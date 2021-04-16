import * as React from "react";

function MacCloseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" {...props}>
      <path
        stroke="currentColor"
        fill="none"
        d="M8.5,3.5 L6,6 L3.5,3.5 L6,6 L3.5,8.5 L6,6 L8.5,8.5 L6,6 L8.5,3.5 Z"
      ></path>
    </svg>
  );
}

export default MacCloseIcon;
