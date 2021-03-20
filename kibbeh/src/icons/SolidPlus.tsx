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
      <g clipPath="url(#clip12)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M8 0C8.55228 0 9 0.447715 9 1V15C9 15.5523 8.55228 16 8 16C7.44772 16 7 15.5523 7 15V1C7 0.447715 7.44772 0 8 0Z"
          fill="#DEE3EA"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0.000976562 8C0.000976562 7.44772 0.448692 7 1.00098 7H15.001C15.5533 7 16.001 7.44772 16.001 8C16.001 8.55228 15.5533 9 15.001 9H1.00098C0.448692 9 0.000976562 8.55228 0.000976562 8Z"
          fill="#DEE3EA"
        />
      </g>
      <defs>
        <clipPath id="clip12">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default SvgSolidMessages;
