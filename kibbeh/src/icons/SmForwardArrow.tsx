import * as React from "react";

function SvgSmSolidVolume(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={6}
      height={11}
      viewBox="0 0 6 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3.93017 5.5L0.206543 1.7793C-0.0688475 1.50391 -0.0688475 1.05859 0.206543 0.786133C0.481933 0.513672 0.927244 0.513672 1.20263 0.786133L5.42138 5.00195C5.68798 5.26855 5.69384 5.69629 5.44188 5.97168L1.20556 10.2168C1.06787 10.3545 0.886229 10.4219 0.707518 10.4219C0.528808 10.4219 0.347167 10.3545 0.209472 10.2168C-0.0659177 9.94141 -0.0659177 9.49609 0.209472 9.22363L3.93017 5.5Z"
        fill="#DEE3EA"
      />
    </svg>
  );
}

export default SvgSmSolidVolume;
