/* eslint-disable operator-linebreak */
import React, { HTMLAttributes, ReactNode } from "react";
import SolidMoon from "../icons/SolidMoon";

export interface NativeRadioProps {
  icon?: string | React.SVGProps<SVGSVGElement>;
  checked?: boolean;
  title: string;
  description: string;
  id?: Settings | string;
  onClick?: () => void;
  radios?: Array<RadioOptions>;
  children?: ReactNode;
}

export type RadioOptions = Omit<NativeRadioProps, "children">;

export type Settings = "online" | "not-disturb" | "dark-theme" | "light-theme";

// this allows us to set a default color when checked is false
const optionalChangedColor = "text-primary-300";

const backgroundColor = "text-primary-800";

function NativeRadioList({
  radios,
  icon,
  checked,
  title,
  id,
  description,
  ...props
}: NativeRadioProps) {
  const [radioSelected, setRadioSelected] = React.useState<NativeRadioProps>();
  const selectedRadio = React.useRef(null);
  const handleSubmit = () => {
    return radioSelected
      ? // eslint-disable-next-line no-alert
        alert(`Selected settings: ${radioSelected}`)
      : undefined;
  };

  return (
    <>
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
          className="flex flex-none absolute ml-3 mr-3"
        >
          {icon}
        </div>
        <div className="ml-6 mt-2 mb-2">
          <span className={`${optionalChangedColor} font-bold`}>{title}</span>
          <p className="text-primary-300">{description}</p>
        </div>
        <div>
          <label
            style={{ margin: "22px 15px 22px 0" }}
            className="flex justify-center content-center"
          >
            <input
              type="radio"
              ref={selectedRadio}
              className="form-radio text-primary-900"
              id={id}
              checked={checked}
              // onClick={handleRadioChange}
            />
          </label>
        </div>
      </div>
    </>
  );
}

export const NativeRadio: React.FC<NativeRadioProps> = ({
  radios,
  children,
  ...props
}) => {
  return (
    <div>
      <div className="container flex flex-col" {...props}>
        {radios?.map((room, idx) => (
          <NativeRadioList
            key={room.id}
            icon={room.icon}
            title={room.title}
            description={room.description}
            checked={room.checked}
          />
        ))}
      </div>
      {children}
    </div>
  );
};
