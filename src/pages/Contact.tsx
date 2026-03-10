import { useState } from "react";
import Layout from "@/components/Layout";
import { getContent } from "@/lib/defaultContent";
import { Phone, Mail, MapPin, Send } from "lucide-react";

const Contact = () => {
  const content = getContent();
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.");
    setForm({ name: "", email: "", message: "" });
  };

  const mapsUrl = "https://www.google.com/maps/place/Alt%C4%B1n%C5%9Fehir,+Atlas+Sk.+No:7,+34775+%C3%9Cmraniye%2F%C4%B0stanbul/@41.0156012,29.136346,695m/data=!3m2!1e3!4b1!4m6!3m5!1s0x14cac8d2ad6f354f:0xfcbf659988d5e1a2!8m2!3d41.0156012!4d29.1389263!16s%2Fg%2F11c19wld6r?hl=tr&entry=ttu&g_ep=EgoyMDI2MDMwNS4wIKXMDSoASAFQAw%3D%3D";

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
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 shrink-0 rounded-full bg-secondary flex items-center justify-center text-primary hover:bg-accent transition-colors"
                  >
                    <MapPin size={22} />
                  </a>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground">Adres</h3>
                    <p className="text-muted-foreground text-sm mt-1">{content.contact.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 shrink-0 rounded-full bg-secondary flex items-center justify-center text-primary">
                    <Phone size={22} />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground">Telefon</h3>
                    <a href={`tel:${content.contact.phone1.replace(/\s/g, "")}`} className="text-muted-foreground text-sm mt-1 block hover:text-primary transition-colors">{content.contact.phone1}</a>
                    <a href={`tel:${content.contact.phone2.replace(/\s/g, "")}`} className="text-muted-foreground text-sm block hover:text-primary transition-colors">{content.contact.phone2}</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 shrink-0 rounded-full bg-secondary flex items-center justify-center text-primary">
                    <Mail size={22} />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-foreground">E-posta</h3>
                    <a href={`mailto:${content.contact.email}`} className="text-muted-foreground text-sm mt-1 block hover:text-primary transition-colors">{content.contact.email}</a>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-6">Mesaj Gönderin</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Adınız Soyadınız"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <input
                  type="email"
                  placeholder="E-posta Adresiniz"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <textarea
                  placeholder="Mesajınız"
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-accent transition-colors"
                >
                  <Send size={18} />
                  Gönder
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
