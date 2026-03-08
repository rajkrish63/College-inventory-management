import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { Building2, Save, Clock, LayoutDashboard, Shield, CalendarCheck, FlaskConical, Users, ChevronRight, PencilLine, CheckCircle2, Plus } from "lucide-react";
import { Navbar } from "../../components/Navbar";
import { Sidebar } from "../../components/Sidebar";
import { LogoutModal } from "../../components/LogoutModal";
import { useAppContext } from "../../context/AppContext";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { cn } from "../../components/ui/utils";

import { FacilityForm } from "./components/FacilityForm";
import { EquipmentForm, EquipmentState, createBlankEq } from "./components/EquipmentForm";

const defaultImages: Record<string, string> = {
    Chemistry: "https://images.unsplash.com/photo-1707944746058-4da338d0f827?w=800&q=80",
    Biotechnology: "https://images.unsplash.com/photo-1732400333616-8efa4f385a03?w=800&q=80",
    "Materials Science": "https://images.unsplash.com/photo-1765830403209-a5eceac4c198?w=800&q=80",
    Electronics: "https://images.unsplash.com/photo-1759866042499-d0b3e9d87ceb?w=800&q=80",
    Computing: "https://images.unsplash.com/photo-1765830403209-a5eceac4c198?w=800&q=80",
    Other: "https://images.unsplash.com/photo-1707944746058-4da338d0f827?w=800&q=80",
};

