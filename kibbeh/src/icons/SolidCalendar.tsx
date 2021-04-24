import * as React from "react";

function SvgSolidCalendar(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#sm-solid-calendar_svg__clip0)">
        <path
          d="M14.461.348h-1.538V1.39c0 .192-.138.348-.308.348H12c-.17 0-.308-.156-.308-.348V.348H4.308V1.39c0 .192-.139.348-.308.348h-.615c-.17 0-.308-.156-.308-.348V.348H1.538C.692.348 0 1.13 0 2.087v11.826c0 .957.692 1.74 1.538 1.74h12.923c.847 0 1.539-.783 1.539-1.74V2.087c0-.957-.692-1.74-1.539-1.74zm.308 13.043c0 .479-.346.87-.769.87H2c-.423 0-.77-.391-.77-.87V5.565c0-.191.14-.348.308-.348h12.923c.17 0 .308.157.308.348v7.826zM4.308-.696c0-.19-.139-.347-.308-.347h-.615c-.17 0-.308.156-.308.347V.348h1.23V-.696zm8.615 0c0-.19-.138-.347-.308-.347H12c-.17 0-.308.156-.308.347V.348h1.231V-.696z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="sm-solid-calendar_svg__clip0">
          <path fill="currentColor" d="M0 0h16v16H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default SvgSolidCalendar;
