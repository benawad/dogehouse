import * as React from "react";

function SvgSolidNew(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g
        clipPath="url(#sm-solid-new_svg__clip0)"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="currentColor"
      >
        <path d="M8-8a2 2 0 012 2v28a2 2 0 11-4 0V-6a2 2 0 012-2z" />
        <path d="M-8 8a2 2 0 012-2h28a2 2 0 110 4H-6a2 2 0 01-2-2z" />
      </g>
      <defs>
        <clipPath id="sm-solid-new_svg__clip0">
          <rect width={16} height={16} rx={8} fill="currentColor" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default SvgSolidNew;
