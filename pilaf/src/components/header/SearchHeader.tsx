import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { colors, paragraph, radius } from "../../constants/dogeStyle";
import { HeaderBase } from "./HeaderBase";

type SearchHeaderProps = {
  text: string;
  autoFocus?: boolean;
  placeHolder?: string;
  onTextChange: (query: string) => void;
};

export const SearchHeader: React.FC<SearchHeaderProps> = ({
  text,
  autoFocus = true,
  placeHolder = "Search",
  onTextChange,
}) => {
  return (
    <HeaderBase>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.text}
          placeholder={placeHolder}
          placeholderTextColor={colors.primary300}
          numberOfLines={1}
          onChangeText={onTextChange}
          value={text}
          autoFocus={autoFocus}
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
    marginLeft: 20,
    marginRight: 25,
    height: 40,
    backgroundColor: colors.primary700,
    paddingHorizontal: 15,
    borderRadius: radius.m,
    ...paragraph,
    lineHeight: undefined,
  },
});
