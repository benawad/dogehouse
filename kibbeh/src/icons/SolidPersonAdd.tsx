import * as React from "react";

function SvgSolidPersonAdd(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M9.6 8.4C11.3602 8.4 12.8 6.95997 12.8 5.2C12.8 3.44003 11.3602 2 9.6 2C7.83983 2 6.4 3.44003 6.4 5.2C6.4 6.95997 7.83983 8.4 9.6 8.4ZM9.6 10C7.48007 10 3.2 11.0801 3.2 13.2V14.8H16V13.2C16 11.0801 11.7199 10 9.6 10ZM3.2 7.33333V5.2H2.13333V7.33333H0V8.4H2.13333V10.5333H3.2V8.4H5.33333V7.33333H3.2Z" />
    </svg>
  );
}

export default SvgSolidPersonAdd;
