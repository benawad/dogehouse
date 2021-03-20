import * as React from "react";

function SvgSolidMessages(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#sm-solid-messages_svg__clip0)">
        <path d="M14.538 4.707H6.01c-.808 0-1.466.658-1.466 1.466v5.937c0 .808.658 1.462 1.466 1.462h4.879a.42.42 0 01.292.123l2.425 2.236c.134.13.357.077.357-.112v-1.947c0-.23.147-.304.377-.304h.039c.808 0 1.62-.65 1.62-1.462V6.173a1.46 1.46 0 00-1.462-1.466z" />
        <path d="M4.859 3.762h6.826V1.25c0-.693-.562-1.255-1.255-1.255H1.25C.557-.005-.005.557-.005 1.25v6.356c0 .693.562 1.255 1.255 1.255H3.6V5.017A1.26 1.26 0 014.86 3.762z" />
      </g>
      <defs>
        <clipPath id="sm-solid-messages_svg__clip0">
          <path d="M0 0h16v16H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default SvgSolidMessages;
