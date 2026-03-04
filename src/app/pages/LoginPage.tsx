import { AuthLayout } from "../components/AuthLayout";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Microscope, Mail, Lock, Eye, EyeOff, Shield, LogIn } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAppContext } from "../context/AppContext";

export function LoginPage() {
  const { login } = useAppContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const result = login(email, password);
      setLoading(false);
      if (result.success) {
        if (email === "admin@rdcenter.edu") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        setError(result.error || "Login failed");
      }
    }, 600);
  };

  const fillAdmin = () => {
    setEmail("admin@rdcenter.edu");
    setPassword("admin123");
    setError("");
  };

  const fillDemo = () => {
    setEmail("s.chen@mit.edu");
    setPassword("pass1234");
    setError("");
  };

  return (
    <AuthLayout>
      <AuthLayout.Hero
        title="Welcome Back to the Research Hub"
        subtitle="Access world-class research facilities, manage equipment bookings, and collaborate with researchers worldwide."
        features={[
          { icon: "🔬", text: "50+ Research Facilities" },
          { icon: "⚗️", text: "200+ Equipment Units" },
          { icon: "👥", text: "1,000+ Active Researchers" },
          { icon: "📅", text: "24/7 Access Available" },
        ]}
      />

      <AuthLayout.Content>
        <div className="w-full max-w-md mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Sign In</h2>
            <p className="text-gray-500">Access your researcher dashboard</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={fillAdmin}
              className="text-xs gap-1.5 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300 transition-all rounded-xl"
            >
              <Shield className="h-3.5 w-3.5" />
              Fill Admin
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={fillDemo}
              className="text-xs gap-1.5 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300 transition-all rounded-xl"
            >
              <LogIn className="h-3.5 w-3.5" />
              Fill Demo
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-gray-400 font-bold tracking-widest">or secure login</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl px-4 py-3 animate-in fade-in slide-in-from-top-1">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Email Address</Label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <Mail className="h-full w-full" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@university.edu"
                  className="pl-11 h-12 bg-gray-50/50 border-gray-200 focus:bg-white rounded-xl transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Password</Label>
              <div className="relative group">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <Lock className="h-full w-full" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-11 pr-11 h-12 bg-gray-50/50 border-gray-200 focus:bg-white rounded-xl transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 text-md font-bold transition-all hover:scale-[1.01] active:scale-95 border border-blue-700/50" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="text-center pt-4">
            <p className="text-sm text-gray-500 font-medium">
              New to the portal?{" "}
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-bold hover:underline underline-offset-4">
                Create an account
              </Link>
            </p>
            <div className="mt-6">
              <Link to="/" className="text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-1">
                View Public Facilities
              </Link>
            </div>
          </div>
        </div>
      </AuthLayout.Content>
    </AuthLayout>
  );
}
