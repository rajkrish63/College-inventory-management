import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowLeft, Plus, X, CheckCircle, Building2 } from "lucide-react";
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
  "Chemistry", "Biotechnology", "Materials Science", "Electronics",
  "Computing", "Physics", "Biology", "Engineering", "Other",
];

const defaultImages: Record<string, string> = {
  Chemistry: "https://images.unsplash.com/photo-1707944746058-4da338d0f827?w=800&q=80",
  Biotechnology: "https://images.unsplash.com/photo-1732400333616-8efa4f385a03?w=800&q=80",
  "Materials Science": "https://images.unsplash.com/photo-1765830403209-a5eceac4c198?w=800&q=80",
  Electronics: "https://images.unsplash.com/photo-1759866042499-d0b3e9d87ceb?w=800&q=80",
  Computing: "https://images.unsplash.com/photo-1765830403209-a5eceac4c198?w=800&q=80",
};

export function AddFacilityPage() {
  const { addFacility } = useAppContext();
  const navigate = useNavigate();
  const [done, setDone] = useState(false);
  const [addedName, setAddedName] = useState("");

  const [form, setForm] = useState({
    name: "", category: "", description: "", capacity: "", room: "",
    availability: "Available" as "Available" | "Limited" | "Unavailable",
  });
  const [featureInput, setFeatureInput] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.category) e.category = "Required";
    if (!form.description.trim()) e.description = "Required";
    if (!form.capacity.trim()) e.capacity = "Required";
    if (!form.room.trim()) e.room = "Required";
    return e;
  };

  const addFeature = () => {
    const v = featureInput.trim();
    if (v && !features.includes(v)) setFeatures([...features, v]);
    setFeatureInput("");
  };
  const removeFeature = (v: string) => setFeatures(features.filter((f) => f !== v));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    addFacility({
      ...form,
      features,
      image: defaultImages[form.category] || defaultImages.Chemistry,
    });
    setAddedName(form.name);
    setDone(true);
  };

  const resetForm = () => {
    setForm({ name: "", category: "", description: "", capacity: "", room: "", availability: "Available" });
    setFeatures([]); setErrors({}); setDone(false);
  };

  if (done) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-gray-50">
        <Card className="max-w-md w-full text-center shadow-xl">
          <CardHeader className="pb-2">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Facility Added!</CardTitle>
            <CardDescription className="text-base mt-1">
              <span className="font-semibold text-gray-900">"{addedName}"</span> has been added to the facilities list.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            <Button className="w-full" onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" /> Add Another Facility
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/admin">Back to Admin Dashboard</Link>
            </Button>
            <Button variant="ghost" className="w-full" asChild>
              <Link to="/facilities">View Facilities</Link>
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
            <div className="w-11 h-11 bg-emerald-500 rounded-xl flex items-center justify-center">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Add New Facility</h1>
              <p className="text-slate-400 text-sm">Register a new research facility or laboratory</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Tips */}
          <div className="space-y-4">
            <Card className="border-emerald-100 bg-emerald-50">
              <CardContent className="pt-5">
                <p className="font-semibold text-emerald-900 text-sm mb-2">Tips</p>
                <ul className="text-xs text-emerald-800 space-y-2">
                  <li>• Include building name and room number(s)</li>
                  <li>• Be specific about capacity (e.g., "12 researchers")</li>
                  <li>• List key equipment available in the facility</li>
                  <li>• Mention any certifications (e.g., BSL-2, ISO Class 7)</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5">
                <p className="font-semibold text-sm mb-3">Availability Guide</p>
                {[
                  { s: "Available", c: "bg-green-500", d: "Open for bookings" },
                  { s: "Limited", c: "bg-amber-500", d: "Partial capacity" },
                  { s: "Unavailable", c: "bg-red-500", d: "Closed / offline" },
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
                <CardTitle>Facility Details</CardTitle>
                <CardDescription>Fields marked <span className="text-red-500">*</span> are required.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic */}
                  <div className="space-y-4">
                    <h3 className="font-semibold border-b pb-2 text-gray-800">Basic Information</h3>
                    <div className="space-y-1.5">
                      <Label htmlFor="name">Facility Name <span className="text-red-500">*</span></Label>
                      <Input id="name" placeholder="e.g., Advanced Chemistry Laboratory"
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
                        <Label htmlFor="availability">Initial Availability</Label>
                        <Select value={form.availability} onValueChange={(v) => setForm({ ...form, availability: v as typeof form.availability })}>
                          <SelectTrigger id="availability"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Available">Available</SelectItem>
                            <SelectItem value="Limited">Limited</SelectItem>
                            <SelectItem value="Unavailable">Unavailable</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="capacity">Capacity <span className="text-red-500">*</span></Label>
                        <Input id="capacity" placeholder="e.g., 20 researchers"
                          value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                          className={errors.capacity ? "border-red-400" : ""} />
                        {errors.capacity && <p className="text-xs text-red-500">{errors.capacity}</p>}
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="room">Room / Location <span className="text-red-500">*</span></Label>
                        <Input id="room" placeholder="e.g., Building A, Room 101-110"
                          value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })}
                          className={errors.room ? "border-red-400" : ""} />
                        {errors.room && <p className="text-xs text-red-500">{errors.room}</p>}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                      <Textarea id="description" rows={3}
                        placeholder="Describe the facility, its purpose, equipment, and any certifications..."
                        value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                        className={errors.description ? "border-red-400" : ""} />
                      {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    <h3 className="font-semibold border-b pb-2 text-gray-800">Key Features / Equipment</h3>
                    <div className="flex gap-2">
                      <Input placeholder='e.g., "Fume Hoods" or "PCR Machines" — press Enter'
                        value={featureInput} onChange={(e) => setFeatureInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addFeature(); } }} />
                      <Button type="button" variant="outline" onClick={addFeature}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 min-h-[28px]">
                      {features.length === 0 && <p className="text-xs text-gray-400 italic">No features added yet</p>}
                      {features.map((f) => (
                        <Badge key={f} variant="secondary" className="gap-1 pl-3 pr-2">
                          {f}
                          <button type="button" onClick={() => removeFeature(f)} className="hover:text-red-600 ml-1">
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button type="submit" size="lg" className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                      <Building2 className="h-4 w-4 mr-2" /> Add Facility
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
