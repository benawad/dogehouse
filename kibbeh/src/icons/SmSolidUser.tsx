import * as React from "react";

function SvgSmSolidUser(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={20}
      height={20}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M10 10a3.76 3.76 0 003.75-3.75A3.76 3.76 0 0010 2.5a3.76 3.76 0 00-3.75 3.75A3.76 3.76 0 0010 10zm0 1.875c-2.484 0-7.5 1.266-7.5 3.75V17.5h15v-1.875c0-2.484-5.016-3.75-7.5-3.75z"
        fill="#DEE3EA"
      />
    </svg>
  );
}

export default SvgSmSolidUser;
