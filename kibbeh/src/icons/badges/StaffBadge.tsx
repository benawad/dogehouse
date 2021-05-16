import * as React from "react";

function SvgSolidStaffBadge(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g id="StaffBadge_svg__KMcxqn_tif_1_">
        <linearGradient
          id="StaffBadge_svg__SVGID_1_"
          gradientUnits="userSpaceOnUse"
          x1={1.523}
          y1={8}
          x2={14.477}
          y2={8}
        >
          <stop offset={0} stopColor="#fd4d4d" />
          <stop offset={1} stopColor="#f26767" />
        </linearGradient>
        <path
          d="M1.5 2.3c.6-.1 1.1-.2 1.6-.3 1.3-.3 2.6-.8 3.8-1.4l.9-.6c.2 0 .3 0 .4.1.7.4 1.4.8 2.1 1.1 1.1.5 2.2.8 3.4 1 .2 0 .5.1.7.1v7.1c0 .5-.1.9-.3 1.4-.4.9-1 1.7-1.8 2.4-.9.8-1.8 1.5-2.9 2.1-.4.2-.8.4-1.3.7h-.2c-1.2-.6-2.3-1.2-3.3-2-.8-.6-1.6-1.3-2.1-2.1-.4-.6-.8-1.3-.9-2v-.4-5.3c-.1-.7-.1-1.3-.1-1.9zm11.7 4.1V3.3c0-.1 0-.1-.1-.1-1-.2-2.1-.5-3-.9-.7-.3-1.4-.7-2-1h-.2c-.3.2-.5.3-.8.5-1.4.6-2.8 1.1-4.2 1.4-.1 0-.1.1-.1.2V9.7c.1.5.3.9.5 1.3.5.8 1.1 1.4 1.9 2 .9.7 1.8 1.3 2.8 1.8h.1c.1-.1.2-.1.4-.2.9-.5 1.8-1 2.5-1.7.7-.6 1.4-1.3 1.9-2.1.3-.5.5-1 .4-1.6-.1-.9-.1-1.8-.1-2.8z"
          fill={props.style?.color || "url(#StaffBadge_svg__SVGID_1_)"}
        />
      </g>
      <linearGradient
        id="StaffBadge_svg__SVGID_2_"
        gradientUnits="userSpaceOnUse"
        x1={4.592}
        y1={8}
        x2={11.408}
        y2={8}
      >
        <stop offset={0} stopColor="#fd4d4d" />
        <stop offset={1} stopColor="#f26767" />
      </linearGradient>
      <path
        d="M11.4 7.9V5v-.1c-.1 0-.3 0-.4-.1-.6-.1-1.2-.3-1.8-.5-.4-.1-.7-.3-1.1-.5h-.2c-.1.1-.3.2-.5.3-.6.3-1.3.6-2 .8-.2 0-.5 0-.8.1v3.9c.1.5.3.8.5 1.1.3.4.7.8 1.1 1.1.5.4 1.1.7 1.7 1H8c.2-.1.5-.2.7-.4.6-.3 1.1-.7 1.5-1.1.4-.4.7-.8.9-1.2.1-.2.2-.5.2-.7.1-.2.1-.5.1-.8z"
        fill={props.style?.color || "url(#StaffBadge_svg__SVGID_2_)"}
      />
      <path fill="none" d="M0 0h16v16H0z" />
    </svg>
  );
}

export default SvgSolidStaffBadge;
