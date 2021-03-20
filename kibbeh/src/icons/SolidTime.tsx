import * as React from "react";

function SvgSolidTime(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm.538 8.692A.54.54 0 018 9.231H4.308a.54.54 0 01-.539-.539.54.54 0 01.539-.538h3.154V3.077A.54.54 0 018 2.538a.54.54 0 01.538.539v5.615z" />
    </svg>
  );
}

export default SvgSolidTime;
