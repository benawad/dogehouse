import * as React from "react";

function SvgSmSolidFullscreen(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={17}
      height={17}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.8 1.56h.935a.78.78 0 000-1.56H.747a.765.765 0 00-.746.78V3.9a.747.747 0 101.493 0V2.4l3.147 3.33A.756.756 0 105.71 4.66l-2.91-3.1zm10.388.01h-.945a.786.786 0 010-1.57h3.017a.77.77 0 01.754.785v3.146a.756.756 0 11-1.509 0V2.42l-3.18 3.355a.763.763 0 11-1.078-1.08l2.941-3.126zM2.8 14.452h.936a.78.78 0 010 1.56H.747a.765.765 0 01-.746-.78v-3.12a.747.747 0 111.493 0v1.5l3.147-3.33a.756.756 0 011.068 1.07l-2.91 3.1zm10.39-.01h-.946a.785.785 0 000 1.57h3.017a.77.77 0 00.754-.785v-3.145a.756.756 0 10-1.509 0v1.51l-3.18-3.355a.762.762 0 10-1.078 1.08l2.941 3.125z"
        fill="currentColor"
      />
    </svg>
  );
}

export default SvgSmSolidFullscreen;
