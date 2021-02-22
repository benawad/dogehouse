import * as React from "react";
import { tw } from "twind";

/* SVG from heroicons, licensed under MIT https://github.com/tailwindlabs/heroicons/blob/master/LICENSE */
export function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={tw`h-6 w-6`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}
