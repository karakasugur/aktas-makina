// UKARAKAS 09.11.2026 - Admin panel rewritten: content is saved on the server (api/*.php),
// password is set on first login and stored hashed on the server, no credentials in the code.
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { LogOut, Save, RotateCcw, Lock, Loader2, Plus, Trash2, ArrowUp, ArrowDown, ExternalLink, KeyRound, FileText, Inbox } from "lucide-react";
import { defaultContent, mergeWithDefaults, type SiteContent, type Service, type Machine } from "@/lib/defaultContent";
import { apiRequest, ApiError } from "@/lib/api";
import { useSetContent, usePageTitle } from "@/lib/content";
import { serviceIcons } from "@/lib/icons";
import ImagePicker from "@/components/admin/ImagePicker";
import MessagesPanel from "@/components/admin/MessagesPanel";

type Phase = "loading" | "unreachable" | "setup" | "login" | "editor";
type Tab = "content" | "messages" | "password";

const inputClass =
  "w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm";
const bigInputClass =
  "w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";
const labelClass = "block text-sm font-medium text-foreground mb-1";
const sectionTitle = "text-lg font-heading font-bold text-foreground mb-4 pb-2 border-b border-border flex items-center justify-between";
const smallBtn = "p-1.5 rounded-md border border-border hover:bg-secondary disabled:opacity-40";

const errorText = (e: unknown) => (e instanceof Error ? e.message : "Bir hata oluştu.");

/** Moves item at index by delta (-1 up, +1 down). */
function move<T>(list: T[], index: number, delta: number): T[] {
  const target = index + delta;
  if (target < 0 || target >= list.length) return list;
  const copy = [...list];
  [copy[index], copy[target]] = [copy[target], copy[index]];
  return copy;
}

// ---------------- Login / first setup ----------------

const AuthScreen = ({ mode, onDone }: { mode: "setup" | "login"; onDone: () => void }) => {
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (mode === "setup") {
      if (password.length < 8) return setError("Şifre en az 8 karakter olmalı.");
      if (password !== password2) return setError("Şifreler aynı değil.");
    }
    setBusy(true);
    try {
      await apiRequest(`auth.php?action=${mode}`, { body: { password } });
      onDone();
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm bg-card rounded-xl p-8 card-elevated">
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-secondary flex items-center justify-center text-primary">
            <Lock size={28} />
          </div>
          <h1 className="font-heading font-bold text-xl text-foreground">Admin Paneli</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {mode === "setup" ? "İlk giriş: panel şifrenizi belirleyin" : "Giriş yapın"}
          </p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <input type="password" autoComplete={mode === "setup" ? "new-password" : "current-password"} placeholder={mode === "setup" ? "Yeni şifre (en az 8 karakter)" : "Şifre"} value={password} onChange={(e) => setPassword(e.target.value)} className={bigInputClass} autoFocus />
          {mode === "setup" && (
            <input type="password" autoComplete="new-password" placeholder="Şifre (tekrar)" value={password2} onChange={(e) => setPassword2(e.target.value)} className={bigInputClass} />
          )}
          {error && <p className="text-destructive text-sm">{error}</p>}
          <button type="submit" disabled={busy} className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-accent transition-colors disabled:opacity-60 inline-flex items-center justify-center gap-2">
            {busy && <Loader2 size={18} className="animate-spin" />}
            {mode === "setup" ? "Şifreyi Kaydet ve Gir" : "Giriş Yap"}
          </button>
        </form>
        <Link to="/" className="block text-center text-sm text-muted-foreground hover:text-primary mt-6">
          ← Siteye dön
        </Link>
      </div>
    </div>
  );
};

// ---------------- Password change ----------------

