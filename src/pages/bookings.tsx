import {useGetBookingsQuery} from "@/app/userApi";
import {Booking} from "@/components/booking";

export function BookingsPage() {
  const {data, isLoading} = useGetBookingsQuery();

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