import { Link } from "react-router";
import { CheckCircle2, Plus } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card";

interface SuccessModalProps {
    isEditMode: boolean;
    savedName: string;
    savedCount: number;
    onReset: () => void;
}

export function SuccessModal({ isEditMode, savedName, savedCount, onReset }: SuccessModalProps) {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <Card className="max-w-md w-full border-none shadow-2xl bg-white/80 backdrop-blur-md overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="h-2 bg-emerald-500" />
                <CardHeader className="text-center pt-8">
                    <div className="mx-auto w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-900">
                        {isEditMode ? "Changes Saved!" : "Facility Created!"}
                    </CardTitle>
                    <CardDescription className="text-base mt-2">
                        <span className="font-semibold text-emerald-700">"{savedName}"</span>
                        {savedCount > 0
                            ? ` with ${savedCount} equipment items has been successfully ${isEditMode ? "updated" : "added"}.`
                            : ` has been successfully ${isEditMode ? "updated" : "added"}.`}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pb-8 pt-4">
                    {!isEditMode && (
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={onReset}>
                            <Plus className="h-4 w-4 mr-2" /> Add Another Facility
                        </Button>
                    )}
                    <Button variant="outline" className="w-full" asChild>
                        <Link to="/admin">Back to Admin Dashboard</Link>
                    </Button>
                    <Button variant="ghost" className="w-full" asChild>
                        <Link to="/facilities">View All Facilities</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