export function CombinedAddPage() {
    const { addFacilityWithEquipment, facilities, equipment, updateFacility, updateEquipment, addEquipment } = useAppContext();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    const [done, setDone] = useState(false);
    const [savedName, setSavedName] = useState("");
    const [savedCount, setSavedCount] = useState(0);
    const [loading, setLoading] = useState(false);

    // Facility State
    const [fac, setFac] = useState({
        name: "", category: "", description: "", capacity: "", room: "",
        availability: "Available" as "Available" | "Limited" | "Unavailable",
    });
    const [featInput, setFeatInput] = useState("");
    const [features, setFeatures] = useState<string[]>([]);
    const [facErrors, setFacErrors] = useState<Record<string, string>>({});

    // Equipment List State
    const [equipments, setEquipments] = useState<EquipmentState[]>([]);

    useEffect(() => {
        if (isEditMode && facilities.length > 0) {
            const facility = facilities.find(f => f.id === parseInt(id));
            if (facility) {
                setFac({
                    name: facility.name,
                    category: facility.category,
                    description: facility.description,
                    capacity: facility.capacity,
                    room: facility.room,
                    availability: facility.availability,
                });
                setFeatures(facility.features);

                // Load associated equipment
                const associated = equipment.filter(e => e.location.startsWith(facility.name));
                if (associated.length > 0) {
                    setEquipments(associated.map(e => ({
                        id: e.id,
                        dbId: e.id,
                        name: e.name,
                        category: e.category,
                        manufacturer: e.manufacturer,
                        model: e.model,
                        status: e.status,
                        description: e.description,
                        specInput: "",
                        specs: e.specifications,
                        appInput: "",
                        apps: e.applications,
                        expanded: false,
                        errors: {},
                    })));
                }
            }
        }
    }, [isEditMode, id, facilities, equipment]);

    const handleFacChange = (k: string, v: string) => {
        setFac(prev => ({ ...prev, [k]: v }));
        if (facErrors[k]) setFacErrors(prev => {
            const next = { ...prev };
            delete next[k];
            return next;
        });
    };

    const addFeat = () => {
        const v = featInput.trim();
        if (v && !features.includes(v)) setFeatures([...features, v]);
        setFeatInput("");
    };

    const removeFeat = (v: string) => setFeatures(features.filter(x => x !== v));

    const updateEq = (eqId: string | number, key: string, val: any) => {
        setEquipments(prev => prev.map(e => e.id === eqId ? { ...e, [key]: val } : e));
    };

    const addEq = () => setEquipments(prev => [...prev, createBlankEq()]);

    const removeEq = (eqId: string | number) => setEquipments(prev => prev.filter(e => e.id !== eqId));

    const validate = () => {
        const fErrs: Record<string, string> = {};
        if (!fac.name.trim()) fErrs.name = "Required";
        if (!fac.category) fErrs.category = "Required";
        if (!fac.description.trim()) fErrs.description = "Required";
        if (!fac.capacity.trim()) fErrs.capacity = "Required";
        if (!fac.room.trim()) fErrs.room = "Required";

        let hasEqErrs = false;
        const updatedEqs = equipments.map(eq => {
            const isTouched = eq.name.trim() || eq.manufacturer.trim() || eq.model.trim() || eq.description.trim() || eq.category;
            const eErrs: Record<string, string> = {};
            if (isTouched) {
                if (!eq.name.trim()) eErrs.name = "Required";
                if (!eq.category) eErrs.category = "Required";
                if (!eq.manufacturer.trim()) eErrs.manufacturer = "Required";
                if (!eq.model.trim()) eErrs.model = "Required";
                if (!eq.description.trim()) eErrs.description = "Required";
            }
            if (Object.keys(eErrs).length > 0) hasEqErrs = true;
            return { ...eq, errors: eErrs, expanded: Object.keys(eErrs).length > 0 ? true : eq.expanded };
        });

        setFacErrors(fErrs);
        setEquipments(updatedEqs);

        return Object.keys(fErrs).length === 0 && !hasEqErrs;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setLoading(true);
        // Simulate premium delay
        await new Promise(r => setTimeout(r, 1000));

        const filledEqs = equipments.filter(eq => eq.name.trim() || eq.manufacturer.trim() || eq.model.trim() || eq.description.trim() || eq.category);

        const eqData = filledEqs.map(e => ({
            name: e.name,
            category: e.category,
            manufacturer: e.manufacturer,
            model: e.model,
            status: e.status,
            description: e.description,
            specifications: e.specs,
            applications: e.apps,
            location: `${fac.name} - ${fac.room}`
        }));

        if (isEditMode) {
            updateFacility(parseInt(id!), { ...fac, features });

            // Handle equipment items in edit mode
            filledEqs.forEach(eq => {
                const data = {
                    name: eq.name,
                    category: eq.category,
                    manufacturer: eq.manufacturer,
                    model: eq.model,
                    status: eq.status,
                    description: eq.description,
                    specifications: eq.specs,
                    applications: eq.apps,
                    location: `${fac.name} - ${fac.room}`
                };

                if (eq.dbId) {
                    updateEquipment(eq.dbId, data);
                } else {
                    addEquipment(data);
                }
            });
        } else {
            addFacilityWithEquipment({
                ...fac,
                features,
                image: defaultImages[fac.category] || defaultImages.Other
            }, eqData);
        }

        setSavedName(fac.name);
        setSavedCount(filledEqs.length);
        setDone(true);
        setLoading(false);
    };

    const resetForm = () => {
        setFac({ name: "", category: "", description: "", capacity: "", room: "", availability: "Available" });
        setFeatures([]);
        setEquipments([]);
        setDone(false);
    };

    if (done) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <Card className="max-w-md w-full border-none shadow-2xl bg-white/80 backdrop-blur-md overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="h-2 bg-emerald-500" />
                <CardHeader className="text-center pt-8">
                    <div className="mx-auto w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-900">{isEditMode ? "Changes Saved!" : "Facility Created!"}</CardTitle>
                    <CardDescription className="text-base mt-2">
                        <span className="font-semibold text-emerald-700">"{savedName}"</span>
                        {savedCount > 0
                            ? ` with ${savedCount} equipment items has been successfully ${isEditMode ? "updated" : "added"}.`
                            : ` has been successfully ${isEditMode ? "updated" : "added"}.`}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pb-8 pt-4">
                    {!isEditMode && (
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={resetForm}>
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

    const [isLogoutOpen, setIsLogoutOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const { logout, bookings } = useAppContext();
    const pendingCount = bookings.filter(b => b.status === "Pending").length;

    const handleLogout = () => { logout(); navigate("/"); };

    const sidebarItems = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "bookings", label: "Bookings", icon: CalendarCheck, badge: pendingCount },
        { id: "facilities", label: "Resources", icon: Building2 },
        { id: "users", label: "Users", icon: Users },
    ];

    return (
        <div className="h-full bg-gray-50 flex flex-col overflow-hidden">
            {/* Admin Nav */}
            <Navbar>
                <Navbar.Brand icon={Shield} title="Admin Portal" subtitle="R&D Center Management" />
                <Navbar.Actions>
                    <Button size="sm" variant="outline" className="text-gray-600 gap-1.5 border-gray-200 h-8" asChild>
                        <Link to="/"><ChevronRight className="h-4 w-4 rotate-180" />Site</Link>
                    </Button>
                </Navbar.Actions>
            </Navbar>

            <div className="flex-1 overflow-hidden w-full flex bg-white">
                <div className="flex w-full h-full">
                    {/* Sidebar */}
                    <Sidebar>
                        <Sidebar.Nav>
                            <Sidebar.Section title="Management">
                                {sidebarItems.map(({ id, label, icon: Icon, badge }) => (
                                    <Sidebar.Item
                                        key={id}
                                        label={label}
                                        icon={Icon}
                                        isActive={false}
                                        onClick={() => navigate("/admin")}
                                        badge={badge}
                                    />
                                ))}
                            </Sidebar.Section>
                        </Sidebar.Nav>
                        <Sidebar.Profile
                            onSettingsClick={() => navigate("/settings")}
                            onLogoutClick={() => setIsLogoutOpen(true)}
                        />
                    </Sidebar>

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50">
                        {/* Page Header */}
                        <div className="shrink-0 px-6 py-4 md:px-8 md:pt-6 md:pb-2 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    {isEditMode ? "Edit Facility & Equipment" : "Add New Facility & Equipment"}
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    {isEditMode ? "Update details for this facility and its equipment" : "Register a new facility and add its equipment"}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button variant="ghost" className="text-slate-500 hover:bg-slate-200/50" onClick={() => navigate("/admin", { state: { activeTab: "facilities" } })}>Cancel</Button>
                                <Button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 shadow-sm"
                                >
                                    {loading ? <Clock className="h-3.5 w-3.5 animate-spin mr-1.5" /> : <Save className="h-3.5 w-3.5 mr-1.5" />}
                                    {isEditMode ? "Save Changes" : "Save All"}
                                </Button>
                            </div>
                        </div>

                        {/* Split Content */}
                        <main className="flex flex-1 overflow-hidden p-6 md:p-8">
                            <div className="flex w-full bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden max-w-7xl mx-auto">
                                <FacilityForm
                                    isEditMode={isEditMode}
                                    fac={fac}
                                    handleFacChange={handleFacChange}
                                    facErrors={facErrors}
                                    featInput={featInput}
                                    setFeatInput={setFeatInput}
                                    features={features}
                                    addFeat={addFeat}
                                    removeFeat={removeFeat}
                                />

                                <div className="w-px bg-slate-100 shrink-0" />

                                <EquipmentForm
                                    equipments={equipments}
                                    updateEq={updateEq}
                                    removeEq={removeEq}
                                    addEq={addEq}
                                />
                            </div>
                        </main>

                        {/* Sticky Status Bar */}
                        <div className="shrink-0 p-4 flex items-center z-20">
                            <div className="flex items-center gap-6 text-xs text-slate-400 font-medium px-4">
                                <div className="flex items-center gap-2">
                                    <div className={cn("w-2 h-2 rounded-full", fac.name ? "bg-emerald-500" : "bg-slate-300")} />
                                    Facility Data
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className={cn("w-2 h-2 rounded-full", equipments.length > 0 ? "bg-blue-500" : "bg-slate-300")} />
                                    {equipments.length} Equipment Items
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <LogoutModal
                open={isLogoutOpen}
                onOpenChange={setIsLogoutOpen}
                onConfirm={handleLogout}
            />
        </div>
    );
}

