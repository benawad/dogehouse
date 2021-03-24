import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
} from "react-native";
import { colors, paragraph, radius } from "../../constants/dogeStyle";

export type SearchHistoryResultProps = ViewProps & {
  query: string;
  onPress?: () => void;
  onDeletePress?: () => void;
};

export const SearchHistoryResult: React.FC<SearchHistoryResultProps> = ({
  style,
  query,
  onDeletePress,
  onPress,
}) => {
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <Image
        source={require("../../assets/images/header/sm-solid-search.png")}
        style={{ tintColor: colors.primary300, height: 18, width: 18 }}
      />
      <View style={styles.textContainer}>
        <Text style={styles.text} numberOfLines={1}>
          {query}
        </Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={onDeletePress}>
        <Text style={styles.buttonText}>Delete</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: radius.m,
    paddingVertical: 10,
  },
  textContainer: { marginHorizontal: 24, flex: 1 },
  text: {
    ...paragraph,
    color: colors.primary300,
  },
  button: {
    alignSelf: "flex-end",
  },
  buttonText: {
    ...paragraph,
    color: colors.accent,
    textDecorationLine: "underline",
  },
});
