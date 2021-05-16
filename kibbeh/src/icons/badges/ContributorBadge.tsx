import * as React from "react";

interface SvgSolidContributorBadgeProps extends React.SVGProps<SVGSVGElement> {
  contributions: number;
}

function SvgSolidContributorBadge(props: SvgSolidContributorBadgeProps) {
  const fill = props.style?.color || "#5df4df";
  let variant = (
    <path
      d="M8 0L0 8l8 8 8-8-8-8zm-.8 5.1L4.3 8l2.9 2.9v2.6L1.7 8l5.5-5.5v2.6zm1.6 5.8L11.7 8 8.8 5.1V2.5L14.3 8l-5.5 5.5v-2.6z"
      fill={fill}
    />
  );

  if (props.contributions >= 1000) {
    variant = (
      <>
        <path
          fill={fill}
          d="M11.098 15.716l4.596-4.596.495.495-4.596 4.596zM-.005 4.624L4.59.028l.495.495L.49 5.12zM8.1.1l-8 8 8 8 8-8-8-8zm-.8 13.5L1.8 8.1l5.5-5.5v2.6L4.4 8.1 7.3 11v2.6zM7 9.5l.2-1.2-.8-.9 1.2-.2.5-1.1.5 1.1 1.2.2-.8.9.2 1.2-1.1-.6-1.1.6zM9 11l2.9-2.9L9 5.2V2.6l5.5 5.5L9 13.6V11zM11.092.518l.495-.495 4.597 4.596-.495.495zM0 11.62l.496-.494 4.596 4.596-.495.495z"
        />
        <path
          fill={fill}
          d="M11.098 15.716l4.596-4.596.495.495-4.596 4.596zM-.005 4.624L4.59.028l.495.495L.49 5.12zM8.1.1l-8 8 8 8 8-8-8-8zm-.8 13.5L1.8 8.1l5.5-5.5v2.6L4.4 8.1 7.3 11v2.6zM7 9.5l.2-1.2-.8-.9 1.2-.2.5-1.1.5 1.1 1.2.2-.8.9.2 1.2-1.1-.6-1.1.6zM9 11l2.9-2.9L9 5.2V2.6l5.5 5.5L9 13.6V11zM11.092.518l.495-.495 4.597 4.596-.495.495zM0 11.62l.496-.494 4.596 4.596-.495.495z"
        />
      </>
    );
  } else if (props.contributions >= 500) {
    variant = (
      <path
        fill={fill}
        d="M8.1.1l-8 8 8 8 8-8-8-8zm-.8 5.1L4.4 8.1 7.3 11v2.6L1.8 8.1l5.5-5.5v2.6zM9 11l2.9-2.9L9 5.2V2.6l5.5 5.5L9 13.6V11zM11.098 15.716l4.596-4.596.495.495-4.596 4.596zM-.005 4.624L4.59.028l.495.495L.49 5.12zM11.092.518l.495-.495 4.597 4.596-.495.495zM0 11.62l.496-.494 4.596 4.596-.495.495z"
      />
    );
  } else if (props.contributions >= 250) {
    variant = (
      <path
        fill={fill}
        d="M8.1.1l-8 8 8 8 8-8-8-8zm-.8 5.1L4.4 8.1 7.3 11v2.6L1.8 8.1l5.5-5.5v2.6zM9 11l2.9-2.9L9 5.2V2.6l5.5 5.5L9 13.6V11zM11.098 15.716l4.596-4.596.495.495-4.596 4.596zM-.005 4.624L4.59.028l.495.495L.49 5.12zM0 11.62l.496-.494 4.596 4.596-.495.495z"
      />
    );
  } else if (props.contributions >= 150) {
    variant = (
      <path
        fill={fill}
        d="M8.1.1l-8 8 8 8 8-8-8-8zm-.8 5.1L4.4 8.1 7.3 11v2.6L1.8 8.1l5.5-5.5v2.6zM9 11l2.9-2.9L9 5.2V2.6l5.5 5.5L9 13.6V11zM11.098 15.715l4.596-4.596.495.495-4.596 4.596zM-.005 4.624L4.59.028l.495.495L.49 5.12z"
      />
    );
  } else if (props.contributions >= 50) {
    variant = (
      <path
        fill={fill}
        d="M8.1.1l-8 8 8 8 8-8-8-8zm-.8 5.1L4.4 8.1 7.3 11v2.6L1.8 8.1l5.5-5.5v2.6zM9 11l2.9-2.9L9 5.2V2.6l5.5 5.5L9 13.6V11zM-.005 4.624L4.59.028l.495.495L.49 5.12z"
      />
    );
  }

  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {variant}
    </svg>
  );
}

export default SvgSolidContributorBadge;
