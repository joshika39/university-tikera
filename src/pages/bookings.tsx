import {useGetBookingsQuery} from "@/app/userApi";
import {Booking} from "@/components/booking";
import {useAuth} from "@/hooks/use-auth";

export function BookingsPage() {
  const {isAdmin} = useAuth();

  const {data, isLoading} = useGetBookingsQuery(undefined, {
    skip: isAdmin,
  });

  if (isAdmin) {
    return <div className="text-center text-primary">Bookings are not available for admins.</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-xl text-primary mb-3 font-bold">Bookings</h1>
      <div className="flex flex-wrap gap-2">
        {data?.map((booking, i) => <Booking key={i} booking={booking}/>)}
      </div>
    </div>
  )
}