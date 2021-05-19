import * as React from "react";

function DeveloperIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 21 21"
      width={16}
      height={16}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M18.5 10H17V6C17 4.9 16.1 4 15 4H11V2.5C11 1.1 9.9 0 8.5 0C7.1 0 6 1.1 6 2.5V4H2C0.9 4 0 4.9 0 6V9.8H1.5C3 9.8 4.2 11 4.2 12.5C4.2 14 3 15.2 1.5 15.2H0V19C0 20.1 0.9 21 2 21H5.8V19.5C5.8 18 7 16.8 8.5 16.8C10 16.8 11.2 18 11.2 19.5V21H15C16.1 21 17 20.1 17 19V15H18.5C19.9 15 21 13.9 21 12.5C21 11.1 19.9 10 18.5 10Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default DeveloperIcon;
