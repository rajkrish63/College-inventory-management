import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  getEquipment as fsGetEquipment,
  getFacilities as fsGetFacilities,
  getBookings as fsGetBookings,
  getUsers as fsGetUsers,
  addEquipmentDoc,
  updateEquipmentDoc,
  deleteEquipmentDoc,
  addFacilityDoc,
  updateFacilityDoc,
  deleteFacilityDoc,
  addBookingDoc,
  updateBookingDoc,
  addUserDoc,
  updateUserDoc,
  updateUserStatusDoc,
  batchUpdateEquipment as fsBatchUpdateEquipment,
} from "../services/firestoreService";
import { auth } from "../../firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

// ── Types ────────────────────────────────────────────────────────────────────

export interface Equipment {
  id: string; // Changed to string for Firestore consistency
  equipmentName: string;
  equipmentCategory: string;
  initialStatus: "Available" | "In Use" | "Maintenance";
  manufacturer: string;
  modelNumber: string;
  instrumentDescription: string;
  technicalSpecifications: string[];
  researchApplications: string[];
  facilityId: string; // Changed to string
}

export interface Facility {
  id: string; // Changed to string
  facilityName: string;
  facilityCategory: string;
  availabilityStatus: "Available" | "Limited" | "Unavailable";
  capacity: number;
  roomLocation: string;
  spaceDescription: string;
  keyFacilityFeatures: string[];
  createdAt: string;
  image?: string; // Kept for UI
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
  persons?: number;
  quantity?: number;
}

export interface AppUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  institution: string;
  role: string;
  phone: string;
  // Make idProof optional to avoid breaking existing users without proofs yet
  idProof?: string;
  status: "Active" | "Pending" | "Inactive";
  joinedAt: string;
  profilePic?: string;
  researchInterests?: string[];
}

export interface AuthUser {
  id: string | "admin";
  name: string;
  email: string;
  role: "admin" | "researcher";
  profilePic?: string;
}

// ── Initial Data ─────────────────────────────────────────────────────────────
// Hardcoded data removed to ensure 100% Firebase integration.

// ── Context Type ──────────────────────────────────────────────────────────────

interface AppContextType {
  // Auth
  currentUser: AuthUser | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUserProfile: (updates: {
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    profilePic?: string;
    idProof?: string;
  }) => void;

  // Facilities
  facilities: Facility[];
  addFacility: (facility: Omit<Facility, "id">) => void;
  updateFacility: (id: string, updates: Partial<Omit<Facility, "id">>) => void;
  updateFacilityAvailability: (id: string, availabilityStatus: Facility["availabilityStatus"]) => void;
  deleteFacility: (id: string) => void;
  addFacilityWithEquipment: (facility: Omit<Facility, "id">, items: Omit<Equipment, "id">[]) => Promise<void>;

  // Equipment
  equipment: Equipment[];
  addEquipment: (facilityId: string, item: Omit<Equipment, "id">) => Promise<void>;
  updateEquipment: (facilityId: string, id: string, updates: Partial<Omit<Equipment, "id">>) => Promise<void>;
  updateEquipmentStatus: (facilityId: string, id: string, initialStatus: Equipment["initialStatus"]) => void;
  deleteEquipment: (facilityId: string, id: string) => void;
  updateEquipmentBatch: (facilityId: string, updates: { id?: string, data: Equipment }[]) => Promise<void>;

  // Bookings
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, "id" | "status" | "submittedAt">) => string;
  updateBookingStatus: (id: string, status: Booking["status"]) => void;

  // Users
  users: AppUser[];
  registerUser: (user: Omit<AppUser, "id" | "status" | "joinedAt"> & { password?: string }) => Promise<{ success: boolean; error?: string }>;
  updateUserStatus: (id: string, status: AppUser["status"]) => void;
}

