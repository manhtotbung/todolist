import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-[#0C66E4] text-white hover:bg-[#0055CC] shadow-sm dark:bg-[#579DFF] dark:text-[#1D2125] dark:hover:bg-[#85B8FF]",
        destructive:
          "bg-[#E34935] text-white hover:bg-[#C93B27] shadow-sm dark:bg-[#F87462] dark:hover:bg-[#FCC6C0] dark:text-[#1D2125]",
        outline:
          "border border-input bg-background shadow-sm hover:bg-[#F1F2F4] hover:text-[#172B4D] dark:hover:bg-[#2C333A] dark:hover:text-[#B6C2CF]",
        secondary:
          "bg-[#091E420F] text-[#172B4D] hover:bg-[#091E4224] dark:bg-[#A6C5E229] dark:text-[#B6C2CF] dark:hover:bg-[#A6C5E23D]",
        ghost:
          "hover:bg-[#091E420F] hover:text-[#172B4D] dark:hover:bg-[#A6C5E229] dark:hover:text-[#B6C2CF]",
        link: "text-[#0C66E4] underline-offset-4 hover:underline dark:text-[#579DFF]",
        gradient: "bg-[#0C66E4] text-white shadow-sm hover:bg-[#0055CC] dark:bg-[#579DFF] dark:text-[#1D2125] dark:hover:bg-[#85B8FF]",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        xl: "h-11 rounded-md px-8",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props} />
  );
}

export { Button, buttonVariants }
