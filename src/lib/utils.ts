import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function findNthOccurance(str: string, n: number, char: string) {
  let count = 0;

  for (let i = 0; i < str.length; i++) {
      if (str[i] === char) {
          count++;

          if (count === n) {
              return i;
          }
      }
  }

  return -1;
}
