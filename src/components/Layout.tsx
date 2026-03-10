import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BottomSlider from "./BottomSlider";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <BottomSlider />
      <Footer />
    </div>
  );
};

export default Layout;
