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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-8 items-center">

        {/* Left: Branding */}
        <div className="hidden lg:block space-y-8 text-white">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg">
              <Microscope className="h-8 w-8 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold">R&D Center</div>
              <div className="text-blue-300 text-sm">Research & Development Portal</div>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold leading-tight">
              Welcome Back to the<br />
              <span className="text-cyan-400">Research Hub</span>
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed">
              Access world-class research facilities, manage equipment bookings, and collaborate with researchers worldwide.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { icon: "🔬", text: "50+ Research Facilities" },
              { icon: "⚗️", text: "200+ Equipment Units" },
              { icon: "👥", text: "1,000+ Active Researchers" },
              { icon: "📅", text: "24/7 Access Available" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3 text-slate-300">
                <span className="text-xl">{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>

          {/* Demo credentials hint */}
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20 space-y-2">
            <p className="text-sm font-medium text-cyan-300">Quick Access Credentials</p>
            <div className="space-y-1 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Admin:</span>
                <span className="font-mono">admin@rdcenter.edu / admin123</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Demo User:</span>
                <span className="font-mono">s.chen@mit.edu / pass1234</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Login Form */}
        <div>
          <Card className="shadow-2xl border-0">
            <CardHeader className="text-center pb-4">
              <div className="lg:hidden flex justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center">
                  <Microscope className="h-7 w-7 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl">Sign In</CardTitle>
              <CardDescription>Enter your credentials to access the portal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Quick fill buttons */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={fillAdmin}
                  className="text-xs gap-1.5 border-slate-800 text-slate-700"
                >
                  <Shield className="h-3.5 w-3.5" />
                  Fill Admin
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={fillDemo}
                  className="text-xs gap-1.5"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  Fill Demo User
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-gray-400">or enter manually</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                    {error}
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@university.edu"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Your password"
                      className="pl-10 pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Signing In...
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              <div className="text-center space-y-3">
                <p className="text-sm text-gray-500">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-blue-600 hover:underline font-medium">
                    Create one
                  </Link>
                </p>
                <p className="text-sm text-gray-500">
                  <Link to="/" className="text-gray-400 hover:text-gray-600">
                    ← Continue without signing in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
