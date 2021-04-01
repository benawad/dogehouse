import React, { ReactNode } from "react";
import { User } from "@dogehouse/kebab";
import { SingleUserAvatar } from "./avatars/SingleUserAvatar";
import { Tag } from "./Tag";
import { Button } from "./buttons/Buttons";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
  ViewStyle,
  Image,
} from "react-native";
import Slider from "react-native-slider";
import {
  colors,
  fontFamily,
  fontSize,
  paragraph,
  paragraphBold,
  radius,
  small,
  smallBold,
} from "../constants/dogeStyle";

export type UserPreviewProps = ViewProps & {
  user: User;
  volume: number;
  isAdmin: boolean;
  onFollowPress?: () => void;
  onSendDMPress?: () => void;
  onVolumeChange?: (volume: number) => void;
  onMoveToListenerPress?: () => void;
  onKickFromRoomPress?: () => void;
  onBanFromChatPress?: () => void;
  onBanFromRoomPress?: () => void;
};

export const UserPreview: React.FC<UserPreviewProps> = ({
  style,
  user,
  volume,
  isAdmin,
  onFollowPress,
  onSendDMPress,
  onVolumeChange,
  onMoveToListenerPress,
  onKickFromRoomPress,
  onBanFromChatPress,
  onBanFromRoomPress,
}) => {
  return (
    <View style={[style, styles.container]}>
      <SingleUserAvatar
        src={{ uri: user.avatarUrl }}
        isOnline={user.online}
        style={styles.avatar}
      />
      <Text style={styles.displayName}>
        {user.displayName}
        <Text style={styles.username}>
          {"  "}@{user.username}
        </Text>
      </Text>
      <View style={styles.tagsContainer}>
        {["DC", "DS"].map((tag) => (
          <Tag style={{ marginRight: 5 }}>
            <Text
              style={{ ...smallBold, fontSize: fontSize.xs, lineHeight: 16 }}
            >
              {tag}
            </Text>
          </Tag>
        ))}
        {!user.followsYou && (
          <Tag style={{ marginLeft: 5 }}>
            <Text
              style={{
                ...smallBold,
                fontSize: fontSize.xs,
                color: colors.primary300,
                lineHeight: 16,
              }}
            >
              {"Follows you"}
            </Text>
          </Tag>
        )}
      </View>
      <View style={styles.tagsContainer}>
        <Text style={{ ...paragraphBold }}>{user.numFollowers}</Text>
        <Text style={{ ...paragraph, color: colors.primary300, marginLeft: 7 }}>
          {"followers"}
        </Text>
        <Text style={{ ...paragraphBold, marginLeft: 20 }}>
          {user.numFollowing}
        </Text>
        <Text style={{ ...paragraph, color: colors.primary300, marginLeft: 7 }}>
          {"following"}
        </Text>
      </View>
      <Text
        style={{
          ...paragraph,
          color: colors.primary300,
          paddingHorizontal: 40,
          marginTop: 10,
          textAlign: "center",
        }}
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis nunc sit
        pulvinar ut tellus sit tincidunt faucibus sapien. ⚡️
      </Text>
      <View style={styles.followDMContainer}>
        <Button
          iconSrc={require("../assets/images/md-person-add.png")}
          title={"Follow"}
          style={{ alignSelf: "center", paddingHorizontal: 10 }}
        />
        <Button
          title={"Send DM"}
          iconSrc={require("../assets/images/header/sm-solid-messages.png")}
          style={{ marginLeft: 10, alignSelf: "center", paddingHorizontal: 10 }}
        />
      </View>
      <View style={styles.controlsContainer}>
        <Text
          style={{
            ...paragraph,
            color: colors.primary300,
            marginTop: 20,
            alignSelf: "center",
          }}
        >
          Volume
        </Text>
        <View style={styles.sliderContainer}>
          <Image
            source={require("../assets/images/ios-volume-off.png")}
            style={{ marginRight: 15 }}
          />
          <Slider
            style={{ flex: 1 }}
            thumbStyle={{ backgroundColor: colors.primary100 }}
            trackStyle={{ backgroundColor: colors.primary300 }}
            onValueChange={onVolumeChange}
            value={volume}
            minimumValue={0}
            maximumValue={200}
            minimumTrackTintColor={colors.primary300}
            maximumTrackTintColor={colors.primary300}
          />
          <Image
            source={require("../assets/images/ios-volume-high.png")}
            style={{ marginLeft: 15 }}
          />
        </View>
        {isAdmin && (
          <>
            <Text
              style={{
                ...paragraph,
                color: colors.primary300,
                marginTop: 15,
                alignSelf: "center",
              }}
            >
              Manage
            </Text>
            <View
              style={{
                marginTop: 15,
                flexDirection: "row",
              }}
            >
              <Button
                title={"Move to listener"}
                style={{
                  marginHorizontal: 40,
                  padding: null,
                  flexGrow: 1,
                }}
                color="secondary"
              />
            </View>
            <View
              style={{
                marginTop: 10,
                flexDirection: "row",
              }}
            >
              <Button
                title={"Kick from room"}
                style={{
                  marginHorizontal: 40,
                  padding: null,
                  flexGrow: 1,
                }}
                color="secondary"
              />
            </View>
            <View
              style={{
                marginTop: 10,
                paddingHorizontal: 40,
                flexDirection: "row",
              }}
            >
              <Button
                title={"Ban from chat"}
                style={{
                  paddingHorizontal: null,
                  flexGrow: 1,
                }}
                color="secondary"
              />
              <Button
                title={"Ban from room"}
                style={{
                  paddingHorizontal: null,
                  flexGrow: 1,
                  marginLeft: 10,
                }}
                color="secondary"
              />
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary900,
    alignItems: "center",
    flex: 1,
  },
  avatar: { marginBottom: 10 },
  displayName: { ...paragraphBold },
  username: { ...paragraph, color: colors.primary300, marginLeft: 5 },
  tagsContainer: { flexDirection: "row", marginTop: 10 },
  followDMContainer: {
    flexDirection: "row",
    marginTop: 23,
    alignItems: "center",
    justifyContent: "center",
  },
  controlsContainer: {
    marginTop: 30,
    // width: "100%",
    flex: 1,
    backgroundColor: colors.primary800,
    alignItems: "flex-start",
  },
  sliderContainer: {
    marginTop: 10,
    flexDirection: "row",
    // width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 40,
  },
});
