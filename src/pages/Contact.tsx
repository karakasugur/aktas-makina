// UKARAKAS 09.11.2026 - contact form now really sends (api/contact.php), WhatsApp card, embedded map,
// server-side content. phone2 removed.
import { useState } from "react";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { useContent, usePageTitle } from "@/lib/content";
import { Phone, Mail, MapPin, Send, Loader2, CheckCircle2 } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { telLink, whatsappLink } from "@/lib/contact";
import { WhatsAppIcon } from "@/components/WhatsAppButton";

const fieldClass =
  "w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

const emptyForm = { name: "", email: "", phone: "", message: "", website: "" };

const Contact = () => {
  const content = useContent();
  usePageTitle("İletişim");
  const [form, setForm] = useState(emptyForm);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await apiRequest("contact.php", { body: form });
      setSent(true);
      setForm(emptyForm);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Mesaj gönderilemedi.", {
        description: `Dilerseniz bizi ${content.contact.phone1} numarasından arayabilirsiniz.`,
      });
    } finally {
      setSending(false);
    }
  };

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(content.contact.address)}`;
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(content.contact.address)}&z=16&output=embed`;

  const infoIcon = "w-12 h-12 shrink-0 rounded-full bg-secondary flex items-center justify-center text-primary";

  return (
    <Layout>
      <section className="hero-gradient py-16 md:py-20">
        <div className="section-container text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold text-primary-foreground">
            İletişim
          </h1>
        </div>
      </section>

      <section className="section-padding">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-6">Bize Ulaşın</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className={`${infoIcon} hover:bg-accent hover:text-primary-foreground transition-colors`} aria-label="Haritada aç">
                    <MapPin size={22} />
                  </a>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground">Adres</h3>
                    <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground text-sm mt-1 block hover:text-primary transition-colors">
                      {content.contact.address}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className={infoIcon}>
                    <Phone size={22} />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground">Telefon</h3>
                    <a href={telLink(content.contact.phone1)} className="text-muted-foreground text-sm mt-1 block hover:text-primary transition-colors">
                      {content.contact.phone1}
                    </a>
                  </div>
                </div>
                {content.contact.whatsapp.trim() && (
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 shrink-0 rounded-full bg-[#25D366]/15 flex items-center justify-center text-[#1da851]">
                      <WhatsAppIcon size={22} />
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-foreground">WhatsApp</h3>
                      <a
                        href={whatsappLink(content.contact.whatsapp, "Merhaba, web siteniz üzerinden ulaşıyorum.")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground text-sm mt-1 block hover:text-primary transition-colors"
                      >
                        Hemen yazın, hızlıca dönüş yapalım
                      </a>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-4">
                  <div className={infoIcon}>
                    <Mail size={22} />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground">E-posta</h3>
                    <a href={`mailto:${content.contact.email}`} className="text-muted-foreground text-sm mt-1 block hover:text-primary transition-colors">
                      {content.contact.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-6">Mesaj Gönderin</h2>
              {sent ? (
                <div className="rounded-xl border border-border bg-card p-8 text-center space-y-3">
                  <CheckCircle2 size={48} className="mx-auto text-green-600" />
                  <p className="font-heading font-semibold text-lg text-foreground">Mesajınız bize ulaştı.</p>
                  <p className="text-sm text-muted-foreground">En kısa sürede size dönüş yapacağız. Acil durumlar için bizi arayabilirsiniz.</p>
                  <button onClick={() => setSent(false)} className="text-sm text-primary hover:underline">
                    Yeni mesaj yaz
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input type="text" placeholder="Adınız Soyadınız" required minLength={2} maxLength={100} autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={fieldClass} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input type="email" placeholder="E-posta Adresiniz" required maxLength={200} autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={fieldClass} />
                    <input type="tel" placeholder="Telefon (isteğe bağlı)" maxLength={40} autoComplete="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={fieldClass} />
                  </div>
                  <textarea placeholder="Mesajınız" required minLength={5} maxLength={5000} rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className={`${fieldClass} resize-none`} />
                  {/* Hidden from people, bots fill it in (spam trap) */}
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="hidden" aria-hidden="true" />
                  <button
                    type="submit"
                    disabled={sending}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-accent transition-colors disabled:opacity-60"
                  >
                    {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    {sending ? "Gönderiliyor..." : "Gönder"}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Map */}
          <div className="mt-12 rounded-xl overflow-hidden border border-border card-elevated">
            <iframe
              title="Aktaş Grup konumu"
              src={mapEmbedUrl}
              className="w-full h-[320px] md:h-[420px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
