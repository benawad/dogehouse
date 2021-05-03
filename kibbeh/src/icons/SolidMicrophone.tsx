import * as React from "react";

function SvgSolidMicrophone(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      data-testid="mic-on"
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M8 11.205a3.2 3.2 0 003.196-3.197V3.213C11.196 1.442 9.77 0 8.016 0a.746.746 0 00-.167.02 3.201 3.201 0 00-3.046 3.193v4.795a3.2 3.2 0 003.196 3.197z" />
      <path d="M7.2 14.346V16H8.8v-1.654c3.148-.395 5.594-3.083 5.594-6.338h-1.598A4.8 4.8 0 018 12.803a4.8 4.8 0 01-4.795-4.795H1.606c0 3.255 2.447 5.943 5.595 6.338z" />
    </svg>
  );
}

export default SvgSolidMicrophone;
