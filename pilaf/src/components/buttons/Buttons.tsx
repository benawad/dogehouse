import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  ImageSourcePropType,
  ViewProps,
  Image,
  ActivityIndicator,
  ViewStyle,
} from "react-native";
import {
  colors,
  fontSize,
  paragraph,
  paragraphBold,
  radius,
  smallBold,
} from "../../constants/dogeStyle";
import { Spinner } from "../Spinner";

const sizeClassnames = {
  big: "py-2 px-6 text-sm rounded-lg",
  small: "px-2 py-1 text-xs rounded-md",
};

const colorClassnames = {
  primary: {
    container: {
      backgroundColor: colors.accent,
    },
    textColor: {
      color: colors.text,
    },
  },

  secondary:
    "text-button bg-primary-700 hover:bg-primary-600 disabled:text-primary-300",
};

export type ButtonProps = ViewProps & {
  iconSrc?: ImageSourcePropType;
  size?: "big" | "small";
  color?: "primary" | "secondary";
  loading?: boolean;
  disabled?: boolean;
  title;
  onPress?: () => void;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  size = "big",
  color = "primary",
  disabled = false,
  loading = false,
  iconSrc,
  title,
  ...props
}) => {
  let colorStyle = color === "primary" ? primaryStyle : secondaryStyle;
  let big = size === "big";
  let styleSize = big ? bigStyle : smallStyle;

  return (
    <TouchableOpacity
      style={[
        disabled ? colorStyle.disabled : colorStyle.default,
        styleSize,
        props.style,
      ]}
      onPress={props.onPress}
      disabled={disabled || loading}
    >
      {iconSrc && (
        <Image
          source={iconSrc}
          style={[
            { tintColor: colors.text, marginRight: 10, width: 20 },
            loading && { opacity: 0 },
          ]}
        />
      )}
      <Text
        style={[
          big ? colorStyle.text : colorStyle.textSmall,
          loading && { opacity: 0 },
        ]}
      >
        {title}
      </Text>
      {loading && (
        <Spinner style={{ position: "absolute" }} size={big ? "m" : "s"} />
      )}
    </TouchableOpacity>
  );
};

const containerBase: ViewStyle = {
  alignSelf: "baseline",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
};

const primaryStyle = StyleSheet.create({
  text: {
    ...paragraphBold,
  },
  textSmall: {
    ...smallBold,
  },
  default: {
    ...containerBase,
    backgroundColor: colors.accent,
  },
  disabled: {
    ...containerBase,
    backgroundColor: colors.accentDisabled,
  },
});

const secondaryStyle = StyleSheet.create({
  text: {
    ...paragraphBold,
  },
  textSmall: {
    ...smallBold,
  },
  default: {
    ...containerBase,
    backgroundColor: colors.primary700,
  },
  disabled: {
    ...containerBase,
    backgroundColor: colors.primary300,
  },
});

const smallStyle: ViewStyle = {
  borderRadius: radius.s,
  paddingHorizontal: 10,
};

const bigStyle: ViewStyle = {
  borderRadius: radius.m,
  paddingHorizontal: 38,
  paddingVertical: 8,
  height: 38,
};
