import React, { ReactChild } from "react";

export interface NativeCheckboxProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

export interface ToggleProps {
  on?: boolean;
  className?: string;
  ariaLabel?: string;
  toggle?: () => void;
  onClick?: () => void;
}

const Toggle: React.FC<ToggleProps> = ({
  on = false,
  className = "",
  ariaLabel,
  onClick,
  ...props
}) => {
  const togglerClass = [
    className,
    "toggle-btn",
    on ? "toggle-btn-on" : "toggle-btn-off",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <label
      aria-label={ariaLabel || "Toggle"}
      aria-hideen="true"
      style={{ display: "block" }}
    >
      <input
        className="form-checkbox"
        type="checkbox"
        checked={on}
        onChange={() => {}}
        onClick={onClick}
        data-testid="toggle-input"
      />
      <span className={togglerClass} {...props} />
    </label>
  );
};

// Accepts `on` and `children` props and returns `children` if `on` is true
const ToggleOn = ({ on, children }: ToggleProps & NativeCheckboxProps) => {
  return <React.Fragment>{on ? children : null}</React.Fragment>;
};

// Accepts `on` and `children` props and returns `children` if `on` is false
const ToggleOff = ({ on, children }: ToggleProps & NativeCheckboxProps) => {
  return <React.Fragment>{on ? null : children}</React.Fragment>;
};

// Accepts `on` and `toggle` props and returns the <Switch /> with those props.
const ToggleButton = ({ on, toggle }: ToggleProps) => (
  <Toggle on={on} onClick={toggle} />
);

const allowedTypes = [ToggleOn, ToggleOff, ToggleButton];

const ToggleHelper = ({ children }: any) => {
  const [on, setOn] = React.useState(false);
  const toggle = () => setOn(!on);

  return React.Children.map(children, (child) => {
    if (allowedTypes.includes(child.type)) {
      const newChild = React.cloneElement(child as any, { on, toggle });
      return newChild;
    }
    return child;
  });
};

export const NativeCheckBox: React.FC = ({ children }) => {
  return (
    <div>
      <React.Fragment>
        <ToggleHelper>
          <ToggleOn>Check my box</ToggleOn>
          <ToggleOff>Yo</ToggleOff>
          <ToggleButton />
        </ToggleHelper>
        <div>{children}</div>
      </React.Fragment>
    </div>
  );
};
