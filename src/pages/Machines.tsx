import Layout from "@/components/Layout";
import { getContent } from "@/lib/defaultContent";
import { Cog } from "lucide-react";

const Machines = () => {
  const content = getContent();

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
              <article key={i} className="bg-card rounded-xl overflow-hidden card-elevated group">
                <div className="h-48 bg-white overflow-hidden">
                  {machine.image ? (
                    <img
                      src={machine.image}
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
                <div className="p-6">
                  <h3 className="font-heading font-bold text-lg text-foreground mb-2">{machine.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{machine.description}</p>
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
