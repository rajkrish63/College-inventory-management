import { createContext, useContext, useState, ReactNode } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

export interface Equipment {
  id: number;
  name: string;
  category: string;
  manufacturer: string;
  model: string;
  location: string;
  status: "Available" | "In Use" | "Maintenance";
  description: string;
  specifications: string[];
  applications: string[];
}

export interface Facility {
  id: number;
  name: string;
  category: string;
  description: string;
  capacity: string;
  availability: "Available" | "Limited" | "Unavailable";
  features: string[];
  room: string;
  image: string;
}

export interface Booking {
  id: string;
  name: string;
  email: string;
  department: string;
  type: string;
  facility: string;
  equipment: string;
  date: string;
  timeSlot: string;
  purpose: string;
  status: "Pending" | "Approved" | "Rejected";
  submittedAt: string;
}

export interface AppUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  department: string;
  institution: string;
  role: string;
  phone: string;
  status: "Active" | "Pending" | "Inactive";
  joinedAt: string;
}

export interface AuthUser {
  id: number | "admin";
  name: string;
  email: string;
  role: "admin" | "researcher";
}

// ── Initial Data ─────────────────────────────────────────────────────────────

const initialEquipment: Equipment[] = [
  { id: 1, name: "Gas Chromatography-Mass Spectrometry", category: "Analytical Chemistry", manufacturer: "Agilent", model: "7890B GC-MS", location: "Chemistry Lab - Room 101", status: "Available", description: "High-performance GC-MS system for compound identification and quantification.", specifications: ["EI/CI sources", "Triple-axis detector", "0.1-1050 m/z range"], applications: ["Metabolomics", "Environmental analysis", "Food safety"] },
  { id: 2, name: "Scanning Electron Microscope", category: "Materials Characterization", manufacturer: "JEOL", model: "JSM-7800F", location: "Materials Lab - Room 205", status: "In Use", description: "Field emission SEM with high resolution imaging and EDX capabilities.", specifications: ["1.0 nm resolution", "30 kV max voltage", "EDX detector"], applications: ["Surface morphology", "Elemental analysis", "Nanostructure imaging"] },
  { id: 3, name: "Real-Time PCR System", category: "Molecular Biology", manufacturer: "Bio-Rad", model: "CFX384 Touch", location: "Biotech Suite - Room 150", status: "Available", description: "384-well real-time PCR system for gene expression and genotyping.", specifications: ["384-well format", "6 channels", "Peltier thermal cycler"], applications: ["Gene expression", "SNP genotyping", "Copy number variation"] },
  { id: 4, name: "X-Ray Diffractometer", category: "Materials Characterization", manufacturer: "Bruker", model: "D8 Advance", location: "Materials Lab - Room 210", status: "Available", description: "Powder X-ray diffraction system for crystal structure analysis.", specifications: ["Cu Kα radiation", "Theta-theta geometry", "LynxEye detector"], applications: ["Phase identification", "Crystallinity analysis", "Lattice parameters"] },
  { id: 5, name: "Flow Cytometer", category: "Cell Biology", manufacturer: "BD Biosciences", model: "FACSAria III", location: "Biotech Suite - Room 155", status: "Available", description: "High-speed cell sorter with multi-parameter analysis capabilities.", specifications: ["5 lasers", "18 parameters", "BSL-2 certified"], applications: ["Cell sorting", "Immunophenotyping", "Cell cycle analysis"] },
  { id: 6, name: "Nuclear Magnetic Resonance Spectrometer", category: "Analytical Chemistry", manufacturer: "Bruker", model: "Avance Neo 600", location: "NMR Facility - Room 120", status: "Maintenance", description: "600 MHz NMR for structural elucidation and molecular dynamics.", specifications: ["600 MHz", "Cryoprobe", "Automation capability"], applications: ["Structure determination", "Reaction monitoring", "Metabolomics"] },
  { id: 7, name: "Atomic Force Microscope", category: "Materials Characterization", manufacturer: "Park Systems", model: "NX10", location: "Clean Room - Room 300", status: "Available", description: "High-resolution AFM for nanoscale surface imaging and analysis.", specifications: ["0.5 nm lateral resolution", "Multiple modes", "Environmental control"], applications: ["Surface roughness", "Nanoparticle imaging", "Mechanical properties"] },
  { id: 8, name: "High-Performance Liquid Chromatography", category: "Analytical Chemistry", manufacturer: "Waters", model: "Acquity UPLC H-Class", location: "Chemistry Lab - Room 105", status: "Available", description: "Ultra-performance liquid chromatography with PDA detector.", specifications: ["UPLC technology", "PDA detector", "Quaternary pump"], applications: ["Pharmaceuticals", "Natural products", "Quality control"] },
  { id: 9, name: "Confocal Laser Scanning Microscope", category: "Cell Biology", manufacturer: "Leica", model: "TCS SP8", location: "Imaging Center - Room 180", status: "In Use", description: "Advanced confocal system for live cell imaging and 3D reconstruction.", specifications: ["4 laser lines", "Spectral detection", "Environmental chamber"], applications: ["Live cell imaging", "Co-localization", "3D reconstruction"] },
  { id: 10, name: "Thermal Analysis System", category: "Materials Characterization", manufacturer: "TA Instruments", model: "Discovery DSC 2500", location: "Materials Lab - Room 215", status: "Available", description: "Differential scanning calorimetry for thermal property analysis.", specifications: ["-90°C to 550°C", "Tzero technology", "Auto-sampler"], applications: ["Glass transition", "Melting point", "Thermal stability"] },
  { id: 11, name: "Spectrophotometer", category: "Analytical Chemistry", manufacturer: "PerkinElmer", model: "Lambda 1050+", location: "Chemistry Lab - Room 110", status: "Available", description: "UV-Vis-NIR spectrophotometer for optical characterization.", specifications: ["175-3300 nm range", "Double beam", "InGaAs detector"], applications: ["Absorbance", "Transmittance", "Optical properties"] },
  { id: 12, name: "Electrochemical Workstation", category: "Electrochemistry", manufacturer: "Metrohm", model: "Autolab PGSTAT302N", location: "Chemistry Lab - Room 115", status: "Available", description: "Multi-channel potentiostat/galvanostat for electrochemical analysis.", specifications: ["±10V compliance", "2.5 A current", "FRA module"], applications: ["Cyclic voltammetry", "EIS", "Battery testing"] },
];

