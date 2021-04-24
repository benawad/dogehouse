import React, { ReactNode } from "react";

export interface NativeRadioProps {
  checked?: boolean;
  children: ReactNode;
}

export const NativeRadio: React.FC<NativeRadioProps> = ({
  checked,
  children,
}) => {
  return (
    <div className="block">
      <span className="text-primary-100">Radio Buttons</span>
      <div className="mt-2">
        <div>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio text-primary-900"
              name="radio"
              value="1"
              // checked
            />
            <span className="ml-2 text-primary-100">Option 1</span>
          </label>
        </div>
        <div>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio text-primary-900"
              name="radio"
              value="2"
            />
            <span className="ml-2 text-primary-100">Option 2</span>
          </label>
        </div>
        <div>
          <label className="inline-flex items-center">
            <input
              type="radio"
              className="form-radio text-primary-900"
              name="radio"
              value="3"
              checked={false}
            />
            <span className="ml-2 text-primary-100">Option 3</span>
          </label>
        </div>
      </div>
      {children}
    </div>
  );
};
