import * as React from "react";

function SvgSmSolidCalendar(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={20}
      height={20}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#sm-solid-calendar_svg__clip0)">
        <path
          d="M18.077.435h-1.923v1.304c0 .24-.173.435-.385.435H15c-.211 0-.385-.196-.385-.435V.435h-9.23v1.304c0 .24-.173.435-.385.435h-.77c-.21 0-.384-.196-.384-.435V.435H1.923C.865.435 0 1.413 0 2.609V17.39c0 1.196.865 2.174 1.923 2.174h16.154c1.058 0 1.923-.978 1.923-2.174V2.61c0-1.196-.865-2.174-1.923-2.174zm.384 16.304c0 .598-.432 1.087-.961 1.087h-15c-.529 0-.962-.489-.962-1.087V6.957c0-.24.174-.435.385-.435h16.154c.211 0 .384.195.384.435v9.782zM5.386-.87c0-.239-.173-.434-.385-.434h-.77c-.21 0-.384.195-.384.434V.435h1.539V-.87zm10.769 0c0-.239-.173-.434-.385-.434H15c-.211 0-.385.195-.385.434V.435h1.539V-.87z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="sm-solid-calendar_svg__clip0">
          <path fill="currentColor" d="M0 0h20v20H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default SvgSmSolidCalendar;
