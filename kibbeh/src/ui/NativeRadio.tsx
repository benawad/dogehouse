/* eslint-disable operator-linebreak */
import { Console } from "node:console";
import React, { ChangeEvent, HTMLAttributes, ReactNode } from "react";
import SolidMoon from "../icons/SolidMoon";

export interface NativeRadioProps {
  icon?: string | React.SVGProps<SVGSVGElement>;
  title: string;
  description: string;
  id?: Settings;
  checked?: boolean;
  radios?: Array<RadioOptions>;
  children?: ReactNode;
}

export type RadioOptions = Omit<NativeRadioProps, "children">;

export type Settings = "online" | "not-disturb" | "dark-theme" | "light-theme";

const optionalChangedColor = "text-primary-300";

export function NativeRadioList({
  radios,
  icon,
  title,
  id,
  checked = false,
  description,
  children,
  ...args
}: NativeRadioProps) {
  const [radioSelected, setRadioSelected] = React.useState<
    NativeRadioProps | boolean
  >(false);
  const radioRef = React.useRef<HTMLInputElement>(null);

  const setSetttings = (e: React.MouseEvent) => {
    const { current } = radioRef;
    if (current && !current.contains(e.target as any)) {
      setRadioSelected(false);
    }

    console.log(radioRef.current?.value);
  };

  return (
    <React.Fragment>
      <div
        style={{
          width: "601px",
          height: "64px",
          borderRadius: "8px",
          background: "#151A21",
        }}
        className="flex justify-between mt-4"
      >
        <div
          style={{ marginTop: "16px", marginBottom: "38px" }}
          className={icon ? `flex flex-none absolute ml-3 mr-3` : `absolute `}
        >
          {icon}
        </div>
        <div className={icon ? `ml-6 mt-2 mb-2 relative` : `ml-3 mt-2 mb-2`}>
          <span
            className={
              radioSelected !== checked
                ? `text-primary-100 font-bold`
                : `${optionalChangedColor} font-bold`
            }
          >
            {title}
          </span>
          <p className="text-primary-300">{description}</p>
        </div>
        <div>
          <label
            style={{ margin: "22px 15px 22px 0" }}
            className="flex justify-center content-center"
          >
            <input
              type="radio"
              ref={radioRef}
              name={id}
              className="form-radio text-primary-900"
              id={id}
              checked={checked !== radioSelected}
              onChange={() => setRadioSelected(!radioSelected)}
              onClick={setSetttings}
              value={id}
            />
          </label>
        </div>
      </div>
      {children}
    </React.Fragment>
  );
}

export const NativeRadio: React.FC<NativeRadioProps> = ({ radios }) => {
  return (
    <div>
      <div className="container flex flex-col">
        {radios?.map((room) => (
          <NativeRadioList
            key={room.id}
            id={room.id}
            icon={room.icon}
            title={room.title}
            description={room.description}
            checked={room.checked}
          />
        ))}
      </div>
    </div>
  );
};
