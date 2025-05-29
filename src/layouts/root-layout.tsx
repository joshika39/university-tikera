import {NavLink, Outlet} from "react-router";
import {ThemeProvider} from "@/components/theme-provider";
import {buttonVariants} from "@/components/ui/button";
import Logo from "@/assets/ticket.svg?react";
import {Toaster} from "@/components/ui/sonner";
import {ThemeColorProvider} from "@/layouts/theme-color-provider";
import {ThemeChanger} from "@/components/theme-changer";
import {PaginationContent, Pagination, PaginationItem, PaginationNext, PaginationLink, PaginationPrevious} from "@/components/ui/pagination";
import {Suspense} from "react";
import {getWeek} from "date-fns";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const RootLayout = () => {
  return (
    <ThemeProvider attribute="class" enableSystem defaultTheme="system" disableTransitionOnChange>
      <ThemeColorProvider/>
      <div
        className="flex flex-col gap-2 bg-gradient-to-br from-background via-background via-60% to-primary/20 md:to-primary/40 min-h-screen h-full w-full">
        <div className="md:absolute md:top-4 p-4 md:px-4 md:py-0 self-center flex flex-row gap-4 items-center justify-between w-full">
          <div className="flex flex-row gap-2 items-center">
            <Logo className="h-8 text-primary"/>
            <h1 className="text-3xl font-bold text-primary">
              Tikera
            </h1>
          </div>
          <ThemeChanger />
        </div>
        <div className="flex flex-col gap-2 z-20">
          <div className="flex flex-wrap flex-row gap-2 items-center self-center mt-4">
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
                <PaginationPrevious />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink>{getWeek(new Date()).toString()}</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext />
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
      <Toaster richColors/>
    </ThemeProvider>
  )
};
