import * as React from "react";

function SvgSmSolidCompass(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={20}
      height={20}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M11.178 11.178L8.822 8.822c-.043-.043-.12-.033-.154.02l-2.38 4.735c-.052.087.049.188.135.135l4.736-2.38c.053-.034.062-.11.019-.154z"
        fill="currentColor"
      />
      <path
        d="M10 0C4.476 0 0 4.476 0 10s4.476 10 10 10 10-4.476 10-10S15.524 0 10 0zm1.952 11.986l-7.673 3.87c-.087.053-.188-.048-.135-.135L8.02 8.048a.112.112 0 01.034-.034l7.668-3.87c.087-.053.188.048.135.135l-3.875 7.673a.065.065 0 01-.03.034z"
        fill="currentColor"
      />
    </svg>
  );
}

export default SvgSmSolidCompass;
