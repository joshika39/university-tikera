import SeatIcon from "@/assets/seat.svg?react";
import {cn} from "@/lib/utils.ts";
import {ChangeEvent, useState} from "react";

type SeatProps = {
  row: number;
  seat: number;
  booked?: boolean;
  onClick?: (row: number, seat: number) => void;
}

export default function Seat({row, seat, booked, onClick}: SeatProps) {
  const [checked, setChecked] = useState(false);

  const _onChecked = (e: ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
    if (onClick) {
      onClick(row, seat);
    }
  }

  return (
    <div>
      <label
        className={cn(
          "text-primary hover:text-primary/80 cursor-pointer",
          "has-checked:text-foreground has-checked:hover:text-foreground/80",
          "has-disabled:cursor-not-allowed has-disabled:text-primary/50",
        )}
        htmlFor={`seat-${row}-${seat}`}
      >
        <SeatIcon className="h-8"/>
        <span className="sr-only">Available</span>
        <input
          type="checkbox"
          className="sr-only peer"
          name={`seat-${row}-${seat}`}
          id={`seat-${row}-${seat}`}
          disabled={booked}
          checked={checked}
          onChange={_onChecked}
        />
      </label>
    </div>
  )
}