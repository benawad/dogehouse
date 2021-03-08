import * as React from "react";

function SvgSmSolidVolume(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={27}
      height={27}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M14.708 7.678a.845.845 0 00-.891.1l-3.439 2.769H7.594a.846.846 0 00-.844.844v4.218c0 .464.38.844.844.844h2.784l3.438 2.769a.856.856 0 00.528.184.844.844 0 00.844-.844V8.438a.832.832 0 00-.48-.76zm3.981 1.951a.62.62 0 00-.886-.005.638.638 0 00-.005.896A4.233 4.233 0 0119 13.505a4.252 4.252 0 01-1.202 2.985.638.638 0 00.005.897.62.62 0 00.886-.006 5.504 5.504 0 001.561-3.87h-.01c0-1.477-.544-2.853-1.55-3.882z"
        fill="currentColor"
      />
    </svg>
  );
}

export default SvgSmSolidVolume;
