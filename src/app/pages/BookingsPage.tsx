import { useAppContext } from "../context/AppContext";
import { Badge } from "../components/ui/badge";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Calendar, Clock, MapPin, Package, Users } from "lucide-react";

export function BookingsPage() {
    const { currentUser, bookings } = useAppContext();

    // Filter bookings for the current user
    const myBookings = bookings.filter((b) => b.email === currentUser?.email);

    // Sort bookings by date (newest first)
    const sortedBookings = [...myBookings].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "Approved": return <Badge className="bg-green-100 text-green-700 hover:bg-green-200">Approved</Badge>;
            case "Pending": return <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-200">Pending</Badge>;
            case "Rejected": return <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-200">Rejected</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-50/50 p-6 md:p-10 max-w-5xl mx-auto w-full">
            <div className="mb-8">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 mb-2">
                    My Bookings
                </h1>
                <p className="text-gray-500">
                    View the status of your facility and equipment requests.
                </p>
            </div>

            <div className="overflow-y-auto flex-1 custom-scrollbar pr-2">
                {sortedBookings.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Calendar className="h-10 w-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Bookings Found</h3>
                        <p className="text-gray-500 max-w-sm mx-auto">You haven't made any facility or equipment requests yet.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {sortedBookings.map((booking) => {
                            return (
                                <Card key={booking.id} className="relative overflow-hidden group hover:shadow-md transition-shadow">
                                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${booking.status === 'Approved' ? 'bg-green-500' : booking.status === 'Pending' ? 'bg-amber-400' : 'bg-red-500'}`} />

                                    <CardHeader className="pb-3 pl-6">
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    {booking.type === 'facility' ? (
                                                        <MapPin className="h-4 w-4 text-blue-500" />
                                                    ) : (
                                                        <Package className="h-4 w-4 text-purple-500" />
                                                    )}
                                                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                                        {booking.type === 'facility' ? 'Facility Booking' : 'Equipment Booking'}
                                                    </span>
                                                </div>
                                                <h4 className="text-xl font-bold text-gray-900 leading-tight">
                                                    {booking.type === 'facility' ? booking.facility : booking.equipment}
                                                </h4>
                                                {booking.type === 'equipment' && booking.facility && (
                                                    <p className="text-sm text-gray-600">{booking.facility}</p>
                                                )}
                                            </div>
                                            <div className="shrink-0 mt-1 sm:mt-0">
                                                {getStatusBadge(booking.status)}
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="pl-6 pb-5 space-y-4">
                                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                <span className="font-medium">{new Date(booking.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-gray-400" />
                                                <span className="font-medium">{booking.timeSlot}</span>
                                            </div>
                                            {(booking.type === 'facility' && booking.persons) && (
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-4 w-4 text-gray-400" />
                                                    <span className="font-medium">{booking.persons} {booking.persons > 1 ? 'Persons' : 'Person'}</span>
                                                </div>
                                            )}
                                            {(booking.type === 'equipment' && booking.quantity) && (
                                                <div className="flex items-center gap-2">
                                                    <Package className="h-4 w-4 text-gray-400" />
                                                    <span className="font-medium">Qty: {booking.quantity}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                                            <span className="font-mono bg-gray-50 px-2 py-1 rounded">ID: {booking.id}</span>
                                            <span className="flex items-center gap-1.5">
                                                <Clock className="h-3 w-3" /> Submitted on {new Date(booking.submittedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
