import * as React from "react";

function SvgSmSolidFriends(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={27}
      height={20}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#sm-solid-friends_svg__clip0)" fill="currentColor">
        <path d="M10.164 10.055a5.014 5.014 0 005.027-5.028C15.191 2.295 12.896 0 10.164 0 7.322 0 5.027 2.295 5.027 5.027c0 2.733 2.295 5.028 5.137 5.028zm0 2.404C6.776 12.459 0 14.208 0 17.486V20h20.328v-2.514c0-3.278-6.776-5.027-10.164-5.027zM17.924 5.027c0 1.858-.765 3.607-1.968 4.918.219 0 .547.11.765.11a5.014 5.014 0 005.028-5.028C21.749 2.295 19.454 0 16.72 0c-.328 0-.546 0-.765.11 1.203 1.31 1.968 2.95 1.968 4.917zM20 12.896c.437.219.765.547 1.093.874 1.202 1.093 1.858 2.405 1.858 3.826v2.513h3.934v-2.623c0-2.404-3.606-3.934-6.885-4.59z" />
      </g>
      <defs>
        <clipPath id="sm-solid-friends_svg__clip0">
          <path fill="currentColor" d="M0 0h26.885v20H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default SvgSmSolidFriends;
