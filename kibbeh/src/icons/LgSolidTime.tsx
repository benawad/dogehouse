import * as React from "react";

function SvgLgSolidTime(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={39}
      height={39}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#lg-solid-time_svg__clip0)">
        <path
          d="M20 1.125c-9.874 0-17.875 8-17.875 17.875 0 9.874 8 17.875 17.875 17.875 9.874 0 17.875-8 17.875-17.875 0-9.874-8-17.875-17.875-17.875zm1.203 19.422c0 .662-.541 1.203-1.203 1.203h-8.25a1.207 1.207 0 01-1.203-1.203c0-.662.541-1.203 1.203-1.203h7.047V8c0-.662.541-1.203 1.203-1.203s1.203.541 1.203 1.203v12.547z"
          fill="#5D7290"
        />
      </g>
      <defs>
        <clipPath id="lg-solid-time_svg__clip0">
          <rect width={39} height={39} rx={19.5} fill="currentColor" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default SvgLgSolidTime;
