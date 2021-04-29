import React, { useState } from "react";

export interface NativeRadioProps {
  icon?: React.ReactElement;
  title: string;
  subtitle: string;
  checked?: boolean;
  onClick?: (id: number | undefined) => void;
  num?: number;
}

export const NativeRadio: React.FC<NativeRadioProps> = ({
  icon,
  title,
  subtitle,
  checked = false,
  onClick,
  num,
}) => {
  return (
    <button
      className="w-full flex px-3 py-2 bg-primary-900 rounded-8 justify-between group"
      onClick={onClick ? () => onClick(num) : undefined}
    >
      <div className="flex">
        {icon ? (
          <div className="mr-3 mt-1.5">
            {React.cloneElement(icon, { width: 10, height: 10 })}
          </div>
        ) : null}
        <div className="flex flex-col items-start">
          <div
            className={`font-bold group-hover:text-primary-100 transition duration-100 ${
              checked ? "text-primary-100" : "text-primary-300"
            }`}
          >
            {title}
          </div>
          <div className="text-primary-300">{subtitle}</div>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div className="w-4 h-4 relative">
          <div
            className={`${
              checked ? "bg-accent" : ""
            } w-2 h-2 absolute top-2/4 left-2/4 rounded-full transform -translate-y-1/2 -translate-x-1/2 transition duration-100`}
          ></div>
          <div
            className={`${
              checked ? "border-accent" : "border-primary-300"
            } border w-4 h-4 absolute top-2/4 left-2/4 rounded-full transform -translate-y-1/2 -translate-x-1/2 transition duration-100`}
          ></div>
        </div>
      </div>
    </button>
  );
};

export interface NativeRadioControllerProps {
  radios: NativeRadioProps[];
}

export const NativeRadioController: React.FC<NativeRadioControllerProps> = ({
  radios,
}) => {
  const [current, setCurrent] = useState(0); // To be changed by the stored user selection

  const handleClick = (id: number | undefined) => {
    if (id !== undefined) {
      setCurrent(id); // Probably would be easier to pass this func
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      {radios.map((r, i) => (
        <NativeRadio
          key={r.title + i}
          title={r.title}
          subtitle={r.subtitle}
          icon={r.icon}
          checked={current === i}
          onClick={handleClick}
          num={i}
        />
      ))}
    </div>
  );
};
