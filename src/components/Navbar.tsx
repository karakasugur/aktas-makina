import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Ana Sayfa", path: "/" },
  { label: "Hakkımızda", path: "/about" },
  { label: "Neden Biz", path: "/services" },
  { label: "Makineler", path: "/machines" },
  { label: "İletişim", path: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <nav className="sticky top-0 z-50 bg-card shadow-[var(--navbar-shadow)]">
      <div className="section-container flex items-center justify-between h-14 sm:h-16 md:h-20">
        {/* Logo Text */}
        <Link to="/" className="flex flex-col">
          <span className="text-lg sm:text-xl md:text-2xl font-heading font-extrabold text-primary tracking-tight leading-none">
            Aktaş Grup
          </span>
          <span className="text-[10px] sm:text-xs text-muted-foreground leading-tight">
            Makina & Klima Sistemleri
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-secondary hover:text-secondary-foreground"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2 rounded-md text-foreground hover:bg-secondary"
          onClick={() => setOpen(!open)}
          aria-label="Menü"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden fixed inset-x-0 top-14 sm:top-16 md:top-20 bottom-0 bg-card/95 backdrop-blur-sm z-40 border-t border-border overflow-y-auto">
          <ul className="section-container flex flex-col gap-1 pt-4 pb-8">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-3.5 rounded-md text-base font-medium transition-colors ${
                    location.pathname === item.path
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-secondary"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
