import {
  Bell,
  ChevronsUpDown,
  LogOut,
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Button} from "@/components/ui/button";
import {setUser} from "@/app/appSlice";
import {useAppDispatch} from "@/app/hooks";
import {useIsMobile} from "@/hooks/use-mobile";
import {Link} from "react-router";

type NavUserProps = {
  user: {
    name?: string;
    email?: string;
  }
}

export function NavUser({user}: NavUserProps) {
  const isMobile = useIsMobile();
  const dispatch = useAppDispatch();
  const logOut = () => {
    localStorage.removeItem("user");
    dispatch(setUser(null));
  }

  const getInitials = () => {
    if (!user?.name) {
      return "NA";
    }

    const split = user?.name.split(" ");

    if (split?.length < 2) {
      return split[0]?.slice(0, 2);
    }

    return `${split[0][0].toUpperCase()}${split[1][0].toUpperCase()}`;
  }

  return (
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
        <DropdownMenuSeparator/>
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/bookings">
              <Bell/>
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
  )
}
