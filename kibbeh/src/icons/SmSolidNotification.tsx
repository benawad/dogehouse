import * as React from "react";

function SvgSmSolidNotification(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={20}
      height={20}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M10.201 20c1.095 0 1.991-.9 1.991-2H8.21c0 1.1.896 2 1.991 2zm6.47-6V8.5c0-3.05-2.14-5.65-4.977-6.3v-.7c0-.85-.647-1.5-1.493-1.5a1.47 1.47 0 00-1.493 1.5v.7C5.87 2.85 3.73 5.45 3.73 8.5V14l-1.99 2v1h16.923v-1l-1.991-2z"
        fill="#fff"
      />
    </svg>
  );
}

export default SvgSmSolidNotification;
