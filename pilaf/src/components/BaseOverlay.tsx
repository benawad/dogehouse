import React, { ReactNode } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { colors, fontFamily, fontSize, radius } from "../constants/dogeStyle";

interface BaseOverlayProps {
  style?: ViewStyle;
  title?: string;
  actionButton?: string;
  onActionButtonClicked?: () => void;
  children: ReactNode;
}

export const BaseOverlay: React.FC<BaseOverlayProps> = ({
  children,
  title,
  style,
  actionButton,
  onActionButtonClicked,
}) => {
  return (
    <View style={[style, styles.container]}>
      {title && (
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
        </View>
      )}
      <ScrollView>{children}</ScrollView>
      {actionButton && (
        <TouchableOpacity style={styles.button} onPress={onActionButtonClicked}>
          <Text style={styles.buttonTitle}>{actionButton}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary800,
    borderRadius: radius.m,
  },
  header: {
    borderBottomWidth: 1,
    borderColor: colors.primary600,
    padding: 16,
  },
  title: {
    color: colors.text,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.h4,
    fontWeight: "700",
  },
  button: {
    backgroundColor: colors.primary700,
    padding: 16,
    borderBottomLeftRadius: radius.m,
    borderBottomRightRadius: radius.m,
  },
  buttonTitle: {
    fontSize: fontSize.paragraph,
    fontFamily: fontFamily.bold,
    color: colors.text,
  },
});
