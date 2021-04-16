import * as React from "react";

function MacMinimizeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" {...props}>
      <rect
        fill="currentColor"
        width="8"
        height="2"
        x="2"
        y="5"
        fillRule="evenodd"
      ></rect>
    </svg>
  );
}

export default MacMinimizeIcon;
