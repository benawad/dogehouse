import * as React from "react";

function Smiley(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.111 2.18a7 7 0 1 1 7.778 11.64A7 7 0 0 1 4.11 2.18zm.556 10.809a6 6 0 1 0 6.666-9.978 6 6 0 0 0-6.666 9.978zM6.5 7a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm5 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM8 11a3 3 0 0 1-2.65-1.58l-.87.48a4 4 0 0 0 7.12-.16l-.9-.43A3 3 0 0 1 8 11z"
      />
    </svg>
  );
}

export default Smiley;
