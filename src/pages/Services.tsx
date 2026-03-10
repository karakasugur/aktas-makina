import Layout from "@/components/Layout";
import { Shield, Clock, Award, Users, ThumbsUp, Headphones } from "lucide-react";

const reasons = [
  {
    icon: <Shield size={36} />,
    title: "Güvenilirlik",
    description:
      "Yılların getirdiği sektör deneyimi ve binlerce başarılı projeyle müşterilerimize güven veriyoruz. Her işimizde kaliteyi ve şeffaflığı ön planda tutuyoruz.",
  },
  {
    icon: <Clock size={36} />,
    title: "Hızlı Müdahale",
    description:
      "7/24 acil servis hizmetimizle arızalara anında müdahale ediyoruz. Zaman kaybını en aza indirerek iş sürekliliğinizi koruyoruz.",
  },
  {
    icon: <Award size={36} />,
    title: "Uzman Kadro",
    description:
      "Alanında uzman, sertifikalı teknik ekibimiz tüm marka ve modellerde profesyonel hizmet sunmaktadır. Sürekli eğitimlerle kendimizi güncel tutuyoruz.",
  },
  {
    icon: <Users size={36} />,
    title: "Müşteri Odaklı Yaklaşım",
    description:
      "Her müşterimizin ihtiyaçlarını ayrı ayrı analiz ederek kişiye özel çözümler üretiyoruz. Memnuniyetiniz bizim önceliğimizdir.",
  },
  {
    icon: <ThumbsUp size={36} />,
    title: "Uygun Fiyat Garantisi",
    description:
      "Kaliteli hizmeti uygun fiyatlarla sunuyoruz. Şeffaf fiyatlandırma politikamızla sürpriz maliyetler yaşamazsınız.",
  },
  {
    icon: <Headphones size={36} />,
    title: "Satış Sonrası Destek",
    description:
      "İşlem sonrası da yanınızdayız. Garanti kapsamında ve sonrasında teknik destek hizmetimiz kesintisiz devam eder.",
  },
];

const Services = () => {
  return (
    <Layout>
      <section className="hero-gradient py-16 md:py-20">
        <div className="section-container text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold text-primary-foreground">
            Neden Biz?
          </h1>
          <p className="mt-4 text-lg text-primary-foreground/85 max-w-2xl mx-auto">
            Aktaş Grup olarak fark yaratan hizmet anlayışımızı keşfedin.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reasons.map((reason, i) => (
              <div
                key={i}
                className="bg-card rounded-xl p-8 card-elevated flex flex-col items-center text-center gap-4"
              >
                <div className="w-16 h-16 shrink-0 rounded-full bg-secondary flex items-center justify-center text-primary">
                  {reason.icon}
                </div>
                <h3 className="font-heading font-bold text-xl text-foreground">
                  {reason.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {reason.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
