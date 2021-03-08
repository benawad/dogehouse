import * as React from "react";

function SvgSmSolidTime(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={18}
      height={18}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9 1.688A7.311 7.311 0 001.687 9 7.311 7.311 0 009 16.313 7.311 7.311 0 0016.313 9 7.311 7.311 0 009 1.687zm.492 7.945c0 .27-.221.492-.492.492H5.625a.494.494 0 01-.492-.492c0-.27.221-.492.492-.492h2.883V4.5c0-.27.221-.492.492-.492.27 0 .492.221.492.492v5.133z"
        fill="#B2BDCD"
      />
    </svg>
  );
}

export default SvgSmSolidTime;
