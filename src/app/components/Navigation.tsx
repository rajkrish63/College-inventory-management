import { Link, useLocation, useNavigate } from "react-router";
import { Menu, X, Microscope, Shield, LogIn, UserPlus, LogOut, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { useAppContext } from "../context/AppContext";

const navLinks = [
  { path: "/",          label: "Home" },
  { path: "/facilities", label: "Facilities" },
  { path: "/equipment",  label: "Equipment" },
  { path: "/booking",    label: "Book Access" },
];

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAppContext();

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 bg-white/95 backdrop-blur-md z-50 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
              <Microscope className="h-6 w-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="font-bold text-gray-900">R&D Center</div>
              <div className="text-xs text-gray-500">Research & Development</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-md transition-colors text-sm ${
                  isActive(link.path)
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-2">
            {currentUser ? (
              <>
                {currentUser.role === "admin" && (
                  <Button variant="ghost" size="sm" asChild className="text-slate-700 gap-1.5">
                    <Link to="/admin"><Shield className="h-4 w-4" />Admin</Link>
                  </Button>
                )}
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span className="text-sm text-gray-700 max-w-28 truncate">{currentUser.name}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-600 gap-1.5">
                  <LogOut className="h-4 w-4" />Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild className="text-slate-600 gap-1.5">
                  <Link to="/admin"><Shield className="h-4 w-4" />Admin</Link>
                </Button>
                <Button variant="outline" size="sm" asChild className="gap-1.5">
                  <Link to="/login"><LogIn className="h-4 w-4" />Login</Link>
                </Button>
                <Button size="sm" asChild className="gap-1.5">
                  <Link to="/register"><UserPlus className="h-4 w-4" />Register</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-4 py-2.5 rounded-md transition-colors text-sm ${
                  isActive(link.path)
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-3 border-t border-gray-100 space-y-2 mt-2">
              {currentUser ? (
                <>
                  <div className="flex items-center gap-2 px-4 py-2">
                    <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {currentUser.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{currentUser.name}</span>
                  </div>
                  {currentUser.role === "admin" && (
                    <Link to="/admin" className="flex items-center gap-2 px-4 py-2.5 rounded-md text-sm text-slate-700 hover:bg-slate-50"
                      onClick={() => setIsMenuOpen(false)}>
                      <Shield className="h-4 w-4" />Admin Portal
                    </Link>
                  )}
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 rounded-md text-sm text-red-600 hover:bg-red-50">
                    <LogOut className="h-4 w-4" />Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/admin" className="flex items-center gap-2 px-4 py-2.5 rounded-md text-sm text-slate-700 hover:bg-slate-50"
                    onClick={() => setIsMenuOpen(false)}>
                    <Shield className="h-4 w-4" />Admin Portal
                  </Link>
                  <Link to="/login" className="flex items-center gap-2 px-4 py-2.5 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}>
                    <LogIn className="h-4 w-4" />Login
                  </Link>
                  <Button className="w-full" asChild>
                    <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                      <UserPlus className="h-4 w-4 mr-2" />Create Account
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
