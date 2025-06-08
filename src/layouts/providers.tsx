import {Toaster} from "@/components/ui/sonner";
import {ThemeColorProvider} from "@/layouts/theme-color-provider";
import {ThemeProvider} from "@/components/theme-provider";
import {Outlet} from "react-router";

export function Providers() {
  return (
    <ThemeProvider attribute="class" enableSystem defaultTheme="system" disableTransitionOnChange>
      <ThemeColorProvider/>
      <Outlet/>
      <Toaster richColors/>
    </ThemeProvider>
  )
}