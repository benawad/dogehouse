import { User } from "@dogehouse/kebab";
import React from "react";
import { Animated, StyleSheet, Text, View, ViewProps } from "react-native";
import { h4, paragraph, paragraphBold } from "../../constants/dogeStyle";

export type ReportProps = ViewProps & {
  user: User;
};

const ReasonPicker: React.FC<ReportProps> = ({ style, user }) => {
  return (
    <View>
      <Text style={{ ...h4 }}>Report {user.username}</Text>
      <Text style={{ ...paragraph }}>
        We are going to ask you a couple of questions to assist us with
        investigating your report rapidly and precisely.
      </Text>
      <Text style={{ ...paragraphBold }}>What would you like to report?</Text>
    </View>
  );
};

export const Report: React.FC<ReportProps> = ({ style, user }) => {
  let spinValue = new Animated.Value(0);

  return <View></View>;
};

const styles = StyleSheet.create({});
