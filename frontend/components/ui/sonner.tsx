"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system", resolvedTheme = "light" } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4 text-emerald-600 dark:text-emerald-400" />,
        info: <InfoIcon className="size-4 text-indigo-600 dark:text-indigo-400" />,
        warning: <TriangleAlertIcon className="size-4 text-amber-600 dark:text-amber-400" />,
        error: <OctagonXIcon className="size-4 text-rose-600 dark:text-rose-400" />,
        loading: <Loader2Icon className="size-4 animate-spin text-indigo-600 dark:text-indigo-400" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
          "--success-bg": isDark ? "hsl(150 45% 12%)" : "hsl(142 65% 95%)",
          "--success-border": isDark ? "hsl(150 35% 24%)" : "hsl(142 45% 82%)",
          "--success-text": isDark ? "hsl(142 60% 82%)" : "hsl(145 65% 28%)",
          "--error-bg": isDark ? "hsl(358 45% 14%)" : "hsl(0 75% 96%)",
          "--error-border": isDark ? "hsl(358 35% 27%)" : "hsl(0 65% 86%)",
          "--error-text": isDark ? "hsl(0 75% 84%)" : "hsl(358 65% 38%)",
        } as React.CSSProperties
      }
      {...props}
      toastOptions={{
        ...props.toastOptions,
        classNames: {
          ...props.toastOptions?.classNames,
          toast:
            "!rounded-2xl !border !shadow-[0_16px_48px_-20px_rgba(15,23,42,0.28)] !backdrop-blur-xl",
          title: "!text-sm !font-semibold !tracking-[-0.01em] !text-slate-900 dark:!text-slate-100",
          description: "!text-xs !leading-relaxed !text-slate-500 dark:!text-slate-400",
          info: "!border-indigo-200/80 dark:!border-indigo-900/80",
          warning: "!border-amber-200/80 dark:!border-amber-900/80",
        },
      }}
    />
  )
}

export { Toaster }
