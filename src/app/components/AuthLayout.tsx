import { ReactNode } from "react";
import { Microscope } from "lucide-react";

interface AuthLayoutProps {
    children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-x-hidden">
            <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-0 bg-white rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(37,99,235,0.15)] border border-slate-200">
                {children}
            </div>
        </div>
    );
}

AuthLayout.Hero = ({ title, subtitle, features }: { title: string; subtitle: string; features: { icon: string; text: string }[] }) => (
    <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-slate-900 via-blue-900 to-blue-800 text-white relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -ml-32 -mb-32" />

        <div className="relative z-10 space-y-10">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-500">
                    <Microscope className="h-8 w-8 text-white" />
                </div>
                <div>
                    <div className="text-2xl font-black tracking-tight italic">MAHENDRA</div>
                    <div className="text-blue-300 text-[10px] font-bold uppercase tracking-widest">Research & Development Hub</div>
                </div>
            </div>

            <div className="space-y-6">
                <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-100">
                    {title}
                </h1>
                <p className="text-blue-100/80 text-lg leading-relaxed max-w-md font-medium">
                    {subtitle}
                </p>
            </div>

            <div className="grid grid-cols-1 gap-5">
                {features.map((item) => (
                    <div key={item.text} className="flex items-center gap-4 group cursor-default">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl group-hover:bg-white/20 transition-colors border border-white/5">
                            {item.icon}
                        </div>
                        <span className="text-blue-50 font-semibold">{item.text}</span>
                    </div>
                ))}
            </div>
        </div>

        <div className="relative z-10 pt-10 border-t border-white/10">
            <div className="flex items-center gap-4 text-xs font-medium text-blue-200/60">
                <span>Trusted by 50+ Global Institutions</span>
                <div className="w-1 h-1 rounded-full bg-blue-400/40" />
                <span>ISO 27001 Certified System</span>
            </div>
        </div>
    </div>
);

AuthLayout.Content = ({ children }: { children: ReactNode }) => (
    <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16 bg-white relative">
        {children}
    </div>
);
