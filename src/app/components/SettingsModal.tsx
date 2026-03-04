import * as React from "react";
import { Modal } from "./Modal";
import {
    Settings,
    User,
    Mail,
    Shield,
    Check,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface SettingsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
    const { currentUser, updateUserProfile } = useAppContext();
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [isSaving, setIsSaving] = React.useState(false);
    const [showSuccess, setShowSuccess] = React.useState(false);

    React.useEffect(() => {
        if (open && currentUser) {
            setName(currentUser.name);
            setEmail(currentUser.email);
            setShowSuccess(false);
        }
    }, [open, currentUser]);

    const handleSave = async () => {
        setIsSaving(true);
        updateUserProfile({ name, email });
        setIsSaving(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    return (
        <Modal open={open} onOpenChange={onOpenChange}>
            <Modal.Header
                title="Account Settings"
                subtitle="Manage your researcher profile and security preferences."
                icon={Settings}
                onClose={() => onOpenChange(false)}
            />

            <Modal.Content className="space-y-6">
                <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100 space-y-5">
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5" />
                        Professional Profile
                    </h3>

                    <div className="grid gap-5">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-medium text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <Input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="pl-10 h-11 bg-white border-slate-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="Enter your name"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-medium text-slate-500 uppercase tracking-wider ml-1">Academic Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 h-11 bg-white border-slate-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between px-2">
                    <div className="text-[11px] text-slate-400 font-medium uppercase tracking-tighter">
                        Current Role: <span className="text-blue-600 ml-1">{currentUser?.role || "Researcher"}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium uppercase tracking-tighter">
                        Status: <span className="text-green-600 ml-1">Verified Member</span>
                    </div>
                </div>
            </Modal.Content>

            <Modal.Footer>
                <Button
                    variant="ghost"
                    onClick={() => onOpenChange(false)}
                    className="rounded-xl font-medium text-slate-500 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all"
                >
                    Discard Changes
                </Button>
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`rounded-xl px-8 h-11 font-medium transition-all shadow-lg hover:scale-[1.02] active:scale-95 ${showSuccess
                        ? "bg-green-600 hover:bg-green-700 shadow-green-500/20 border border-green-700/50"
                        : "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20 border border-blue-700/50"
                        }`}
                >
                    {showSuccess ? (
                        <span className="flex items-center gap-2">
                            <Check className="w-4 h-4" />
                            Saved
                        </span>
                    ) : (
                        isSaving ? "Saving..." : "Apply Changes"
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
