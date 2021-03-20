import * as React from "react";

function SvgSolidNotification(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M8.16 16c.877 0 1.594-.72 1.594-1.6H6.568c0 .88.717 1.6 1.593 1.6zm5.177-4.8V6.8c0-2.44-1.712-4.52-3.982-5.04V1.2c0-.68-.517-1.2-1.194-1.2-.677 0-1.195.52-1.195 1.2v.56c-2.27.52-3.982 2.6-3.982 5.04v4.4l-1.592 1.6v.8H14.93v-.8l-1.593-1.6z" />
    </svg>
  );
}

export default SvgSolidNotification;
