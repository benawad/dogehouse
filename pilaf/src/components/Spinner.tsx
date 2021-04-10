import React from "react";
import { Animated, Easing, ViewProps } from "react-native";
import { colors } from "../constants/dogeStyle";

export type SpinnerProps = ViewProps & {
  size?: "s" | "m";
};

export const Spinner: React.FC<SpinnerProps> = ({ style, size = "m" }) => {
  let spinValue = new Animated.Value(0);

  // First set up animation
  Animated.loop(
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear, // Easing is an additional import from react-native
      useNativeDriver: true, // To make use of native driver for performance
    })
  ).start();

  // Next, interpolate beginning and end values (in this case 0 and 1)
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const isSmall = size === "s";

  return (
    <Animated.View
      style={[
        style,
        {
          borderWidth: isSmall ? 2 : 4,
          borderRadius: isSmall ? 6 : 12,
          borderColor: "transparent",
          height: isSmall ? 12 : 20,
          width: isSmall ? 12 : 20,
          borderTopColor: colors.text,
          borderLeftColor: colors.text,
          transform: [{ rotate: spin }],
        },
      ]}
    />
  );
};
