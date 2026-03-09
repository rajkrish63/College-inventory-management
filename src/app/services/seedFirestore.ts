import {
    addEquipmentDoc,
    addFacilityDoc,
    addBookingDoc,
    addUserDoc,
    clearAllCollections,
} from "./firestoreService";
import { db } from "../../firebase";
import { setDoc, doc } from "firebase/firestore";
import type { Equipment, Facility, Booking, AppUser } from "../context/AppContext";

const labData: Record<string, any> = {
    CHEMISTRY_LAB: {
        id: "f1",
        facilityName: "Advanced Chemistry Laboratory",
        roomLocation: "Block A - 101",
        spaceDescription: "Leading facility for chemical analysis, organic synthesis, and material characterization. Equipped with high-end spectroscopy and safety systems.",
        image: "https://images.unsplash.com/photo-1707944746058-4da338d0f827?w=800&q=80",
        categories: {
            "Analytical Instruments": ["UV-Visible Spectrophotometer", "FTIR Spectrometer", "Gas Chromatography (GC)", "High Performance Liquid Chromatography (HPLC)", "Atomic Absorption Spectrometer"],
            "Material Characterization": ["X-Ray Diffraction (XRD)", "Thermal Gravimetric Analyzer (TGA)", "Differential Scanning Calorimeter (DSC)", "Particle Size Analyzer", "Surface Area Analyzer"],
            "General Lab Equipment": ["Digital pH Meter", "Magnetic Stirrer", "Hot Air Oven", "Muffle Furnace", "Vacuum Pump"],
            "Organic Synthesis Equipment": ["Rotary Evaporator", "Soxhlet Extraction Apparatus", "Vacuum Distillation Unit", "Heating Mantle", "Nitrogen Gas Setup"],
            "Safety & Environmental Equipment": ["Fume Hood", "Eye Wash Station", "Chemical Spill Kit", "Gas Leak Detector", "Laminar Air Flow Unit"]
        }
    },
    BIOMEDICAL_LAB: {
        id: "f2",
        facilityName: "Biomedical Instrumentation & Research Lab",
        roomLocation: "Block B - 205",
        spaceDescription: "State-of-the-art lab focusing on biosignal processing, medical imaging, and rehabilitation technology.",
        image: "https://images.unsplash.com/photo-1732400333616-8efa4f385a03?w=800&q=80",
        categories: {
            "Imaging Systems": ["Ultrasound Scanner", "MRI Simulation Unit", "Optical Microscope", "Digital X-ray System", "Confocal Microscope"],
            "Diagnostic Equipment": ["ECG Machine", "EMG Machine", "Pulse Oximeter", "Blood Pressure Monitor", "Glucose Analyzer"],
            "Bio-Signal Processing": ["EEG Machine", "Data Acquisition System", "Patient Monitoring System", "Bio-Amplifier System", "Biomedical Signal Recorder"],
            "Laboratory Analysis Equipment": ["Centrifuge Machine", "Hematology Analyzer", "Biochemistry Analyzer", "ELISA Reader", "Incubator"],
            "Rehabilitation & Therapeutic Devices": ["TENS Therapy Unit", "Medical Ventilator", "Physiotherapy Ultrasound Unit", "Digital Spirometer", "Infusion Pump"]
        }
    },
    EEE_LAB: {
        id: "f3",
        facilityName: "Electrical Engineering & Power Systems Lab",
        roomLocation: "Block C - 110",
        spaceDescription: "A comprehensive laboratory for power systems testing, electrical machines, and high-voltage engineering research.",
        image: "https://images.unsplash.com/photo-1765830403209-a5eceac4c198?w=800&q=80",
        categories: {
            "Power Systems": ["Transformer Testing Kit", "Three Phase Induction Motor", "Load Bank Setup", "Auto Transformer", "Power Analyzer"],
            "Electrical Machines": ["DC Motor Test Setup", "Alternator Setup", "Motor Generator Set", "Speed Control Unit", "Synchronous Motor"],
            "Measurement Instruments": ["Digital Power Meter", "LCR Meter", "Oscilloscope", "Function Generator", "Clamp Meter"],
            "Renewable Energy Systems": ["Solar Panel Trainer Kit", "Wind Energy Demo Kit", "Solar Inverter System", "MPPT Controller", "Battery Storage System"],
            "High Voltage Engineering": ["High Voltage DC Test Kit", "Insulation Resistance Tester", "Lightning Surge Generator", "Breakdown Voltage Apparatus", "Earthing Resistance Tester"]
        }
    },
    ECE_LAB: {
        id: "f4",
        facilityName: "Electronics & Communication Systems Lab",
        roomLocation: "Block C - 215",
        spaceDescription: "Specialized lab for RF communications, embedded systems, VLSI design, and IoT development.",
        image: "https://images.unsplash.com/photo-1759866042499-d0b3e9d87ceb?w=800&q=80",
        categories: {
            "Communication Systems": ["RF Signal Generator", "Spectrum Analyzer", "Antenna Trainer Kit", "Optical Fiber Trainer Kit", "Microwave Test Bench"],
            "Embedded Systems": ["Arduino Development Board", "Raspberry Pi Kit", "FPGA Development Board", "ARM Cortex Board", "Microcontroller Trainer Kit"],
            "VLSI & Digital Systems": ["Logic Analyzer", "PCB Fabrication Unit", "Digital IC Trainer Kit", "Oscilloscope", "Soldering Station"],
            "Signal Processing Systems": ["DSP Processor Kit", "Audio Signal Analyzer", "Digital Filter Trainer Kit", "Waveform Analyzer", "Image Processing Workstation"],
            "IoT & Wireless Systems": ["IoT Development Kit", "GSM/GPRS Module", "LoRa Module", "Zigbee Module", "Smart Sensor Kit"]
        }
    },
    PHYSICS_LAB: {
        id: "f5",
        facilityName: "Precision Physics & Nuclear Research Lab",
        roomLocation: "Block D - 101",
        spaceDescription: "Advanced laboratory for optics, mechanics, electronics physics, and thermal studies.",
        image: "https://images.unsplash.com/photo-1707944746058-4da338d0f827?w=800&q=80",
        categories: {
            "Optics": ["Laser Source Kit", "Spectrometer", "Polarimeter", "Optical Bench", "Interference Apparatus"],
            "Mechanics": ["Young’s Modulus Apparatus", "Flywheel Setup", "Vibration Table", "Torsion Pendulum", "Spring Constant Setup"],
            "Electronics Physics": ["Hall Effect Setup", "CRO", "Semiconductor Diode Kit", "Transistor Characteristics Kit", "Photoelectric Effect Apparatus"],
            "Nuclear Physics Equipment": ["Geiger Muller Counter", "Radiation Detector", "Gamma Ray Spectrometer", "NMR Simulator", "Radioactive Demonstration Kit"],
            "Thermal Physics Equipment": ["Thermal Conductivity Apparatus", "Heat Engine Model", "Thermocouple Calibration Unit", "Specific Heat Setup", "Refrigeration Test Rig"]
        }
    },
    COMPUTER_LAB: {
        id: "f6",
        facilityName: "Computing, AI & Cyber Security Lab",
        roomLocation: "Block E - 505",
        spaceDescription: "High-performance computing facility for AI research, cybersecurity testing, and cloud infrastructure studies.",
        image: "https://images.unsplash.com/photo-1765830403209-a5eceac4c198?w=800&q=80",
        categories: {
            "Hardware Systems": ["High Performance Workstation", "GPU Computing System", "Server Rack Unit", "NAS Storage Device", "Networking Switch"],
            "Networking Equipment": ["Router", "Firewall Device", "Wireless Access Point", "Patch Panel", "Network Analyzer"],
            "Software & AI Systems": ["AI Workstation", "Database Server", "DevOps Server", "Cloud VM Setup", "Cyber Security Testing System"],
            "Cyber Security Systems": ["Penetration Testing System", "SIEM Server", "Malware Analysis Lab System", "Firewall Training Setup", "Network Sniffer System"],
            "Cloud & Data Center Systems": ["Virtualization Server", "Kubernetes Cluster Node", "Storage Area Network (SAN)", "Backup & Disaster Recovery Server", "Load Balancer Unit"]
        }
    }
};

