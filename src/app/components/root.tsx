import { Outlet, Link, useLocation } from "react-router";
import { Music2, Calendar, Heart, BarChart3, Menu, X, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ScrollToTop } from "./scroll-to-top";
import { getFaviconDataUrl } from "../favicons/favicon-decoder";


export function Root() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auto-sync disabled - use /admin-sync to manually trigger sync
  // useEffect(() => {
  //   syncStorageToSupabase().catch(console.error);
  // }, []);

  // Set favicon and meta tags for Google
  useEffect(() => {
    // Set page title
    document.title = "Hallyu Wishlist - K-pop Events in Greece";
    
    // Set favicon
    const setFavicon = (href: string, rel: string = "icon", sizes?: string, type?: string) => {
      let link = document.querySelector(`link[rel="${rel}"]${sizes ? `[sizes="${sizes}"]` : ''}`) as HTMLLinkElement;
      if (!link) {
        link = document.createElement("link");
        link.rel = rel;
        if (sizes) link.setAttribute("sizes", sizes);
        if (type) link.type = type;
        document.head.appendChild(link);
      }
      link.href = href;
    };

    // Set all favicon variants - using root paths since publicDir copies them to root
    setFavicon(getFaviconDataUrl(), "icon", undefined, "image/x-icon"); // Base64 ICO favicon
    setFavicon("/favicon.png", "icon"); // PNG fallback
    setFavicon("/favicon-16x16.png", "icon", "16x16");
    setFavicon("/favicon.png", "icon", "32x32");
    setFavicon("/apple-touch-icon.png", "apple-touch-icon", "180x180");
    setFavicon("/android-chrome-192x192.png", "icon", "192x192");
    setFavicon("/android-chrome-512x512.png", "icon", "512x512");

    // Set meta tags for Google and SEO
    const setMetaTag = (name: string, content: string, property?: boolean) => {
      const attr = property ? "property" : "name";
      let meta = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    setMetaTag("description", "Discover K-pop concerts and events in Greece. Vote for your favorite artists, participate in polls, and join the Hallyu wave!");
    setMetaTag("keywords", "K-pop, Greece, concerts, events, Hallyu, Korean music, Athens, Thessaloniki");
    setMetaTag("theme-color", "#1e40af");
    
    // Open Graph tags for social media
    setMetaTag("og:title", "Hallyu Wishlist - K-pop Events in Greece", true);
    setMetaTag("og:description", "Discover K-pop concerts and events in Greece. Vote for your favorite artists and join the Hallyu wave!", true);
    setMetaTag("og:type", "website", true);
    setMetaTag("og:image", "/android-chrome-512x512.png", true);
    
    // Twitter Card tags
    setMetaTag("twitter:card", "summary_large_image");
    setMetaTag("twitter:title", "Hallyu Wishlist - K-pop Events in Greece");
    setMetaTag("twitter:description", "Discover K-pop concerts and events in Greece. Vote for your favorite artists!");
    setMetaTag("twitter:image", "/android-chrome-512x512.png");
  }, []);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { path: "/", label: "Home", icon: Music2 },
    { path: "/events", label: "Events", icon: Calendar },
    { path: "/fan-tools", label: "Fan Tools", icon: Heart },
    { path: "/kpi-dashboard", label: "Analytics", icon: BarChart3 },
    { path: "/contact-us", label: "Contact Us", icon: Menu }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-red-50 to-blue-100">
      {/* Scroll to top on route change */}
      <ScrollToTop />
      
      {/* Header */}
      
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        className="bg-gradient-to-r from-blue-900/95 via-red-900/95 to-blue-900/95 backdrop-blur-md border-b border-blue-200 sticky top-0 z-50 shadow-lg"
      >
      
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-r from-blue-600 to-red-600 p-2 rounded-lg shadow-lg"
              >
                <Sparkles className="size-6 text-white" />
              </motion.div>
              <div>
                <div className="text-xl font-bold bg-gradient-to-r from-blue-100 to-red-100 bg-clip-text text-transparent">
                  Hallyu Wishlist
                </div>
                <div className="text-xs text-blue-200">Greece × Korea United</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive(path)
                      ? "bg-gradient-to-r from-blue-600 to-red-600 text-white shadow-lg"
                      : "text-blue-100 hover:bg-white/10"
                  }`}
                >
                  <Icon className="size-4" />
                  <span>{label}</span>
                </Link>
              ))}
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10"
            >
              {mobileMenuOpen ? (
                <X className="size-6 text-blue-100" />
              ) : (
                <Menu className="size-6 text-blue-100" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.nav
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden py-4 space-y-1 overflow-hidden"
              >
                {navLinks.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
                      isActive(path)
                        ? "bg-gradient-to-r from-blue-600 to-red-600 text-white shadow-lg"
                        : "text-blue-100 hover:bg-white/10"
                    }`}
                  >
                    <Icon className="size-5" />
                    <span>{label}</span>
                  </Link>
                ))}
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-900/95 via-red-900/95 to-blue-900/95 backdrop-blur-md border-t border-blue-700/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center md:text-left"
            >
              <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
                <div className="bg-gradient-to-r from-blue-600 to-red-600 p-2.5 rounded-lg shadow-lg">
                  <Sparkles className="size-5 text-white" />
                </div>
                <div className="text-xl font-bold text-white">
                  Hallyu Wishlist
                </div>
              </div>
              <p className="text-sm text-blue-100/80 leading-relaxed max-w-xs mx-auto md:mx-0">
                Bridging Greece and Korea through K-pop concerts, events, and fan community engagement.
              </p>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center md:text-left"
            >
              <h3 className="font-bold text-white mb-4 text-base">Quick Links</h3>
              <ul className="space-y-2.5">
                <li>
                  <Link to="/events" className="text-sm text-blue-100/80 hover:text-white transition-colors inline-flex items-center gap-1 group">
                    <span className="group-hover:translate-x-1 transition-transform">Browse Events</span>
                  </Link>
                </li>
                <li>
                  <Link to="/fan-tools" className="text-sm text-blue-100/80 hover:text-white transition-colors inline-flex items-center gap-1 group">
                    <span className="group-hover:translate-x-1 transition-transform">Fan Tools</span>
                  </Link>
                </li>
                <li>
                  <Link to="/kpi-dashboard" className="text-sm text-blue-100/80 hover:text-white transition-colors inline-flex items-center gap-1 group">
                    <span className="group-hover:translate-x-1 transition-transform">Analytics</span>
                  </Link>
                </li>
                <li>
                  <Link to="/contact-us" className="text-sm text-blue-100/80 hover:text-white transition-colors inline-flex items-center gap-1 group">
                    <span className="group-hover:translate-x-1 transition-transform">Contact Us</span>
                  </Link>
                </li>
              </ul>
            </motion.div>

            {/* For Companies */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center md:text-left"
            >
              <h3 className="font-bold text-white mb-4 text-base">For Companies</h3>
              <p className="text-sm text-blue-100/80 mb-5 leading-relaxed">
                Partner with us to bring K-pop to Greece. Access our analytics dashboard for valuable insights.
              </p>
              <div className="flex justify-center md:justify-start">
                <Link
                  to="/kpi-dashboard"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-lg hover:shadow-xl hover:scale-105 transition-all text-sm font-semibold shadow-lg"
                >
                  <BarChart3 className="size-4" />
                  View Analytics
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Copyright Section */}
          <div className="mt-12 pt-8 border-t border-blue-700/50">
            <div className="text-center space-y-2">
              <p className="text-sm text-blue-100/90 font-medium">
                © 2026 Hallyu Wishlist • Greece 🇬🇷 × Korea 🇰🇷
              </p>
              <p className="text-xs text-blue-200/60">
                All content belongs to its respective owners. We do not own any of the content shown.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}