import * as React from "react";

function SvgSmSolidBug(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={20}
      height={20}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M17.5 5.688h-2.633a5.6 5.6 0 00-1.707-1.836l1.527-1.532L13.367 1l-2.035 2.035a5.576 5.576 0 00-2.652 0L6.633 1l-1.32 1.32 1.519 1.528a5.648 5.648 0 00-1.695 1.836H2.5v1.875h1.96a6.195 6.195 0 00-.085.937v.938H2.5v1.875h1.875v.937c0 .32.04.629.086.938H2.5v1.875h2.633A5.622 5.622 0 0010 17.87a5.622 5.622 0 004.867-2.812H17.5v-1.875h-1.96c.046-.309.085-.618.085-.938v-.937H17.5V9.434h-1.875v-.938c0-.32-.04-.629-.086-.937H17.5V5.687z"
        fill="#DEE3EA"
      />
    </svg>
  );
}

export default SvgSmSolidBug;
