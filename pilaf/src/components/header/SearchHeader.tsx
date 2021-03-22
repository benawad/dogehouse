import React from "react";
import { StyleSheet, View, TextInput } from "react-native";
import { colors, radius } from "../../constants/dogeStyle";
import { HeaderBase } from "./HeaderBase";

type SearchHeaderProps = {
  onTextChange: (query: string) => void;
};

export const SearchHeader: React.FC<SearchHeaderProps> = ({ onTextChange }) => {
  return (
    <HeaderBase>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.text}
          placeholder={"Search"}
          placeholderTextColor={colors.primary300}
          numberOfLines={1}
          onChangeText={onTextChange}
        />
      </View>
    </HeaderBase>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
  },
  text: {
    marginRight: 25,
    height: 40,
    backgroundColor: colors.primary700,
    paddingHorizontal: 16,
    borderRadius: radius.m,
    color: colors.text,
  },
});
