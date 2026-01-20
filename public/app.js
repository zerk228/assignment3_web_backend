const $ = (id) => document.getElementById(id);

const statusEl = $("status");
const listEl = $("list");

const form = $("blogForm");
const idEl = $("id");
const titleEl = $("title");
const authorEl = $("author");
const bodyEl = $("body");

const setStatus = (obj) => {
  statusEl.textContent =
    typeof obj === "string" ? obj : JSON.stringify(obj, null, 2);
};

const api = async (path, opts = {}) => {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });

  if (res.status === 204) return { ok: true, status: 204, data: null };

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const msg = data?.error || `HTTP ${res.status}`;
    throw { status: res.status, error: msg, data };
  }

  return { ok: true, status: res.status, data };
};

const load = async () => {
  try {
    const r = await api("/blogs");
    listEl.innerHTML = "";
    for (const b of r.data) {
      const div = document.createElement("div");
      div.className = "post";
      div.innerHTML = `
        <div class="meta">
          <div class="id">${b._id}</div>
          <div class="time">${new Date(b.createdAt).toLocaleString()}</div>
        </div>
        <div class="title">${escapeHtml(b.title)}</div>
        <div class="author">${escapeHtml(b.author || "Anonymous")}</div>
        <div class="body">${escapeHtml(b.body)}</div>
        <div class="row">
          <button data-act="fill" data-id="${b._id}">Fill</button>
          <button data-act="open" data-id="${b._id}">Open</button>
          <button data-act="del" data-id="${b._id}">Delete</button>
        </div>
      `;
      listEl.appendChild(div);
    }
    setStatus({ loaded: r.data.length });
  } catch (e) {
    setStatus(e);
  }
};

const escapeHtml = (s) =>
  String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

listEl.addEventListener("click", async (ev) => {
  const btn = ev.target.closest("button");
  if (!btn) return;
  const act = btn.dataset.act;
  const id = btn.dataset.id;

  try {
    if (act === "open") {
      const r = await api(`/blogs/${id}`);
      setStatus(r.data);
    }

    if (act === "fill") {
      const r = await api(`/blogs/${id}`);
      idEl.value = r.data._id;
      titleEl.value = r.data.title;
      authorEl.value = r.data.author || "";
      bodyEl.value = r.data.body;
      setStatus({ filled: id });
    }

    if (act === "del") {
      await api(`/blogs/${id}`, { method: "DELETE" });
      setStatus({ deleted: id });
      await load();
    }
  } catch (e) {
    setStatus(e);
  }
});

form.addEventListener("submit", async (ev) => {
  ev.preventDefault();
  const id = idEl.value.trim();
  const payload = {
    title: titleEl.value.trim(),
    body: bodyEl.value.trim(),
    author: authorEl.value.trim() || undefined,
  };

  try {
    if (!payload.title || !payload.body) {
      setStatus({ error: "title and body are required" });
      return;
    }

    if (id) {
      const r = await api(`/blogs/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      setStatus(r.data);
    } else {
      const r = await api("/blogs", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setStatus(r.data);
    }
    await load();
  } catch (e) {
    setStatus(e);
  }
});

$("refresh").addEventListener("click", load);

$("clear").addEventListener("click", () => {
  idEl.value = "";
  titleEl.value = "";
  authorEl.value = "";
  bodyEl.value = "";
  setStatus("cleared");
});

load();
