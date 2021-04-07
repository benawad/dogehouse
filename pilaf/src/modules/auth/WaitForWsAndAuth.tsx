import React, { useContext } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { colors, h4 } from "../../constants/dogeStyle";
import { WebSocketContext } from "../ws/WebSocketProvider";
import { useVerifyLoggedIn } from "./useVerifyLoggedIn";

interface WaitForWsAndAuthProps {}

export const WaitForWsAndAuth: React.FC<WaitForWsAndAuthProps> = ({
  children,
}) => {
  const { conn } = useContext(WebSocketContext);

  if (!useVerifyLoggedIn()) {
    // This should never happens
    return null;
  }

  if (!conn) {
    // @todo make this better
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.primary900,
        }}
      >
        <ActivityIndicator />
        <Text style={{ marginTop: 20, ...h4 }}>Going to the moon...</Text>
      </View>
    );
  }

  return <>{children}</>;
};
