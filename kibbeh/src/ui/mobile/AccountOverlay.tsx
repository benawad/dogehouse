import React, { ReactNode } from "react";
import Draggable, {
  DraggableBounds,
  ControlPosition,
  DraggableEventHandler,
} from "react-draggable";

export interface AccountOverlyProps {
  children: ReactNode;
  position: ControlPosition;
  dragHandler: DraggableEventHandler;
  bounds: DraggableBounds;
  className?: string;
  axis?: "both" | "x" | "y" | "none" | undefined;
}

export const AccountOverlay: React.FC<AccountOverlyProps> = ({
  children,
  position,
  bounds,
  dragHandler,
  className = "",
  axis = "both",
}) => {
  return (
    <Draggable
      onDrag={dragHandler}
      axis={axis}
      handle="#handle"
      bounds={bounds}
      position={position}
    >
      <div
        style={{ padding: "43px 25px" }}
        className={`w-full rounded-t-8 px-2 pt-7 pb-5 bg-primary-800 relative  ${className}`}
        data-testid="account-overlay"
      >
        <span
          id="handle"
          style={{ cursor: "grab" }}
          className="absolute bg-primary-300 rounded-8 inline-block top-3 left-1 right-1 w-6 h-1 m-auto"
        ></span>
        {children}
      </div>
    </Draggable>
  );
};
