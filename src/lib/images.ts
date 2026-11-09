// Author: UKARAKAS | Date: 09.11.2026 | Registry of bundled images, referenced by stable keys
//
// Bundled image URLs change on every build (hashed file names), so saved content
// never stores them directly. It stores "asset:<key>" for bundled images or
// "/uploads/<file>" for images uploaded from the admin panel.
import salonKlimaImg from "@/assets/Salon-tipi-klima.jpg";
import kasetKlimaImg from "@/assets/cassette-ac.jpg";
import chillerImg from "@/assets/chiller.webp";
import bulasikImg from "@/assets/dish-Washer.jpg";
import hamurKesmeImg from "@/assets/dough-cutter.jpg";
import hamurYogurmaImg from "@/assets/dough-machine.jpg";
import mutfakRobotuImg from "@/assets/mutfak-robotu.jpg";
import tunelFirinImg from "@/assets/tunnel-oven.webp";
import camasirImg from "@/assets/washing-machine.jpg";
import splitKlimaImg from "@/assets/split-klima.jpg";
import donerFirinImg from "@/assets/rotary-oven.jpg";
import heroChillerImg from "@/assets/hero-chiller.webp";

export const bundledImages: Record<string, { label: string; url: string }> = {
  chiller: { label: "Chiller", url: chillerImg },
  "salon-klima": { label: "Salon tipi klima", url: salonKlimaImg },
  "split-klima": { label: "Duvar tipi klima", url: splitKlimaImg },
  "kaset-klima": { label: "Kaset tipi klima", url: kasetKlimaImg },
  "hamur-yogurma": { label: "Hamur yoğurma makinası", url: hamurYogurmaImg },
  "mutfak-robotu": { label: "Mutfak robotu", url: mutfakRobotuImg },
  camasir: { label: "Çamaşır makinesi", url: camasirImg },
  bulasik: { label: "Bulaşık makinesi", url: bulasikImg },
  "hamur-kesme": { label: "Hamur kesme makinesi", url: hamurKesmeImg },
  "tunel-firin": { label: "Tünel fırın", url: tunelFirinImg },
  "doner-firin": { label: "Döner fırın", url: donerFirinImg },
  "hero-chiller": { label: "Chiller (ana sayfa)", url: heroChillerImg },
};

/** Turns a stored image reference into a URL the browser can load. */
export const resolveImage = (ref: string | undefined | null): string => {
  if (!ref) return "";
  if (ref.startsWith("asset:")) return bundledImages[ref.slice(6)]?.url ?? "";
  // Only allow our own uploads or https images, nothing else (e.g. javascript: or data:)
  if (ref.startsWith("/uploads/") || ref.startsWith("https://")) return ref;
  return "";
};
