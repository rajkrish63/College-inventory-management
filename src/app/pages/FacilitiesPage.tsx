import { useState } from "react";
import { Link } from "react-router";
import { FlaskConical, Microscope, Thermometer, Zap, Users, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useAppContext } from "../context/AppContext";

const allCategories = ["All", "Chemistry", "Biotechnology", "Materials Science", "Electronics", "Computing"];

export function FacilitiesPage() {
  const { facilities } = useAppContext();
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? facilities
    : facilities.filter((f) => f.category === activeCategory);

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-50 to-cyan-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Research Facilities
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Browse our state-of-the-art facilities designed to support cutting-edge research across multiple disciplines
          </p>
        </div>
      </section>

      {/* Facilities Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Filter Badges */}
          <div className="flex flex-wrap gap-2 mb-8">
            {allCategories.map((category) => (
              <Badge
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                className="cursor-pointer hover:bg-blue-100 px-4 py-2"
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>

          {/* Facilities Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((facility) => (
              <Card key={facility.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback
                    src={facility.image}
                    alt={facility.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge
                      className={
                        facility.availability === "Available" ? "bg-green-500" :
                        facility.availability === "Limited" ? "bg-orange-500" : "bg-red-500"
                      }
                    >
                      {facility.availability}
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <CardTitle className="text-lg">{facility.name}</CardTitle>
                  </div>
                  <Badge variant="outline" className="w-fit">{facility.category}</Badge>
                  <CardDescription className="mt-3">{facility.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{facility.capacity}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {facility.features.map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">{feature}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline" asChild
                    disabled={facility.availability === "Unavailable"}>
                    <Link to="/booking">
                      {facility.availability === "Unavailable" ? "Unavailable" : "Request Access"}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>No facilities found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Clock className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Flexible Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Access facilities 24/7 with approved booking. Extended hours support available.</CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Expert Support</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Technical staff available to assist with equipment training and troubleshooting.</CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Thermometer className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Safety First</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>All facilities meet stringent safety standards with regular audits and certifications.</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}