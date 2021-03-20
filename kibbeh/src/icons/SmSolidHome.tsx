import * as React from "react";

function SvgSmSolidHome(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={20}
      height={20}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#sm-solid-home_svg__clip0)">
        <path
          d="M19.994 7.6c-.11-.1-.11-.2-.222-.3L11.885.6C11.33.2 10.664 0 9.997 0 9.442 0 8.775.2 8.22.6L.333 7.2c-.11.1-.222.2-.222.3C0 7.7 0 7.8 0 8v10.2C0 19.3 1.11 20 2.555 20H6.33c1.333 0 2.555-.7 2.555-1.9V17c-.11-.5.445-1 1.111-1 .667 0 1.222.5 1.222 1.1v1.1c0 1.2 1.11 1.9 2.555 1.9h3.777c1.332 0 2.554-.7 2.554-1.9V8c0-.1 0-.3-.11-.4z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="sm-solid-home_svg__clip0">
          <path fill="currentColor" d="M0 0h20v20H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default SvgSmSolidHome;
