// UKARAKAS 09.11.2026 - Content now lives on the server (api/content.php). This file holds the
// defaults used until the admin saves something, and merges saved content with them.
// localStorage storage was removed: it only changed the admin's own browser.

export interface Service {
  title: string;
  description: string;
  icon: string;
}

export interface Machine {
  title: string;
  description: string;
  /** "asset:<key>" for bundled images, "/uploads/<file>" for uploaded ones */
  image: string;
}

export interface SiteContent {
  heroTitle: string;
  heroSubtitle: string;
  aboutTitle: string;
  aboutText: string;
  services: Service[];
  machines: Machine[];
  contact: {
    address: string;
    phone1: string;
    /** Number used for the WhatsApp button; empty hides the button */
    whatsapp: string;
    email: string;
  };
}

export const defaultContent: SiteContent = {
  heroTitle: "Endüstriyel Makine ve Klima Bakım, Onarım & Satış",
  // UKARAKAS 09.11.2026 - fixed missing spaces after commas
  heroSubtitle:
    "Chiller, salon tipi klima, duvar tipi klima, kaset tipi klima, VRF merkezi sistemleri, soğutma santralleri, fancoil soğutma sistemleri, hassas klima sistemleri, pano klima sistemleri ve endüstriyel makinalarda uzman çözümler.",
  aboutTitle: "Hakkımızda",
  aboutText:
    "Aktaş Grup Makina & Klima Sistemleri olarak, endüstriyel makine ve klima sistemleri alanında uzun yıllara dayanan deneyimimizle müşterilerimize en kaliteli hizmeti sunmaktayız. Uzman ekibimiz, bakım, onarım ve satış süreçlerinde güvenilir çözümler üretmektedir. Müşteri memnuniyetini ön planda tutarak, sektördeki en son teknolojileri takip ediyor ve iş ortaklarımıza değer katıyoruz. Kalite, güvenilirlik ve müşteri memnuniyeti temel değerlerimizdir.",
  services: [
    { title: "Bakım ve Onarım", description: "Endüstriyel makine ve klima sistemlerinizin periyodik bakım ve onarımını uzman ekibimizle gerçekleştiriyoruz. Arızaları önleyin, verimliliği artırın!", icon: "Wrench" },
    { title: "Satış ve Kurulum", description: "İhtiyaçlarınıza en uygun, enerji verimli ve yüksek performanslı endüstriyel çözümleri sunuyoruz. Profesyonel kurulum hizmetimizle yanınızdayız.", icon: "ShoppingCart" },
    { title: "Yedek Parça", description: "Tüm endüstriyel makine ve klima sistemleri için orijinal ve uyumlu yedek parça tedariki sağlıyoruz. Geniş stok ağımız sayesinde hızlı teslimat yapıyoruz.", icon: "Package" },
    { title: "Acil Servis", description: "7/24 acil servis hizmetimiz ile kritik arızalarınıza anında müdahale ediyoruz. Deneyimli ekibimiz en kısa sürede yanınızda.", icon: "Phone" },
  ],
  machines: [
    { title: "Chiller Soğutma", description: "Endüstriyel chiller soğutma sistemlerinin bakım, onarım ve satışını gerçekleştiriyoruz. Tüm marka ve modellerde uzman çözümler sunuyoruz.", image: "asset:chiller" },
    { title: "Salon Tipi Klima", description: "Salon tipi klima sistemlerinin kurulum, bakım ve onarım hizmetlerini profesyonel ekibimizle sağlıyoruz.", image: "asset:salon-klima" },
    { title: "Duvar Tipi Klima", description: "Duvar tipi klima sistemlerinin montaj, bakım ve onarım işlemlerini uzman kadromuzla gerçekleştiriyoruz.", image: "asset:split-klima" },
    { title: "Kaset Tipi Klima", description: "Kaset tipi klima sistemlerinde kurulum, periyodik bakım ve arıza onarım hizmetleri sunuyoruz.", image: "asset:kaset-klima" },
    { title: "Endüstriyel Hamur Yoğurma Makinası", description: "Endüstriyel hamur yoğurma makinalarının bakım, onarım ve yedek parça hizmetlerini sağlıyoruz.", image: "asset:hamur-yogurma" },
    { title: "Endüstriyel Mutfak Robotu", description: "Endüstriyel mutfak robotlarının bakım ve onarım hizmetlerini profesyonel ekibimizle sunuyoruz.", image: "asset:mutfak-robotu" },
    { title: "Endüstriyel Çamaşır Makinesi", description: "Endüstriyel çamaşır makinelerinin bakım, onarım ve yedek parça tedariki hizmetlerini veriyoruz.", image: "asset:camasir" },
    { title: "Endüstriyel Bulaşık Makinesi", description: "Endüstriyel bulaşık makinelerinin kurulum, bakım ve arıza onarım hizmetlerini sağlıyoruz.", image: "asset:bulasik" },
    { title: "Endüstriyel Hamur Kesme Makinesi", description: "Endüstriyel hamur kesme makinelerinin bakım, onarım ve yedek parça hizmetlerini sunuyoruz.", image: "asset:hamur-kesme" },
    { title: "Endüstriyel Taban Ekmek Tünel Fırın Sistemi", description: "Tünel fırın sistemlerinin kurulum, bakım ve onarım hizmetlerini uzman ekibimizle gerçekleştiriyoruz.", image: "asset:tunel-firin" },
  ],
  contact: {
    address: "Altınşehir, Atlas Sk. No:7, 34775 Ümraniye/İstanbul",
    phone1: "+90 544 211 82 86", // UKARAKAS 09.11.2026 - phone2 removed
    whatsapp: "+90 544 211 82 86",
    email: "info@aktasmakinagrup.com",
  },
};

const str = (v: unknown, fallback: string): string => (typeof v === "string" ? v : fallback);
const isObj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

/** Merges content saved on the server with the defaults, so missing or broken fields never crash the site. */
export const mergeWithDefaults = (raw: unknown): SiteContent => {
  if (!isObj(raw)) return defaultContent;
  const d = defaultContent;
  const contact = isObj(raw.contact) ? raw.contact : {};

  const services = Array.isArray(raw.services)
    ? raw.services.filter(isObj).map((s) => ({ title: str(s.title, ""), description: str(s.description, ""), icon: str(s.icon, "Wrench") }))
    : d.services;
  const machines = Array.isArray(raw.machines)
    ? raw.machines.filter(isObj).map((m) => ({ title: str(m.title, ""), description: str(m.description, ""), image: str(m.image, "") }))
    : d.machines;

  return {
    heroTitle: str(raw.heroTitle, d.heroTitle),
    heroSubtitle: str(raw.heroSubtitle, d.heroSubtitle),
    aboutTitle: str(raw.aboutTitle, d.aboutTitle),
    aboutText: str(raw.aboutText, d.aboutText),
    services,
    machines,
    contact: {
      address: str(contact.address, d.contact.address),
      phone1: str(contact.phone1, d.contact.phone1),
      whatsapp: str(contact.whatsapp, d.contact.whatsapp),
      email: str(contact.email, d.contact.email),
    },
  };
};
