import * as React from "react";

function SvgSolidCompass(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M8.942 8.942L7.058 7.058c-.035-.035-.096-.027-.123.015L5.03 10.861c-.042.07.038.15.108.108l3.788-1.904c.042-.027.05-.088.015-.123z"
        fill="currentColor"
      />
      <path
        d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm1.562 9.588l-6.139 3.097c-.07.042-.15-.039-.108-.108l3.1-6.139a.09.09 0 01.027-.026l6.135-3.097c.07-.042.15.039.108.108l-3.1 6.139a.052.052 0 01-.023.026z"
        fill="currentColor"
      />
    </svg>
  );
}

export default SvgSolidCompass;
