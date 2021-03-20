import * as React from "react";

function SvgSmSolidPlus(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={20}
      height={20}
      fill="#fff"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g
        clipPath="url(#sm-solid-plus_svg__clip0)"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="current"
      >
        <path d="M10-10a2.5 2.5 0 012.5 2.5v35a2.5 2.5 0 11-5 0v-35A2.5 2.5 0 0110-10z" />
        <path d="M-10 10a2.5 2.5 0 012.5-2.5h35a2.5 2.5 0 010 5h-35A2.5 2.5 0 01-10 10z" />
      </g>
      <defs>
        <clipPath id="sm-solid-plus_svg__clip0">
          <rect width={20} height={20} rx={10} fill="current" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default SvgSmSolidPlus;
