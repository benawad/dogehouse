import PropTypes from "prop-types";
import React from "react";
import { StyleSheet, View } from "react-native";
import { colors } from "../../../src/constants/dogeStyle";

export default function CenterView({ children }) {
  return <View style={styles.main}>{children}</View>;
}

CenterView.defaultProps = {
  children: null,
};

CenterView.propTypes = {
  children: PropTypes.node,
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    justifyContent: "center",
    //alignItems: "center",
    backgroundColor: colors.primary900,
  },
});
