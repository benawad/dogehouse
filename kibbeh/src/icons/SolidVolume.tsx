import * as React from "react";

function SvgSolidVolume(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M9.431 1.1a1.002 1.002 0 00-1.056.119L4.3 4.5H1c-.55 0-1 .45-1 1v5c0 .55.45 1 1 1h3.3l4.075 3.281c.181.144.406.219.625.219a1 1 0 001-1V2a.986.986 0 00-.569-.9zm4.719 2.313a.736.736 0 00-1.05-.007.756.756 0 00-.006 1.063 5.017 5.017 0 011.425 3.537 5.04 5.04 0 01-1.425 3.538.756.756 0 00.006 1.062.735.735 0 001.05-.006A6.523 6.523 0 0016 8.012h-.012c0-1.75-.644-3.38-1.838-4.6z" />
    </svg>
  );
}

export default SvgSolidVolume;
