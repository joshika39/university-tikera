import {QueryBooking} from "@/app/userApi";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {TicketCheck} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";

type BookingProps = {
  booking: QueryBooking;
}

const priceMap: Record<string, number> = {
  "normal": 2500,
  "student": 2000,
  "senior": 1800,
};

export function Booking({booking}: BookingProps) {
  const ticketCount = booking.ticket_types.reduce((total, t2) => total + t2.quantity, 0);
  const sumPrice = booking.ticket_types.reduce((total, t2) => total + t2.quantity * priceMap[t2.type], 0);
  const ticketTypes = (
    <>
      {booking.ticket_types.map((ticket) => <p>{ticket.type} - {ticket.quantity}</p>)}
    </>
  )
  return (
    <Card>
      <CardHeader>
        <CardTitle>{booking.screening.movie.title}</CardTitle>
        <CardDescription>Starts: {new Date(booking.screening.start_time).toLocaleString()}</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <img src={booking.screening.movie.image_path} alt="Photo by Yu Kato"
             className="aspect-auto object-contain" width={300}/>
      </CardContent>
      <CardFooter className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline">
                <TicketCheck/> {ticketCount}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              {ticketTypes}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="ml-auto font-medium tabular-nums">HUF {sumPrice}</div>
      </CardFooter>
    </Card>
  )
}