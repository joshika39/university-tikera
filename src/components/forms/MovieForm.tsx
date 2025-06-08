import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {useCreateMovieMutation, useUpdateMovieMutation} from "@/app/adminApi";
import {toast} from "sonner";

type MovieFormProps = {
  movie?: {
    id: number;
    title: string;
    description: string;
    genre: string;
    duration: number;
    release_year: number;
    image_path: string;
  };
  onClose?: () => void;
}

const movieForm = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  genre: z.string().min(1, "Genre is required"),
  duration: z.number().min(1, "Duration must be greater than 0"),
  release_year: z.number().int().min(1900, "Release year must be a valid year").max(new Date().getFullYear(), "Release year cannot be in the future"),
  image_path: z.string().url("Image path must be a valid URL"),
})

type MovieFormValues = z.infer<typeof movieForm>;

export function MovieForm({movie, onClose}: MovieFormProps) {
  const [createMovie, {isLoading: isCreating}] = useCreateMovieMutation();
  const [updateMovie, {isLoading: isUpdating}] = useUpdateMovieMutation();
  const isEditing = !!movie;

  const form = useForm<MovieFormValues>({
    resolver: zodResolver(movieForm),
    defaultValues: {
      title: movie?.title || "",
      description: movie?.description || "",
      genre: movie?.genre || "",
      duration: movie?.duration || 120,
      release_year: movie?.release_year || new Date().getFullYear(),
      image_path: movie?.image_path || "",
    }
  });

  const onSubmit = async (data: MovieFormValues) => {
    try {
      if (isEditing) {
        const resp = await updateMovie({...data, id: movie?.id}).unwrap();
        console.log("Movie updated successfully:", resp);
        toast.success(`Movie (${resp.data.id}) updated successfully!`);
      } else {
        const resp = await createMovie(data).unwrap();
        console.log("Movie created successfully:", resp);
        toast.success(`Movie (${resp.data.id}) created successfully!`);
      }
      form.reset();
      onClose?.();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(`Failed to ${isEditing ? "update" : "create"} movie. Please try again.`);
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{isEditing ? "Edit" : "Create"} Movie</DialogTitle>
        <DialogDescription>
          {isEditing ? "Edit the movie details below." : "Create a new movie by filling out the form below. "}
          Please ensure all fields are filled out correctly.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField name="title" control={form.control} render={({field}) =>
            (
              <FormItem {...field}>
                <Label>Title</Label>
                <Input {...field} placeholder="Enter movie title"/>
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField name="description" control={form.control} render={({field}) =>
            (
              <FormItem {...field}>
                <Label>Description</Label>
                <Textarea {...field} placeholder="Enter movie description" rows={3}/>
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField name="genre" control={form.control} render={({field}) =>
            (
              <FormItem {...field}>
                <Label>Genre</Label>
                <Input {...field} placeholder="Enter movie genre"/>
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField name="duration" control={form.control} render={({field}) =>
            (
              <FormItem {...field}>
                <Label>Duration (minutes)</Label>
                <Input type="number" {...field} placeholder="Enter movie duration" min={1}/>
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField name="release_year" control={form.control} render={({field}) =>
            (
              <FormItem {...field}>
                <Label>Release Year</Label>
                <Input type="number" {...field} placeholder="Enter release year" min={1900}
                       max={new Date().getFullYear()}/>
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField name="image_path" control={form.control} render={({field}) =>
            (
              <FormItem {...field}>
                <Label>Image Path</Label>
                <Input {...field} placeholder="Enter image URL (optional)"/>
                <FormMessage/>
              </FormItem>
            )}
          />
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => form.reset()}>Reset</Button>
            <Button type="submit" disabled={isUpdating || isCreating}>{isEditing ? "Update" : "Create"}</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  )
}