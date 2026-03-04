import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, Plus, X, CheckCircle, PackagePlus } from "lucide-react";
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
  const { addEquipment } = useAppContext();
  const navigate = useNavigate();
  const [done, setDone] = useState(false);
  const [addedName, setAddedName] = useState("");

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
    addEquipment({ ...form, specifications: specs, applications: apps });
    setAddedName(form.name);
    setDone(true);
  };

  const resetForm = () => {
    setForm({ name: "", category: "", manufacturer: "", model: "", location: "", status: "Available", description: "" });
    setSpecs([]); setApps([]); setErrors({}); setDone(false);
  };

  if (done) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-gray-50">
        <Card className="max-w-md w-full text-center shadow-xl">
          <CardHeader className="pb-2">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Equipment Added!</CardTitle>
            <CardDescription className="text-base mt-1">
              <span className="font-semibold text-gray-900">"{addedName}"</span> has been added to the catalog.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            <Button className="w-full" onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" /> Add Another Equipment
            </Button>
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-slate-900 text-white px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-4xl mx-auto">
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white mb-3" asChild>
            <Link to="/admin"><ArrowLeft className="h-4 w-4 mr-1.5" />Back to Admin</Link>
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-blue-500 rounded-xl flex items-center justify-center">
              <PackagePlus className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Add New Equipment</h1>
              <p className="text-slate-400 text-sm">Add a new instrument to the research catalog</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Tips */}
          <div className="space-y-4">
            <Card className="border-blue-100 bg-blue-50">
              <CardContent className="pt-5">
                <p className="font-semibold text-blue-900 text-sm mb-2">Tips</p>
                <ul className="text-xs text-blue-800 space-y-2">
                  <li>• Use official manufacturer model numbers</li>
                  <li>• Include building and room in location</li>
                  <li>• List 3–5 key technical specifications</li>
                  <li>• Add realistic research application examples</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5">
                <p className="font-semibold text-sm mb-3">Status Guide</p>
                {[
                  { s: "Available", c: "bg-green-500", d: "Ready to book" },
                  { s: "In Use", c: "bg-orange-500", d: "Currently occupied" },
                  { s: "Maintenance", c: "bg-red-500", d: "Not bookable" },
                ].map((item) => (
                  <div key={item.s} className="flex items-center gap-2 text-sm mb-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${item.c}`} />
                    <span className="font-medium">{item.s}</span>
                    <span className="text-gray-400 text-xs">— {item.d}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Equipment Details</CardTitle>
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
                    <div className="flex flex-wrap gap-2 min-h-[28px]">
                      {specs.length === 0 && <p className="text-xs text-gray-400 italic">No specifications added yet</p>}
                      {specs.map((s) => (
                        <Badge key={s} variant="secondary" className="gap-1 pl-3 pr-2">
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
                    <div className="flex flex-wrap gap-2 min-h-[28px]">
                      {apps.length === 0 && <p className="text-xs text-gray-400 italic">No applications added yet</p>}
                      {apps.map((a) => (
                        <Badge key={a} variant="outline" className="gap-1 pl-3 pr-2">
                          {a}
                          <button type="button" onClick={() => removeTag(a, apps, setApps)} className="hover:text-red-600 ml-1">
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button type="submit" size="lg" className="flex-1">
                      <PackagePlus className="h-4 w-4 mr-2" /> Add to Catalog
                    </Button>
                    <Button type="button" variant="outline" size="lg" onClick={() => navigate("/admin")}>Cancel</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
