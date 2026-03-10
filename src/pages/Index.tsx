import Layout from "@/components/Layout";
import { getContent } from "@/lib/defaultContent";
import { Wrench, Settings, Package, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import heroChillerImg from "@/assets/hero-chiller.webp";

const iconMap: Record<string, React.ReactNode> = {
  Wrench: <Wrench size={32} />,
  Settings: <Settings size={32} />,
  Package: <Package size={32} />,
  Phone: <Phone size={32} />,
};

const Index = () => {
  const content = getContent();

  return (
    <Layout>
      {/* Hero */}
      <section className="hero-gradient section-padding">
        <div className="section-container flex flex-col lg:flex-row items-center gap-10">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold text-primary-foreground leading-tight mb-6 animate-fade-in">
              {content.heroTitle}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-primary-foreground/90 max-w-3xl mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              {content.heroSubtitle}
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <Link
                to="/services"
                className="px-6 py-3 bg-card text-primary font-semibold rounded-lg hover:bg-secondary transition-colors"
              >
                Hizmetlerimiz
              </Link>
              <Link
                to="/contact"
                className="px-6 py-3 border-2 border-primary-foreground text-primary-foreground font-semibold rounded-lg hover:bg-primary-foreground/10 transition-colors"
              >
                İletişim
              </Link>
            </div>
          </div>
          <div className="flex-1 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <img
              src={heroChillerImg}
              alt="Endüstriyel Chiller Soğutma Sistemi"
              className="w-full max-w-lg mx-auto rounded-xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="section-padding section-alt">
        <div className="section-container">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-center text-foreground mb-12">
            Hizmetlerimiz
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.services.map((service, i) => (
              <div
                key={i}
                className="bg-card rounded-xl p-6 text-center card-elevated animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center text-primary">
                  {iconMap[service.icon] || <Wrench size={32} />}
                </div>
                <h3 className="font-heading font-bold text-lg text-foreground mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="section-container text-center">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-4">
            Profesyonel Hizmet İçin Bizi Arayın
          </h2>
          <p className="text-muted-foreground mb-6">
            7/24 acil servis desteği ile yanınızdayız.
          </p>
          <a
            href={`tel:${content.contact.phone1.replace(/\s/g, "")}`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-lg text-lg hover:bg-accent transition-colors"
          >
            <Phone size={20} />
            {content.contact.phone1}
          </a>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