const initialFacilities: Facility[] = [
  { id: 1, name: "Advanced Chemistry Laboratory", category: "Chemistry", description: "Fully equipped analytical and synthetic chemistry lab with fume hoods, spectroscopy equipment, and chemical storage.", capacity: "20 researchers", availability: "Available", features: ["GC-MS", "HPLC", "NMR Spectrometer", "Fume Hoods"], room: "Building A, Room 101-110", image: "https://images.unsplash.com/photo-1707944746058-4da338d0f827?w=800&q=80" },
  { id: 2, name: "Molecular Biology Suite", category: "Biotechnology", description: "Sterile environment for cell culture, genetic analysis, and molecular biology research with BSL-2 certification.", capacity: "15 researchers", availability: "Limited", features: ["PCR Machines", "Cell Culture Facility", "Flow Cytometer", "DNA Sequencer"], room: "Building B, Room 150-160", image: "https://images.unsplash.com/photo-1732400333616-8efa4f385a03?w=800&q=80" },
  { id: 3, name: "Clean Room Facility", category: "Materials Science", description: "ISO Class 7 clean room for nanofabrication, semiconductor processing, and sensitive material preparation.", capacity: "8 researchers", availability: "Available", features: ["Electron Microscope", "Spin Coater", "Plasma Etcher", "Controlled Environment"], room: "Building C, Room 300", image: "https://images.unsplash.com/photo-1765830403209-a5eceac4c198?w=800&q=80" },
  { id: 4, name: "Electronics & Instrumentation Lab", category: "Electronics", description: "Advanced electronics workstations for circuit design, testing, and microcontroller development.", capacity: "12 researchers", availability: "Available", features: ["Oscilloscopes", "Signal Generators", "PCB Fabrication", "3D Printer"], room: "Building A, Room 200-210", image: "https://images.unsplash.com/photo-1759866042499-d0b3e9d87ceb?w=800&q=80" },
  { id: 5, name: "Materials Characterization Center", category: "Materials Science", description: "Comprehensive suite of instruments for material analysis, testing, and characterization.", capacity: "10 researchers", availability: "Available", features: ["XRD", "SEM", "TEM", "AFM", "Tensile Tester"], room: "Building D, Room 400-415", image: "https://images.unsplash.com/photo-1707944746058-4da338d0f827?w=800&q=80" },
  { id: 6, name: "High-Performance Computing Lab", category: "Computing", description: "Dedicated computational resources for data analysis, simulation, and machine learning research.", capacity: "25 researchers", availability: "Available", features: ["GPU Cluster", "HPC Nodes", "Data Storage", "Visualization Suite"], room: "Building E, Room 500-510", image: "https://images.unsplash.com/photo-1765830403209-a5eceac4c198?w=800&q=80" },
];

