import * as React from "react";

export default function SvgSolidMoon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M5.62095 2.89044C5.62095 1.86455 5.82769 0.889365 6.20216 0C2.6447 0.86206 0.00390625 4.06456 0.00390625 7.88337C0.00390625 12.3614 3.63938 15.9969 8.11741 15.9969C11.9362 15.9969 15.1387 13.3561 16.0008 9.79862C15.1114 10.1731 14.1323 10.3798 13.1103 10.3798C8.97557 10.3798 5.62095 7.02521 5.62095 2.89044Z" />
    </svg>
  );
}
