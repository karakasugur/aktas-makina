import Marquee from "react-fast-marquee";
import istanbulUniLogo from "@/assets/ref-istanbul-universitesi.png";
import yildizTeknikLogo from "@/assets/yildiz-teknik-universitesi-seeklogo.png";
import adaletBakanligiLogo from "@/assets/ref-adalet-bakanligi.png";
import saglikBakanligiLogo from "@/assets/ref-saglik-bakanligi.png";
import savunmaBakanligiLogo from "@/assets/ref-savunma-bakanligi.png";

const references = [
  { name: "İstanbul Üniversitesi", logo: istanbulUniLogo },
  { name: "Yıldız Teknik Üniversitesi", logo: yildizTeknikLogo },
  { name: "T.C. Adalet Bakanlığı", logo: adaletBakanligiLogo },
  { name: "T.C. Sağlık Bakanlığı", logo: saglikBakanligiLogo },
  { name: "T.C. Milli Savunma Bakanlığı", logo: savunmaBakanligiLogo },
];

const BottomSlider = () => {
  return (
    <section className="bg-secondary py-12 md:py-16">
      <div className="container">
        <h2 className="text-center text-2xl md:text-3xl font-heading font-bold text-foreground mb-10">
          Referanslarımız
        </h2>
        <Marquee pauseOnHover>
          {references.map((ref, i) => (
            <div key={i} className="mx-4">
              <div className="flex flex-col items-center gap-3 p-6 bg-card rounded-xl card-elevated w-[200px]">
                <img
                  src={ref.logo}
                  alt={`${ref.name} logosu`}
                  className="h-20 md:h-24 w-auto object-contain"
                />
                <span className="text-xs md:text-sm font-medium text-muted-foreground text-center leading-tight">
                  {ref.name}
                </span>
              </div>
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default BottomSlider;
