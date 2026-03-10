import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
import { getContent } from "@/lib/defaultContent";

const Footer = () => {
  const content = getContent();

  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="section-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company info */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Aktaş Grup</h3>
            <p className="text-sm opacity-80 leading-relaxed">
              Endüstriyel makine ve klima sistemleri alanında bakım, onarım ve satış hizmetleri sunmaktayız.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">Hızlı Bağlantılar</h3>
            <ul className="space-y-2 text-sm opacity-80">
              {[
                { label: "Ana Sayfa", path: "/" },
                { label: "Hakkımızda", path: "/about" },
                { label: "Hizmetler", path: "/services" },
                { label: "Makineler", path: "/machines" },
                { label: "İletişim", path: "/contact" },
              ].map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="hover:opacity-100 transition-opacity">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-bold text-lg mb-4">İletişim</h3>
            <ul className="space-y-3 text-sm opacity-80">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0" />
                <span>{content.contact.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="shrink-0" />
                <span>{content.contact.phone1} / {content.contact.phone2}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="shrink-0" />
                <span>{content.contact.email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-center text-sm opacity-60">
          © {new Date().getFullYear()} Aktaş Grup Makina & Klima Sistemleri. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
