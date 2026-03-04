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
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-gray-50">
        <Card className="max-w-md w-full text-center shadow-xl">
          <CardHeader className="pb-2">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Registration Successful!</CardTitle>
            <CardDescription className="text-base mt-1">
              Welcome, {form.firstName}! Your account is pending admin approval.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-800 text-left space-y-1">
              <p className="font-medium">What happens next?</p>
              <ul className="list-disc list-inside text-blue-700 space-y-0.5">
                <li>Admin reviews your request within 24 hours</li>
                <li>Confirmation sent to <strong>{form.email}</strong></li>
                <li>Access granted upon approval</li>
              </ul>
            </div>
            <Button className="w-full" onClick={() => navigate("/login")}>Sign In</Button>
            <Button variant="outline" className="w-full" onClick={() => navigate("/")}>Back to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const field = (id: keyof typeof form, label: string, type = "text", placeholder = "") => (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label} <span className="text-red-500">*</span></Label>
      <Input
        id={id} type={type} placeholder={placeholder}
        value={form[id]}
        onChange={(e) => setForm({ ...form, [id]: e.target.value })}
        className={errors[id] ? "border-red-400" : ""}
      />
      {errors[id] && <p className="text-xs text-red-500">{errors[id]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-700 to-cyan-600 py-14 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <Microscope className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2">Create Your Account</h1>
          <p className="text-blue-100 text-lg">
            Join the R&D Center to access world-class research facilities and equipment.
          </p>
          <p className="text-blue-200 text-sm mt-2">
            Already have an account?{" "}
            <Link to="/login" className="text-white underline font-medium hover:text-blue-100">Sign In</Link>
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Researcher Registration</CardTitle>
              <CardDescription>Fields marked <span className="text-red-500">*</span> are required.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {serverError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                    {serverError}
                  </div>
                )}

                {/* Personal Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2 pb-1 border-b">
                    <User className="h-4 w-4 text-blue-600" /> Personal Information
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {field("firstName", "First Name", "text", "John")}
                    {field("lastName", "Last Name", "text", "Doe")}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email" type="email" placeholder="john.doe@university.edu"
                        className={`pl-10 ${errors.email ? "border-red-400" : ""}`}
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                    {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Phone Number <span className="text-gray-400 text-xs">(optional)</span></Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" className="pl-10"
                        value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2 pb-1 border-b">
                    <Lock className="h-4 w-4 text-blue-600" /> Security
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
                      <div className="relative">
                        <Input id="password" type={showPass ? "text" : "password"} placeholder="Min. 8 characters"
                          className={`pr-10 ${errors.password ? "border-red-400" : ""}`}
                          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                        <button type="button" onClick={() => setShowPass(!showPass)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="confirmPassword">Confirm Password <span className="text-red-500">*</span></Label>
                      <div className="relative">
                        <Input id="confirmPassword" type={showConfirm ? "text" : "password"} placeholder="Repeat password"
                          className={`pr-10 ${errors.confirmPassword ? "border-red-400" : ""}`}
                          value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
                        <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
                    </div>
                  </div>
                </div>

                {/* Affiliation */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2 pb-1 border-b">
                    <Building2 className="h-4 w-4 text-blue-600" /> Affiliation
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {field("institution", "Institution", "text", "e.g., MIT, Stanford")}
                    {field("department", "Department", "text", "e.g., Chemistry")}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="role">Role / Position <span className="text-red-500">*</span></Label>
                    <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                      <SelectTrigger id="role" className={errors.role ? "border-red-400" : ""}>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    {errors.role && <p className="text-xs text-red-500">{errors.role}</p>}
                  </div>
                </div>

                {/* Research Interests */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2 pb-1 border-b">
                    <GraduationCap className="h-4 w-4 text-blue-600" />
                    Research Interests{" "}
                    <span className="text-sm font-normal text-gray-400">(optional)</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {researchInterestsList.map((interest) => (
                      <Badge
                        key={interest}
                        variant={interests.includes(interest) ? "default" : "outline"}
                        className={`cursor-pointer px-3 py-1.5 transition-all ${
                          interests.includes(interest)
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "hover:bg-blue-50 hover:border-blue-400"
                        }`}
                        onClick={() => toggleInterest(interest)}
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Terms */}
                <p className="text-xs text-gray-400">
                  By registering, you agree to the R&D Center's{" "}
                  <a href="#" className="text-blue-600 underline">Terms of Use</a> and{" "}
                  <a href="#" className="text-blue-600 underline">Safety Policies</a>.
                </p>

                <Button type="submit" size="lg" className="w-full">
                  Create Account
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
