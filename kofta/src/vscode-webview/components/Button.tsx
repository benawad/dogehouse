import React, { useState } from "react";
import { Spinner } from "./Spinner";
import "../../css/doge-button.css";

export const Button: React.FC<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > & {
    variant?: "default" | "small" | "slim" | "follow";
    color?: "default" | "red" | "secondary";
    loading?: boolean;
    dogeProbability?: number;
  }
> = ({
  children,
  loading,
  disabled,
  color = "default",
  variant = "default",
  dogeProbability,
  ...props
}) => {
  const [hasDoge, setHasDoge] = useState(false);
  const [dogeXAnchor, setDogeXAnchor] = useState(0);
  const [dogeHideTimeout, setDogeHideTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [useTopDoge, setUseTopDoge] = useState(false);
  const [useGlassesDoge, setUseGlassesDoge] = useState(false);

  const maybeShowDoge = () => {
    if (hasDoge) return;
    if (dogeHideTimeout) {
      clearTimeout(dogeHideTimeout);
      setDogeHideTimeout(null);
      setHasDoge(true);
    } else if ((dogeProbability ?? 0) > Math.random()) {
      setDogeXAnchor(Math.random() * 0.8 + 0.1);
      setHasDoge(true);
      setUseTopDoge(Math.random() < 0.5);
      setUseGlassesDoge(Math.random() < 0.2);
    }
  };

  const hideDoge = () => {
    if (!hasDoge) return;
    setHasDoge(false);
    const timeout = setTimeout(() => {
      setDogeHideTimeout(null);
    }, 200);
    setDogeHideTimeout(timeout);
  };

  const onMouseOver =
    (dogeProbability ?? 0) > 0
      ? (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
          maybeShowDoge();
          if (props.onMouseOver) props.onMouseOver(event);
        }
      : props.onMouseOver;

  const onMouseLeave =
    (dogeProbability ?? 0) > 0
      ? (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
          hideDoge();
          if (props.onMouseLeave) props.onMouseLeave(event);
        }
      : props.onMouseLeave;

  return (
    <button
      {...props}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
      disabled={loading || disabled}
      className={`
          rounded capitalize outline-none w-full flex items-center justify-center text-center text-white button-fix
          ${
            color === "secondary"
              ? "bg-simple-gray-3a hover:bg-simple-gray-45"
              : color === "red"
              ? "bg-red-600 hover:bg-red-400"
              : "bg-blue-500 hover:bg-blue-400"
          }
          ${
            variant === "small"
              ? "py-1 px-2 w-max"
              : variant === "slim"
              ? "max-w-md ml-auto mr-auto py-2.5 px-12"
              : "py-2.5 px-1"
          }
          ${props.className}
        `}
    >
      {loading ? <Spinner /> : children}
      {loading && variant === "small" ? children : null}
      {(dogeProbability ?? 0) > 0 ? (
        <>
          <div
            className={`button-doge button-doge-top ${
              hasDoge && useTopDoge ? "button-doge-shown" : ""
            } ${useGlassesDoge ? "button-doge-cooler" : ""}`}
            style={{
              left: `${dogeXAnchor * 100}%`,
            }}
          />
          <div
            className={`button-doge button-doge-bottom ${
              hasDoge && !useTopDoge ? "button-doge-shown" : ""
            } ${useGlassesDoge ? "button-doge-cooler" : ""}`}
            style={{
              left: `${dogeXAnchor * 100}%`,
            }}
          />
        </>
      ) : (
        <></>
      )}
    </button>
  );
};
