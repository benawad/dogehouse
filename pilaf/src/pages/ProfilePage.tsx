import React from "react";
import { StyleSheet, Text } from "react-native";
import { TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fontFamily } from "../constants/dogeStyle";
import { useTokenStore } from "../module/auth/useTokenStore";

export const ProfilePage: React.FC = () => {
  const setTokens = useTokenStore((s) => s.setTokens);
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <TouchableOpacity
        onPress={() => setTokens({ accessToken: "", refreshToken: "" })}
      >
        <Text
          style={{
            alignSelf: "center",
            fontFamily: fontFamily.extraBold,
            color: colors.text,
          }}
        >
          Logout
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.primary900,
  },
});
