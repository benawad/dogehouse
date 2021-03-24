import * as React from "react";

function SvgSolidBug(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M15.113 4.445h-2.497a5.31 5.31 0 00-1.619-1.74l1.449-1.453L11.194 0l-1.93 1.93a5.288 5.288 0 00-2.516 0L4.808 0 3.554 1.252l1.441 1.449a5.357 5.357 0 00-1.608 1.74h-2.5V6.22h1.86a5.875 5.875 0 00-.082.89v.888H.888v1.778h1.778v.89c0 .303.037.596.081.889H.887v1.778h2.498A5.332 5.332 0 008 16a5.332 5.332 0 004.616-2.667h2.497v-1.778h-1.86a5.87 5.87 0 00.082-.89v-.889h1.778V7.998h-1.778V7.11a5.87 5.87 0 00-.082-.889h1.86V4.445z" />
    </svg>
  );
}

export default SvgSolidBug;
