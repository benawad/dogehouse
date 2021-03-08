import * as React from "react";

function SvgSmSolidSearch(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={18}
      height={18}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M8.25 14.25a6 6 0 100-12 6 6 0 000 12zM15.75 15.75l-3.262-3.262"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default SvgSmSolidSearch;
