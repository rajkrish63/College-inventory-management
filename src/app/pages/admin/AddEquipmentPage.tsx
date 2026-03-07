import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft, Plus, X, CheckCircle, PackagePlus, Clock, Save, Layers, PencilLine } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Badge } from "../../components/ui/badge";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../../components/ui/select";
import { useAppContext } from "../../context/AppContext";

const categories = [
    "Analytical Chemistry", "Materials Characterization", "Molecular Biology",
    "Cell Biology", "Electrochemistry", "Electronics", "Computing",
    "Biotechnology", "Physics", "Other",
];

export function AddEquipmentPage() {
    const { addEquipment, updateEquipment, equipment } = useAppContext();
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;
    const [done, setDone] = useState(false);
    const [addedName, setAddedName] = useState("");
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: "", category: "", manufacturer: "", model: "", location: "",
        status: "Available" as "Available" | "In Use" | "Maintenance",
        description: "",
    });
    const [specInput, setSpecInput] = useState("");
    const [specs, setSpecs] = useState<string[]>([]);
    const [appInput, setAppInput] = useState("");
    const [apps, setApps] = useState<string[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (isEditMode && equipment.length > 0 && id) {
            const itemId = parseInt(id);
            const item = equipment.find(e => e.id === itemId);
            if (item) {
                setForm({
                    name: item.name,
                    category: item.category,
                    manufacturer: item.manufacturer,
                    model: item.model,
                    location: item.location,
                    status: item.status,
                    description: item.description,
                });
                setSpecs(item.specifications || []);
                setApps(item.applications || []);
            }
        } else if (!isEditMode) {
            resetForm();
        }
    }, [isEditMode, id, equipment]);

    const validate = () => {
        const e: Record<string, string> = {};
        if (!form.name.trim()) e.name = "Required";
        if (!form.category) e.category = "Required";
        if (!form.manufacturer.trim()) e.manufacturer = "Required";
        if (!form.model.trim()) e.model = "Required";
        if (!form.location.trim()) e.location = "Required";
        if (!form.description.trim()) e.description = "Required";
        return e;
    };

    const addTag = (val: string, list: string[], setList: (v: string[]) => void, setInput: (v: string) => void) => {
        const v = val.trim();
        if (v && !list.includes(v)) setList([...list, v]);
        setInput("");
    };
    const removeTag = (val: string, list: string[], setList: (v: string[]) => void) =>
        setList(list.filter((x) => x !== val));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }

        setLoading(true);
        // Simulate slight delay for premium feel
        setTimeout(() => {
            if (isEditMode) {
                updateEquipment(parseInt(id), { ...form, specifications: specs, applications: apps });
            } else {
                addEquipment({ ...form, specifications: specs, applications: apps });
            }
            setAddedName(form.name);
            setDone(true);
            setLoading(false);
        }, 800);
    };

    const resetForm = () => {
        setForm({ name: "", category: "", manufacturer: "", model: "", location: "", status: "Available", description: "" });
        setSpecs([]); setApps([]); setErrors({}); setDone(false);
    };

    if (done) {
        return (
            <div className="h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50">
                <Card className="max-w-md w-full text-center shadow-xl border-none bg-white/80 backdrop-blur-sm">
                    <CardHeader className="pb-2">
                        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="h-10 w-10 text-green-600" />
                        </div>
                        <CardTitle className="text-2xl">{isEditMode ? "Changes Saved!" : "Equipment Added!"}</CardTitle>
                        <CardDescription className="text-base mt-1">
                            <span className="font-semibold text-gray-900">"{addedName}"</span> {isEditMode ? "has been updated." : "has been added to the catalog."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-4">
                        {!isEditMode && (
                            <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={resetForm}>
                                <Plus className="h-4 w-4 mr-2" /> Add Another Equipment
                            </Button>
                        )}
                        <Button variant="outline" className="w-full" asChild>
                            <Link to="/admin">Back to Admin Dashboard</Link>
                        </Button>
                        <Button variant="ghost" className="w-full" asChild>
                            <Link to="/equipment">View Equipment Catalog</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50">
            {/* Header - Fixed at Top */}
            <div className="bg-slate-900 text-white p-6 shadow-lg shrink-0">
                <div className="flex items-center gap-4 mb-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-300 hover:text-white -ml-2"
                        asChild
                    >
                        <Link to="/admin">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Admin
                        </Link>
                    </Button>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-blue-500/20 p-3 rounded-xl border border-blue-400/30">
                        {isEditMode ? <PencilLine className="h-8 w-8 text-blue-400" /> : <PackagePlus className="h-8 w-8 text-blue-400" />}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">{isEditMode ? "Edit Equipment" : "Add New Equipment"}</h1>
                        <p className="text-slate-400 text-sm">{isEditMode ? `Updating "${form.name}"` : "Add a new instrument to the research catalog"}</p>
                    </div>
                </div>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-4 sm:px-6 lg:px-8 py-10">
                <div className="max-w-4xl">
                    <Card className="border-none shadow-md bg-white/90 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle>{isEditMode ? "Edit Details" : "Equipment Details"}</CardTitle>
                            <CardDescription>Fields marked <span className="text-red-500">*</span> are required.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Basic */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold border-b pb-2 text-gray-800">Basic Information</h3>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="name">Equipment Name <span className="text-red-500">*</span></Label>
                                        <Input id="name" placeholder="e.g., Scanning Electron Microscope"
                                            value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            className={errors.name ? "border-red-400" : ""} />
                                        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                                    </div>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
                                            <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                                                <SelectTrigger id="category" className={errors.category ? "border-red-400" : ""}>
                                                    <SelectValue placeholder="Select category" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                            {errors.category && <p className="text-xs text-red-500">{errors.category}</p>}
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="status">Initial Status</Label>
                                            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as typeof form.status })}>
                                                <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Available">Available</SelectItem>
                                                    <SelectItem value="In Use">In Use</SelectItem>
                                                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="manufacturer">Manufacturer <span className="text-red-500">*</span></Label>
                                            <Input id="manufacturer" placeholder="e.g., JEOL, Bruker"
                                                value={form.manufacturer} onChange={(e) => setForm({ ...form, manufacturer: e.target.value })}
                                                className={errors.manufacturer ? "border-red-400" : ""} />
                                            {errors.manufacturer && <p className="text-xs text-red-500">{errors.manufacturer}</p>}
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="model">Model Number <span className="text-red-500">*</span></Label>
                                            <Input id="model" placeholder="e.g., JSM-7800F"
                                                value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })}
                                                className={errors.model ? "border-red-400" : ""} />
                                            {errors.model && <p className="text-xs text-red-500">{errors.model}</p>}
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="location">Location <span className="text-red-500">*</span></Label>
                                        <Input id="location" placeholder="e.g., Materials Lab - Room 205"
                                            value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                                            className={errors.location ? "border-red-400" : ""} />
                                        {errors.location && <p className="text-xs text-red-500">{errors.location}</p>}
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                                        <Textarea id="description" rows={3} placeholder="Describe capabilities and intended use..."
                                            value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                                            className={errors.description ? "border-red-400" : ""} />
                                        {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
                                    </div>
                                </div>

                                {/* Specs */}
                                <div className="space-y-3">
                                    <h3 className="font-semibold border-b pb-2 text-gray-800">Technical Specifications</h3>
                                    <div className="flex gap-2">
                                        <Input placeholder='e.g., "1.0 nm resolution" — press Enter'
                                            value={specInput} onChange={(e) => setSpecInput(e.target.value)}
                                            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(specInput, specs, setSpecs, setSpecInput); } }} />
                                        <Button type="button" variant="outline" onClick={() => addTag(specInput, specs, setSpecs, setSpecInput)}>
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 min-h-[28px] p-3 bg-slate-50 rounded-lg">
                                        {specs.length === 0 && <p className="text-xs text-gray-400 italic">No specifications added yet</p>}
                                        {specs.map((s) => (
                                            <Badge key={s} variant="secondary" className="gap-1 pl-3 pr-2 py-1 bg-blue-50 text-blue-700 border-blue-100">
                                                {s}
                                                <button type="button" onClick={() => removeTag(s, specs, setSpecs)} className="hover:text-red-600 ml-1">
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                {/* Applications */}
                                <div className="space-y-3">
                                    <h3 className="font-semibold border-b pb-2 text-gray-800">Research Applications</h3>
                                    <div className="flex gap-2">
                                        <Input placeholder='e.g., "Surface morphology" — press Enter'
                                            value={appInput} onChange={(e) => setAppInput(e.target.value)}
                                            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(appInput, apps, setApps, setAppInput); } }} />
                                        <Button type="button" variant="outline" onClick={() => addTag(appInput, apps, setApps, setAppInput)}>
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 min-h-[28px] p-3 bg-slate-50 rounded-lg">
                                        {apps.length === 0 && <p className="text-xs text-gray-400 italic">No applications added yet</p>}
                                        {apps.map((a) => (
                                            <Badge key={a} variant="outline" className="gap-1 pl-3 pr-2 py-1 bg-white text-slate-700">
                                                {a}
                                                <button type="button" onClick={() => removeTag(a, apps, setApps)} className="hover:text-red-600 ml-1">
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4 border-t">
                                    <Button type="submit" size="lg" className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={loading}>
                                        {loading ? (
                                            <><Clock className="mr-2 h-4 w-4 animate-spin" /> {isEditMode ? "Saving..." : "Adding..."}</>
                                        ) : (
                                            <><Save className="h-4 w-4 mr-2" /> {isEditMode ? "Save Changes" : "Add to Catalog"}</>
                                        )}
                                    </Button>
                                    <Button type="button" variant="outline" size="lg" onClick={() => navigate("/admin")}>Cancel</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
