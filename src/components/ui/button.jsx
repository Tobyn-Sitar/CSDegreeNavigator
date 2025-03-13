import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#FFC72C] text-[#5A1F58] font-medium rounded-full px-6 py-2 hover:opacity-90 hover:shadow-lg transition-all",
        destructive: "bg-red-600 text-white shadow-lg hover:bg-red-700 hover:scale-105",
        outline: "bg-[#FFC72C] text-[#5A1F58] font-medium rounded-full px-6 py-2 hover:opacity-90 hover:shadow-lg transition-all",
        secondary: "bg-gray-200 text-gray-900 shadow-sm hover:bg-gray-300 hover:scale-105",
        ghost: "hover:bg-gray-100 text-gray-900",
        link: "text-blue-600 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-4 text-xs",
        lg: "h-12 px-6 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, isLoading, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }), "relative overflow-hidden")}
      ref={ref}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="absolute inset-0 flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
        </span>
      ) : (
        props.children
      )}
    </Comp>
  );
});
Button.displayName = "Button";

export { Button, buttonVariants };
