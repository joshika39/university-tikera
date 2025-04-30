import {Outlet} from "react-router";
import {ThemeProvider} from "@/components/theme-provider.tsx";

export const RootLayout = () => {
  return (
    <ThemeProvider attribute="class" enableSystem defaultTheme="system" disableTransitionOnChange>
      <div>
        <Outlet/>
      </div>
    </ThemeProvider>
  )
};
