import {Pencil} from "lucide-react";
import {Button} from "../ui/button";
import {DialogTrigger} from "../ui/dialog";
import {Dialog} from "@/components/ui/dialog";
import {MovieForm} from "@/components/forms/MovieForm";

type EditMovieDialogProps = {
  movie: {
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

export function EditMovieDialog({movie, onClose}: EditMovieDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon"><Pencil/></Button>
      </DialogTrigger>
      <MovieForm movie={movie} onClose={onClose}/>
    </Dialog>
  );
}