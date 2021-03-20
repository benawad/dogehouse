import * as React from "react";

function SvgSmSolidSearch(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={20}
      height={20}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g
        clipPath="url(#sm-solid-search_svg__clip0)"
        fillRule="evenodd"
        clipRule="evenodd"
        fill="#fff"
      >
        <path d="M9.015 2.254a6.761 6.761 0 100 13.522 6.761 6.761 0 000-13.522zM0 9.014a9.015 9.015 0 1118.03 0 9.015 9.015 0 01-18.03 0z" />
        <path d="M13.787 13.789c.44-.44 1.154-.44 1.594 0l4.289 4.289a1.127 1.127 0 01-1.594 1.593l-4.289-4.289a1.127 1.127 0 010-1.593z" />
      </g>
      <defs>
        <clipPath id="sm-solid-search_svg__clip0">
          <path fill="#fff" d="M0 0h20v20H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default SvgSmSolidSearch;
