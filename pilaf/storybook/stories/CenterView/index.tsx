import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, View } from "react-native";

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
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
});
