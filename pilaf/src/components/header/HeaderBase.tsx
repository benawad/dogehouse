import { useNavigation } from "@react-navigation/core";
import React from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewProps,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "../../constants/dogeStyle";

export type HeaderBaseProps = ViewProps & {
  showBackButton?: boolean;
};

export const HeaderBase: React.FC<HeaderBaseProps> = ({
  showBackButton = true,
  children,
}) => {
  const navigation = useNavigation();
  const inset = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: inset.top }]}>
      {showBackButton && (
        <TouchableOpacity
          style={styles.leftContainer}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require("../../assets/images/header/sm-solid-caret-right.png")}
          />
        </TouchableOpacity>
      )}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: colors.primary900,
    flexDirection: "row",
  },
  leftContainer: {
    paddingLeft: 25,
    height: 70,
    justifyContent: "center",
  },
});