const initialBookings: Booking[] = [
  { id: "RD-1001", name: "Dr. Sarah Chen", email: "s.chen@mit.edu", department: "Chemistry Dept., MIT", type: "equipment", facility: "", equipment: "GC-MS (Gas Chromatography-Mass Spectrometry)", date: "2026-03-10", timeSlot: "10:00 - 12:00", purpose: "Analysis of metabolite compounds in biological samples for cancer research.", status: "Pending", submittedAt: "2026-03-01" },
  { id: "RD-1002", name: "Prof. James Wright", email: "j.wright@stanford.edu", department: "Materials Science, Stanford", type: "facility", facility: "Clean Room Facility", equipment: "", date: "2026-03-12", timeSlot: "08:00 - 10:00", purpose: "Nanofabrication of thin-film solar cell prototypes for renewable energy study.", status: "Approved", submittedAt: "2026-02-28" },
  { id: "RD-1003", name: "Dr. Aisha Patel", email: "a.patel@caltech.edu", department: "Molecular Biology, Caltech", type: "equipment", facility: "", equipment: "Real-Time PCR System", date: "2026-03-08", timeSlot: "14:00 - 16:00", purpose: "Gene expression profiling for CRISPR-edited cell lines in immunotherapy research.", status: "Approved", submittedAt: "2026-02-25" },
  { id: "RD-1004", name: "Dr. Marcus Lee", email: "m.lee@berkeley.edu", department: "Physics, UC Berkeley", type: "both", facility: "Materials Characterization Center", equipment: "X-Ray Diffractometer", date: "2026-03-15", timeSlot: "12:00 - 14:00", purpose: "Crystal structure analysis of newly synthesized quantum dot materials.", status: "Pending", submittedAt: "2026-03-02" },
  { id: "RD-1005", name: "Dr. Elena Rossi", email: "e.rossi@harvard.edu", department: "Biochemistry, Harvard", type: "facility", facility: "Molecular Biology Suite", equipment: "", date: "2026-03-20", timeSlot: "10:00 - 12:00", purpose: "Cell culture experiments for protein folding study in neurodegenerative diseases.", status: "Rejected", submittedAt: "2026-02-20" },
  { id: "RD-1006", name: "Mr. David Kim", email: "d.kim@gatech.edu", department: "Electrical Engineering, Georgia Tech", type: "facility", facility: "Electronics & Instrumentation Lab", equipment: "", date: "2026-03-18", timeSlot: "16:00 - 18:00", purpose: "Testing custom PCB designs for IoT sensor node development project.", status: "Pending", submittedAt: "2026-03-03" },
];

const initialUsers: AppUser[] = [
  { id: 1, firstName: "Sarah", lastName: "Chen", email: "s.chen@mit.edu", password: "pass1234", department: "Chemistry", institution: "MIT", role: "Principal Investigator", phone: "+1-617-555-0101", status: "Active", joinedAt: "2025-09-15" },
  { id: 2, firstName: "James", lastName: "Wright", email: "j.wright@stanford.edu", password: "pass1234", department: "Materials Science", institution: "Stanford University", role: "Professor", phone: "+1-650-555-0202", status: "Active", joinedAt: "2025-10-01" },
  { id: 3, firstName: "Aisha", lastName: "Patel", email: "a.patel@caltech.edu", password: "pass1234", department: "Molecular Biology", institution: "Caltech", role: "Post-Doctoral Researcher", phone: "+1-626-555-0303", status: "Active", joinedAt: "2025-11-20" },
  { id: 4, firstName: "Marcus", lastName: "Lee", email: "m.lee@berkeley.edu", password: "pass1234", department: "Physics", institution: "UC Berkeley", role: "PhD Student", phone: "+1-510-555-0404", status: "Pending", joinedAt: "2026-01-10" },
  { id: 5, firstName: "Elena", lastName: "Rossi", email: "e.rossi@harvard.edu", password: "pass1234", department: "Biochemistry", institution: "Harvard University", role: "Associate Professor", phone: "+1-617-555-0505", status: "Inactive", joinedAt: "2025-08-05" },
  { id: 6, firstName: "David", lastName: "Kim", email: "d.kim@gatech.edu", password: "pass1234", department: "Electrical Engineering", institution: "Georgia Tech", role: "Graduate Researcher", phone: "+1-404-555-0606", status: "Pending", joinedAt: "2026-03-03" },
];

// ── Context Type ──────────────────────────────────────────────────────────────

interface AppContextType {
  // Auth
  currentUser: AuthUser | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  updateUserProfile: (updates: { name?: string; email?: string }) => void;

  // Equipment
  equipment: Equipment[];
  addEquipment: (item: Omit<Equipment, "id">) => void;
  updateEquipmentStatus: (id: number, status: Equipment["status"]) => void;
  deleteEquipment: (id: number) => void;

  // Facilities
  facilities: Facility[];
  addFacility: (facility: Omit<Facility, "id">) => void;
  updateFacilityAvailability: (id: number, availability: Facility["availability"]) => void;
  deleteFacility: (id: number) => void;

