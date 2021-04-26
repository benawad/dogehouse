import React, { Children } from "react";

export interface ToggleContext {
  title?: string;
  description?: string;
  on?: boolean;
  toggle?: (s: boolean) => any;
  onClick?: any; // for now :)
  className?: string;
  children?: React.ReactNode;
}
export const MyToggleContext = React.createContext<ToggleContext>({});

export const Toggle: React.FC<ToggleContext> = ({ children }) => {
  const [on, setOn] = React.useState(false);
  const toggle = () => setOn(!on);
  return (
    <MyToggleContext.Provider value={{ on, toggle }}>
      {children}
    </MyToggleContext.Provider>
  );
};

const ToggleSwitch: React.FC<ToggleContext> = ({
  on,
  onClick,
  className = "",
  ...props
}) => {
  return (
    <label aria-label={"Toggle"} aria-hidden="false">
      <input
        // className="form-checkbox"
        id="toggle"
        type="checkbox"
        checked={on}
        onChange={() => {}}
        onClick={onClick}
        data-testid="toggle-input"
      />
      <span
        className={on ? "text-primary-100" : "text-primary-300"}
        {...props}
      />
    </label>
  );
};

// small util hook for validation of context
function useToggle() {
  return React.useContext(MyToggleContext);
}

function ToggleOn({ children }: ToggleContext) {
  const { on } = useToggle();
  return <React.Fragment>{on ? children : null}</React.Fragment>;
}

function ToggleOff({ children }: ToggleContext) {
  const { on } = useToggle();
  return <React.Fragment>{on ? null : children}</React.Fragment>;
}

function ToggleButton({ ...props }) {
  const { on, toggle } = useToggle();
  console.log({ toggle, on });
  return <ToggleSwitch on={on} onClick={toggle} {...props} />;
}

export const NativeCheckBox: React.FC<ToggleContext> = ({
  on,
  title,
  toggle,
  description,
  ...props
}) => {
  return (
    <div>
      <Toggle>
        <div className="container flex-col justify-between">
          <div
            style={{
              width: "601px",
              height: "64px",
              borderRadius: "8px",
              background: "#151A21",
              justifyContent: "space-between",
            }}
            className="flex mt-4"
          >
            <div className="ml-3 mt-2 mb-2 relative">
              <span
                id="title"
                className={
                  on
                    ? `text-primary-100 font-bold`
                    : `text-primary-300 font-bold`
                }
              >
                {console.log("on is: ", on)}
                {title}
              </span>
              <p id="description" className="text-primary-300">
                {description}
              </p>
            </div>
            <div
              style={{ margin: "22px 15px 22px 0" }}
              className="flex justify-center content-center"
            >
              {on ? <ToggleOff /> : <ToggleOn />}
              <div>
                <ToggleButton />
              </div>
            </div>
          </div>
        </div>
      </Toggle>
    </div>
  );
};