// ── Context ───────────────────────────────────────────────────────────────────

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [nextEquipId, setNextEquipId] = useState(1);
  const [nextFacilityId, setNextFacilityId] = useState(1);

  // ── Load data from Firestore on mount ──────────────────────────────────
  useEffect(() => {
    async function loadFromFirestore() {
      try {
        const [fsEquip, fsFac, fsBook, fsUsr] = await Promise.all([
          fsGetEquipment(),
          fsGetFacilities(),
          fsGetBookings(),
          fsGetUsers(),
        ]);
        setEquipment(fsEquip);
        if (fsEquip.length > 0) {
          setNextEquipId(Math.max(...fsEquip.map(e => parseInt(e.id) || 0)) + 1);
        }
        setFacilities(fsFac);
        if (fsFac.length > 0) {
          setNextFacilityId(Math.max(...fsFac.map(f => parseInt(f.id) || 0)) + 1);
        }
        setBookings(fsBook);
        setUsers(fsUsr);
        console.log("✅ Loaded data from Firestore");
      } catch (err) {
        console.warn("⚠️ Could not load from Firestore, using local data:", err);
      }
    }
    loadFromFirestore();
  }, []);

  // ── Auth Listener ──────────────────────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        // Find user info in our users list or create a basic one
        // Note: For a robust app, we'd fetch this from Firestore here
        const existing = users.find(u => u.id === fbUser.uid);
        if (existing) {
          setCurrentUser({
            id: existing.id,
            name: `${existing.firstName} ${existing.lastName}`,
            email: existing.email,
            role: (fbUser.email === "clginventorymanagement@gmail.com" ? "admin" : "researcher"),
            profilePic: existing.profilePic
          });
        } else if (fbUser.email === "clginventorymanagement@gmail.com") {
          setCurrentUser({
            id: fbUser.uid,
            name: "Admin",
            email: fbUser.email,
            role: "admin"
          });
        } else {
          // Fallback if user document hasn't loaded yet or doesn't exist
          setCurrentUser({
            id: fbUser.uid,
            name: fbUser.displayName || fbUser.email?.split('@')[0] || "Researcher",
            email: fbUser.email || "",
            role: "researcher"
          });
        }
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, [users]);

  // Auth
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim();
    const cleanPass = password.trim();

    try {
      await signInWithEmailAndPassword(auth, cleanEmail, cleanPass);
      return { success: true };
    } catch (error: any) {

      // Auto-Provisioning for Admin
      if (cleanEmail === "clginventorymanagement@gmail.com" && cleanPass === "password1234@mce") {
        try {
          // Attempt to create if login failed for any reason other than wrong password
          if (error.code !== 'auth/wrong-password') {
            const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, cleanPass);
            const fbUser = userCredential.user;

            const adminUser: AppUser = {
              id: fbUser.uid,
              firstName: "Super",
              lastName: "Admin",
              email: cleanEmail,
              role: "admin",
              status: "Active",
              joinedAt: new Date().toISOString().split("T")[0],
              department: "Administration",
              institution: "MCE R&D Center",
              phone: "+1 (555) 000-0000"
            };

            setUsers(prev => [...prev, adminUser]);
            await addUserDoc(adminUser);
            return { success: true };
          }
        } catch (createError: any) {
          return { success: false, error: "Initial setup failed: " + (createError.code === 'auth/operation-not-allowed' ? "Email/Password auth is disabled in your Firebase Dashboard." : createError.message) };
        }
      }

      let message = "Invalid email or password.";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        message = "Account not found. Please register first.";
      } else if (error.code === 'auth/wrong-password') {
        message = "Incorrect password. Please try again.";
      } else if (error.code === 'auth/too-many-requests') {
        message = "Too many failed attempts. Please try again later.";
      }
      return { success: false, error: message };
    }
  };

  const logout = () => signOut(auth);

  const updateUserProfile = (updates: { name?: string; email?: string; phone?: string; password?: string; profilePic?: string; idProof?: string; }) => {
    if (!currentUser) return;

    // Update currentUser state (only name, email, and profilePic are exposed to AuthUser)
    setCurrentUser(prev => prev ? {
      ...prev,
      ...(updates.name && { name: updates.name }),
      ...(updates.email && { email: updates.email }),
      ...(updates.profilePic !== undefined && { profilePic: updates.profilePic })
    } : null);

    // Synchronize with users list
    if (currentUser.id !== "admin") {
      setUsers(prev => prev.map(u => {
        if (u.id === currentUser.id) {
          const [firstName = "", ...lastNameParts] = (updates.name || `${u.firstName} ${u.lastName}`).split(" ");
          const lastName = lastNameParts.join(" ");
          return {
            ...u,
            firstName,
            lastName,
            email: updates.email || u.email,
            ...(updates.phone && { phone: updates.phone }),
            ...(updates.profilePic !== undefined && { profilePic: updates.profilePic }),
            ...(updates.idProof !== undefined && { idProof: updates.idProof })
          };
        }
        return u;
      }));

      // Sync to Firestore
      const userId = currentUser.id as string;
      const [firstName = "", ...lastNameParts] = (updates.name || "").split(" ");
      const firestoreUpdates: Record<string, unknown> = {};
      if (updates.name) { firestoreUpdates.firstName = firstName; firestoreUpdates.lastName = lastNameParts.join(" "); }
      if (updates.email) firestoreUpdates.email = updates.email;
      if (updates.phone) firestoreUpdates.phone = updates.phone;
      if (updates.profilePic !== undefined) firestoreUpdates.profilePic = updates.profilePic;
      if (updates.idProof !== undefined) firestoreUpdates.idProof = updates.idProof;
      if (Object.keys(firestoreUpdates).length > 0) {
        updateUserDoc(userId, firestoreUpdates as Partial<AppUser>).catch(console.error);
      }
    }
  };

  // Equipment (Note: Updated to use facilityId for Firestore subcollections)
  const addEquipment = async (facilityId: string, item: Omit<Equipment, "id">) => {
    const newItem = { ...item, id: String(nextEquipId), facilityId } as Equipment;
    setEquipment((prev) => [...prev, newItem]);
    setNextEquipId((n) => n + 1);
    await addEquipmentDoc(facilityId, newItem);
  };
  const updateEquipment = async (facilityId: string, id: string, updates: Partial<Omit<Equipment, "id">>) => {
    setEquipment((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
    await updateEquipmentDoc(facilityId, id, updates as Partial<Equipment>);
  };
  const updateEquipmentStatus = (facilityId: string, id: string, initialStatus: Equipment["initialStatus"]) => {
    setEquipment((prev) => prev.map((e) => (e.id === id ? { ...e, initialStatus } : e)));
    updateEquipmentDoc(facilityId, id, { initialStatus }).catch(console.error);
  };
  const deleteEquipment = (facilityId: string, id: string) => {
    setEquipment((prev) => prev.filter((e) => e.id !== id));
    deleteEquipmentDoc(facilityId, id).catch(console.error);
  };

  const updateEquipmentBatch = async (facilityId: string, updates: { id?: string, data: Equipment }[]) => {
    // Update local state first
    setEquipment(prev => {
      let current = [...prev];
      updates.forEach(({ id, data }) => {
        if (id) {
          current = current.map(e => e.id === id ? data : e);
        } else {
          current.push(data);
        }
      });
      return current;
    });
    // Then sync with Firestore
    await fsBatchUpdateEquipment(facilityId, updates);
  };

  // Facilities
  const addFacility = async (facility: Omit<Facility, "id">) => {
    const newFac = { ...facility, id: String(nextFacilityId) } as Facility;
    setFacilities((prev) => [...prev, newFac]);
    setNextFacilityId((n) => n + 1);
    await addFacilityDoc(newFac);
  };

  const addFacilityWithEquipment = async (facility: Omit<Facility, "id">, items: Omit<Equipment, "id">[]) => {
    const fId = String(nextFacilityId);
    const newFac = { ...facility, id: fId } as Facility;
    setFacilities((prev) => [...prev, newFac]);
    setNextFacilityId((n) => n + 1);
    await addFacilityDoc(newFac);

    const newEquipments = items.map((item, index) => ({
      ...item,
      id: String(nextEquipId + index),
      facilityId: fId
    } as Equipment));
    setEquipment((prev) => [...prev, ...newEquipments]);
    setNextEquipId((n) => n + items.length);
    for (const eq of newEquipments) {
      await addEquipmentDoc(fId, eq);
    }
  };
  const updateFacility = async (id: string, updates: Partial<Omit<Facility, "id">>) => {
    setFacilities((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
    await updateFacilityDoc(id, updates as Partial<Facility>);
  };
  const updateFacilityAvailability = (id: string, availabilityStatus: Facility["availabilityStatus"]) => {
    setFacilities((prev) => prev.map((f) => (f.id === id ? { ...f, availabilityStatus } : f)));
    updateFacilityDoc(id, { availabilityStatus }).catch(console.error);
  };
  const deleteFacility = (id: string) => {
    setFacilities((prev) => prev.filter((f) => f.id !== id));
    deleteFacilityDoc(id).catch(console.error);
  };

  // Bookings
  const addBooking = (booking: Omit<Booking, "id" | "status" | "submittedAt">): string => {
    const id = `RD - ${1000 + bookings.length + 1} `;
    const submittedAt = new Date().toISOString();
    const newBooking = { ...booking, id, status: "Pending" as const, submittedAt };
    setBookings((prev) => [...prev, newBooking]);
    addBookingDoc(newBooking).catch(console.error);
    return id;
  };
  const updateBookingStatus = (id: string, status: Booking["status"]) => {
    setBookings((prev) => {
      const updated = prev.map((b) => (b.id === id ? { ...b, status } : b));

      // Resource Status Automation on Approval
      if (status === "Approved") {
        const booking = prev.find(b => b.id === id);
        if (booking) {
          // 1. Automate Facility Availability
          if (booking.facility) {
            const fac = facilities.find(f => f.facilityName === booking.facility);
            if (fac) {
              const persons = booking.persons || 1;
              const newStatus = persons >= fac.capacity ? "Unavailable" : "Limited";
              updateFacilityAvailability(fac.id, newStatus);
            }
          }
          // 2. Automate Equipment Status
          if (booking.equipment) {
            const eq = equipment.find(e => e.equipmentName === booking.equipment);
            if (eq) {
              // Maintenance is manual only, so we only automate "In Use"
              updateEquipmentStatus(eq.facilityId, eq.id, "In Use");
            }
          }
        }
      }

      return updated;
    });
    updateBookingDoc(id, { status }).catch(console.error);
  };

  // Users
  const registerUser = async (user: Omit<AppUser, "id" | "status" | "joinedAt"> & { password?: string }): Promise<{ success: boolean; error?: string }> => {
    try {
      if (user.email === "clginventorymanagement@gmail.com") return { success: false, error: "This email is reserved." };

      const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password!);
      const fbUser = userCredential.user;

      const today = new Date().toISOString().split("T")[0];
      const newUser: AppUser = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        department: user.department,
        institution: user.institution,
        role: user.role,
        phone: user.phone,
        idProof: user.idProof,
        researchInterests: user.researchInterests,
        id: fbUser.uid,
        status: "Active",
        joinedAt: today
      };

      setUsers((prev) => [...prev, newUser]);
      await addUserDoc(newUser);

      return { success: true };
    } catch (error: any) {
      let errorMessage = "An error occurred during registration.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already registered. Please sign in instead.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Password is too weak. Please use at least 6 characters.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email format.";
      } else {
        errorMessage = error.message || "Registration failed. Please try again.";
      }
      return { success: false, error: errorMessage };
    }
  };
  const updateUserStatus = (id: string, status: AppUser["status"]) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
    updateUserStatusDoc(id, status).catch(console.error);
  };

  return (
    <AppContext.Provider value={{
      currentUser, login, logout, updateUserProfile,
      equipment, addEquipment, updateEquipment, updateEquipmentStatus, deleteEquipment,
      updateEquipmentBatch,
      facilities, addFacility, updateFacility, updateFacilityAvailability,
      deleteFacility,
      addFacilityWithEquipment,
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
