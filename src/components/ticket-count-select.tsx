import {useState} from "react";
import {Button} from "@/components/ui/button.tsx";

type TicketCountSelectProps = {
  label: string;
  price: number;
  onChange: (count: number) => void;
}

export default function TicketCountSelect({
                                            label,
                                            price,
                                            onChange,
                                          }: TicketCountSelectProps) {
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount(count + 1);
    onChange(count + 1);
  }

  const handleDecrement = () => {
    if (count > 0) {
      setCount(count - 1);
      onChange(count - 1);
    }
  }

  return (
    <div className="flex flex-row items-center justify-between gap-2">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">{label}</label>
        <span className="text-xs text-muted-foreground">
          {price.toLocaleString("hu-HU", {
            style: "currency",
            currency: "HUF",
          })}
        </span>
      </div>
      <div className="flex flex-row items-center gap-2">
        <Button
          className="size-4 p-0 text-sm rounded"
          onClick={handleDecrement}
        >
          -
        </Button>
        <span className="text-sm font-medium">{count}</span>
        <Button
          className="size-4 p-0 text-sm rounded"
          onClick={handleIncrement}
        >
          +
        </Button>
      </div>
    </div>
  )
}