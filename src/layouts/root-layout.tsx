import {NavLink, Outlet} from "react-router";
import {buttonVariants} from "@/components/ui/button";
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

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const RootLayout = () => {
  const {currentWeek} = useAppSelector((state) => state.app);
  const dispatch = useAppDispatch();

  return (
    <div
      className="flex flex-col gap-2 bg-gradient-to-br from-background via-background via-60% to-primary/20 md:to-primary/40 min-h-screen h-full w-full">
      <div
        className="md:absolute md:top-4 p-4 md:px-4 md:py-0 self-center flex flex-row gap-4 items-center justify-between w-full">
        <div className="flex flex-row gap-2 items-center">
          <Logo className="h-8 text-primary"/>
          <h1 className="text-3xl font-bold text-primary">
            Tikera
          </h1>
        </div>
        <ThemeChanger/>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap flex-row gap-2 items-center self-center mt-4 z-10">
          {days.map((day, index) => (
            <NavLink
              key={index} to={`/${day.toLowerCase()}`}
              className={({isActive}) => buttonVariants({variant: isActive ? "default" : "link"})}
            >
              {day}
            </NavLink>
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
