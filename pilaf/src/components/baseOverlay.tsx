import React, { ReactNode } from "react";
import {
  StyleSheet,
  View,
  ViewStyle,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { colors, fontFamily } from "../constants/GlobalStyles";

interface MultipleUserAvatarProps {
  style?: ViewStyle;
  title?: string;
  actionButton?: string;
  onActionButtonClicked?: () => void;
  children: ReactNode;
}

export const BaseOverlay: React.FC<MultipleUserAvatarProps> = ({
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
    borderRadius: 8,
  },
  header: {
    borderBottomWidth: 1,
    borderColor: colors.primary600,
    padding: 16,
  },
  title: {
    color: colors.text,
    fontFamily: fontFamily.regular,
    fontSize: 20,
    fontWeight: "700",
  },
  button: {
    backgroundColor: colors.primary700,
    padding: 16,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  buttonTitle: {
    fontSize: 14,
    fontFamily: fontFamily.bold,
    color: colors.text,
  },
});