const PasswordPanel = ({ onAuthLost }: { onAuthLost: () => void }) => {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [next2, setNext2] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (next.length < 8) return toast.error("Yeni şifre en az 8 karakter olmalı.");
    if (next !== next2) return toast.error("Yeni şifreler aynı değil.");
    setBusy(true);
    try {
      await apiRequest("auth.php?action=change", { body: { current, password: next } });
      toast.success("Şifre değiştirildi.");
      setCurrent("");
      setNext("");
      setNext2("");
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) onAuthLost();
      toast.error(errorText(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="max-w-sm space-y-3">
      <div>
        <label className={labelClass}>Mevcut şifre</label>
        <input type="password" autoComplete="current-password" className={inputClass} value={current} onChange={(e) => setCurrent(e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Yeni şifre (en az 8 karakter)</label>
        <input type="password" autoComplete="new-password" className={inputClass} value={next} onChange={(e) => setNext(e.target.value)} />
      </div>
      <div>
        <label className={labelClass}>Yeni şifre (tekrar)</label>
        <input type="password" autoComplete="new-password" className={inputClass} value={next2} onChange={(e) => setNext2(e.target.value)} />
      </div>
      <button type="submit" disabled={busy} className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-accent disabled:opacity-60">
        {busy ? <Loader2 size={16} className="animate-spin" /> : <KeyRound size={16} />} Şifreyi Değiştir
      </button>
      <p className="text-xs text-muted-foreground pt-4">
        Şifrenizi unutursanız: hosting (Güzel Hosting) dosya yöneticisinde <code>api/data/admin.php</code> dosyasını silin, sonra panele girip yeni şifre belirleyin.
      </p>
    </form>
  );
};

// ---------------- Content editor ----------------

const Admin = () => {
  usePageTitle("Admin Paneli");
  const setSiteContent = useSetContent();
  const [phase, setPhase] = useState<Phase>("loading");
  const [tab, setTab] = useState<Tab>("content");
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [savedJson, setSavedJson] = useState(JSON.stringify(defaultContent));
  const [saving, setSaving] = useState(false);

  const dirty = useMemo(() => JSON.stringify(content) !== savedJson, [content, savedJson]);

  const loadContent = useCallback(async () => {
    const res = await apiRequest<{ content: unknown }>("content.php");
    const merged = mergeWithDefaults(res.content);
    setContent(merged);
    setSavedJson(JSON.stringify(merged));
  }, []);

  const checkStatus = useCallback(async () => {
    setPhase("loading");
    try {
      const s = await apiRequest<{ configured: boolean; loggedIn: boolean }>("auth.php?action=status");
      if (!s.configured) return setPhase("setup");
      if (!s.loggedIn) return setPhase("login");
      await loadContent();
      setPhase("editor");
    } catch {
      setPhase("unreachable");
    }
  }, [loadContent]);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  // Warn before leaving the page with unsaved changes
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  const onAuthLost = useCallback(() => setPhase("login"), []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiRequest("content.php?action=save", { body: { content } });
      setSavedJson(JSON.stringify(content));
      setSiteContent(content);
      toast.success("Kaydedildi. Değişiklikler sitede görünüyor.");
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        toast.error("Oturum süresi doldu. Tekrar giriş yapın; değişiklikleriniz bu sayfada duruyor.");
        setPhase("login");
      } else {
        toast.error(errorText(e));
      }
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm("Tüm içerik ilk haline döndürülecek. Emin misiniz?")) return;
    try {
      await apiRequest("content.php?action=reset", { body: {} });
      setContent(defaultContent);
      setSavedJson(JSON.stringify(defaultContent));
      setSiteContent(defaultContent);
      toast.success("İçerik ilk haline döndürüldü.");
    } catch (e) {
      toast.error(errorText(e));
    }
  };

  const handleLogout = async () => {
    if (dirty && !confirm("Kaydedilmemiş değişiklikler var. Yine de çıkılsın mı?")) return;
    try {
      await apiRequest("auth.php?action=logout", { body: {} });
    } catch {
      // ignore, we leave the editor anyway
    }
    setSavedJson(JSON.stringify(content));
    setPhase("login");
  };

  const afterLogin = async () => {
    // Keep unsaved edits when the session expired mid-editing
    if (dirty) return setPhase("editor");
    try {
      await loadContent();
      setPhase("editor");
    } catch (e) {
      toast.error(errorText(e));
    }
  };

  // ---- field helpers ----
  const updateService = (i: number, patch: Partial<Service>) =>
    setContent((c) => ({ ...c, services: c.services.map((s, j) => (j === i ? { ...s, ...patch } : s)) }));
  const updateMachine = (i: number, patch: Partial<Machine>) =>
    setContent((c) => ({ ...c, machines: c.machines.map((m, j) => (j === i ? { ...m, ...patch } : m)) }));
  const updateContact = (patch: Partial<SiteContent["contact"]>) => setContent((c) => ({ ...c, contact: { ...c.contact, ...patch } }));

  if (phase === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  if (phase === "unreachable") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md text-center space-y-4">
          <h1 className="font-heading font-bold text-xl">Sunucuya ulaşılamadı</h1>
          <p className="text-muted-foreground text-sm">
            Admin paneli sunucudaki PHP dosyalarıyla çalışır. Site hostinge yüklenmemiş, <code>api</code> klasörü eksik ya da internet bağlantısı yok olabilir.
          </p>
          <button onClick={checkStatus} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm">
            Tekrar dene
          </button>
        </div>
      </div>
    );
  }

  if (phase === "setup" || phase === "login") {
    return <AuthScreen mode={phase} onDone={afterLogin} />;
  }

  const tabBtn = (t: Tab, label: string, Icon: typeof FileText) => (
    <button
      onClick={() => setTab(t)}
      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}
    >
      <Icon size={16} /> {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-card shadow-[var(--navbar-shadow)] px-4 py-3">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <h1 className="font-heading font-bold text-lg text-primary">Admin Paneli</h1>
            <Link to="/" target="_blank" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
              Siteyi aç <ExternalLink size={12} />
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {tab === "content" && (
              <>
                {dirty && <span className="text-xs text-amber-600 font-medium">Kaydedilmemiş değişiklik var</span>}
                <button onClick={handleSave} disabled={saving || !dirty} className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-accent transition-colors disabled:opacity-50">
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Kaydet
                </button>
                <button onClick={handleReset} className="inline-flex items-center gap-1.5 px-3 py-2 bg-secondary text-secondary-foreground text-sm font-medium rounded-lg hover:bg-muted transition-colors" title="İçeriği ilk haline döndür">
                  <RotateCcw size={16} /> Sıfırla
                </button>
              </>
            )}
            <button onClick={handleLogout} className="inline-flex items-center gap-1.5 px-3 py-2 bg-destructive text-destructive-foreground text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">
              <LogOut size={16} /> Çıkış
            </button>
          </div>
        </div>
        <div className="max-w-5xl mx-auto flex gap-1 mt-3">
          {tabBtn("content", "İçerik", FileText)}
          {tabBtn("messages", "Gelen Mesajlar", Inbox)}
          {tabBtn("password", "Şifre", KeyRound)}
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-4 md:p-8">
        {tab === "messages" && <MessagesPanel onAuthLost={onAuthLost} />}
        {tab === "password" && <PasswordPanel onAuthLost={onAuthLost} />}

        {tab === "content" && (
          <div className="space-y-10">
            {/* Contact */}
            <section>
              <h2 className={sectionTitle}>İletişim Bilgileri</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Telefon</label>
                  <input className={inputClass} value={content.contact.phone1} onChange={(e) => updateContact({ phone1: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>WhatsApp numarası (boş bırakılırsa buton gizlenir)</label>
                  <input className={inputClass} value={content.contact.whatsapp} onChange={(e) => updateContact({ whatsapp: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>E-posta (form mesajları buraya gönderilir)</label>
                  <input className={inputClass} type="email" value={content.contact.email} onChange={(e) => updateContact({ email: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Adres</label>
                  <input className={inputClass} value={content.contact.address} onChange={(e) => updateContact({ address: e.target.value })} />
                </div>
              </div>
            </section>

            {/* Hero */}
            <section>
              <h2 className={sectionTitle}>Ana Sayfa Üst Bölüm</h2>
              <div className="space-y-3">
                <div>
                  <label className={labelClass}>Başlık</label>
                  <input className={inputClass} value={content.heroTitle} onChange={(e) => setContent({ ...content, heroTitle: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Alt metin</label>
                  <textarea className={inputClass} rows={3} value={content.heroSubtitle} onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })} />
                </div>
              </div>
            </section>

            {/* About */}
            <section>
              <h2 className={sectionTitle}>Hakkımızda</h2>
              <div className="space-y-3">
                <div>
                  <label className={labelClass}>Başlık</label>
                  <input className={inputClass} value={content.aboutTitle} onChange={(e) => setContent({ ...content, aboutTitle: e.target.value })} />
                </div>
                <div>
                  <label className={labelClass}>Metin (boş satır bırakarak paragraf ayırabilirsiniz)</label>
                  <textarea className={inputClass} rows={7} value={content.aboutText} onChange={(e) => setContent({ ...content, aboutText: e.target.value })} />
                </div>
              </div>
            </section>

            {/* Services */}
            <section>
              <h2 className={sectionTitle}>
                <span>Hizmetler ({content.services.length})</span>
                <button
                  onClick={() => setContent((c) => ({ ...c, services: [...c.services, { title: "Yeni hizmet", description: "", icon: "Wrench" }] }))}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  <Plus size={16} /> Hizmet ekle
                </button>
              </h2>
              <div className="space-y-4">
                {content.services.map((s, i) => (
                  <div key={i} className="bg-card rounded-lg p-4 border border-border space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-muted-foreground">Hizmet {i + 1}</p>
                      <div className="flex gap-1">
                        <button className={smallBtn} disabled={i === 0} onClick={() => setContent((c) => ({ ...c, services: move(c.services, i, -1) }))} aria-label="Yukarı taşı"><ArrowUp size={14} /></button>
                        <button className={smallBtn} disabled={i === content.services.length - 1} onClick={() => setContent((c) => ({ ...c, services: move(c.services, i, 1) }))} aria-label="Aşağı taşı"><ArrowDown size={14} /></button>
                        <button className={`${smallBtn} text-destructive`} onClick={() => confirm(`"${s.title}" silinsin mi?`) && setContent((c) => ({ ...c, services: c.services.filter((_, j) => j !== i) }))} aria-label="Sil"><Trash2 size={14} /></button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <input className={`${inputClass} md:col-span-2`} placeholder="Başlık" value={s.title} onChange={(e) => updateService(i, { title: e.target.value })} />
                      <select className={inputClass} value={s.icon} onChange={(e) => updateService(i, { icon: e.target.value })}>
                        {Object.entries(serviceIcons).map(([key, ic]) => (
                          <option key={key} value={key}>{ic.label}</option>
                        ))}
                      </select>
                    </div>
                    <textarea className={inputClass} rows={2} placeholder="Açıklama" value={s.description} onChange={(e) => updateService(i, { description: e.target.value })} />
                  </div>
                ))}
              </div>
            </section>

            {/* Machines */}
            <section>
              <h2 className={sectionTitle}>
                <span>Makineler ({content.machines.length})</span>
                <button
                  onClick={() => setContent((c) => ({ ...c, machines: [...c.machines, { title: "Yeni makine", description: "", image: "" }] }))}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  <Plus size={16} /> Makine ekle
                </button>
              </h2>
              <div className="space-y-4">
                {content.machines.map((m, i) => (
                  <div key={i} className="bg-card rounded-lg p-4 border border-border space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-muted-foreground">Makine {i + 1}</p>
                      <div className="flex gap-1">
                        <button className={smallBtn} disabled={i === 0} onClick={() => setContent((c) => ({ ...c, machines: move(c.machines, i, -1) }))} aria-label="Yukarı taşı"><ArrowUp size={14} /></button>
                        <button className={smallBtn} disabled={i === content.machines.length - 1} onClick={() => setContent((c) => ({ ...c, machines: move(c.machines, i, 1) }))} aria-label="Aşağı taşı"><ArrowDown size={14} /></button>
                        <button className={`${smallBtn} text-destructive`} onClick={() => confirm(`"${m.title}" silinsin mi?`) && setContent((c) => ({ ...c, machines: c.machines.filter((_, j) => j !== i) }))} aria-label="Sil"><Trash2 size={14} /></button>
                      </div>
                    </div>
                    <input className={inputClass} placeholder="Başlık" value={m.title} onChange={(e) => updateMachine(i, { title: e.target.value })} />
                    <textarea className={inputClass} rows={2} placeholder="Açıklama" value={m.description} onChange={(e) => updateMachine(i, { description: e.target.value })} />
                    <ImagePicker value={m.image} onChange={(image) => updateMachine(i, { image })} />
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
