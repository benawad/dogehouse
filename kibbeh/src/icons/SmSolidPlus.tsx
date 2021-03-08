import * as React from "react";

function SvgSmSolidPlus(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={12}
      height={12}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        stroke="#DEE3EA"
        strokeWidth={2}
        strokeLinecap="round"
        d="M6 1v10M11 6H1"
      />
    </svg>
  );
}

export default SvgSmSolidPlus;
