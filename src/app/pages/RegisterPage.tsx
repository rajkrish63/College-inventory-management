import { AuthLayout } from "../components/AuthLayout";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Microscope, User, Mail, Lock, Building2, Phone, GraduationCap,
  Eye, EyeOff, CheckCircle, FlaskConical, ArrowLeft,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../components/ui/select";
import { useAppContext } from "../context/AppContext";

const researchInterestsList = [
  "Analytical Chemistry", "Materials Science", "Molecular Biology", "Cell Biology",
  "Electrochemistry", "Nanotechnology", "Biotechnology", "Electronics",
  "High-Performance Computing", "Physics",
];

const roles = [
  "Principal Investigator", "Professor", "Associate Professor",
  "Post-Doctoral Researcher", "PhD Student", "Graduate Researcher",
  "Undergraduate Student", "Industry Researcher", "Visiting Scholar",
];

export function RegisterPage() {
  const { registerUser } = useAppContext();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");
  const [interests, setInterests] = useState<string[]>([]);

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", password: "", confirmPassword: "",
    department: "", institution: "", role: "", phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.password) e.password = "Required";
    else if (form.password.length < 8) e.password = "Min. 8 characters";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords don't match";
    if (!form.institution.trim()) e.institution = "Required";
    if (!form.department.trim()) e.department = "Required";
    if (!form.role) e.role = "Required";
    return e;
  };

  const toggleInterest = (i: string) =>
    setInterests((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setServerError("");
    const result = registerUser({
      firstName: form.firstName, lastName: form.lastName, email: form.email,
      password: form.password, department: form.department, institution: form.institution,
      role: form.role, phone: form.phone,
    });
    if (result.success) {
      setSubmitted(true);
    } else {
      setServerError(result.error || "Registration failed.");
    }
  };

  if (submitted) {
    return (
      <AuthLayout>
        <AuthLayout.Hero
          title="Registration Successful!"
          subtitle={`Welcome, ${form.firstName}! Your account has been created and is now pending admin approval.`}
          features={[
            { icon: "✅", text: "Account under review" },
            { icon: "📧", text: "Confirmation email sent" },
            { icon: "🕒", text: "24-hour approval window" },
          ]}
        />
        <AuthLayout.Content>
          <div className="max-w-md w-full mx-auto text-center space-y-8">
            <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center shadow-inner">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-gray-900">Next Steps</h2>
              <p className="text-gray-500">Access world-class facilities in no time</p>
            </div>
            <div className="bg-blue-50/50 rounded-2xl p-6 text-left border border-blue-100 space-y-4">
              <p className="font-bold text-blue-900">What happens now?</p>
              <ul className="space-y-3">
                {[
                  "Admin reviews your credentials",
                  "Validation of institutional affiliation",
                  "Final approval for equipment booking",
                ].map((step, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-blue-800">
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">{i + 1}</div>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-3">
              <Button className="w-full h-12 rounded-xl bg-blue-600 font-bold transition-all hover:scale-[1.01] active:scale-95 border border-blue-700/50" onClick={() => navigate("/login")}>Continue to Sign In</Button>
              <Button variant="ghost" className="w-full font-bold text-gray-500 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all rounded-xl" onClick={() => navigate("/")}>Go to Home</Button>
            </div>
          </div>
        </AuthLayout.Content>
      </AuthLayout>
    );
  }

  const field = (id: keyof typeof form, label: string, type = "text", placeholder = "") => (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">{label} <span className="text-red-500">*</span></Label>
      <Input
        id={id} type={type} placeholder={placeholder}
        value={form[id]}
        onChange={(e) => setForm({ ...form, [id]: e.target.value })}
        className={`h-11 bg-gray-50/50 border-gray-200 focus:bg-white rounded-xl transition-all ${errors[id] ? "border-red-400 bg-red-50/30" : ""}`}
      />
      {errors[id] && <p className="text-[10px] font-bold text-red-500 uppercase tracking-tight ml-1">{errors[id]}</p>}
    </div>
  );

  return (
    <AuthLayout>
      <AuthLayout.Hero
        title="Create Your Researcher Account"
        subtitle="Join the R&D Center to access world-class research facilities and collaborate with global scientists."
        features={[
          { icon: "🔬", text: "Advanced Lab Access" },
          { icon: "⚡", text: "Fast Equipment Booking" },
          { icon: "🧬", text: "Global Collaboration" },
        ]}
      />

      <AuthLayout.Content>
        <div className="w-full max-w-lg mx-auto space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">Register</h2>
            <p className="text-gray-500 font-medium">Step into the future of research</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {serverError && (
              <div className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl px-4 py-3 animate-in fade-in slide-in-from-top-1 font-medium">
                {serverError}
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              {field("firstName", "First Name", "text", "John")}
              {field("lastName", "Last Name", "text", "Doe")}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Email <span className="text-red-500">*</span></Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <Input
                    id="email" type="email" placeholder="john.doe@edu"
                    className={`pl-10 h-11 bg-gray-50/50 border-gray-200 focus:bg-white rounded-xl transition-all ${errors.email ? "border-red-400 bg-red-50/30" : ""}`}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                {errors.email && <p className="text-[10px] font-bold text-red-500 uppercase tracking-tight ml-1">{errors.email}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Phone</Label>
                <div className="relative group">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <Input id="phone" type="tel" placeholder="+1..." className="pl-10 h-11 bg-gray-50/50 border-gray-200 focus:bg-white rounded-xl transition-all"
                    value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Password <span className="text-red-500">*</span></Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <Input id="password" type={showPass ? "text" : "password"} placeholder="Min 8 chars"
                    className={`pl-10 pr-10 h-11 bg-gray-50/50 border-gray-200 focus:bg-white rounded-xl transition-all ${errors.password ? "border-red-400 bg-red-50/30" : ""}`}
                    value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-[10px] font-bold text-red-500 uppercase tracking-tight ml-1">{errors.password}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Confirm <span className="text-red-500">*</span></Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                  <Input id="confirmPassword" type={showConfirm ? "text" : "password"} placeholder="Repeat"
                    className={`pl-10 pr-10 h-11 bg-gray-50/50 border-gray-200 focus:bg-white rounded-xl transition-all ${errors.confirmPassword ? "border-red-400 bg-red-50/30" : ""}`}
                    value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-[10px] font-bold text-red-500 uppercase tracking-tight ml-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {field("institution", "Institution", "text", "e.g. MIT")}
              <div className="space-y-1.5">
                <Label htmlFor="role" className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Role <span className="text-red-500">*</span></Label>
                <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                  <SelectTrigger id="role" className={`h-11 bg-gray-50/50 border-gray-200 focus:bg-white rounded-xl transition-all ${errors.role ? "border-red-400 bg-red-50/30" : ""}`}>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-gray-200 shadow-xl overflow-hidden">
                    {roles.map((r) => <SelectItem key={r} value={r} className="focus:bg-blue-50 focus:text-blue-700">{r}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.role && <p className="text-[10px] font-bold text-red-500 uppercase tracking-tight ml-1">{errors.role}</p>}
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-blue-600" /> Research Interests
              </Label>
              <div className="flex flex-wrap gap-2">
                {researchInterestsList.map((interest) => (
                  <Badge
                    key={interest}
                    variant={interests.includes(interest) ? "default" : "outline"}
                    className={`cursor-pointer px-3 py-2 rounded-lg transition-all border-gray-200 ${interests.includes(interest)
                      ? "bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20"
                      : "hover:bg-blue-50 hover:border-blue-400 text-gray-600"
                      }`}
                    onClick={() => toggleInterest(interest)}
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 font-bold transition-all hover:scale-[1.01] active:scale-95 border border-blue-700/50">
              Complete Registration
            </Button>

            <p className="text-[10px] text-gray-400 text-center font-medium leading-relaxed px-4">
              By registering, you agree to Mahendra R&D Hub's{" "}
              <a href="#" className="text-blue-600 font-bold hover:underline">Terms of Use</a> and{" "}
              <a href="#" className="text-blue-600 font-bold hover:underline">Safety Policies</a>.
            </p>
          </form>

          <p className="text-sm text-gray-500 text-center font-medium pt-2 border-t border-gray-100 italic">
            Already a member?{" "}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-bold hover:underline underline-offset-4">Sign In</Link>
          </p>
        </div>
      </AuthLayout.Content>
    </AuthLayout>
  );
}
