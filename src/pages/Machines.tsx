import Layout from "@/components/Layout";
// UKARAKAS 09.11.2026 - server-side content, stable image keys, "Teklif İste" button per machine
import { useContent, usePageTitle } from "@/lib/content";
import { Cog, Phone } from "lucide-react";
import { resolveImage } from "@/lib/images";
import { telLink, whatsappLink } from "@/lib/contact";
import { WhatsAppIcon } from "@/components/WhatsAppButton";

const Machines = () => {
  const content = useContent();
  usePageTitle("Makineler");
  const { whatsapp, phone1 } = content.contact;

  return (
    <Layout>
      <section className="hero-gradient py-16 md:py-20">
        <div className="section-container text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold text-primary-foreground">
            Makineler
          </h1>
          <p className="text-primary-foreground/80 mt-4 text-lg">
            Bakım ve onarım hizmeti verdiğimiz endüstriyel makineler
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="section-container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.machines.map((machine, i) => (
              <article key={i} className="bg-card rounded-xl overflow-hidden card-elevated group flex flex-col">
                <div className="h-48 bg-white overflow-hidden">
                  {resolveImage(machine.image) ? (
                    <img
                      src={resolveImage(machine.image)}
                      alt={machine.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary/30">
                      <Cog size={64} />
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-heading font-bold text-lg text-foreground mb-2">{machine.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">{machine.description}</p>
                  {whatsapp.trim() ? (
                    <a
                      href={whatsappLink(whatsapp, `Merhaba, "${machine.title}" hakkında bilgi ve teklif almak istiyorum.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#25D366] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                    >
                      <WhatsAppIcon size={18} /> Teklif İste
                    </a>
                  ) : (
                    <a
                      href={telLink(phone1)}
                      className="mt-5 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-accent transition-colors"
                    >
                      <Phone size={16} /> Teklif İçin Arayın
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Machines;
