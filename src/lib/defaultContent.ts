import rconditionerImg from "@/assets/Salon-tipi-klima.jpg";
import cassetteAcImg from "@/assets/cassette-ac.jpg";
import chillerImg from "@/assets/chiller.webp";
import dishWasherImg from "@/assets/dish-Washer.jpg";
import doughCutterImg from "@/assets/dough-cutter.jpg";
import doughMachineImg from "@/assets/dough-machine.jpg";
import fmixImg from "@/assets/mutfak-robotu.jpg";
import tunnelOvenImg from "@/assets/tunnel-oven.webp";
import washingMachineImg from "@/assets/washing-machine.jpg";
import wconditionerImg from "@/assets/split-klima.jpg";


interface Service {
    title: string;
    description: string;
    icon: string;
  }
  
  interface Machine {
    title: string;
    description: string;
    image: string;
  }
  
  export interface SiteContent {
    heroTitle: string;
    heroSubtitle: string;
    aboutTitle: string;
    aboutText: string;
    services: Service[];
    machines: Machine[];
    sliderImages: string[];
    contact: {
      address: string;
      phone1: string;
      phone2: string;
      email: string;
    };
  }

  export const getContent = (): SiteContent => {
    if (typeof window !== "undefined") {
      const storedContent = localStorage.getItem("siteContent");
      if (storedContent) {
        return JSON.parse(storedContent);
      }
    }
    return defaultContent;
  };

  export const saveContent = (content: SiteContent) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("siteContent", JSON.stringify(content));
    }
  };
  
  export const resetContent = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("siteContent");
    }
  };
  
  export const defaultContent: SiteContent = {
    heroTitle: "Endüstriyel Makine ve Klima Bakım, Onarım & Satış",
    heroSubtitle: "Chiller, salon tipi klima, duvar tipi klima, kaset tipi klima,VRF merkezi sistemleri, soğutma santralleri, fancoil soğutma sistemleri,hassas klima sistemleri,pano klima sistemleri ve endüstriyel makinalarda uzman çözümler.",
    aboutTitle: "Hakkımızda",
    aboutText: "Aktaş Grup Makina & Klima Sistemleri olarak, endüstriyel makine ve klima sistemleri alanında uzun yıllara dayanan deneyimimizle müşterilerimize en kaliteli hizmeti sunmaktayız. Uzman ekibimiz, bakım, onarım ve satış süreçlerinde güvenilir çözümler üretmektedir. Müşteri memnuniyetini ön planda tutarak, sektördeki en son teknolojileri takip ediyor ve iş ortaklarımıza değer katıyoruz. Kalite, güvenilirlik ve müşteri memnuniyeti temel değerlerimizdir.",
    services: [
      { title: "Bakım ve Onarım", description: "Endüstriyel makine ve klima sistemlerinizin periyodik bakım ve onarımını uzman ekibimizle gerçekleştiriyoruz. Arızaları önleyin, verimliliği artırın!", icon: "Wrench" },
      { title: "Satış ve Kurulum", description: "İhtiyaçlarınıza en uygun, enerji verimli ve yüksek performanslı endüstriyel çözümleri sunuyoruz. Profesyonel kurulum hizmetimizle yanınızdayız.", icon: "ShoppingCart" },
      { title: "Yedek Parça", description: "Tüm endüstriyel makine ve klima sistemleri için orijinal ve uyumlu yedek parça tedariki sağlıyoruz. Geniş stok ağımız sayesinde hızlı teslimat yapıyoruz.", icon: "Package" },
      { title: "Acil Servis", description: "7/24 acil servis hizmetimiz ile kritik arızalarınıza anında müdahale ediyoruz. Deneyimli ekibimiz en kısa sürede yanınızda.", icon: "Phone" },
    ],
    machines: [
      { title: "Chiller Soğutma", description: "Endüstriyel chiller soğutma sistemlerinin bakım, onarım ve satışını gerçekleştiriyoruz. Tüm marka ve modellerde uzman çözümler sunuyoruz.", image: chillerImg },
      { title: "Salon Tipi Klima", description: "Salon tipi klima sistemlerinin kurulum, bakım ve onarım hizmetlerini profesyonel ekibimizle sağlıyoruz.", image: rconditionerImg },
      { title: "Duvar Tipi Klima", description: "Duvar tipi klima sistemlerinin montaj, bakım ve onarım işlemlerini uzman kadromuzla gerçekleştiriyoruz.", image: wconditionerImg },
      { title: "Kaset Tipi Klima", description: "Kaset tipi klima sistemlerinde kurulum, periyodik bakım ve arıza onarım hizmetleri sunuyoruz.", image: cassetteAcImg },
      { title: "Endüstriyel Hamur Yoğurma Makinası", description: "Endüstriyel hamur yoğurma makinalarının bakım, onarım ve yedek parça hizmetlerini sağlıyoruz.", image: doughMachineImg },
      { title: "Endüstriyel Mutfak Robotu", description: "Endüstriyel mutfak robotlarının bakım ve onarım hizmetlerini profesyonel ekibimizle sunuyoruz.", image: fmixImg },
      { title: "Endüstriyel Çamaşır Makinesi", description: "Endüstriyel çamaşır makinelerinin bakım, onarım ve yedek parça tedariki hizmetlerini veriyoruz.", image: washingMachineImg },
      { title: "Endüstriyel Bulaşık Makinesi", description: "Endüstriyel bulaşık makinelerinin kurulum, bakım ve arıza onarım hizmetlerini sağlıyoruz.", image: dishWasherImg},
      { title: "Endüstriyel Hamur Kesme Makinesi", description: "Endüstriyel hamur kesme makinelerinin bakım, onarım ve yedek parça hizmetlerini sunuyoruz.", image: doughCutterImg },
      { title: "Endüstriyel Taban Ekmek Tünel Fırın Sistemi", description: "Tünel fırın sistemlerinin kurulum, bakım ve onarım hizmetlerini uzman ekibimizle gerçekleştiriyoruz.", image: tunnelOvenImg },
    ],
    sliderImages: [
      rconditionerImg,
      cassetteAcImg,
      chillerImg,
      dishWasherImg,
      doughCutterImg,
      doughMachineImg,
      fmixImg,
      tunnelOvenImg,
      washingMachineImg,
      wconditionerImg
    ],
    contact: {
      address: "Altınşehir, Atlas Sk. No:7, 34775 Ümraniye/İstanbul",
      phone1: "+90 544 211 82 86",
      phone2: "+90 533 143 18 34",
      email: "info@aktasmakinagrup.com",
    },
  };