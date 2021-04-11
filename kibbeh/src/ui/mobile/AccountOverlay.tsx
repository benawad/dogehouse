import React, { useEffect, useRef, ReactNode } from "react";
import Draggable, {
  DraggableBounds,
  ControlPosition,
  DraggableEventHandler,
} from "react-draggable";

export interface AccountOverlyProps {
  children: ReactNode;
  position: ControlPosition;
  dragHandler: DraggableEventHandler;
  closeHandler: () => void;
  bounds: DraggableBounds;
  className?: string;
  axis?: "both" | "x" | "y" | "none" | undefined;
}

export const AccountOverlay: React.FC<AccountOverlyProps> = ({
  children,
  position,
  bounds,
  dragHandler,
  closeHandler,
  className = "",
  axis = "y",
}) => {
  const endPosition = useRef(0);
  const node = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!(node!.current! as Node).contains(e.target as Node)) {
        endPosition.current = 0;
        closeHandler();
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [closeHandler]);

  const onStop = () => {
    const { y } = position;
    const { current } = endPosition;

    if (y > current + 15) closeHandler();

    endPosition.current = y;
  };

  return (
    <Draggable
      onDrag={dragHandler}
      onStop={onStop}
      axis={axis}
      handle="#handle"
      bounds={bounds}
      position={position}
    >
      <div
        ref={node}
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
