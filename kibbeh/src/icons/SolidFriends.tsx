import * as React from "react";

function SvgSolidFriends(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={22}
      height={16}
      viewBox="0 0 22 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#sm-solid-friends_svg__clip0)" fill="currentColor">
        <path d="M8.131 8.044a4.011 4.011 0 004.022-4.022C12.153 1.836 10.317 0 8.131 0c-2.273 0-4.11 1.836-4.11 4.022s1.837 4.022 4.11 4.022zm0 1.923C5.421 9.967 0 11.367 0 13.99V16h16.262v-2.011c0-2.623-5.42-4.022-8.13-4.022zM14.339 4.022c0 1.486-.612 2.885-1.574 3.934.175 0 .437.088.612.088a4.011 4.011 0 004.022-4.022C17.399 1.836 15.563 0 13.377 0c-.262 0-.437 0-.612.087.962 1.05 1.574 2.361 1.574 3.935zM16 10.317c.35.175.612.437.874.7.962.874 1.487 1.923 1.487 3.06v2.01h3.147V13.99c0-1.923-2.885-3.148-5.508-3.672z" />
      </g>
      <defs>
        <clipPath id="sm-solid-friends_svg__clip0">
          <path fill="currentColor" d="M0 0h21.6v16H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default SvgSolidFriends;
