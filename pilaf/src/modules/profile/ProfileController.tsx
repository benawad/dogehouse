import { useNavigation } from "@react-navigation/core";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TitledHeader } from "../../components/header/TitledHeader";
import { colors, fontFamily } from "../../constants/dogeStyle";
import { useTokenStore } from "../auth/useTokenStore";

export const ProfileController: React.FC = () => {
  const setTokens = useTokenStore((s) => s.setTokens);
  const navigation = useNavigation();
  return (
    <>
      <TitledHeader title={"Profile"} showBackButton={true} />
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            setTokens({ accessToken: "", refreshToken: "" });
            navigation.navigate("Home");
          }}
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
