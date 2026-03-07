import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Navbar } from "../../components/Navbar";
import { Sidebar } from "../../components/Sidebar";
import {
  LayoutDashboard, CalendarCheck, FlaskConical, Building2, Users,
  PackagePlus, PlusCircle, CheckCircle, XCircle, Clock, Trash2,
  Search, Shield, Activity, ChevronRight, LogOut, ToggleLeft, ToggleRight, Filter,
  LucideIcon, Settings, User, PencilLine
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../../components/ui/select";
import { useAppContext } from "../../context/AppContext";
import type { Booking, Equipment, Facility, AppUser } from "../../context/AppContext";
import { LogoutModal } from "../../components/LogoutModal";

import { SettingsContent } from "../SettingsPage";

type Section = "dashboard" | "bookings" | "equipment" | "facilities" | "users" | "settings";

// ── Helpers ───────────────────────────────────────────────────────────────────

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    Pending: "bg-amber-100 text-amber-800 border-amber-200",
    Approved: "bg-green-100 text-green-800 border-green-200",
    Rejected: "bg-red-100 text-red-800 border-red-200",
    Available: "bg-green-100 text-green-800 border-green-200",
    "In Use": "bg-orange-100 text-orange-800 border-orange-200",
    Maintenance: "bg-red-100 text-red-800 border-red-200",
    Active: "bg-green-100 text-green-800 border-green-200",
    Inactive: "bg-gray-100 text-gray-600 border-gray-200",
    Limited: "bg-amber-100 text-amber-800 border-amber-200",
    Unavailable: "bg-red-100 text-red-800 border-red-200",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${map[status] ?? "bg-gray-100 text-gray-800"}`}>
      {status}
    </span>
  );
}

function StatCard({ label, value, sub, icon: Icon, color }: { label: string; value: string | number; sub: string; icon: React.ElementType; color: string }) {
  return (
    <Card>
      <CardContent className="pt-5 pb-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">{label}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-400 mt-1">{sub}</p>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function DashboardSection({ setSection }: { setSection: (s: Section) => void }) {
  const { equipment, facilities, bookings, users } = useAppContext();
  const pending = bookings.filter((b) => b.status === "Pending").length;
  const approved = bookings.filter((b) => b.status === "Approved").length;
  const available = equipment.filter((e) => e.status === "Available").length;
  const activeUsers = users.filter((u) => u.status === "Active").length;
  const recent = [...bookings].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt)).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Bookings" value={bookings.length} sub={`${approved} approved`} icon={CalendarCheck} color="bg-blue-500" />
        <StatCard label="Pending Approvals" value={pending} sub="awaiting review" icon={Clock} color="bg-amber-500" />
        <StatCard label="Equipment Units" value={equipment.length} sub={`${available} available`} icon={FlaskConical} color="bg-green-500" />
        <StatCard label="Researchers" value={users.length} sub={`${activeUsers} active`} icon={Users} color="bg-purple-500" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle>Recent Booking Requests</CardTitle>
                <CardDescription>Latest 5 access requests</CardDescription>
              </div>
              {pending > 0 && (
                <Badge className="bg-amber-100 text-amber-800 border border-amber-200">{pending} pending</Badge>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recent.map((b) => (
                  <div key={b.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-sm text-gray-900 truncate">{b.name}</p>
                        <StatusPill status={b.status} />
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">
                        {b.type === "facility" ? b.facility : b.type === "equipment" ? b.equipment : "Facility + Equipment"}
                        {" · "}{b.date}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 ml-3 flex-shrink-0 font-mono">{b.id}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4" onClick={() => setSection("bookings")}>
                View All Bookings
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <Card className="gap-0">
            <CardHeader className="pb-2"><CardTitle className="text-sm">Resource Overview</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Facilities</p>
              {[
                { label: "Available", count: facilities.filter((f) => f.availability === "Available").length, color: "bg-green-500" },
                { label: "Limited", count: facilities.filter((f) => f.availability === "Limited").length, color: "bg-amber-500" },
                { label: "Unavailable", count: facilities.filter((f) => f.availability === "Unavailable").length, color: "bg-red-500" },
              ].map((item) => (
                <div key={`fac-${item.label}`} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                    <span className="text-sm text-gray-600">{item.label}</span>
                  </div>
                  <span className="font-semibold text-sm">{item.count}</span>
                </div>
              ))}
              <p className="text-[10px] font-bold uppercase text-gray-400 tracking-wider pt-2 border-t">Equipment</p>
              {[
                { label: "Available", count: equipment.filter((e) => e.status === "Available").length, color: "bg-green-500" },
                { label: "In Use", count: equipment.filter((e) => e.status === "In Use").length, color: "bg-orange-500" },
                { label: "Maintenance", count: equipment.filter((e) => e.status === "Maintenance").length, color: "bg-red-500" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                    <span className="text-sm text-gray-600">{item.label}</span>
                  </div>
                  <span className="font-semibold text-sm">{item.count}</span>
                </div>
              ))}
              <div className="pt-2 border-t">
                <Button size="sm" variant="outline" className="w-full" asChild>
                  <Link to="/admin/add-facility"><PlusCircle className="h-3.5 w-3.5 mr-1.5" />Add Resources</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ── Bookings ──────────────────────────────────────────────────────────────────
function BookingsSection() {
  const { bookings, updateBookingStatus } = useAppContext();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = bookings.filter((b) => {
    const q = search.toLowerCase();
    return (b.name.toLowerCase().includes(q) || b.id.toLowerCase().includes(q) || b.email.toLowerCase().includes(q))
      && (statusFilter === "All" || b.status === statusFilter);
  }).sort((a, b) => a.submittedAt.localeCompare(b.submittedAt));

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Booking Requests</h2>
        <p className="text-sm text-gray-500">{bookings.length} total requests</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search by name, ID or email..." className="pl-10"
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-44">
            <Filter className="h-4 w-4 mr-2 text-gray-400" /><SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Status</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto rounded-t-xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  {["Researcher", "Resource", "Date & Time", "Requested Date", "Status", "Actions"].map((h, i, arr) => (
                    <th key={h} className={`${h === "Actions" ? "text-right pr-12" : "text-left"} py-3 px-4 font-medium text-gray-600 ${h === "Resource" ? "hidden md:table-cell" : h === "Date & Time" || h === "Requested Date" ? "hidden lg:table-cell" : ""} ${i === 0 ? "rounded-tl-xl" : ""} ${i === arr.length - 1 ? "rounded-tr-xl" : ""}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((b: Booking) => (
                  <tr key={b.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">{b.name}</p>
                      <p className="text-xs text-gray-400">{b.email}</p>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <p className="text-gray-700 text-xs max-w-40 truncate">
                        {b.type === "facility" ? b.facility : b.type === "equipment" ? b.equipment : "Facility + Equipment"}
                      </p>
                      <p className="text-gray-400 text-xs capitalize">{b.type}</p>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell text-xs text-gray-500">{b.date}<br />{b.timeSlot}</td>
                    <td className="py-3 px-4 hidden lg:table-cell text-xs text-gray-500">
                      {new Date(b.submittedAt).toLocaleDateString()}
                      <br />
                      {!isNaN(new Date(b.submittedAt).getTime()) && b.submittedAt.includes('T') && new Date(b.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-4"><StatusPill status={b.status} /></td>
                    <td className="py-3 px-4">
                      <div className="flex justify-end pr-2">
                        <div className="flex items-center gap-3 flex-wrap w-max">
                          {(b.status === "Pending" || b.status === "Approved" || b.status === "Rejected") && (
                            <>
                              {b.status !== "Approved" && (
                                <Button size="sm" variant="ghost" className="h-7 px-2 text-green-600 hover:bg-green-50 text-xs" onClick={() => updateBookingStatus(b.id, "Approved")}>
                                  <CheckCircle className="h-3.5 w-3.5 mr-1" />Approve
                                </Button>
                              )}
                              {b.status !== "Rejected" && (
                                <Button size="sm" variant="ghost" className="h-7 px-2 text-red-600 hover:bg-red-50 text-xs" onClick={() => updateBookingStatus(b.id, "Rejected")}>
                                  <XCircle className="h-3.5 w-3.5 mr-1" />Reject
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-10 text-gray-400">
                <CalendarCheck className="h-10 w-10 mx-auto mb-2 opacity-30" />
                <p>No bookings match your search</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Equipment ─────────────────────────────────────────────────────────────────
function EquipmentSection() {
  const { equipment, facilities, updateEquipmentStatus, deleteEquipment } = useAppContext();
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const filtered = equipment.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.category.toLowerCase().includes(search.toLowerCase()) ||
    e.manufacturer.toLowerCase().includes(search.toLowerCase())
  );

  const cycleStatus = (e: Equipment) => {
    const cycle: Equipment["status"][] = ["Available", "In Use", "Maintenance"];
    updateEquipmentStatus(e.id, cycle[(cycle.indexOf(e.status) + 1) % 3]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Equipment Catalog</h2>
          <p className="text-sm text-gray-500">{equipment.length} instruments registered</p>
        </div>
        <Button asChild><Link to="/admin/add-equipment"><PackagePlus className="h-4 w-4 mr-2" />Add Equipment</Link></Button>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input placeholder="Search equipment..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 hidden sm:table-cell">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 hidden md:table-cell">Manufacturer / Model</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 hidden lg:table-cell">Location</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e: Equipment) => (
                  <tr key={e.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 px-4"><p className="font-medium text-gray-900 max-w-44 truncate">{e.name}</p></td>
                    <td className="py-3 px-4 hidden sm:table-cell">
                      <Badge variant="outline" className="text-xs whitespace-nowrap">{e.category}</Badge>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <p className="text-gray-700">{e.manufacturer}</p>
                      <p className="text-gray-400 text-xs">{e.model}</p>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell text-xs text-gray-500 max-w-36">
                      <span className="truncate block text-slate-700 font-medium">
                        {facilities.find(f => e.location.startsWith(f.name))?.name || "Unknown Facility"}
                      </span>
                      <span className="truncate block text-[10px]">{e.location.split(" - ").slice(1).join(" - ") || e.location}</span>
                    </td>
                    <td className="py-3 px-4"><StatusPill status={e.status} /></td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-blue-600 hover:bg-blue-50" asChild title="Edit equipment">
                          <Link to={`/admin/edit-equipment/${e.id}`}><PencilLine className="h-4 w-4" /></Link>
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 px-2 text-blue-600 hover:bg-blue-50" onClick={() => cycleStatus(e)} title="Cycle status">
                          {e.status === "Available" ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
                        </Button>
                        {confirmDelete === e.id ? (
                          <div className="flex gap-1">
                            <Button size="sm" variant="destructive" className="h-7 px-2 text-xs" onClick={() => { deleteEquipment(e.id); setConfirmDelete(null); }}>Confirm</Button>
                            <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => setConfirmDelete(null)}>Cancel</Button>
                          </div>
                        ) : (
                          <Button size="sm" variant="ghost" className="h-7 px-2 text-red-500 hover:bg-red-50" onClick={() => setConfirmDelete(e.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-10 text-gray-400">
                <FlaskConical className="h-10 w-10 mx-auto mb-2 opacity-30" />
                <p>No equipment found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Facilities ────────────────────────────────────────────────────────────────
function FacilitiesSection({ setActiveSection }: { setActiveSection: (s: Section) => void }) {
  const { facilities, equipment, updateFacilityAvailability, deleteFacility, updateEquipmentStatus } = useAppContext();
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [availFilter, setAvailFilter] = useState("All");
  const [catFilter, setCatFilter] = useState("All");
  const [eqStatusFilter, setEqStatusFilter] = useState("All");

  const categories = Array.from(new Set(facilities.map(f => f.category)));

  const filtered = facilities.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase()) || f.category.toLowerCase().includes(search.toLowerCase());
    const matchesAvail = availFilter === "All" || f.availability === availFilter;
    const matchesCat = catFilter === "All" || f.category === catFilter;

    // For equipment status filter, check if facility has equipment matching that status
    if (eqStatusFilter !== "All") {
      const hasMatchingEq = equipment.some(e => e.location.startsWith(f.name) && e.status === eqStatusFilter);
      return matchesSearch && matchesAvail && matchesCat && hasMatchingEq;
    }

    return matchesSearch && matchesAvail && matchesCat;
  });

  const cycleAvail = (f: Facility) => {
    const cycle: Facility["availability"][] = ["Available", "Limited", "Unavailable"];
    updateFacilityAvailability(f.id, cycle[(cycle.indexOf(f.availability) + 1) % 3]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Research Facilities</h2>
          <p className="text-sm text-gray-500">{facilities.length} facilities registered</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700" asChild>
          <Link to="/admin/add-facility"><PlusCircle className="h-4 w-4 mr-2" />Add Resources</Link>
        </Button>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search facilities..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={availFilter} onValueChange={setAvailFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <Filter className="h-4 w-4 mr-2 text-gray-400" /><SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Status</SelectItem>
            <SelectItem value="Available">Available</SelectItem>
            <SelectItem value="Limited">Limited</SelectItem>
            <SelectItem value="Unavailable">Unavailable</SelectItem>
          </SelectContent>
        </Select>
        <Select value={catFilter} onValueChange={setCatFilter}>
          <SelectTrigger className="w-full sm:w-44">
            <Filter className="h-4 w-4 mr-2 text-gray-400" /><SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Categories</SelectItem>
            {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={eqStatusFilter} onValueChange={setEqStatusFilter}>
          <SelectTrigger className="w-full sm:w-44">
            <Filter className="h-4 w-4 mr-2 text-gray-400" /><SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Equipment</SelectItem>
            <SelectItem value="Available">Equip: Available</SelectItem>
            <SelectItem value="In Use">Equip: In Use</SelectItem>
            <SelectItem value="Maintenance">Equip: Maintenance</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="w-full sm:w-auto ml-auto text-blue-600 border-blue-200 bg-blue-50/50 hover:bg-blue-50 hover:text-blue-700 h-10 px-4" onClick={() => setActiveSection("equipment")}>
          <FlaskConical className="h-4 w-4 mr-2" />
          Equipment
        </Button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((f: Facility) => (
          <Card key={f.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">{f.name}</h3>
                  <div className="flex items-center gap-2 flex-wrap text-xs text-gray-500 mb-2">
                    <span>{f.room}</span>
                    <span>·</span>
                    <span>{f.capacity}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-xs">{f.category}</Badge>
                    <StatusPill status={f.availability} />
                  </div>
                  {f.features.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {f.features.slice(0, 3).map((feat) => (
                        <Badge key={feat} variant="secondary" className="text-[10px]">{feat}</Badge>
                      ))}
                      {f.features.length > 3 && (
                        <Badge variant="secondary" className="text-[10px]">+{f.features.length - 3}</Badge>
                      )}
                    </div>
                  )}

                  {/* Associated Equipment grouped by Category */}
                  {(() => {
                    const associated = equipment.filter(e => e.location.startsWith(f.name));
                    if (associated.length === 0) return null;

                    const grouped = associated.reduce((acc, eq) => {
                      if (!acc[eq.category]) acc[eq.category] = [];
                      acc[eq.category].push(eq);
                      return acc;
                    }, {} as Record<string, Equipment[]>);

                    return (
                      <div className="mt-4 pt-3 border-t border-gray-100/60 space-y-2">
                        <p className="text-[9px] font-bold uppercase text-gray-400 tracking-wider">Associated Equipment</p>
                        <div className="space-y-2">
                          {Object.entries(grouped).map(([cat, eqs]) => (
                            <div key={cat} className="space-y-1">
                              <p className="text-[9px] font-semibold text-blue-500/80 leading-none">{cat}</p>
                              <div className="flex flex-wrap gap-1">
                                {eqs.map(eq => (
                                  <Badge key={eq.id} variant="outline" className="text-[9px] bg-white border-blue-100 text-slate-600 h-5 px-1.5 font-medium">
                                    {eq.name}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })()}
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <Button size="sm" variant="outline" className="h-8 px-2 text-xs" asChild>
                    <Link to={`/admin/edit-facility/${f.id}`}><PencilLine className="h-4 w-4 text-blue-600 mr-1" />Edit</Link>
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 px-2 text-xs" onClick={() => cycleAvail(f)}>
                    {f.availability === "Available" ? <ToggleRight className="h-4 w-4 text-green-600 mr-1" /> : <ToggleLeft className="h-4 w-4 text-gray-400 mr-1" />}
                    Toggle
                  </Button>
                  {confirmDelete === f.id ? (
                    <div className="flex gap-1">
                      <Button size="sm" variant="destructive" className="h-7 px-2 text-xs" onClick={() => { deleteFacility(f.id); setConfirmDelete(null); }}>Del</Button>
                      <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => setConfirmDelete(null)}>No</Button>
                    </div>
                  ) : (
                    <Button size="sm" variant="ghost" className="h-8 px-2 text-red-500 hover:bg-red-50" onClick={() => setConfirmDelete(f.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="md:col-span-2 text-center py-10 text-gray-400">
            <Building2 className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p>No facilities found</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Users ─────────────────────────────────────────────────────────────────────
function UsersSection() {
  const { users, updateUserStatus } = useAppContext();
  const [search, setSearch] = useState("");

  const filtered = users.filter((u) =>
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.institution.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Registered Users</h2>
        <p className="text-sm text-gray-500">{users.length} total accounts</p>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input placeholder="Search by name, email or institution..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 hidden md:table-cell">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 hidden lg:table-cell">Institution</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 hidden sm:table-cell">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u: AppUser) => (
                  <tr key={u.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-900">{u.firstName} {u.lastName}</p>
                      <p className="text-xs text-gray-400">{u.email}</p>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <p className="text-gray-700 text-xs">{u.role}</p>
                      <p className="text-gray-400 text-xs">{u.department}</p>
                    </td>
                    <td className="py-3 px-4 hidden lg:table-cell text-xs text-gray-500">{u.institution}</td>
                    <td className="py-3 px-4 hidden sm:table-cell text-xs text-gray-500">{u.joinedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-10 text-gray-400">
                <Users className="h-10 w-10 mx-auto mb-2 opacity-30" />
                <p>No users found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Main Admin Page ───────────────────────────────────────────────────────────
export function AdminPage() {
  const { currentUser, logout, bookings } = useAppContext();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<Section>("dashboard");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const pendingCount = bookings.filter((b) => b.status === "Pending").length;

  // Redirect non-admins
  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <Card className="max-w-md w-full text-center shadow-2xl">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-3">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-xl">Admin Access Required</CardTitle>
            <CardDescription>You need to sign in as an administrator to access this page.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-slate-50 rounded-lg p-3 text-xs text-gray-600 text-left">
              <p className="font-medium mb-1">Admin Credentials:</p>
              <p>Email: <span className="font-mono">admin@rdcenter.edu</span></p>
              <p>Password: <span className="font-mono">admin123</span></p>
            </div>
            <Button className="w-full" onClick={() => navigate("/login")}>Sign In as Admin</Button>
            <Button variant="outline" className="w-full" onClick={() => navigate("/")}>Back to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const navItems: { id: Section; label: string; icon: LucideIcon; badge?: number }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "bookings", label: "Bookings", icon: CalendarCheck, badge: pendingCount },
    { id: "facilities", label: "Resources", icon: Building2 },
    { id: "users", label: "Users", icon: Users },
  ];

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <div className="h-full bg-gray-50 flex flex-col overflow-hidden">
      {/* Admin Top Bar */}
      <Navbar>
        <Navbar.Brand
          icon={Shield}
          title="Admin Portal"
          subtitle="R&D Center Management"
        />
        <Navbar.Actions>
          <Button size="sm" variant="outline" className="text-gray-600 gap-1.5 border-gray-200 h-8" asChild>
            <Link to="/"><ChevronRight className="h-4 w-4 rotate-180" />Site</Link>
          </Button>
        </Navbar.Actions>
      </Navbar>

      <div className="flex-1 overflow-hidden w-full flex bg-white">
        <div className="flex w-full h-full">
          {/* Sidebar — desktop */}
          <Sidebar>
            <Sidebar.Nav>
              <Sidebar.Section title="Management">
                {navItems.map(({ id, label, icon: Icon, badge }) => (
                  <Sidebar.Item
                    key={id}
                    label={label}
                    icon={Icon}
                    isActive={activeSection === id}
                    onClick={() => setActiveSection(id)}
                    badge={badge}
                  />
                ))}
              </Sidebar.Section>
            </Sidebar.Nav>
            <Sidebar.Profile
              onSettingsClick={() => setActiveSection("settings")}
              onLogoutClick={() => setIsLogoutOpen(true)}
            />
          </Sidebar>

          <main className="flex-1 overflow-y-auto custom-scrollbar bg-gradient-to-br from-blue-50 to-cyan-50">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
              {activeSection === "dashboard" && <DashboardSection setSection={setActiveSection} />}
              {activeSection === "bookings" && <BookingsSection />}
              {activeSection === "equipment" && <EquipmentSection />}
              {activeSection === "facilities" && <FacilitiesSection setActiveSection={setActiveSection} />}
              {activeSection === "users" && <UsersSection />}
              {activeSection === "settings" && <SettingsContent />}
            </div>
          </main>
        </div>
      </div>
      <LogoutModal
        open={isLogoutOpen}
        onOpenChange={setIsLogoutOpen}
        onConfirm={handleLogout}
      />
    </div >
  );
}
