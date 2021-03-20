import * as React from "react";

function SvgSolidMegaphone(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M12.504 3.979l-.825.821a2.91 2.91 0 01.853 2.057c0 .8-.328 1.532-.853 2.057l.825.825a4.074 4.074 0 000-5.76z" />
      <path d="M14.15 2.393l-.81.81a5.159 5.159 0 011.51 3.654 5.156 5.156 0 01-1.51 3.654l.81.81A6.322 6.322 0 0016 6.857c0-1.74-.707-3.318-1.85-4.464zm-3.864 3.04V1.713H9.143L5.714 4.572H1.143L0 5.142v4l1.143.572L4 14.286h1.714L4.643 9.714h1.071L9.143 12h1.143V8.282c.657-.06 1.143-.675 1.143-1.425s-.486-1.364-1.143-1.425z" />
    </svg>
  );
}

export default SvgSolidMegaphone;
