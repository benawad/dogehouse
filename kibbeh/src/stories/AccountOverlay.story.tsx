import React, { useState } from "react";
import { Story } from "@storybook/react";
import { DraggableEventHandler } from "react-draggable";

import {
  AccountOverlay,
  AccountOverlyProps,
} from "../ui/mobile/AccountOverlay";

export default {
  title: "AccountOverlay",
  component: AccountOverlay,
};
const defaultProps: AccountOverlyProps = {
  axis: "y",
  position: { x: 0, y: 0 },
  bounds: { top: -363, bottom: 0 },
  children: <div style={{ color: "white" }}>Use the handle to drag me up!</div>,
  dragHandler: (_e, ui) => console.log(ui.deltaY),
  closeHandler: () => console.log("closing"),
};

export const Main: Story<AccountOverlyProps> = (props) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragHandler: DraggableEventHandler = (_e, ui) =>
    setPosition({ x: 0, y: ui.y });

  const closeHandler = () => setPosition({ x: 0, y: 0 });

  return (
    <div
      style={{
        width: "414px",
        height: "362x",
        border: "1px solid #fd6868",
        position: "relative",
        top: "500px",
      }}
    >
      <div style={{ width: "414px", height: "362px" }}>
        <AccountOverlay
          {...props}
          axis={props.axis || defaultProps.axis}
          bounds={props.bounds || defaultProps.bounds}
          position={props.position || position}
          dragHandler={props.dragHandler || dragHandler}
          closeHandler={props.closeHandler || closeHandler}
        >
          {props.children || defaultProps.children}
        </AccountOverlay>
      </div>
    </div>
  );
};

Main.bind({});
