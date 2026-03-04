import { useState } from "react";
import { Calendar, Clock, User, Mail, Building, FileText, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../components/ui/select";
import { useAppContext } from "../context/AppContext";

const timeSlots = [
  "08:00 - 10:00", "10:00 - 12:00", "12:00 - 14:00",
  "14:00 - 16:00", "16:00 - 18:00", "18:00 - 20:00",
];

export function BookingPage() {
  const { facilities, equipment: equipmentList, addBooking } = useAppContext();
  const [submitted, setSubmitted] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [formData, setFormData] = useState({
    name: "", email: "", department: "", type: "",
    facility: "", equipment: "", date: "", timeSlot: "", purpose: "",
  });

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
    setFormData({ name: "", email: "", department: "", type: "", facility: "", equipment: "", date: "", timeSlot: "", purpose: "" });
  };

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Request Submitted!</CardTitle>
            <CardDescription>
              Your access request has been submitted. Our team will review it and contact you within 24-48 hours.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-left bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Request ID:</span>
                <span className="font-medium font-mono text-blue-600">{bookingId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{formData.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{formData.email}</span>
              </div>
            </div>
            <Button onClick={resetForm} className="w-full">Submit Another Request</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-50 to-cyan-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Request Facility Access</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Submit a request to access our research facilities and equipment. We'll review your application and get back to you shortly.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Info Cards */}
            <div className="md:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <Clock className="h-6 w-6 text-blue-600 mb-2" />
                  <CardTitle className="text-lg">Quick Response</CardTitle>
                  <CardDescription>Most requests are processed within 24-48 hours</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <User className="h-6 w-6 text-blue-600 mb-2" />
                  <CardTitle className="text-lg">Training Provided</CardTitle>
                  <CardDescription>Equipment training sessions available upon approval</CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <FileText className="h-6 w-6 text-blue-600 mb-2" />
                  <CardTitle className="text-lg">Documentation</CardTitle>
                  <CardDescription>Safety protocols and SOPs provided before access</CardDescription>
                </CardHeader>
              </Card>
            </div>

            {/* Booking Form */}
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Access Request Form</CardTitle>
                  <CardDescription>Please fill out all required fields to submit your request</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Info */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Personal Information</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name *</Label>
                          <Input id="name" placeholder="John Doe" required value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <Input id="email" type="email" placeholder="john.doe@university.edu" required
                            value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department">Department/Organization *</Label>
                        <Input id="department" placeholder="e.g., Chemistry Department, XYZ University" required
                          value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} />
                      </div>
                    </div>

                    {/* Access Details */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Access Details</h3>
                      <div className="space-y-2">
                        <Label htmlFor="type">Request Type *</Label>
                        <Select required value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v, facility: "", equipment: "" })}>
                          <SelectTrigger id="type"><SelectValue placeholder="Select request type" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="facility">Facility Access</SelectItem>
                            <SelectItem value="equipment">Equipment Booking</SelectItem>
                            <SelectItem value="both">Both Facility & Equipment</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {(formData.type === "facility" || formData.type === "both") && (
                        <div className="space-y-2">
                          <Label htmlFor="facility">Select Facility *</Label>
                          <Select required value={formData.facility} onValueChange={(v) => setFormData({ ...formData, facility: v })}>
                            <SelectTrigger id="facility"><SelectValue placeholder="Choose a facility" /></SelectTrigger>
                            <SelectContent>
                              {facilities.filter((f) => f.availability !== "Unavailable").map((f) => (
                                <SelectItem key={f.id} value={f.name}>{f.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {(formData.type === "equipment" || formData.type === "both") && (
                        <div className="space-y-2">
                          <Label htmlFor="equipment">Select Equipment *</Label>
                          <Select required value={formData.equipment} onValueChange={(v) => setFormData({ ...formData, equipment: v })}>
                            <SelectTrigger id="equipment"><SelectValue placeholder="Choose equipment" /></SelectTrigger>
                            <SelectContent>
                              {equipmentList.filter((e) => e.status === "Available").map((item) => (
                                <SelectItem key={item.id} value={item.name}>{item.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

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

                      <div className="space-y-2">
                        <Label htmlFor="purpose">Research Purpose *</Label>
                        <Textarea id="purpose" rows={4} required
                          placeholder="Please describe your research purpose and how you plan to use the facility/equipment..."
                          value={formData.purpose} onChange={(e) => setFormData({ ...formData, purpose: e.target.value })} />
                      </div>
                    </div>

                    <Button type="submit" className="w-full" size="lg">Submit Request</Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Guidelines */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Access Guidelines</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Before You Book</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Check equipment availability and specifications</li>
                  <li>• Review safety protocols and requirements</li>
                  <li>• Ensure you have necessary clearances</li>
                  <li>• Plan your experiment timeline</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>After Approval</CardTitle></CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Complete mandatory safety training</li>
                  <li>• Review equipment SOPs</li>
                  <li>• Arrange for technical support if needed</li>
                  <li>• Confirm your booking 24 hours before</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}