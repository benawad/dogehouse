import * as React from "react";

function SvgSmSolidMicrophone(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={20}
      height={20}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M10 13.333A3.337 3.337 0 0013.333 10V5c0-1.848-1.487-3.35-3.316-3.35a.778.778 0 00-.174.02A3.338 3.338 0 006.667 5v5A3.337 3.337 0 0010 13.333z"
        fill="currentColor"
      />
      <path
        d="M9.167 16.61v1.723h1.666V16.61c3.283-.412 5.834-3.215 5.834-6.609H15c0 2.758-2.242 5-5 5s-5-2.242-5-5H3.333c0 3.393 2.551 6.197 5.834 6.61z"
        fill="currentColor"
      />
    </svg>
  );
}

export default SvgSmSolidMicrophone;
