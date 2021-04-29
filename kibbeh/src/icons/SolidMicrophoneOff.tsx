import * as React from "react";

function SvgSolidMicrophoneOff(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      data-testid="mic-off"
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#solid-microphone-off_svg__clip0)" fill="currentColor">
        <path d="M15.758 14.636l-2.718-2.717a6.338 6.338 0 001.353-3.91h-1.598c0 .994-.313 1.963-.894 2.77L10.743 9.62a3.138 3.138 0 00.454-1.612V3.213C11.197 1.442 9.77 0 8.017 0a.74.74 0 00-.167.02 3.201 3.201 0 00-3.047 3.193v.469L1.373.25.243 1.38l14.385 14.385 1.13-1.13zM3.205 8.008H1.607c0 3.255 2.445 5.943 5.594 6.339V16h1.598v-1.653a6.34 6.34 0 001.791-.504l-1.238-1.237c-.439.13-.894.197-1.352.197a4.8 4.8 0 01-4.795-4.795z" />
        <path d="M4.81 8.062A3.194 3.194 0 007.946 11.2L4.809 8.062z" />
      </g>
      <defs>
        <clipPath id="solid-microphone-off_svg__clip0">
          <path fill="currentColor" d="M0 0h16v16H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default SvgSolidMicrophoneOff;
