import { Modal } from "./Modal";
import { LogOut } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { Button } from "./ui/button";

interface LogoutModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
}

export function LogoutModal({ open, onOpenChange, onConfirm }: LogoutModalProps) {
    const { currentUser } = useAppContext();

    return (
        <Modal open={open} onOpenChange={onOpenChange} className="max-w-md">
            <Modal.Header
                title="Confirm Logout"
                subtitle="Are you sure you want to end your session?"
                icon={LogOut}
                onClose={() => onOpenChange(false)}
            />

            <Modal.Content className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 border border-red-100 mb-2">
                    <LogOut className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                    <p className="text-gray-500 font-normal">You are currently signed in as</p>
                    <p className="text-gray-900 font-semibold">{currentUser?.email || "Academic Researcher"}</p>
                </div>
                <p className="text-sm text-gray-400 font-normal">Any unsaved changes to active research protocols might be lost.</p>
            </Modal.Content>

            <Modal.Footer className="flex-col sm:flex-row gap-2">
                <Button
                    variant="ghost"
                    onClick={() => onOpenChange(false)}
                    className="w-full sm:w-auto h-11 rounded-xl font-medium text-gray-500 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
                >
                    Stay Logged In
                </Button>
                <Button
                    onClick={onConfirm}
                    className="w-full sm:w-auto h-11 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl shadow-lg shadow-red-500/20 transition-all hover:scale-[1.02] active:scale-95 border border-red-700/50"
                >
                    Confirm Sign Out
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
