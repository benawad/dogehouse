import * as React from "react";

export default function SvgSolidFriendsAdd(
  props: React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      width={20}
      height={16}
      viewBox="0 0 20 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M12 8C14.2002 8 16 6.19996 16 4C16 1.80004 14.2002 0 12 0C9.79979 0 8 1.80004 8 4C8 6.19996 9.79979 8 12 8ZM12 10C9.35008 10 4 11.3501 4 14V16H20V14C20 11.3501 14.6499 10 12 10ZM4 6.66667V4H2.66667V6.66667H0V8H2.66667V10.6667H4V8H6.66667V6.66667H4Z" />
    </svg>
  );
}
