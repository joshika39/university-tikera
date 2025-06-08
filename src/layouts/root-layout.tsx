import {Link, Outlet, useLocation, useNavigate} from "react-router";
import {Button, buttonVariants} from "@/components/ui/button";
import Logo from "@/assets/ticket.svg?react";
import {ThemeChanger} from "@/components/theme-changer";
import {
  PaginationContent,
  Pagination,
  PaginationItem,
  PaginationNext,
  PaginationLink,
  PaginationPrevious
} from "@/components/ui/pagination";
import {Suspense} from "react";
import {useAppDispatch, useAppSelector} from "@/app/hooks";
import {nextWeek, previousWeek} from "@/app/appSlice";
import {useAuth} from "@/hooks/use-auth";
import {addDays, isBefore, setISOWeek, startOfDay, startOfISOWeek} from "date-fns";
import {NavUser} from "@/components/nav-user";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const RootLayout = () => {
  const {isLoggedIn} = useAuth();
  const {pathname} = useLocation();
  const navigate = useNavigate();
  const {currentWeek} = useAppSelector((state) => state.app);
  const dispatch = useAppDispatch();

  const isActive = (day: string) => {
    day = day.toLowerCase();
    day = `/${day}`;
    return pathname.startsWith(day);
  }

  const isDisabled = (day: string) => {
    const today = startOfDay(new Date());
    const currentYear = today.getFullYear(); // optional: use a selected year instead

    // Map the day to an index (0 = Monday, 6 = Sunday)
    const dayMap: Record<string, number> = {
      monday: 0,
      tuesday: 1,
      wednesday: 2,
      thursday: 3,
      friday: 4,
      saturday: 5,
      sunday: 6,
    };

    const dayIndex = dayMap[day.toLowerCase()];
    if (dayIndex === undefined) return true;

    const mondayOfSelectedWeek = startOfISOWeek(setISOWeek(new Date(currentYear, 0, 4), parseInt(currentWeek)));

    const dayDate = startOfDay(addDays(mondayOfSelectedWeek, dayIndex));

    return isBefore(dayDate, today);
  };

  const authButtons = isLoggedIn ? (
    <NavUser />
  ) : (
    <>
      <Link to="/login" className={buttonVariants({variant: "outline"})}>
        Log in
      </Link>
      <Link to="/register" className={buttonVariants()}>
        Register
      </Link>
    </>
  );

  return (
    <div
      className="flex flex-col gap-2 bg-gradient-to-br from-background via-background via-60% to-primary/20 md:to-primary/40 min-h-screen h-full w-full">
      <div
        className="md:absolute md:top-4 p-4 md:px-4 md:py-0 self-center flex flex-col md:flex-row gap-4 items-center justify-between w-full">
        <div className="flex flex-row gap-2 items-center">
          <Link to="/" className="flex flex-row gap-2 items-center justify-between">
            <Logo className="h-8 text-primary"/>
            <h1 className="text-3xl font-bold text-primary">
              Tikera
            </h1>
          </Link>
        </div>
        <div className="flex flex-row gap-2 items-center">
          {authButtons}
          <ThemeChanger/>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap flex-row gap-2 items-center self-center mt-4 z-10">
          {days.map((day, index) => (
            <Button
              key={index}
              onClick={() => navigate(day.toLowerCase())}
              disabled={isDisabled(day)}
              variant={isActive(day) ? "default" : "link"}
            >
              {day}
            </Button>
          ))}
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={() => dispatch(previousWeek())}/>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink>{currentWeek}</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext onClick={() => dispatch(nextWeek())}/>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      <div className="p-0 md:p-8">
        <Suspense>
          <Outlet/>
        </Suspense>
      </div>
    </div>
  )
};