const seedBookings: Booking[] = [
    { id: "RD-1001", name: "Dr. Sarah Chen", email: "s.chen@mit.edu", department: "Chemistry Dept., MIT", type: "equipment", facility: "Advanced Chemistry Laboratory", equipment: "UV-Visible Spectrophotometer", date: "2026-03-10", timeSlot: "10:00 - 12:00", purpose: "Analysis of metabolite compounds in biological samples for cancer research.", status: "Pending", submittedAt: "2026-03-01T09:15:00Z" },
    { id: "RD-1002", name: "Prof. James Wright", email: "j.wright@stanford.edu", department: "Materials Science, Stanford", type: "facility", facility: "Clean Room Facility", equipment: "", date: "2026-03-12", timeSlot: "08:00 - 10:00", purpose: "Nanofabrication of thin-film solar cell prototypes for renewable energy study.", status: "Approved", submittedAt: "2026-02-28T14:30:00Z" },
];

const seedUsers: AppUser[] = [
    { id: "1", firstName: "Sarah", lastName: "Chen", email: "s.chen@mit.edu", department: "Chemistry", institution: "MIT", role: "Principal Investigator", phone: "+1-617-555-0101", idProof: "MIT-ID-77291A", status: "Active", joinedAt: "2025-09-15" },
    { id: "2", firstName: "James", lastName: "Wright", email: "j.wright@stanford.edu", department: "Materials Science", institution: "Stanford University", role: "Professor", phone: "+1-650-555-0202", idProof: "STAN-EMP-0092", status: "Active", joinedAt: "2025-10-01" },
];

