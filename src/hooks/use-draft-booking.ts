import {useEffect, useState} from "react";
import {Booking} from "@/types";

const KEY = "draftBooking";

export type DraftBooking = {
  day: string;
  movieId: number;
  screeningId: number;
  lastEdited?: string;
  tickets: {
    student: number;
    adult: number;
    senior: number;
  };
  selectedSeats: Booking[];
}

export default function useDraftBooking() {
  const [draftBooking, setDraftBooking] = useState<DraftBooking | null>(null);

  const updateDraftBooking = (newDraftBooking: DraftBooking) => {
    const updatedDraftBooking = {
      ...draftBooking,
      ...newDraftBooking,
      lastEdited: new Date().toISOString(),
    }

    setDraftBooking(updatedDraftBooking);
    localStorage.setItem(KEY, JSON.stringify(updatedDraftBooking));
  }

  const removeDraftBooking = () => {
    setDraftBooking(null);
    localStorage.removeItem(KEY);
  }

  useEffect(() => {
    const storedDraftBooking = localStorage.getItem(KEY);
    if (storedDraftBooking) {
      const _draftBooking = JSON.parse(storedDraftBooking) as DraftBooking;
      const now = new Date();
      const lastEdited = new Date(_draftBooking?.lastEdited || 0);
      const diff = now.getTime() - lastEdited.getTime();

      if (diff > 15 * 60 * 1000) {
        localStorage.removeItem(KEY);
      } else {
        setDraftBooking(_draftBooking);
      }
    }
  }, []);

  return {
    draftBooking,
    removeDraftBooking,
    updateDraftBooking,
  }
}