"use client";

import { Check, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { setTheme, resolvedTheme, theme } = useTheme();
  const active = theme === "system" ? resolvedTheme : theme;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          {active === "dark" ? <Moon /> : <Sun />}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked={theme === "light"} onCheckedChange={() => setTheme("light")}>
          <Sun />
          Light
          {theme === "light" ? <Check className="ml-auto" /> : null}
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={theme === "dark"} onCheckedChange={() => setTheme("dark")}>
          <Moon />
          Dark
          {theme === "dark" ? <Check className="ml-auto" /> : null}
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={theme === "system"} onCheckedChange={() => setTheme("system")}>
          System
          {theme === "system" ? <Check className="ml-auto" /> : null}
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