export async function seedAllCollections(): Promise<void> {
    console.log("🔥 Clearing and Seeding Firestore with Comprehensive Lab Data...");

    try {
        await clearAllCollections();
        console.log("✅ Cleared all collections");

        const facilities: Facility[] = [];
        const equipments: Equipment[] = [];
        let eqCounter = 1;

        // Process Lab Data
        for (const [catId, data] of Object.entries(labData)) {
            // Create Facility
            const fac: Facility = {
                id: data.id,
                facilityName: data.facilityName,
                facilityCategory: catId,
                availabilityStatus: "Available",
                capacity: 25,
                roomLocation: data.roomLocation,
                spaceDescription: data.spaceDescription,
                keyFacilityFeatures: Object.keys(data.categories),
                createdAt: new Date().toISOString(),
                image: data.image
            };
            facilities.push(fac);

            // Create Equipment
            for (const [eqCatName, eqNames] of Object.entries(data.categories)) {
                // Seed category in Firestore
                await setDoc(doc(db, "facilityCategories", catId, "equipmentCategories", eqCatName), { name: eqCatName });

                for (const name of (eqNames as string[])) {
                    equipments.push({
                        id: `e${eqCounter++}`,
                        equipmentName: name,
                        equipmentCategory: eqCatName,
                        initialStatus: "Available",
                        manufacturer: "Premium Laboratory Supplier",
                        modelNumber: `RD-${Math.floor(Math.random() * 9000) + 1000}`,
                        instrumentDescription: `High-precision ${name} designed for advanced research and developmental applications in ${data.facilityName}.`,
                        technicalSpecifications: ["Unit calibrated to ISO 9001 standards", "Automated precision control", "Real-time data logging enabled"],
                        researchApplications: ["Advanced Academic Research", "Industrial Prototype Development", "Scientific Analysis"],
                        facilityId: data.id
                    });
                }
            }
        }

        console.log(`  → Seeding ${facilities.length} facilities...`);
        for (const f of facilities) await addFacilityDoc(f);

        console.log(`  → Seeding ${equipments.length} equipment items...`);
        for (const e of equipments) await addEquipmentDoc(e.facilityId, e);

        console.log("  → Seeding bookings...");
        for (const bk of seedBookings) await addBookingDoc(bk);

        console.log("  → Seeding users...");
        for (const usr of seedUsers) await addUserDoc(usr);

        console.log("✅ Firestore seeding complete!");
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        throw error;
    }
}
