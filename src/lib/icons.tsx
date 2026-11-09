// Author: UKARAKAS | Date: 09.11.2026 | Icons selectable for service cards (shared by site and admin)
import { Wrench, Settings, Package, Phone, ShoppingCart, Snowflake, Thermometer, Factory, Truck, ShieldCheck, Clock, Fan } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const serviceIcons: Record<string, { label: string; Icon: LucideIcon }> = {
  Wrench: { label: "Anahtar (bakım)", Icon: Wrench },
  Settings: { label: "Dişli (ayar)", Icon: Settings },
  Package: { label: "Kutu (yedek parça)", Icon: Package },
  Phone: { label: "Telefon (servis)", Icon: Phone },
  ShoppingCart: { label: "Sepet (satış)", Icon: ShoppingCart },
  Snowflake: { label: "Kar tanesi (soğutma)", Icon: Snowflake },
  Fan: { label: "Fan (klima)", Icon: Fan },
  Thermometer: { label: "Termometre", Icon: Thermometer },
  Factory: { label: "Fabrika", Icon: Factory },
  Truck: { label: "Kamyon (teslimat)", Icon: Truck },
  ShieldCheck: { label: "Kalkan (garanti)", Icon: ShieldCheck },
  Clock: { label: "Saat (7/24)", Icon: Clock },
};

export const ServiceIcon = ({ name, size = 32 }: { name: string; size?: number }) => {
  const Icon = serviceIcons[name]?.Icon ?? Wrench;
  return <Icon size={size} />;
};
