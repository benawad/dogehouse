import * as React from "react";

function SvgSolidDownload(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M12.9001 6.69999C12.4333 4.40003 10.4333 2.66663 8 2.66663C6.06673 2.66663 4.40007 3.76656 3.56673 5.36666C1.56673 5.56669 0 7.26656 0 9.33329C0 11.5332 1.79997 13.3333 4 13.3333H12.6667C14.5 13.3333 16 11.8333 16 9.99996C16 8.23336 14.6335 6.79993 12.9001 6.69999ZM6.93333 8.39996V5.86663H9.06667V8.39996H11.3333L8 11.7333L4.66667 8.39996H6.93333Z" />
    </svg>
  );
}

export default SvgSolidDownload;
