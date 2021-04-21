import * as React from "react";

function LinkIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="8"
      viewBox="0 0 16 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M1.52143 4C1.52143 2.63214 2.63214 1.52143 4 1.52143H7.14286V0H4C1.79286 0 0 1.79286 0 4C0 6.20714 1.79286 8 4 8H7.14286V6.47857H4C2.63214 6.47857 1.52143 5.36786 1.52143 4ZM4.57143 4.78571H11.4286V3.21429H4.57143V4.78571ZM12 0H8.85714V1.52143H12C13.3679 1.52143 14.4786 2.63214 14.4786 4C14.4786 5.36786 13.3679 6.47857 12 6.47857H8.85714V8H12C14.2071 8 16 6.20714 16 4C16 1.79286 14.2071 0 12 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default LinkIcon;
