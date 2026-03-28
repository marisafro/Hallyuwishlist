import { Outlet, Link, useLocation } from "react-router";
import { Music2, Calendar, Heart, BarChart3, Menu, X, Sparkles } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ScrollToTop } from "./scroll-to-top";


export function Root() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      <footer className="bg-gradient-to-r from-blue-900/90 via-red-900/90 to-blue-900/90 backdrop-blur-md border-t border-blue-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-red-600 p-2 rounded-lg shadow-lg">
                  <Sparkles className="size-5 text-white" />
                </div>
                <div className="text-lg font-bold bg-gradient-to-r from-blue-100 to-red-100 bg-clip-text text-transparent">
                  Hallyu Wishlist
                </div>
              </div>
              <p className="text-sm text-blue-200">
                Bridging Greece and Korea through K-pop concerts, events, and fan community engagement.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 id="QuickLink" className="font-semibold text-white mb-4 margin-left-40">Quick Links</h3>
              <ul className="space-y-2 text-sm text-blue-200">
                <li id="QuickLink"><Link to="/events" className="hover:text-red-300 transition-colors">Browse Events</Link></li>
                <li id="QuickLink"><Link to="/fan-tools" className="hover:text-red-300 transition-colors">Fan Tools</Link></li>
                <li id="QuickLink"><Link to="/kpi-dashboard" className="hover:text-red-300 transition-colors">Analytics</Link></li>
                <li id="QuickLink"><Link to="/contact-us" className="hover:text-red-300 transition-colors">Contact Us</Link></li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="font-semibold text-white mb-4 margin-left-40">For Companies</h3>
              <p className="text-sm text-blue-200 mb-4">
                Partner with us to bring K-pop to Greece. Access our analytics dashboard for valuable insights.
              </p>
              <Link
                to="/kpi-dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-lg hover:shadow-lg transition-all text-sm shadow-md"
              >
                <BarChart3 className="size-4" />
                View Analytics
              </Link>
            </motion.div>
          </div>

          <div className="mt-8 pt-8 border-t border-blue-800 text-center text-sm text-blue-200">
            <p>© 2026 Hallyu Wishlist. Greece 🇬🇷 × Korea 🇰🇷</p>
            <p>All content belongs to its respective owners. We do not own any of the content shown</p>
          </div>
        </div>
      </footer>
    </div>
  );
}