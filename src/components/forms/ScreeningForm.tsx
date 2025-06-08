import {DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Form} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

type ScreeningFormProps = {
  screening?: {
    id: number;
    movie_id: number;
    room_id: number;
    start_time: string;
    date: string;
  };
}

const screeningForm = z.object({
  movie_id: z.number().int().min(1, "Movie ID is required"),
  room_id: z.number().int().min(1, "Room ID is required"),
  start_time: z.string().min(1, "Start time is required"),
  date: z.string().min(1, "Date is required"),
});

type ScreeningFormValues = z.infer<typeof screeningForm>;

export function ScreeningForm({ screening }: ScreeningFormProps) {
  const form = useForm<ScreeningFormValues>({
    resolver: zodResolver(screeningForm),
    defaultValues: {
      movie_id: screening?.movie_id || 0,
      room_id: screening?.room_id || 0,
      start_time: screening?.start_time || "",
      date: screening?.date || "",
    }
  });

  const onSubmit = async (data: ScreeningFormValues) => {

  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create Screening</DialogTitle>
        <DialogDescription>
          Create a new screening to add to the system. Please ensure that the movie and room IDs are valid.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <DialogFooter>
            <Button type="submit">Confirm</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  )
}