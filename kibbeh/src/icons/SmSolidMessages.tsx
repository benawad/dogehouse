import * as React from "react";

function SvgSmSolidMessages(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={20}
      height={20}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#sm-solid-messages_svg__clip0)" fill="#fff">
        <path d="M18.172 5.883H7.514c-1.01 0-1.833.823-1.833 1.833v7.421c0 1.01.823 1.828 1.833 1.828h6.099c.134 0 .269.058.365.154l3.03 2.794c.169.164.448.096.448-.14V17.34c0-.288.182-.38.47-.38h.049c1.01 0 2.025-.813 2.025-1.828V7.716a1.825 1.825 0 00-1.828-1.833z" />
        <path d="M6.073 4.703h8.533V1.562c0-.866-.702-1.568-1.568-1.568H1.562c-.866 0-1.568.702-1.568 1.568v7.946c0 .865.702 1.568 1.568 1.568H4.5V6.27a1.575 1.575 0 011.572-1.568z" />
      </g>
      <defs>
        <clipPath id="sm-solid-messages_svg__clip0">
          <path fill="#fff" d="M0 0h20v20H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default SvgSmSolidMessages;
