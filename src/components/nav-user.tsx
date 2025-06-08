import {
  ChevronsUpDown, Clapperboard, House,
  LogOut, Projector, ShieldUser, Ticket,
} from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuPortal,
  DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Button} from "@/components/ui/button";
import {setUser} from "@/app/appSlice";
import {useAppDispatch, useAppSelector} from "@/app/hooks";
import {useIsMobile} from "@/hooks/use-mobile";
import {Link} from "react-router";
import {
  Dialog,
  DialogTrigger
} from "@/components/ui/dialog";
import {useState} from "react";
import {MovieForm} from "@/components/forms/MovieForm";
import {ScreeningForm} from "@/components/forms/ScreeningForm";


export function NavUser() {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState<string>("movie");
  const {user} = useAppSelector(state => state.app);
  const isMobile = useIsMobile();
  const dispatch = useAppDispatch();

  if (!user) {
    return null;
  }

  const logOut = () => {
    localStorage.removeItem("user");
    dispatch(setUser(null));
  }

  const getInitials = () => {
    const split = user.name.split(" ");

    if (split?.length < 2) {
      return split[0]?.slice(0, 2);
    }

    return `${split[0][0].toUpperCase()}${split[1][0].toUpperCase()}`;
  }

  const _setContent = (content: string) => {
    setContent(content);
    setOpen(true);
  }

  const dialogContent = () => {
    if (!content) {
      return null;
    }

    if (content === "movie") {
      return <MovieForm/>
    }

    if (content === "screening") {
      return <ScreeningForm/>
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="lg"
            className="has-[>svg]:px-2"
          >
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={""} alt={user.name}/>
              <AvatarFallback className="rounded-lg text-primary">{getInitials()}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
            <ChevronsUpDown className="ml-auto size-4"/>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
          side={isMobile ? "bottom" : "right"}
          align="center"
          sideOffset={4}
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={""} alt={user.name}/>
                <AvatarFallback className="rounded-lg">{getInitials()}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          {user.role === "admin" && (
            <>
              <DropdownMenuSeparator/>
              <DropdownMenuGroup>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <ShieldUser/>
                    Admin Actions
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DialogTrigger asChild>
                        <DropdownMenuItem onClick={() => _setContent("movie")}>
                          <Clapperboard/>
                          Add a Movie
                        </DropdownMenuItem>
                      </DialogTrigger>
                      <DialogTrigger asChild>
                        <DropdownMenuItem onClick={() => _setContent("screening")}>
                          <Projector/>
                          Add a Screening
                        </DropdownMenuItem>
                      </DialogTrigger>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>
            </>
          )}
          <DropdownMenuSeparator/>
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link to="/">
                <House/>
                Movies
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/bookings">
                <Ticket/>
                Bookings
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator/>
          <DropdownMenuItem onClick={logOut}>
            <LogOut/>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {dialogContent()}
    </Dialog>
  )
}
