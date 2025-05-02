import SeatIcon from "@/assets/seat.svg?react";
import {cn} from "@/lib/utils.ts";

type SeatProps = {
  row: number;
  seat: number;
  selected?: boolean;
  booked?: boolean;
  onClick?: (row: number, seat: number) => void;
  disabled?: boolean;
}

export default function Seat({row, seat, selected, booked, disabled, onClick}: SeatProps) {

  const _onChecked = () => {
    if (onClick) {
      onClick(row, seat);
    }
  }

  return (
    <div className="size-6 sm:size-8 flex items-center justify-center transition-all">
      <label
        className={cn(
          "transition-all",
          "text-primary hover:text-primary/80 cursor-pointer",
          "has-checked:text-foreground has-checked:hover:text-foreground/80",
          "has-disabled:cursor-not-allowed has-disabled:text-primary/50",
          booked && "text-secondary has-disabled:text-secondary",
        )}
        htmlFor={`seat-${row}-${seat}`}
      >
        <SeatIcon className="size-6 sm:size-8" />
        <span className="sr-only">Available</span>
        <input
          type="checkbox"
          className="sr-only peer"
          name={`seat-${row}-${seat}`}
          id={`seat-${row}-${seat}`}
          disabled={booked || disabled}
          checked={selected}
          onChange={_onChecked}
        />
      </label>
    </div>
  )
}