  // Bookings
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, "id" | "status" | "submittedAt">) => string;
  updateBookingStatus: (id: string, status: Booking["status"]) => void;

  // Users
  users: AppUser[];
  registerUser: (user: Omit<AppUser, "id" | "status" | "joinedAt">) => { success: boolean; error?: string };
  updateUserStatus: (id: number, status: AppUser["status"]) => void;
}

// ── Context ───────────────────────────────────────────────────────────────────

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [equipment, setEquipment] = useState<Equipment[]>(initialEquipment);
  const [facilities, setFacilities] = useState<Facility[]>(initialFacilities);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [users, setUsers] = useState<AppUser[]>(initialUsers);
  const [nextEquipId, setNextEquipId] = useState(13);
  const [nextFacilityId, setNextFacilityId] = useState(7);
  const [nextUserId, setNextUserId] = useState(7);

  // Auth
  const login = (email: string, password: string): { success: boolean; error?: string } => {
    // Admin credentials
    if (email === "admin@rdcenter.edu" && password === "admin123") {
      setCurrentUser({ id: "admin", name: "Admin", email, role: "admin" });
      return { success: true };
    }
    // Regular users
    const user = users.find((u) => u.email === email && u.password === password);
    if (user) {
      if (user.status === "Inactive") return { success: false, error: "Your account has been deactivated. Contact admin." };
      if (user.status === "Pending") return { success: false, error: "Your account is pending approval." };
      setCurrentUser({ id: user.id, name: `${user.firstName} ${user.lastName}`, email: user.email, role: "researcher" });
      return { success: true };
    }
    return { success: false, error: "Invalid email or password." };
  };

  const logout = () => setCurrentUser(null);

  const updateUserProfile = (updates: { name?: string; email?: string }) => {
    if (!currentUser) return;

    // Update currentUser state
    setCurrentUser(prev => prev ? { ...prev, ...updates } : null);

    // Synchronize with users list
    if (currentUser.id !== "admin") {
      setUsers(prev => prev.map(u => {
        if (u.id === currentUser.id) {
          const [firstName = "", ...lastNameParts] = (updates.name || "").split(" ");
          const lastName = lastNameParts.join(" ");
          return {
            ...u,
            firstName: updates.name ? firstName : u.firstName,
            lastName: updates.name ? lastName : u.lastName,
            email: updates.email || u.email
          };
        }
        return u;
      }));
    }
  };

  // Equipment
  const addEquipment = (item: Omit<Equipment, "id">) => {
    setEquipment((prev) => [...prev, { ...item, id: nextEquipId }]);
    setNextEquipId((n) => n + 1);
  };
  const updateEquipmentStatus = (id: number, status: Equipment["status"]) =>
    setEquipment((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
  const deleteEquipment = (id: number) =>
    setEquipment((prev) => prev.filter((e) => e.id !== id));

  // Facilities
  const addFacility = (facility: Omit<Facility, "id">) => {
    setFacilities((prev) => [...prev, { ...facility, id: nextFacilityId }]);
    setNextFacilityId((n) => n + 1);
  };
  const updateFacilityAvailability = (id: number, availability: Facility["availability"]) =>
    setFacilities((prev) => prev.map((f) => (f.id === id ? { ...f, availability } : f)));
  const deleteFacility = (id: number) =>
    setFacilities((prev) => prev.filter((f) => f.id !== id));

  // Bookings
  const addBooking = (booking: Omit<Booking, "id" | "status" | "submittedAt">): string => {
    const id = `RD-${1000 + bookings.length + 1}`;
    const today = new Date().toISOString().split("T")[0];
    setBookings((prev) => [...prev, { ...booking, id, status: "Pending", submittedAt: today }]);
    return id;
  };
  const updateBookingStatus = (id: string, status: Booking["status"]) =>
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));

  // Users
  const registerUser = (user: Omit<AppUser, "id" | "status" | "joinedAt">): { success: boolean; error?: string } => {
    if (user.email === "admin@rdcenter.edu") return { success: false, error: "This email is reserved." };
    if (users.find((u) => u.email === user.email)) return { success: false, error: "An account with this email already exists." };
    const today = new Date().toISOString().split("T")[0];
    setUsers((prev) => [...prev, { ...user, id: nextUserId, status: "Pending", joinedAt: today }]);
    setNextUserId((n) => n + 1);
    return { success: true };
  };
  const updateUserStatus = (id: number, status: AppUser["status"]) =>
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));

  return (
    <AppContext.Provider value={{
      currentUser, login, logout, updateUserProfile,
      equipment, addEquipment, updateEquipmentStatus, deleteEquipment,
      facilities, addFacility, updateFacilityAvailability, deleteFacility,
      bookings, addBooking, updateBookingStatus,
      users, registerUser, updateUserStatus,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppContextProvider");
  return ctx;
}
