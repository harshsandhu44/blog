"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useIsHydrated } from "@radix-ui/react-use-is-hydrated";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const isHydrated = useIsHydrated();
  const { setTheme, resolvedTheme, theme } = useTheme();
  const currentTheme = isHydrated ? (theme ?? "system") : "system";
  const active = isHydrated
    ? currentTheme === "system"
      ? resolvedTheme
      : currentTheme
    : undefined;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="min-w-24 justify-between gap-2">
          {active === "dark" ? <Moon className="size-4" /> : active === "light" ? <Sun className="size-4" /> : <Monitor className="size-4" />}
          <span className="capitalize">{currentTheme}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={currentTheme} onValueChange={(value) => setTheme(value)}>
          <DropdownMenuRadioItem value="light">
            <Sun className="mr-2 size-4" />
            Light
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">
            <Moon className="mr-2 size-4" />
            Dark
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">
            <Monitor className="mr-2 size-4" />
            System
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
