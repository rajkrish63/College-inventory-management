import { useState, useEffect } from "react";
import { Calendar, Clock, User, Mail, Building, FileText, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../components/ui/select";
import { Pencil, X, Upload } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { useLocation } from "react-router";

const timeSlots = [
  "08:00 - 10:00", "10:00 - 12:00", "12:00 - 14:00",
  "14:00 - 16:00", "16:00 - 18:00", "18:00 - 20:00",
];

export function BookingPage() {
  const { facilities, equipment: equipmentList, addBooking, currentUser, users } = useAppContext();
  const location = useLocation();
  const routeState = location.state as {
    equipment?: string; equipCategory?: string; equipFacility?: string;
    facility?: string; type?: string;
  } | null;

  const userProfile = currentUser && currentUser.id !== "admin"
    ? users.find((u) => String(u.id) === String(currentUser.id))
    : null;

  const bookingType = routeState?.type === "facility" ? "facility" : "equipment";

  const [submitted, setSubmitted] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [persons, setPersons] = useState(1);
  const [extraPersons, setExtraPersons] = useState<{ name: string; email: string }[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    type: bookingType,
    facility: routeState?.facility ?? "",
    equipFacility: routeState?.equipFacility ?? "",
    equipCategory: routeState?.equipCategory ?? "",
    equipment: routeState?.equipment ?? "",
    quantity: 1,
    date: "", timeSlot: "", purpose: "",
  });
  const [idProofUrl, setIdProofUrl] = useState<string | null>(null);
  const [idProofConfirmed, setIdProofConfirmed] = useState(false);

  // Update extraPersons array when persons count changes
  useEffect(() => {
    const extra = Math.max(0, persons - 1);
    setExtraPersons((prev) => {
      if (extra > prev.length) return [...prev, ...Array(extra - prev.length).fill({ name: "", email: "" })];
      return prev.slice(0, extra);
    });
  }, [persons]);

  // Auto-fill user details on mount / whenever login state changes
  useEffect(() => {
    const profile = currentUser && currentUser.id !== "admin"
      ? users.find((u) => String(u.id) === String(currentUser.id))
      : null;

    // Find facility for the equipment if not already provided
    const equipCat = routeState?.equipCategory ?? "";
    const equipName = routeState?.equipment ?? "";
    let resolvedFacility = routeState?.equipFacility ?? "";
    if (!resolvedFacility && (equipCat || equipName)) {
      // Find facility whose features include the equipment category
      const match = facilities.find((f) =>
        f.features.some((feat) => feat.toLowerCase() === equipCat.toLowerCase())
      );
      if (match) resolvedFacility = match.name;
    }

    setFormData((prev) => ({
      ...prev,
      ...(currentUser ? { name: currentUser.name, email: currentUser.email } : {}),
      ...(profile ? { department: `${profile.department}, ${profile.institution}` } : {}),
      ...(resolvedFacility ? { equipFacility: resolvedFacility } : {}),
    }));
  }, [currentUser?.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = addBooking({
      name: formData.name, email: formData.email, department: formData.department,
      type: formData.type, facility: formData.facility, equipment: formData.equipment,
      date: formData.date, timeSlot: formData.timeSlot, purpose: formData.purpose,
    });
    setBookingId(id);
    setSubmitted(true);
  };

  const resetForm = () => {
    setSubmitted(false);
    setFormData({ name: "", email: "", department: "", type: "equipment", facility: "", equipFacility: "", equipCategory: "", equipment: "", quantity: 1, date: "", timeSlot: "", purpose: "" });
    setIdProofUrl(null);
    setIdProofConfirmed(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setIdProofUrl(url);
      setIdProofConfirmed(false);
    }
  };

  const handleRemoveFile = () => {
    setIdProofUrl(null);
    setIdProofConfirmed(false);
  };
  // The submitted dialog is now rendered as a modal at the end of the return statement.

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-50 to-cyan-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-8xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Request Facility Access</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Submit a request to access our research facilities and equipment. We'll review your application and get back to you shortly.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Booking Form */}
          <Card>
            <CardHeader>
              <CardTitle>Access Request Form</CardTitle>
              <CardDescription>Please fill out all required fields to submit your request</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Info */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Personal Information</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input id="name" placeholder="John Doe" required value={formData.name}
                        readOnly={!!currentUser}
                        className={currentUser ? "bg-gray-50 text-gray-600 cursor-not-allowed" : ""}
                        onChange={(e) => !currentUser && setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input id="email" type="email" placeholder="john.doe@university.edu" required
                        readOnly={!!currentUser}
                        className={currentUser ? "bg-gray-50 text-gray-600 cursor-not-allowed" : ""}
                        value={formData.email} onChange={(e) => !currentUser && setFormData({ ...formData, email: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department/Organization *</Label>
                    <Input id="department" placeholder="e.g., Chemistry Department, XYZ University" required
                      readOnly={!!currentUser}
                      className={currentUser ? "bg-gray-50 text-gray-600 cursor-not-allowed" : ""}
                      value={formData.department} onChange={(e) => !currentUser && setFormData({ ...formData, department: e.target.value })} />
                  </div>
                </div>

                {/* Access Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Access Details</h3>

                  {/* ── FACILITY FLOW ── */}
                  {formData.type === "facility" && (
                    <div className="space-y-4">
                      {/* Facility select */}
                      <div className="space-y-2">
                        <Label htmlFor="facility">Facility *</Label>
                        <Select required value={formData.facility} onValueChange={(v) => setFormData({ ...formData, facility: v })}>
                          <SelectTrigger id="facility"><SelectValue placeholder="Select a facility" /></SelectTrigger>
                          <SelectContent>
                            {facilities.filter((f) => f.availability !== "Unavailable").map((f) => (
                              <SelectItem key={f.id} value={f.name}>{f.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Number of persons */}
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Number of Persons *</Label>
                          <p className="text-xs text-gray-400 mt-0.5">Including yourself</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button type="button"
                            onClick={() => setPersons((p) => Math.max(1, p - 1))}
                            disabled={persons <= 1}
                            className="w-8 h-8 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 flex items-center justify-center text-lg font-semibold text-gray-600 transition-colors disabled:opacity-40"
                          >−</button>
                          <input type="number" min={1} value={persons}
                            onChange={(e) => setPersons(Math.max(1, Number(e.target.value)))}
                            className="w-14 text-center border border-gray-300 rounded-lg h-8 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <button type="button"
                            onClick={() => setPersons((p) => p + 1)}
                            className="w-8 h-8 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 flex items-center justify-center text-lg font-semibold text-gray-600 transition-colors"
                          >+</button>
                        </div>
                      </div>

                      {/* Extra persons details */}
                      {extraPersons.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold text-gray-700">Additional Persons Details</h4>
                          {extraPersons.map((p, i) => (
                            <div key={i} className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Person {i + 2}</p>
                              <div className="grid md:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                  <Label htmlFor={`ep-name-${i}`}>Full Name *</Label>
                                  <Input id={`ep-name-${i}`} required placeholder="Full name" value={p.name}
                                    onChange={(e) => setExtraPersons((prev) => prev.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} />
                                </div>
                                <div className="space-y-1">
                                  <Label htmlFor={`ep-email-${i}`}>Email *</Label>
                                  <Input id={`ep-email-${i}`} type="email" required placeholder="email@example.com" value={p.email}
                                    onChange={(e) => setExtraPersons((prev) => prev.map((x, j) => j === i ? { ...x, email: e.target.value } : x))} />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── EQUIPMENT FLOW ── */}
                  {formData.type === "equipment" && (
                    <div className="space-y-3">
                      {/* Step 1: Facility */}
                      <div className="space-y-2">
                        <Label htmlFor="equipFacility">Facility *</Label>
                        <Select
                          required
                          value={formData.equipFacility}
                          onValueChange={(v) => setFormData({ ...formData, equipFacility: v, equipCategory: "", equipment: "" })}
                        >
                          <SelectTrigger id="equipFacility"><SelectValue placeholder="Select a facility" /></SelectTrigger>
                          <SelectContent>
                            {facilities.filter((f) => f.availability !== "Unavailable").map((f) => (
                              <SelectItem key={f.id} value={f.name}>{f.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Step 2: Equipment Category (from facility features) */}
                      {formData.equipFacility && (() => {
                        const selectedFacility = facilities.find((f) => f.name === formData.equipFacility);
                        const categories = selectedFacility?.features ?? [];
                        return (
                          <div className="space-y-2">
                            <Label htmlFor="equipCategory">Equipment Category *</Label>
                            <Select
                              required
                              value={formData.equipCategory}
                              onValueChange={(v) => setFormData({ ...formData, equipCategory: v, equipment: "" })}
                            >
                              <SelectTrigger id="equipCategory"><SelectValue placeholder="Select a category" /></SelectTrigger>
                              <SelectContent>
                                {categories.map((cat) => (
                                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        );
                      })()}

                      {/* Step 3: Equipment (filtered by category) */}
                      {formData.equipCategory && (() => {
                        const filtered = equipmentList.filter(
                          (e) =>
                            e.status === "Available" &&
                            (e.category.toLowerCase() === formData.equipCategory.toLowerCase() ||
                              e.name.toLowerCase().includes(formData.equipCategory.toLowerCase()))
                        );
                        return (
                          <div className="space-y-2">
                            <Label htmlFor="equipment">Select Equipment *</Label>
                            <Select
                              required
                              value={formData.equipment}
                              onValueChange={(v) => setFormData({ ...formData, equipment: v })}
                            >
                              <SelectTrigger id="equipment"><SelectValue placeholder="Choose equipment" /></SelectTrigger>
                              <SelectContent>
                                {filtered.length > 0 ? (
                                  filtered.map((item) => (
                                    <SelectItem key={item.id} value={item.name}>{item.name}</SelectItem>
                                  ))
                                ) : (
                                  <SelectItem value="__none" disabled>No available equipment in this category</SelectItem>
                                )}
                              </SelectContent>
                            </Select>

                            {/* Quantity Counter */}
                            <div className="flex items-center justify-between pt-1">
                              <Label htmlFor="quantity">Quantity</Label>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setFormData((p) => ({ ...p, quantity: Math.max(1, p.quantity - 1) }))}
                                  className="w-8 h-8 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 flex items-center justify-center text-lg font-semibold text-gray-600 transition-colors disabled:opacity-40"
                                  disabled={formData.quantity <= 1}
                                >−</button>
                                <input
                                  id="quantity"
                                  type="number"
                                  min={1}
                                  value={formData.quantity}
                                  onChange={(e) => setFormData((p) => ({ ...p, quantity: Math.max(1, Number(e.target.value)) }))}
                                  className="w-14 text-center border border-gray-300 rounded-lg h-8 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                  type="button"
                                  onClick={() => setFormData((p) => ({ ...p, quantity: p.quantity + 1 }))}
                                  className="w-8 h-8 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 flex items-center justify-center text-lg font-semibold text-gray-600 transition-colors"
                                >+</button>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Preferred Date *</Label>
                    <Input id="date" type="date" required value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeSlot">Preferred Time Slot *</Label>
                    <Select required value={formData.timeSlot} onValueChange={(v) => setFormData({ ...formData, timeSlot: v })}>
                      <SelectTrigger id="timeSlot"><SelectValue placeholder="Select time slot" /></SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((slot) => <SelectItem key={slot} value={slot}>{slot}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <h3 className="font-semibold text-lg">Additional Information</h3>
                <div className="space-y-4">
                  <Label htmlFor="idProof">Upload ID Proof *</Label>
                  {!idProofUrl ? (
                    <label
                      htmlFor="idProof"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-blue-400 transition-all group"
                    >
                      <div className="flex flex-col items-center justify-center gap-1 text-center">
                        <svg className="h-8 w-8 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm text-gray-500 group-hover:text-blue-600">
                          <span className="font-medium">Click to upload</span> your ID proof
                        </p>
                        <p className="text-xs text-gray-400">Aadhar card, Passport, or Institution ID (JPG, PNG, PDF)</p>
                      </div>
                      <input id="idProof" type="file" accept="image/*,.pdf" className="hidden" required onChange={handleFileChange} />
                    </label>
                  ) : (
                    <div className="space-y-3">
                      <div className="relative w-full aspect-video sm:aspect-auto sm:h-48 bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 shadow-inner group">
                        <img src={idProofUrl} alt="ID Proof Preview" className="w-full h-full object-contain" />

                        {/* Overlay Controls */}
                        {!idProofConfirmed && (
                          <div className="absolute top-3 right-3 flex gap-2">
                            <label htmlFor="idProof" className="p-2 bg-white/90 hover:bg-white text-gray-700 rounded-full shadow-lg cursor-pointer transition-all hover:scale-110">
                              <Pencil className="w-4 h-4" />
                              <input id="idProof" type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileChange} />
                            </label>
                            <button
                              type="button"
                              onClick={handleRemoveFile}
                              className="p-2 bg-white/90 hover:bg-red-50 text-gray-700 hover:text-red-600 rounded-full shadow-lg transition-all hover:scale-110"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )}

                        {idProofConfirmed && (
                          <div className="absolute inset-0 bg-green-600/10 backdrop-blur-[1px] flex items-center justify-center">
                            <div className="bg-white/90 px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-green-700 font-bold border border-green-200">
                              <CheckCircle className="w-5 h-5" />
                              ID Proof Confirmed
                            </div>
                          </div>
                        )}
                      </div>

                      {!idProofConfirmed ? (
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 bg-blue-50/30 font-bold h-11 rounded-xl"
                          onClick={() => setIdProofConfirmed(true)}
                        >
                          Confirm & Lock Upload
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="ghost"
                          className="w-full text-gray-500 hover:text-gray-700 text-xs font-bold"
                          onClick={() => setIdProofConfirmed(false)}
                        >
                          Change Image
                        </Button>
                      )}
                    </div>
                  )}

                  <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex items-start gap-3 mt-4">
                    <span className="text-amber-500 text-lg mt-0.5">⚠️</span>
                    <div>
                      <h3 className="font-semibold text-amber-800 text-sm">ID Proof Required</h3>
                      <p className="text-xs text-amber-700 mt-0.5">Please carry a valid government-issued ID (Aadhar card, passport, or institution ID) on the day of your visit. Access will not be granted without verification.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purpose">Research Purpose *</Label>
                  <Textarea id="purpose" rows={4} required
                    placeholder="Please describe your research purpose and how you plan to use the facility/equipment..."
                    value={formData.purpose} onChange={(e) => setFormData({ ...formData, purpose: e.target.value })} />
                </div>

                <Button type="submit" className="w-full" size="lg">Submit Request</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Success Modal */}
      {submitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Request Submitted!</h3>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  Your request is submitted. The Admin will accept or reject your request within 24 hours.
                </p>
              </div>
              <div className="pt-4">
                <Button onClick={resetForm} className="w-full bg-blue-600 hover:bg-blue-700">
                  Got it, thanks!
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}