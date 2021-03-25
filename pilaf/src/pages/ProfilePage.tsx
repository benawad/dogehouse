import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TitledHeader } from "../components/header/TitledHeader";
import { colors, fontFamily } from "../constants/dogeStyle";
import { useTokenStore } from "../modules/auth/useTokenStore";

export const ProfilePage: React.FC = () => {
  const setTokens = useTokenStore((s) => s.setTokens);
  return (
    <>
      <TitledHeader title={"Profile"} showBackButton={true} />
      <View style={styles.container}>
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
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: colors.primary900,
  },
});
