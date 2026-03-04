import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { FlaskConical, Microscope, Thermometer, Zap, Users, Clock, Dna, Cpu, Atom, Monitor } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useAppContext } from "../context/AppContext";

const allCategories = ["All", "Chemistry", "Biotechnology", "Materials Science", "Electronics", "Computing"];

export function FacilitiesPage() {
  const { facilities } = useAppContext();
  const location = useLocation();
  const rawData = location.state?.data;
  const passedData = (rawData === "all" || rawData === "All") ? null : rawData;

  // Initialize with passedData if it exists and matches a category, otherwise "All"
  const defaultCategory = passedData && allCategories.some(c => c.toLowerCase() === passedData.toLowerCase())
    ? allCategories.find(c => c.toLowerCase() === passedData.toLowerCase()) || "All"
    : "All";

  const [activeCategory, setActiveCategory] = useState(defaultCategory);

  // If the user clicks the link again while already on the page, update the category
  useEffect(() => {
    const target = passedData || "All";
    const match = allCategories.find(c => c.toLowerCase() === target.toLowerCase());
    if (match) setActiveCategory(match);
  }, [passedData]);

  const filtered = activeCategory === "All"
    ? facilities
    : facilities.filter((f) => f.category === activeCategory);

  // Dynamic header content mapping
  const headerContent: Record<string, { title: string, desc: string, icon: any, color: string }> = {
    "Chemistry": {
      title: "Chemistry Research Laboratory",
      desc: "Advanced facilities for synthesis, structural analysis, and characterization of novel chemical compounds and materials.",
      icon: FlaskConical,
      color: "from-blue-600 to-indigo-600"
    },
    "Biotechnology": {
      title: "Biotechnology & Life Sciences",
      desc: "Cutting-edge tools for molecular biology, genetics, and bio-processing research in a sterile environment.",
      icon: Dna,
      color: "from-emerald-600 to-teal-600"
    },
    "Electronics": {
      title: "Electronics & Embedded Systems",
      desc: "State-of-the-art labs for circuit design, semiconductor testing, and the development of next-gen electronics.",
      icon: Cpu,
      color: "from-orange-600 to-amber-600"
    },
    "Materials Science": {
      title: "Advanced Materials Science",
      desc: "Exploring the characterization and development of advanced functional materials and nanotechnology.",
      icon: Atom,
      color: "from-purple-600 to-fuchsia-600"
    },
    "Computing": {
      title: "HPC & Computing Center",
      desc: "High-performance computing resources, AI research, and big data analysis for complex scientific simulations.",
      icon: Monitor,
      color: "from-slate-700 to-slate-900"
    }
  };

  const currentHeader = headerContent[activeCategory];
  return (
    <div>
      {/* Unified Header */}
      <section className="bg-gradient-to-br from-blue-50 to-cyan-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-8xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {currentHeader ? currentHeader.title : "Research Facilities"}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {currentHeader ? currentHeader.desc : "Browse our state-of-the-art facilities designed to support cutting-edge research across multiple disciplines"}
          </p>
        </div>
      </section>

      {/* Facilities Grid & Lab Sidebar */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white min-h-[600px]">
        <div className="max-w-8xl mx-auto">


          <div className={`${passedData ? "flex flex-col lg:flex-row gap-8" : ""}`}>
            {/* Internal Lab Sidebar (Equipment Categories) */}
            {passedData && filtered.length > 0 && (
              <aside className="w-full lg:flex-1 shrink-0">
                <div className="sticky top-24">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b pb-2">
                    Equipment Categories
                  </h3>
                  <nav className="flex flex-col gap-1">
                    {filtered[0].features.map((feature, idx) => (
                      <button
                        key={idx}
                        className="text-left px-3 py-2 text-sm text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        {feature}
                      </button>
                    ))}
                  </nav>
                </div>
              </aside>
            )}

            {/* Content Area */}
            <div className={`w-full ${passedData ? "lg:max-w-md lg:shrink-0" : "flex-1"}`}>
              <div className={`grid gap-6 ${passedData ? "grid-cols-1" : "md:grid-cols-2 lg:grid-cols-3"}`}>
                {filtered.map((facility) => (
                  <Card key={facility.id} className="overflow-hidden hover:shadow-lg transition-shadow border-gray-200">
                    <div className="relative h-56 overflow-hidden">
                      <ImageWithFallback
                        src={facility.image}
                        alt={facility.name}
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge
                          className={`${facility.availability === "Available" ? "bg-emerald-500" :
                            facility.availability === "Limited" ? "bg-amber-500" : "bg-rose-500"
                            } text-white border-0 shadow-sm`}
                        >
                          {facility.availability}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-xl font-bold text-gray-900">{facility.name}</CardTitle>
                      </div>
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-0 w-fit">
                        {facility.category}
                      </Badge>
                      <CardDescription className="text-gray-600 leading-relaxed mt-2 text-sm">
                        {facility.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Users className="h-4 w-4" />
                        <span>Maximum capacity: {facility.capacity}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {facility.features.map((feature, idx) => (
                          <Badge key={idx} variant="outline" className="text-[11px] font-medium border-gray-200 text-gray-500">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm" asChild
                        disabled={facility.availability === "Unavailable"}>
                        <Link to="/booking">
                          {facility.availability === "Unavailable" ? "Temporarily Closed" : "Reserve This Facility"}
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
                    <Microscope className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">No facilities found</h3>
                  <p className="text-gray-500 max-w-xs mx-auto mt-1">We couldn't find any facilities in the {activeCategory} category.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}