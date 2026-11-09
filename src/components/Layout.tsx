import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BottomSlider from "./BottomSlider";
import WhatsAppButton from "./WhatsAppButton"; // UKARAKAS 09.11.2026

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <BottomSlider />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Layout;
