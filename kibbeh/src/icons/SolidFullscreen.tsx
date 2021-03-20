import * as React from "react";

function SvgSolidFullscreen(props: React.SVGProps<SVGSVGElement>) {
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.797 1.559h.934a.78.78 0 000-1.559H.747A.764.764 0 000 .78v3.118a.747.747 0 101.492 0v-1.5l3.144 3.328a.755.755 0 101.066-1.069L2.797 1.56zm10.38.01h-.945a.785.785 0 010-1.569h3.014a.768.768 0 01.753.785v3.143a.755.755 0 11-1.507 0v-1.51l-3.177 3.353a.762.762 0 11-1.078-1.079l2.94-3.123zM2.796 14.441h.934a.78.78 0 010 1.559H.747A.764.764 0 010 15.22v-3.118a.747.747 0 111.492 0v1.5l3.144-3.328a.755.755 0 111.066 1.069L2.797 14.44zm10.38-.01h-.945a.785.785 0 000 1.569h3.014a.767.767 0 00.753-.784v-3.143a.755.755 0 10-1.507 0v1.508l-3.177-3.352a.762.762 0 10-1.078 1.079l2.94 3.123z"
      />
    </svg>
  );
}

export default SvgSolidFullscreen;
