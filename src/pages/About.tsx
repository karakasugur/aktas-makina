import Layout from "@/components/Layout";
import { getContent } from "@/lib/defaultContent";
import { Shield, Award, Users } from "lucide-react";

const values = [
  { icon: <Shield size={28} />, title: "Kalite", description: "En yüksek kalite standartlarında hizmet sunuyoruz." },
  { icon: <Award size={28} />, title: "Güvenilirlik", description: "Uzun yıllara dayanan tecrübemizle güvenilir çözümler üretiyoruz." },
  { icon: <Users size={28} />, title: "Müşteri Memnuniyeti", description: "Müşterilerimizin memnuniyeti her zaman önceliğimizdir." },
];

const About = () => {
  const content = getContent();

  return (
    <Layout>
      {/* Header */}
      <section className="hero-gradient py-16 md:py-20">
        <div className="section-container text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold text-primary-foreground">
            {content.aboutTitle}
          </h1>
        </div>
      </section>

      {/* About text */}
      <section className="section-padding">
        <div className="section-container max-w-4xl">
          <p className="text-foreground leading-relaxed text-base md:text-lg whitespace-pre-line">
            {content.aboutText}
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding section-alt">
        <div className="section-container">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-center text-foreground mb-12">
            Değerlerimiz
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <div key={i} className="bg-card rounded-xl p-8 text-center card-elevated">
                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center text-primary">
                  {v.icon}
                </div>
                <h3 className="font-heading font-bold text-lg text-foreground mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
