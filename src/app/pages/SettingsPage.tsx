import { useState, useEffect } from "react";
import { User, Mail, Lock, Phone, Camera, Save } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAppContext } from "../context/AppContext";

export function SettingsPage() {
    const { currentUser, updateUserProfile, users } = useAppContext();
    const [name, setName] = useState(currentUser?.name || "");
    const [email, setEmail] = useState(currentUser?.email || "");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [profilePic, setProfilePic] = useState(currentUser?.profilePic || "");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (currentUser) {
            setName(currentUser.name);
            setEmail(currentUser.email);
            setProfilePic(currentUser.profilePic || "");

            // Find extra details (phone, password) from users list
            const fullUser = users.find(u => u.id === currentUser.id);
            if (fullUser) {
                setPhone(fullUser.phone || "");
                setPassword(fullUser.password || "");
            }
        }
    }, [currentUser, users]);

    const handleSave = () => {
        setIsSaving(true);
        // Simulate network delay
        setTimeout(() => {
            updateUserProfile({
                name,
                email,
                phone,
                password,
                profilePic
            });
            setIsSaving(false);
        }, 800);
    };

    return (
        <div className="flex flex-col h-full bg-gray-50/50 p-6 md:p-10 max-w-5xl mx-auto w-full">
            <div className="mb-8">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 mb-2">
                    Account Settings
                </h1>
                <p className="text-gray-500">
                    Update your profile information and security preferences.
                </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden flex-1 overflow-y-auto custom-scrollbar">
                <div className="p-8 space-y-8">
                    {/* Profile Picture Section */}
                    <div className="flex flex-col items-center gap-6 py-4 border-b border-gray-50 pb-10">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full bg-slate-100 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center">
                                {profilePic ? (
                                    <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-12 h-12 text-slate-300" />
                                )}
                            </div>
                            <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                <Camera className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <div className="w-full max-w-md space-y-1.5">
                            <Label htmlFor="pic-url" className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Profile Picture URL</Label>
                            <Input
                                id="pic-url"
                                type="url"
                                placeholder="https://example.com/photo.jpg"
                                className="h-12 bg-slate-50/50 border-slate-200 rounded-xl focus:bg-white text-sm"
                                value={profilePic}
                                onChange={(e) => setProfilePic(e.target.value)}
                            />
                            <p className="text-[10px] text-gray-400 font-medium ml-1">Paste a URL link to your hosted profile image</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-1.5">
                            <Label htmlFor="name" className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Full Name</Label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="pl-11 h-12 bg-slate-50/50 border-slate-200 rounded-xl focus:bg-white font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Email Address</Label>
                            <div className="relative group grayscale">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    id="email"
                                    value={email}
                                    disabled
                                    className="pl-11 h-12 bg-slate-100 border-slate-200 rounded-xl cursor-not-allowed opacity-70"
                                />
                            </div>
                            <p className="text-[10px] text-gray-400 font-medium ml-1 italic">Email cannot be changed directly</p>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="phone" className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Phone Number</Label>
                            <div className="relative group">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <Input
                                    id="phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+1 (555) 000-0000"
                                    className="pl-11 h-12 bg-slate-50/50 border-slate-200 rounded-xl focus:bg-white font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="pass" className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</Label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <Input
                                    id="pass"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-11 h-12 bg-slate-50/50 border-slate-200 rounded-xl focus:bg-white"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-50 flex items-center justify-end gap-4">
                        <Button
                            variant="ghost"
                            className="rounded-xl px-8 h-12 font-bold text-slate-500 hover:bg-slate-100"
                            onClick={() => {
                                setName(currentUser?.name || "");
                                setProfilePic(currentUser?.profilePic || "");
                                const fullUser = users.find(u => u.id === currentUser?.id);
                                if (fullUser) {
                                    setPhone(fullUser.phone || "");
                                    setPassword(fullUser.password || "");
                                }
                            }}
                        >
                            Reset Changes
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="rounded-xl px-10 h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/20 font-bold transition-all hover:scale-[1.02] active:scale-98"
                        >
                            {isSaving ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Saving...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Save className="w-5 h-5" />
                                    Save Profile
                                </div>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
