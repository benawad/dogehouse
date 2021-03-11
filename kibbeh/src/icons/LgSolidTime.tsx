import * as React from "react";

function SvgLgSolidTime(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={40}
      height={40}
      viewBox="0 0 40 40"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M20 0C8.952 0 0 8.952 0 20s8.952 20 20 20 20-8.952 20-20S31.048 0 20 0zm1.346 21.73A1.35 1.35 0 0120 23.078h-9.23a1.35 1.35 0 01-1.347-1.346c0-.74.606-1.346 1.346-1.346h7.885V7.692c0-.74.606-1.346 1.346-1.346.74 0 1.346.606 1.346 1.346v14.039z" />
    </svg>
  );
}

export default SvgLgSolidTime;
