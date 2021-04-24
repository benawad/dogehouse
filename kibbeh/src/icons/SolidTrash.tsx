import * as React from "react";

export default function SvgSolidTrash(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M2.66634 14.2262C2.66634 15.2019 3.46626 16 4.44414 16H11.5553C12.5331 16 13.333 15.2019 13.333 14.2262V4H2.66634V14.2262ZM14.6664 1.33333H11.333L10.217 0H5.78243L4.66634 1.33333H1.33301V2.66667H14.6664V1.33333Z" />
    </svg>
  );
}
