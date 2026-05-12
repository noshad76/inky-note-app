import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs))
}


// <div
//   className={cn(
//     "px-4 py-2 rounded-md",
//     isActive && "bg-blue-500",
//     disabled && "opacity-50",
//     className
//   )}
// />