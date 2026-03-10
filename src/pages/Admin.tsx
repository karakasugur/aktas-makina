import { useState, useEffect } from "react";
import { getContent, saveContent, resetContent, defaultContent, SiteContent } from "@/lib/defaultContent";
import { LogOut, Save, RotateCcw, Lock } from "lucide-react";

const ADMIN_USER = "admin";
const ADMIN_PASS = "repair2026";

const Admin = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (loggedIn) {
      setContent(getContent());
    }
  }, [loggedIn]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      setLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError("Kullanıcı adı veya şifre yanlış!");
    }
  };

  const handleSave = () => {
    saveContent(content);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (confirm("Tüm içerik varsayılana sıfırlanacak. Emin misiniz?")) {
      resetContent();
      setContent(defaultContent);
    }
  };

  const updateService = (index: number, field: string, value: string) => {
    const services = [...content.services];
    services[index] = { ...services[index], [field]: value };
    setContent({ ...content, services });
  };

  const updateMachine = (index: number, field: string, value: string) => {
    const machines = [...content.machines];
    machines[index] = { ...machines[index], [field]: value };
    setContent({ ...content, machines });
  };

  const updateSlider = (index: number, field: string, value: string) => {
    const sliderImages = [...content.sliderImages];
    sliderImages[index] = { ...sliderImages[index], [field]: value };
    setContent({ ...content, sliderImages });
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-sm bg-card rounded-xl p-8 card-elevated">
          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-secondary flex items-center justify-center text-primary">
              <Lock size={28} />
            </div>
            <h1 className="font-heading font-bold text-xl text-foreground">Admin Paneli</h1>
            <p className="text-sm text-muted-foreground mt-1">Giriş yapın</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              placeholder="Kullanıcı Adı"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              type="password"
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {loginError && <p className="text-destructive text-sm">{loginError}</p>}
            <button type="submit" className="w-full py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-accent transition-colors">
              Giriş Yap
            </button>
          </form>
        </div>
      </div>
    );
  }

  const inputClass = "w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm";
  const labelClass = "block text-sm font-medium text-foreground mb-1";
  const sectionTitle = "text-lg font-heading font-bold text-foreground mb-4 pb-2 border-b border-border";

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-card shadow-[var(--navbar-shadow)] px-4 py-3 flex items-center justify-between">
        <h1 className="font-heading font-bold text-lg text-primary">Admin Paneli</h1>
        <div className="flex items-center gap-2">
          {saved && <span className="text-sm text-green-600 font-medium">✓ Kaydedildi!</span>}
          <button onClick={handleSave} className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-accent transition-colors">
            <Save size={16} /> Kaydet
          </button>
          <button onClick={handleReset} className="inline-flex items-center gap-1.5 px-4 py-2 bg-secondary text-secondary-foreground text-sm font-medium rounded-lg hover:bg-muted transition-colors">
            <RotateCcw size={16} /> Sıfırla
          </button>
          <button onClick={() => setLoggedIn(false)} className="inline-flex items-center gap-1.5 px-4 py-2 bg-destructive text-destructive-foreground text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">
            <LogOut size={16} /> Çıkış
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
        {/* Hero */}
        <section>
          <h2 className={sectionTitle}>Hero Bölümü</h2>
          <div className="space-y-3">
            <div>
              <label className={labelClass}>Başlık</label>
              <input className={inputClass} value={content.heroTitle} onChange={(e) => setContent({ ...content, heroTitle: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>Alt Başlık</label>
              <textarea className={inputClass} rows={2} value={content.heroSubtitle} onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })} />
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
              <label className={labelClass}>Metin</label>
              <textarea className={inputClass} rows={5} value={content.aboutText} onChange={(e) => setContent({ ...content, aboutText: e.target.value })} />
            </div>
          </div>
        </section>

        {/* Services */}
        <section>
          <h2 className={sectionTitle}>Hizmetler ({content.services.length})</h2>
          <div className="space-y-4">
            {content.services.map((s, i) => (
              <div key={i} className="bg-card rounded-lg p-4 border border-border space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Hizmet {i + 1}</p>
                <input className={inputClass} placeholder="Başlık" value={s.title} onChange={(e) => updateService(i, "title", e.target.value)} />
                <textarea className={inputClass} rows={2} placeholder="Açıklama" value={s.description} onChange={(e) => updateService(i, "description", e.target.value)} />
                <input className={inputClass} placeholder="İkon (Wrench, Settings, Package, Phone)" value={s.icon} onChange={(e) => updateService(i, "icon", e.target.value)} />
              </div>
            ))}
          </div>
        </section>

        {/* Machines */}
        <section>
          <h2 className={sectionTitle}>Makineler ({content.machines.length})</h2>
          <div className="space-y-4">
            {content.machines.map((m, i) => (
              <div key={i} className="bg-card rounded-lg p-4 border border-border space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Makine {i + 1}</p>
                <input className={inputClass} placeholder="Başlık" value={m.title} onChange={(e) => updateMachine(i, "title", e.target.value)} />
                <textarea className={inputClass} rows={2} placeholder="Açıklama" value={m.description} onChange={(e) => updateMachine(i, "description", e.target.value)} />
                <input className={inputClass} placeholder="Görsel URL" value={m.image} onChange={(e) => updateMachine(i, "image", e.target.value)} />
              </div>
            ))}
          </div>
        </section>

        {/* Slider */}
        <section>
          <h2 className={sectionTitle}>Slider Görselleri ({content.sliderImages.length})</h2>
          <div className="space-y-4">
            {content.sliderImages.map((s, i) => (
              <div key={i} className="bg-card rounded-lg p-4 border border-border space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Slider {i + 1}</p>
                <input className={inputClass} placeholder="Görsel URL" value={s.image} onChange={(e) => updateSlider(i, "image", e.target.value)} />
                <input className={inputClass} placeholder="Açıklama" value={s.caption} onChange={(e) => updateSlider(i, "caption", e.target.value)} />
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section>
          <h2 className={sectionTitle}>İletişim Bilgileri</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Telefon 1</label>
              <input className={inputClass} value={content.contact.phone1} onChange={(e) => setContent({ ...content, contact: { ...content.contact, phone1: e.target.value } })} />
            </div>
            <div>
              <label className={labelClass}>Telefon 2</label>
              <input className={inputClass} value={content.contact.phone2} onChange={(e) => setContent({ ...content, contact: { ...content.contact, phone2: e.target.value } })} />
            </div>
            <div>
              <label className={labelClass}>E-posta</label>
              <input className={inputClass} value={content.contact.email} onChange={(e) => setContent({ ...content, contact: { ...content.contact, email: e.target.value } })} />
            </div>
            <div>
              <label className={labelClass}>Adres</label>
              <input className={inputClass} value={content.contact.address} onChange={(e) => setContent({ ...content, contact: { ...content.contact, address: e.target.value } })} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Admin;
