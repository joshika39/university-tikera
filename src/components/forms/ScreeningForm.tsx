import {DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Form, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {useCreateScreeningMutation, useUpdateScreeningMutation} from "@/app/adminApi";
import {toast} from "sonner";

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
  movie_id: z.number().min(1, "Movie ID is required"),
  room_id: z.number().min(1, "Room ID is required"),
  start_time: z.string().min(1, "Start time is required"),
  date: z.string().min(1, "Date is required"),
});

type ScreeningFormValues = z.infer<typeof screeningForm>;

export function ScreeningForm({screening}: ScreeningFormProps) {
  const isEditing = !!screening;
  const [createScreening, {isLoading: isCreating}] = useCreateScreeningMutation();
  const [updateScreening, {isLoading: isUpdating}] = useUpdateScreeningMutation();
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
    try {
      if (isEditing) {
        const resp = await updateScreening({...data, id: screening?.id}).unwrap();
        console.log("Screening updated successfully:", resp);
        toast.success(`Screening (${resp.data.id}) updated successfully!`);
      } else {
        const resp = await createScreening(data).unwrap();
        console.log("Screening created successfully:", resp);
        toast.success(`Screening (${resp.data.id}) created successfully!`);
      }
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit form. Please try again.");
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{isEditing ? "Edit Screening" : "Create Screening"}</DialogTitle>
        <DialogDescription>
          {isEditing ? "Edit the details of the screening." : "Create a new screening for a movie."}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="movie_id"
            render={({field}) => (
              <FormItem>
                <Label>Movie ID</Label>
                <Input type="number" placeholder="Enter movie ID" {...field} />
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="room_id"
            render={({field}) => (
              <FormItem>
                <Label>Room ID</Label>
                <Input type="number" placeholder="Enter room ID" {...field} />
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="start_time"
            render={({field}) => (
              <FormItem>
                <Label>Start Time</Label>
                <Input type="datetime" placeholder="Enter start time" {...field} />
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({field}) => (
              <FormItem>
                <Label>Date</Label>
                <Input type="date" placeholder="Enter date" {...field} />
                <FormMessage/>
              </FormItem>
            )}
          />
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => form.reset()}>
              Reset
            </Button>
            <Button type="submit" disabled={isCreating || isUpdating}>
              {isEditing ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  )
}