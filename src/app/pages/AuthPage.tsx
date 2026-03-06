import { AuthLayout } from "../components/AuthLayout";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import {
    Microscope, Mail, Lock, Eye, EyeOff, Shield, LogIn,
    Phone, GraduationCap, CheckCircle
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../components/ui/select";
import { useAppContext } from "../context/AppContext";

const roles = [
    "Principal Investigator", "Professor", "Associate Professor",
    "Post-Doctoral Researcher", "PhD Student", "Graduate Researcher",
    "Undergraduate Student", "Industry Researcher", "Visiting Scholar",
];

export function AuthPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { login, registerUser } = useAppContext();

    // Attempt to intelligently default to register mode if we came from /register
    const [isLoginMode, setIsLoginMode] = useState(location.pathname !== "/register");

    // Registration and Login states
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        firstName: "", lastName: "", email: "", password: "", confirmPassword: "",
        department: "", institution: "", role: "", phone: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateLogin = () => {
        const e: Record<string, string> = {};
        if (!form.email.trim()) e.email = "Required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
        if (!form.password) e.password = "Required";
        return e;
    };

    const validateRegister = () => {
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

    const handleLoginSubmit = () => {
        const errs = validateLogin();
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        setErrors({});
        setServerError("");
        setLoading(true);

        setTimeout(() => {
            const result = login(form.email, form.password);
            setLoading(false);
            if (result.success) {
                if (form.email === "admin@rdcenter.edu") {
                    navigate("/admin");
                } else {
                    navigate("/");
                }
            } else {
                setServerError(result.error || "Login failed");
            }
        }, 600);
    };

    const handleRegisterSubmit = () => {
        const errs = validateRegister();
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }
        setErrors({});
        setServerError("");
        setLoading(true);

        setTimeout(() => {
            const result = registerUser({
                firstName: form.firstName, lastName: form.lastName, email: form.email,
                password: form.password, department: form.department, institution: form.institution,
                role: form.role, phone: form.phone,
            });
            setLoading(false);
            if (result.success) {
                setSubmitted(true);
            } else {
                setServerError(result.error || "Registration failed.");
            }
        }, 600);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoginMode) handleLoginSubmit();
        else handleRegisterSubmit();
    };

    const fillAdmin = () => {
        setForm(prev => ({ ...prev, email: "admin@rdcenter.edu", password: "admin123" }));
        setErrors({});
        setServerError("");
    };

    const fillDemo = () => {
        setForm(prev => ({ ...prev, email: "s.chen@mit.edu", password: "pass1234" }));
        setErrors({});
        setServerError("");
    };

    const switchMode = () => {
        setIsLoginMode(!isLoginMode);
        setErrors({});
        setServerError("");
    }

    if (submitted && !isLoginMode) {
        return (
            <AuthLayout>
                <AuthLayout.Hero
                    title="Welcome Aboard!"
                    subtitle={`Hi ${form.firstName}! Your account is active and ready to go. Sign in now to explore facilities and book equipment.`}
                    features={[
                        { icon: "✅", text: "Account created & active" },
                        { icon: "🔬", text: "Access 50+ research facilities" },
                        { icon: "⚡", text: "Book equipment instantly" },
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
                        <div className="bg-green-50/50 rounded-2xl p-6 text-left border border-green-100 space-y-4">
                            <p className="font-bold text-green-900">You're all set!</p>
                            <ul className="space-y-3">
                                {[
                                    "Your account is immediately active",
                                    "Browse and book research equipment",
                                    "Collaborate with researchers worldwide",
                                ].map((step, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-green-800">
                                        <div className="w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">{i + 1}</div>
                                        {step}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-3">
                            <Button className="w-full h-12 rounded-xl bg-blue-600 font-bold transition-all hover:scale-[1.01] active:scale-95 border border-blue-700/50" onClick={() => { setSubmitted(false); setIsLoginMode(true); }}>Continue to Sign In</Button>
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
            {isLoginMode ? (
                <AuthLayout.Hero
                    title="Welcome Back to the Research Hub"
                    subtitle="Access world-class research facilities, manage equipment bookings, and collaborate with researchers worldwide."
                />
            ) : (
                <AuthLayout.Hero
                    title="Create Your Researcher Account"
                    subtitle="Join the R&D Center to access world-class research facilities and collaborate with global scientists."
                    features={[
                        { icon: "🔬", text: "Advanced Lab Access" },
                        { icon: "⚡", text: "Fast Equipment Booking" },
                        { icon: "🧬", text: "Global Collaboration" },
                    ]}
                />
            )}

            <AuthLayout.Content>
                <div className={`w-full mx-auto space-y-6 ${isLoginMode ? 'max-w-md' : 'max-w-lg'}`}>
                    <div className="space-y-1 text-center">
                        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">{isLoginMode ? "Sign In" : "Register"}</h2>
                        <p className="text-sm text-gray-500 font-medium">{isLoginMode ? "Access your researcher dashboard" : "Step into the future of research"}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {serverError && (
                            <div className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl px-4 py-3 animate-in fade-in slide-in-from-top-1 font-medium">
                                {serverError}
                            </div>
                        )}

                        {!isLoginMode && (
                            <div className="grid sm:grid-cols-2 gap-4">
                                {field("firstName", "First Name", "text", "John")}
                                {field("lastName", "Last Name", "text", "Doe")}
                            </div>
                        )}

                        <div className={`grid gap-4 ${!isLoginMode ? 'sm:grid-cols-2' : 'grid-cols-1'}`}>
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
                            {!isLoginMode && (
                                <div className="space-y-1.5">
                                    <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Phone</Label>
                                    <div className="relative group">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                        <Input id="phone" type="tel" placeholder="+1..." className="pl-10 h-11 bg-gray-50/50 border-gray-200 focus:bg-white rounded-xl transition-all"
                                            value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className={`grid gap-4 ${!isLoginMode ? 'sm:grid-cols-2' : 'grid-cols-1'}`}>
                            <div className="space-y-1.5">
                                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Password <span className="text-red-500">*</span></Label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                    <Input id="password" type={showPassword ? "text" : "password"} placeholder={isLoginMode ? "••••••••" : "Min 8 chars"}
                                        className={`pl-10 pr-10 h-11 bg-gray-50/50 border-gray-200 focus:bg-white rounded-xl transition-all ${errors.password ? "border-red-400 bg-red-50/30" : ""}`}
                                        value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-[10px] font-bold text-red-500 uppercase tracking-tight ml-1">{errors.password}</p>}
                            </div>

                            {!isLoginMode && (
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
                            )}
                        </div>

                        {!isLoginMode && (
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
                        )}

                        {isLoginMode && (
                            <div className="pt-2 pb-1 space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={fillAdmin}
                                        className="text-xs gap-1.5 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300 transition-all rounded-xl"
                                    >
                                        <Shield className="h-3.5 w-3.5" />
                                        Fill Admin
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
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
                            </div>
                        )}

                        <Button type="submit" className={`w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20 text-md font-bold transition-all hover:scale-[1.01] active:scale-95 border border-blue-700/50 ${!isLoginMode ? 'mt-4' : ''}`} disabled={loading}>
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Authenticating...
                                </span>
                            ) : (
                                isLoginMode ? "Sign In" : "Complete Registration"
                            )}
                        </Button>

                        {!isLoginMode && (
                            <p className="text-[10px] text-gray-400 text-center font-medium leading-relaxed px-4 pt-2">
                                By registering, you agree to Mahendra R&D Hub's{" "}
                                <a href="#" className="text-blue-600 font-bold hover:underline">Terms of Use</a> and{" "}
                                <a href="#" className="text-blue-600 font-bold hover:underline">Safety Policies</a>.
                            </p>
                        )}

                    </form>

                    <div className="text-center pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-500 font-medium">
                            {isLoginMode ? "New to the portal?" : "Already a member?"}{" "}
                            <button onClick={switchMode} className="text-blue-600 hover:text-blue-700 font-bold hover:underline underline-offset-4 focus:outline-hidden">
                                {isLoginMode ? "Create an account" : "Sign In"}
                            </button>
                        </p>
                        {isLoginMode && (
                            <div className="mt-4">
                                <Link to="/" className="text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-1">
                                    View Public Facilities
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </AuthLayout.Content>
        </AuthLayout>
    );
}
