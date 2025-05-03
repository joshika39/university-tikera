import {NavLink, Outlet} from "react-router";
import {ThemeProvider} from "@/components/theme-provider.tsx";
import {buttonVariants} from "@/components/ui/button.tsx";
import Logo from "@/assets/ticket.svg?react";
import {Toaster} from "@/components/ui/sonner.tsx";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const RootLayout = () => {
  return (
    <ThemeProvider attribute="class" enableSystem defaultTheme="system" disableTransitionOnChange>
      <div
        className="flex flex-col gap-2 bg-gradient-to-br from-background via-background via-60% to-primary/20 md:to-primary/40 min-h-screen h-full w-fit">
        <div className="md:absolute md:top-4 md:left-8 p-4 md:p-0 self-center flex flex-row gap-2 items-center">
          <Logo className="h-8 text-primary"/>
          <h1 className="text-3xl font-bold text-primary">
            Tikera
          </h1>
        </div>
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
        <div className="p-0 md:p-8">
          <Outlet/>
        </div>
      </div>
      <Toaster richColors/>
    </ThemeProvider>
  )
};
