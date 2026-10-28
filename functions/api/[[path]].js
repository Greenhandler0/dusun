// Dusun Maliyan - API (Cloudflare Pages Functions)
// Butuh: binding KV bernama DATA  +  variabel ADMIN_PASSWORD (opsional: SESSION_SECRET)

const MAX_MEDIA = 20 * 1024 * 1024;
const MAX_CAT = 9;
const TYPES = {
  "image/jpeg": "i", "image/png": "i", "image/webp": "i", "image/gif": "i",
  "video/mp4": "v", "video/webm": "v",
};
const enc = new TextEncoder();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function J(obj, status = 200, extra = {}) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...extra },
  });
}
const fail = (status, error, message) => J({ error, message }, status);

function b64u(buf) {
  let s = "";
  for (const x of new Uint8Array(buf)) s += String.fromCharCode(x);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
async function hmac(secret, msg) {
  const k = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return b64u(await crypto.subtle.sign("HMAC", k, enc.encode(msg)));
}
function same(a, b) {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}
const secretOf = (env) => env.SESSION_SECRET || env.ADMIN_PASSWORD || "";

async function makeToken(env) {
  const exp = Date.now() + 7 * 864e5;
  return exp + "." + (await hmac(secretOf(env), "adm." + exp));
}
async function isAdmin(request, env) {
  const sec = secretOf(env);
  if (!sec) return false;
  const m = /(?:^|;\s*)adm=([^;]+)/.exec(request.headers.get("cookie") || "");
  if (!m) return false;
  const [exp, sig] = m[1].split(".");
  if (!exp || !sig || !(+exp > Date.now())) return false;
  return same(sig, await hmac(sec, "adm." + exp));
}
const cookie = (v, age) => `adm=${v}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${age}`;

async function putRetry(kv, key, val, opt) {
  for (let i = 0; ; i++) {
    try { return await kv.put(key, val, opt); }
    catch (e) { if (i >= 2) throw e; await sleep(1100); } // batas KV: 1 tulis/detik per kunci
  }
}

function clean(o) {
  if (!o || !Array.isArray(o.rows) || o.rows.length > 5000) return null;
  const num = (v) => (Number.isFinite(+v) ? Math.round(+v) : 0);
  const g = (x) => ({ p: String((x && x.p) || "").slice(0, 80), j: num(x && x.j), x: !!(x && x.x) });
  const rows = o.rows
    .filter((r) => r && /^\d{4}-\d{2}-\d{2}$/.test(r.d))
    .map((r) => ({
      d: r.d, a: g(r.a), b: g(r.b), t: num(r.t), o: num(r.o),
      k: String(r.k || "").slice(0, 500), l: num(r.l), lk: String(r.lk || "").slice(0, 200),
    }));
  const n = Array.isArray(o.n) && o.n.length === 2
    ? [String(o.n[0]).slice(0, 40), String(o.n[1]).slice(0, 40)]
    : ["Kelompok 1", "Kelompok 2"];
  return { n, sa: num(o.sa), rows };
}
// Pengunjung umum tidak menerima nama petugas / bolos / rincian per kelompok.
function pub(st) {
  return {
    n: st.n, sa: st.sa,
    rows: st.rows.map((r) => ({
      d: r.d, a: { p: "", j: 0, x: false }, b: { p: "", j: 0, x: false },
      t: ((r.a && r.a.j) || 0) + ((r.b && r.b.j) || 0) + (r.t || 0),
      o: r.o || 0, k: r.k || "", l: r.l || 0, lk: r.lk || "",
    })),
  };
}

export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/api\/?/, "").replace(/\/+$/, "");
  const method = request.method;

  if (method !== "GET" && method !== "HEAD") {
    const o = request.headers.get("origin");
    if (o && o !== url.origin) return fail(403, "forbidden", "Permintaan ditolak.");
  }

  try {
    if (path === "me" && method === "GET") {
      const setup = !env.ADMIN_PASSWORD
        ? "ADMIN_PASSWORD belum diatur di Cloudflare Pages (Settings → Variables and secrets)."
        : !env.DATA ? "Binding KV bernama DATA belum dipasang di Cloudflare Pages (Settings → Bindings)." : "";
      return J({ admin: await isAdmin(request, env), setup });
    }
    if (path === "login" && method === "POST") {
      if (!env.ADMIN_PASSWORD) return fail(500, "no_pw", "ADMIN_PASSWORD belum diatur di Cloudflare Pages.");
      let b = {};
      try { b = await request.json(); } catch (e) {}
      const pw = String((b && b.password) || "");
      const ok = same(await hmac("pw", pw), await hmac("pw", env.ADMIN_PASSWORD));
      if (!ok) { await sleep(800); return fail(401, "bad_pw", "Kata sandi salah."); }
      return J({ ok: true }, 200, { "set-cookie": cookie(await makeToken(env), 604800) });
    }
    if (path === "logout" && method === "POST") {
      return J({ ok: true }, 200, { "set-cookie": cookie("", 0) });
    }

    if (!env.DATA) return fail(500, "no_kv", "Binding KV bernama DATA belum dipasang di Cloudflare Pages (Settings → Bindings), lalu deploy ulang.");
    const admin = await isAdmin(request, env);
    const needAdmin = () => fail(401, "unauthorized", "Sesi admin habis. Silakan masuk lagi.");

    // ---- data keuangan ----
    if (path === "state") {
      if (method === "GET") {
        const st = await env.DATA.get("state", "json");
        if (!st || !Array.isArray(st.rows)) return J({ state: null });
        return J({ state: admin ? st : pub(st) });
      }
      if (method === "PUT") {
        if (!admin) return needAdmin();
        if (+request.headers.get("content-length") > 1e6) return fail(413, "too_large", "Data terlalu besar.");
        let b; try { b = await request.json(); } catch (e) { return fail(400, "bad_json", "Format data tidak valid."); }
        const st = clean(b);
        if (!st) return fail(400, "bad_data", "Data tidak valid.");
        await putRetry(env.DATA, "state", JSON.stringify(st));
        return J({ ok: true });
      }
    }

    // ---- informasi & poster rutinan ----
    if (path === "info") {
      if (method === "GET") {
        return J({ info: (await env.DATA.get("info", "json")) || { notes: [], rut: null } });
      }
      if (method === "PUT") {
        if (!admin) return needAdmin();
        let b; try { b = await request.json(); } catch (e) { return fail(400, "bad_json", "Format data tidak valid."); }
        const notes = (Array.isArray(b && b.notes) ? b.notes : []).slice(0, 30)
          .map((x) => ({ t: String((x && x.t) || "").trim().slice(0, 120), b: String((x && x.b) || "").trim().slice(0, 1000) }))
          .filter((x) => x.t || x.b);
        const r = b && b.rut;
        const rut = r && /^\d{4}-\d{2}-\d{2}$/.test(r.d) && String(r.r || "").trim()
          ? { r: String(r.r).trim().slice(0, 80), d: r.d } : null;
        await putRetry(env.DATA, "info", JSON.stringify({ notes, rut }));
        return J({ ok: true });
      }
    }

    // ---- galeri ----
    if (path === "gallery" && method === "GET") {
      return J({ items: (await env.DATA.get("idx", "json")) || [] });
    }
    if (path === "upload" && method === "POST") {
      if (!admin) return needAdmin();
      const ct = (request.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
      const ty = TYPES[ct];
      if (!ty) return fail(415, "unsupported_type", "Format tidak didukung.");
      if (+request.headers.get("content-length") > MAX_MEDIA + 4096) return fail(413, "too_large", "Ukuran melebihi 20 MB.");
      const c = parseInt(url.searchParams.get("c"), 10);
      if (!(c >= 0 && c <= MAX_CAT)) return fail(400, "bad_cat", "Kategori tidak valid.");
      const n = (url.searchParams.get("n") || "").trim().slice(0, 120);
      const buf = await request.arrayBuffer();
      if (!buf.byteLength) return fail(400, "empty", "Berkas kosong.");
      if (buf.byteLength > MAX_MEDIA) return fail(413, "too_large", "Ukuran melebihi 20 MB.");
      const id = crypto.randomUUID().replace(/-/g, "");
      await putRetry(env.DATA, "m:" + id, buf, { metadata: { ct } });
      const item = { id, c, ty, n, ts: Date.now() };
      const idx = (await env.DATA.get("idx", "json")) || [];
      idx.push(item);
      await putRetry(env.DATA, "idx", JSON.stringify(idx));
      return J(item);
    }
    if (path.startsWith("gallery/") && method === "DELETE") {
      if (!admin) return needAdmin();
      const id = path.slice(8);
      if (!/^[0-9a-f]{32}$/.test(id)) return fail(400, "bad_id", "ID tidak valid.");
      const idx = ((await env.DATA.get("idx", "json")) || []).filter((x) => x.id !== id);
      await putRetry(env.DATA, "idx", JSON.stringify(idx));
      await env.DATA.delete("m:" + id);
      return J({ ok: true });
    }
    if (path.startsWith("media/") && (method === "GET" || method === "HEAD")) {
      const id = path.slice(6);
      if (!/^[0-9a-f]{32}$/.test(id)) return new Response("Not found", { status: 404 });
      const { value: buf, metadata } = await env.DATA.getWithMetadata("m:" + id, "arrayBuffer");
      if (!buf) return new Response("Not found", { status: 404 });
      const total = buf.byteLength;
      const h = {
        "content-type": (metadata && metadata.ct) || "application/octet-stream",
        "accept-ranges": "bytes",
        "cache-control": "public, max-age=31536000, immutable",
        "x-content-type-options": "nosniff",
      };
      const rg = request.headers.get("range");
      const m = rg && /^bytes=(\d*)-(\d*)$/.exec(rg);
      if (m && (m[1] || m[2])) {
        let s = m[1] === "" ? null : +m[1];
        let e = m[2] === "" ? null : +m[2];
        if (s === null) { s = Math.max(0, total - e); e = total - 1; }
        else if (e === null || e >= total) e = total - 1;
        if (s > e || s >= total) return new Response(null, { status: 416, headers: { "content-range": `bytes */${total}` } });
        return new Response(buf.slice(s, e + 1), {
          status: 206,
          headers: { ...h, "content-range": `bytes ${s}-${e}/${total}`, "content-length": String(e - s + 1) },
        });
      }
      return new Response(buf, { headers: { ...h, "content-length": String(total) } });
    }

    return fail(404, "not_found", "Endpoint tidak ditemukan.");
  } catch (e) {
    return fail(500, "server", "Terjadi kesalahan di server: " + ((e && e.message) || e));
  }
}
