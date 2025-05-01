import SeatIcon from "@/assets/seat.svg?react";
import {cn} from "@/lib/utils.ts";

type SeatProps = {
  row: number;
  seat: number;
  selected?: boolean;
  booked?: boolean;
  onClick?: (row: number, seat: number) => void;
}

export default function Seat({row, seat, selected, booked, onClick}: SeatProps) {

  const _onChecked = () => {
    if (onClick) {
      onClick(row, seat);
    }
  }

  return (
    <div className="w-8 h-8 flex items-center justify-center">
      <label
        className={cn(
          "text-primary hover:text-primary/80 cursor-pointer",
          "has-checked:text-foreground has-checked:hover:text-foreground/80",
          "has-disabled:cursor-not-allowed has-disabled:text-primary/50",
        )}
        htmlFor={`seat-${row}-${seat}`}
      >
        <SeatIcon />
        <span className="sr-only">Available</span>
        <input
          type="checkbox"
          className="sr-only peer"
          name={`seat-${row}-${seat}`}
          id={`seat-${row}-${seat}`}
          disabled={booked}
          checked={selected}
          onChange={_onChecked}
        />
      </label>
    </div>
  )
}