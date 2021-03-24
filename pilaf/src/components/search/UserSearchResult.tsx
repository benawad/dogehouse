import React from "react";
import {
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
} from "react-native";
import {
  colors,
  paragraphBold,
  radius,
  small,
} from "../../constants/dogeStyle";
import { SingleUserAvatar } from "../avatars/SingleUserAvatar";

export type UserSearchResultProps = ViewProps & {
  userAvatarSrc: ImageSourcePropType;
  userName: string;
  userLink: string;
  isOnline: boolean;
  onPress?: () => void;
};

export const UserSearchResult: React.FC<UserSearchResultProps> = ({
  style,
  userAvatarSrc,
  userName,
  userLink,
  isOnline,
  onPress,
}) => {
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <SingleUserAvatar src={userAvatarSrc} size="sm" isOnline={isOnline} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{userName}</Text>
        <Text style={styles.subtitle}>{userLink}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: radius.m,
    paddingVertical: 10,
    alignItems: "center",
  },
  textContainer: { marginLeft: 12 },
  title: {
    ...paragraphBold,
    //lineHeight: 20,
  },
  subtitle: {
    ...small,
    color: colors.primary300,
    //lineHeight: 20,
  },
});
