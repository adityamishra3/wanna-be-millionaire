import { useState, useEffect } from "react";

const API = "";

async function apiFetch(path, opts = {}) {
  const res = await fetch(`${API}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Something went wrong");
  return data.data;
}

// ── Spinner ───────────────────────────────────────────────────────────────────
function Spinner({ size = 18 }) {
  return (
    <div style={{
      width: size, height: size,
      border: "2px solid rgba(255,255,255,0.2)",
      borderTop: "2px solid #e8d5a3", borderRadius: "50%",
      animation: "spin 0.7s linear infinite", display: "inline-block",
      flexShrink: 0,
    }} />
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, []);
  return (
    <div style={{
      position: "fixed", bottom: 32, right: 32, zIndex: 9999,
      background: type === "error" ? "#3d1a1a" : "#1a3d2b",
      border: `1px solid ${type === "error" ? "#7a2f2f" : "#2f7a4f"}`,
      color: type === "error" ? "#f87171" : "#6ee7a0",
      padding: "12px 20px", borderRadius: 10, fontSize: 14,
      fontFamily: "'DM Mono', monospace", letterSpacing: 0.3,
      boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      animation: "slideUp 0.3s ease",
    }}>
      {type === "error" ? "✕ " : "✓ "}{msg}
    </div>
  );
}

// ── Input ─────────────────────────────────────────────────────────────────────
function Input({ label, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      {label && <label style={{
        display: "block", fontSize: 10, letterSpacing: 2,
        color: "rgba(232,213,163,0.5)", fontFamily: "'DM Mono', monospace",
        textTransform: "uppercase", marginBottom: 6,
      }}>{label}</label>}
      <input {...props} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} style={{
        width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.04)",
        border: `1px solid ${focused ? "rgba(232,213,163,0.4)" : "rgba(255,255,255,0.08)"}`,
        borderRadius: 8, color: "#f5f0e8", fontFamily: "'DM Mono', monospace",
        fontSize: 14, outline: "none", transition: "border 0.2s", boxSizing: "border-box",
      }} />
    </div>
  );
}

// ── Auth Screen ───────────────────────────────────────────────────────────────
function AuthScreen({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = mode === "login"
        ? { username: form.username, password: form.password }
        : { username: form.username, email: form.email, password: form.password };
      const user = await apiFetch(`/auth/${mode}`, { method: "POST", body: JSON.stringify(payload) });
      onAuth(user);
    } catch (err) {
      setToast({ msg: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "#0a0a0a", position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", inset: 0, opacity: 0.04,
        backgroundImage: "linear-gradient(#e8d5a3 1px, transparent 1px), linear-gradient(90deg, #e8d5a3 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />
      <div style={{
        position: "absolute", width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(232,213,163,0.08) 0%, transparent 70%)",
        top: "50%", left: "50%", transform: "translate(-50%, -50%)",
      }} />

      <div style={{
        width: 420, padding: "48px 40px", position: "relative", zIndex: 1,
        background: "rgba(255,255,255,0.03)", border: "1px solid rgba(232,213,163,0.12)",
        borderRadius: 20, backdropFilter: "blur(20px)",
        boxShadow: "0 32px 80px rgba(0,0,0,0.5)", animation: "fadeIn 0.5s ease",
      }}>
        <div style={{ marginBottom: 36, textAlign: "center" }}>
          <div style={{
            fontSize: 11, letterSpacing: 4, color: "#e8d5a3", opacity: 0.6,
            fontFamily: "'DM Mono', monospace", textTransform: "uppercase", marginBottom: 12,
          }}>IDEA VAULT</div>
          <div style={{
            fontSize: 28, fontWeight: 800, color: "#f5f0e8",
            fontFamily: "'Playfair Display', serif", lineHeight: 1.2,
          }}>
            Wanna Be<br /><span style={{ color: "#e8d5a3" }}>Millionaire</span>
          </div>
        </div>

        <div style={{
          display: "flex", background: "rgba(255,255,255,0.05)",
          borderRadius: 10, padding: 4, marginBottom: 28,
        }}>
          {["login", "register"].map((m) => (
            <button key={m} onClick={() => setMode(m)} style={{
              flex: 1, padding: "8px 0", border: "none", borderRadius: 7, cursor: "pointer",
              fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: 1,
              textTransform: "uppercase", transition: "all 0.2s",
              background: mode === m ? "#e8d5a3" : "transparent",
              color: mode === m ? "#0a0a0a" : "rgba(255,255,255,0.4)",
              fontWeight: mode === m ? 700 : 400,
            }}>{m}</button>
          ))}
        </div>

        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Input label="Username" value={form.username} onChange={set("username")} placeholder="johndoe" />
          {mode === "register" && (
            <Input label="Email" type="email" value={form.email} onChange={set("email")} placeholder="john@example.com" />
          )}
          <Input label="Password" type="password" value={form.password} onChange={set("password")} placeholder="••••••••" />
          <button type="submit" disabled={loading} style={{
            marginTop: 8, padding: "14px 0", border: "none", borderRadius: 10,
            background: loading ? "rgba(232,213,163,0.3)" : "#e8d5a3",
            color: "#0a0a0a", fontFamily: "'DM Mono', monospace",
            fontSize: 13, letterSpacing: 2, textTransform: "uppercase",
            fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.2s", display: "flex", alignItems: "center",
            justifyContent: "center", gap: 8,
          }}>
            {loading ? <Spinner /> : mode === "login" ? "Enter Vault" : "Create Account"}
          </button>
        </form>
      </div>
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

// ── Idea Form ─────────────────────────────────────────────────────────────────
function IdeaForm({ onSave, onCancel, notify, initial }) {
  const [form, setForm] = useState(initial || { title: "", content: "", isPublic: false });
  const [loading, setLoading] = useState(false);
  const isEdit = !!initial;
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    if (!form.title.trim()) return notify("Title is required", "error");
    setLoading(true);
    try {
      if (isEdit) {
        await apiFetch(`/idea/${initial.id}`, { method: "PATCH", body: JSON.stringify(form) });
      } else {
        await apiFetch("/idea", { method: "POST", body: JSON.stringify(form) });
      }
      onSave();
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      marginBottom: 24, padding: "28px", borderRadius: 14,
      background: "rgba(232,213,163,0.04)", border: "1px solid rgba(232,213,163,0.15)",
      animation: "fadeIn 0.3s ease",
    }}>
      <div style={{
        fontSize: 10, letterSpacing: 3, color: "rgba(232,213,163,0.5)",
        fontFamily: "'DM Mono', monospace", textTransform: "uppercase", marginBottom: 20,
      }}>{isEdit ? "EDIT IDEA" : "NEW IDEA"}</div>

      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Input label="Title" value={form.title} onChange={set("title")} placeholder="Your million dollar idea..." />
        <div>
          <label style={{
            display: "block", fontSize: 10, letterSpacing: 2,
            color: "rgba(232,213,163,0.5)", fontFamily: "'DM Mono', monospace",
            textTransform: "uppercase", marginBottom: 6,
          }}>Details</label>
          <textarea value={form.content} onChange={set("content")} rows={4}
            placeholder="Describe it..." style={{
              width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
              color: "#f5f0e8", fontFamily: "'DM Mono', monospace", fontSize: 14,
              outline: "none", resize: "vertical", boxSizing: "border-box",
            }} />
        </div>
        <label style={{
          display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
          fontFamily: "'DM Mono', monospace", fontSize: 12,
          color: "rgba(255,255,255,0.4)", letterSpacing: 1,
        }}>
          <input type="checkbox" checked={form.isPublic}
            onChange={e => setForm(f => ({ ...f, isPublic: e.target.checked }))}
            style={{ accentColor: "#e8d5a3" }} />
          Make public
        </label>
        <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
          <button type="submit" disabled={loading} style={{
            flex: 1, padding: "12px 0", border: "none", borderRadius: 8,
            background: loading ? "rgba(232,213,163,0.3)" : "#e8d5a3",
            color: "#0a0a0a", fontFamily: "'DM Mono', monospace",
            fontSize: 12, letterSpacing: 2, textTransform: "uppercase",
            fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            {loading ? <Spinner /> : isEdit ? "Save Changes" : "Save to Vault"}
          </button>
          <button type="button" onClick={onCancel} style={{
            padding: "12px 20px", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 8, background: "transparent", color: "rgba(255,255,255,0.3)",
            fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: 2,
            textTransform: "uppercase", cursor: "pointer",
          }}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

// ── Idea Card ─────────────────────────────────────────────────────────────────
function IdeaCard({ idea, index, onEdit, onDelete, readonly }) {
  const [hovered, setHovered] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await apiFetch(`/idea/${idea.id}`, { method: "DELETE" });
      onDelete();
    } catch (err) {
      setDeleting(false);
    }
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "24px 28px", borderRadius: 14,
        background: hovered ? "rgba(232,213,163,0.05)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${hovered ? "rgba(232,213,163,0.2)" : "rgba(255,255,255,0.06)"}`,
        transition: "all 0.25s", animation: `fadeIn 0.4s ease ${index * 0.06}s both`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{
              fontSize: 10, letterSpacing: 2, fontFamily: "'DM Mono', monospace",
              color: "rgba(232,213,163,0.3)", textTransform: "uppercase",
            }}>#{String(index + 1).padStart(2, "0")}</span>
            {idea.isPublic && (
              <span style={{
                fontSize: 9, letterSpacing: 2, padding: "2px 6px",
                background: "rgba(110,231,183,0.08)", border: "1px solid rgba(110,231,183,0.15)",
                borderRadius: 4, color: "#6ee7b7", textTransform: "uppercase",
                fontFamily: "'DM Mono', monospace",
              }}>PUBLIC</span>
            )}
            {idea.owner && (
              <span style={{
                fontSize: 10, letterSpacing: 1, fontFamily: "'DM Mono', monospace",
                color: "rgba(232,213,163,0.4)",
              }}>by {idea.owner.username}</span>
            )}
          </div>
          <h3 style={{
            margin: "0 0 8px", fontSize: 18, fontWeight: 700,
            fontFamily: "'Playfair Display', serif", color: "#f5f0e8",
          }}>{idea.title}</h3>
          {idea.content && (
            <p style={{
              margin: 0, fontSize: 13, color: "rgba(255,255,255,0.35)",
              fontFamily: "'DM Mono', monospace", lineHeight: 1.7, letterSpacing: 0.3,
            }}>{idea.content}</p>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: idea.isPublic ? "#6ee7b7" : "rgba(232,213,163,0.3)",
            boxShadow: idea.isPublic ? "0 0 8px rgba(110,231,183,0.4)" : "none",
          }} />
          {!readonly && hovered && (
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={onEdit} style={{
                padding: "4px 10px", border: "1px solid rgba(232,213,163,0.2)",
                borderRadius: 6, background: "transparent", color: "rgba(232,213,163,0.6)",
                fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 1,
                textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s",
              }}>Edit</button>
              <button onClick={handleDelete} disabled={deleting} style={{
                padding: "4px 10px", border: "1px solid rgba(248,113,113,0.2)",
                borderRadius: 6, background: "transparent", color: "rgba(248,113,113,0.6)",
                fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 1,
                textTransform: "uppercase", cursor: "pointer", transition: "all 0.2s",
              }}>
                {deleting ? <Spinner size={10} /> : "Delete"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({ user, onLogout }) {
  const [tab, setTab] = useState("mine");
  const [myIdeas, setMyIdeas] = useState([]);
  const [publicIdeas, setPublicIdeas] = useState([]);
  const [loadingMine, setLoadingMine] = useState(true);
  const [loadingPublic, setLoadingPublic] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingIdea, setEditingIdea] = useState(null);
  const [toast, setToast] = useState(null);

  const notify = (msg, type = "success") => setToast({ msg, type });

  async function loadMyIdeas() {
    try {
      const data = await apiFetch("/idea/me");
      setMyIdeas(data);
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setLoadingMine(false);
    }
  }

  async function loadPublicIdeas() {
    try {
      const data = await apiFetch("/idea/public");
      setPublicIdeas(data);
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setLoadingPublic(false);
    }
  }

  useEffect(() => { loadMyIdeas(); loadPublicIdeas(); }, []);

  async function logout() {
    try { await apiFetch("/auth/logout", { method: "POST" }); } catch {}
    onLogout();
  }

  const tabs = [
    { id: "mine", label: "My Ideas", count: myIdeas.length },
    { id: "public", label: "Public Vault", count: publicIdeas.length },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#f5f0e8" }}>
      <div style={{
        position: "fixed", inset: 0, opacity: 0.03,
        backgroundImage: "linear-gradient(#e8d5a3 1px, transparent 1px), linear-gradient(90deg, #e8d5a3 1px, transparent 1px)",
        backgroundSize: "60px 60px", pointerEvents: "none",
      }} />

      {/* Nav */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        borderBottom: "1px solid rgba(232,213,163,0.08)",
        background: "rgba(10,10,10,0.9)", backdropFilter: "blur(20px)",
        padding: "0 40px", height: 60, display: "flex", alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#e8d5a3" }}>VAULT</span>
          <span style={{ fontSize: 10, letterSpacing: 3, color: "rgba(255,255,255,0.2)", fontFamily: "'DM Mono', monospace", textTransform: "uppercase" }}>/ ideas</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ fontSize: 12, fontFamily: "'DM Mono', monospace", color: "rgba(255,255,255,0.4)", letterSpacing: 1 }}>
            <span style={{ color: "#e8d5a3" }}>{user?.username || "user"}</span>
            {user?.role === "ADMIN" && (
              <span style={{
                marginLeft: 8, fontSize: 9, letterSpacing: 2, padding: "2px 6px",
                background: "rgba(232,213,163,0.1)", border: "1px solid rgba(232,213,163,0.2)",
                borderRadius: 4, color: "#e8d5a3", textTransform: "uppercase",
              }}>ADMIN</span>
            )}
          </div>
          <button onClick={logout} style={{
            padding: "6px 14px", background: "transparent",
            border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6,
            color: "rgba(255,255,255,0.3)", fontFamily: "'DM Mono', monospace",
            fontSize: 11, letterSpacing: 1, cursor: "pointer", transition: "all 0.2s", textTransform: "uppercase",
          }}
            onMouseEnter={e => { e.target.style.borderColor = "rgba(232,213,163,0.3)"; e.target.style.color = "#e8d5a3"; }}
            onMouseLeave={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.color = "rgba(255,255,255,0.3)"; }}
          >Exit</button>
        </div>
      </nav>

      <main style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: 40, animation: "fadeIn 0.5s ease" }}>
          <div style={{
            fontSize: 11, letterSpacing: 4, color: "rgba(232,213,163,0.4)",
            fontFamily: "'DM Mono', monospace", textTransform: "uppercase", marginBottom: 12,
          }}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </div>
          <h1 style={{ fontSize: 42, fontWeight: 800, fontFamily: "'Playfair Display', serif", margin: 0, lineHeight: 1.1 }}>
            Idea <span style={{ color: "#e8d5a3" }}>Vault</span>
          </h1>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex", gap: 4, marginBottom: 32,
          background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 4,
          border: "1px solid rgba(255,255,255,0.06)",
        }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: "10px 0", border: "none", borderRadius: 9, cursor: "pointer",
              fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: 1,
              textTransform: "uppercase", transition: "all 0.2s",
              background: tab === t.id ? "rgba(232,213,163,0.12)" : "transparent",
              color: tab === t.id ? "#e8d5a3" : "rgba(255,255,255,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
              {t.label}
              <span style={{
                fontSize: 10, padding: "1px 6px", borderRadius: 20,
                background: tab === t.id ? "rgba(232,213,163,0.2)" : "rgba(255,255,255,0.05)",
                color: tab === t.id ? "#e8d5a3" : "rgba(255,255,255,0.2)",
              }}>{t.count}</span>
            </button>
          ))}
        </div>

        {/* My Ideas Tab */}
        {tab === "mine" && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            {/* New idea button */}
            {!showForm && !editingIdea && (
              <button onClick={() => setShowForm(true)} style={{
                width: "100%", padding: "20px", marginBottom: 24,
                background: "transparent", border: "1px dashed rgba(232,213,163,0.2)",
                borderRadius: 14, color: "rgba(232,213,163,0.4)", cursor: "pointer",
                fontFamily: "'DM Mono', monospace", fontSize: 13, letterSpacing: 2,
                textTransform: "uppercase", transition: "all 0.25s",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(232,213,163,0.5)"; e.currentTarget.style.color = "#e8d5a3"; e.currentTarget.style.background = "rgba(232,213,163,0.03)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(232,213,163,0.2)"; e.currentTarget.style.color = "rgba(232,213,163,0.4)"; e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{ fontSize: 20, lineHeight: 1 }}>+</span> New Idea
              </button>
            )}

            {showForm && (
              <IdeaForm
                onSave={async () => { await loadMyIdeas(); setShowForm(false); notify("Idea saved to vault"); }}
                onCancel={() => setShowForm(false)}
                notify={notify}
              />
            )}

            {editingIdea && (
              <IdeaForm
                initial={editingIdea}
                onSave={async () => { await loadMyIdeas(); setEditingIdea(null); notify("Idea updated"); }}
                onCancel={() => setEditingIdea(null)}
                notify={notify}
              />
            )}

            {loadingMine ? (
              <div style={{ textAlign: "center", padding: 60 }}><Spinner /></div>
            ) : myIdeas.length === 0 ? (
              <div style={{
                textAlign: "center", padding: "80px 40px",
                color: "rgba(255,255,255,0.15)", fontFamily: "'DM Mono', monospace",
                fontSize: 13, letterSpacing: 1,
              }}>
                <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.3 }}>◈</div>
                Vault is empty. Add your first idea.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {myIdeas.map((idea, i) => (
                  <IdeaCard
                    key={idea.id} idea={idea} index={i}
                    onEdit={() => { setShowForm(false); setEditingIdea(idea); }}
                    onDelete={async () => { await loadMyIdeas(); notify("Idea removed"); }}
                    notify={notify}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Public Tab */}
        {tab === "public" && (
          <div style={{ animation: "fadeIn 0.3s ease" }}>
            {loadingPublic ? (
              <div style={{ textAlign: "center", padding: 60 }}><Spinner /></div>
            ) : publicIdeas.length === 0 ? (
              <div style={{
                textAlign: "center", padding: "80px 40px",
                color: "rgba(255,255,255,0.15)", fontFamily: "'DM Mono', monospace",
                fontSize: 13, letterSpacing: 1,
              }}>
                <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.3 }}>◈</div>
                No public ideas yet.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {publicIdeas.map((idea, i) => (
                  <IdeaCard key={idea.id} idea={idea} index={i} readonly notify={notify} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    apiFetch("/auth/me")
      .then(user => setUser(user))
      .catch(() => {})
      .finally(() => setChecking(false));
  }, []);

  if (checking) return (
    <div style={{
      minHeight: "100vh", background: "#0a0a0a", display: "flex",
      alignItems: "center", justifyContent: "center",
    }}>
      <Spinner />
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Mono:wght@400;500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a0a; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(232,213,163,0.2); border-radius: 2px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.15); }
      `}</style>
      {user ? <Dashboard user={user} onLogout={() => setUser(null)} /> : <AuthScreen onAuth={setUser} />}
    </>
  );
}
