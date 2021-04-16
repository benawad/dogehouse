import * as React from "react";

function SolidChatBubble(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M14.4 0H1.6A1.6 1.6 0 000 1.6V16l3.2-3.2h11.2a1.6 1.6 0 001.6-1.6V1.6A1.6 1.6 0 0014.4 0z"
        fill="currentColor"
      />
    </svg>
  );
}

export default SolidChatBubble;
