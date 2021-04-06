import React, { ReactNode, useContext, useState } from "react";
import { JoinRoomAndGetInfoResponse, RoomUser, User } from "@dogehouse/kebab";
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
import { Spinner } from "./Spinner";
import Modal from "react-native-modal";
import { useTypeSafeMutation } from "../shared-hooks/useTypeSafeMutation";
import { useTypeSafeQuery } from "../shared-hooks/useTypeSafeQuery";
import {
  RoomChatMessage,
  useRoomChatStore,
} from "../modules/room/chat/useRoomChatStore";
import { useCurrentRoomInfo } from "../shared-hooks/useCurrentRoomInfo";
import { useConn } from "../shared-hooks/useConn";
import { UserPreviewModalContext } from "../modules/room/UserPreviewModalProvider";

export type UserPreviewProps = ViewProps & {
  message?: RoomChatMessage;
  id: string;
  isMe: boolean;
  iAmCreator: boolean;
  iAmMod: boolean;
  isCreator: boolean;
  roomPermissions?: RoomUser["roomPermissions"];
  onClosePress: () => void;
  onVolumeChange?: (volume: number) => void;
};

export const UserPreview: React.FC<UserPreviewProps> = ({
  style,
  id,
  isMe,
  iAmCreator,
  iAmMod,
  isCreator,
  message,
  roomPermissions,
  onClosePress,
  onVolumeChange,
}) => {
  const { mutateAsync: setListener } = useTypeSafeMutation("setListener");
  const { mutateAsync: changeModStatus } = useTypeSafeMutation(
    "changeModStatus"
  );
  const { mutateAsync: changeRoomCreator } = useTypeSafeMutation(
    "changeRoomCreator"
  );
  const { mutateAsync: addSpeaker } = useTypeSafeMutation("addSpeaker");
  const { mutateAsync: deleteRoomChatMessage } = useTypeSafeMutation(
    "deleteRoomChatMessage"
  );
  const { mutateAsync: blockFromRoom } = useTypeSafeMutation("blockFromRoom");
  const { mutateAsync: banFromRoomChat } = useTypeSafeMutation(
    "banFromRoomChat"
  );
  const { data, isLoading } = useTypeSafeQuery(["getUserProfile", id], {}, [
    id,
  ]);
  const bannedUserIdMap = useRoomChatStore((s) => s.bannedUserIdMap);

  if (isLoading) {
    return <Spinner />;
  }

  if (!data) {
    return <Text>This user is gone.</Text>;
  }

  const canDoModStuffOnThisUser = !isMe && (iAmCreator || iAmMod) && !isCreator;

  return (
    <View style={[style, styles.container]}>
      <TouchableOpacity
        style={{ position: "absolute", top: 20, right: 20 }}
        onPress={onClosePress}
      >
        <Image source={require("../assets/images/plus.png")} />
      </TouchableOpacity>
      <SingleUserAvatar
        src={{ uri: data.avatarUrl }}
        isOnline={data.online}
        style={styles.avatar}
      />
      <Text style={styles.displayName}>
        {data.displayName}
        <Text style={styles.username}>
          {"  "}@{data.username}
        </Text>
      </Text>
      <View style={styles.tagsContainer}>
        {["DC", "DS"].map((tag) => (
          <Tag style={{ marginRight: 5, height: 16 }}>
            <Text
              style={{ ...smallBold, fontSize: fontSize.xs, lineHeight: 16 }}
            >
              {tag}
            </Text>
          </Tag>
        ))}
        {!data.followsYou && (
          <Tag style={{ marginLeft: 5, height: 16 }}>
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
        <Text style={{ ...paragraphBold }}>{data.numFollowers}</Text>
        <Text style={{ ...paragraph, color: colors.primary300, marginLeft: 7 }}>
          {"followers"}
        </Text>
        <Text style={{ ...paragraphBold, marginLeft: 20 }}>
          {data.numFollowing}
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
            value={100}
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
        {canDoModStuffOnThisUser && (
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
            {!isMe && iAmCreator && (
              <View
                style={{
                  marginTop: 15,
                  flexDirection: "row",
                }}
              >
                <Button
                  title={
                    roomPermissions?.isMod
                      ? "Remove moderator"
                      : "Make moderator"
                  }
                  style={{
                    marginHorizontal: 40,
                    padding: null,
                    flexGrow: 1,
                  }}
                  color="secondary"
                  onPress={() => {
                    changeModStatus([id, !roomPermissions?.isMod]);
                    onClosePress();
                  }}
                />
              </View>
            )}
            {canDoModStuffOnThisUser &&
              !roomPermissions?.isSpeaker &&
              roomPermissions?.askedToSpeak && (
                <View
                  style={{
                    marginTop: 10,
                    flexDirection: "row",
                  }}
                >
                  <Button
                    title={"Add as speaker"}
                    style={{
                      marginHorizontal: 40,
                      padding: null,
                      flexGrow: 1,
                    }}
                    color="secondary"
                    onPress={() => {
                      addSpeaker([id]);
                      onClosePress();
                    }}
                  />
                </View>
              )}
            {canDoModStuffOnThisUser && roomPermissions?.isSpeaker && (
              <View
                style={{
                  marginTop: 10,
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
                  onPress={() => {
                    setListener([id]);
                    onClosePress();
                  }}
                />
              </View>
            )}
            {!!message && (
              <View
                style={{
                  marginTop: 10,
                  flexDirection: "row",
                }}
              >
                <Button
                  title={"Delete message"}
                  style={{
                    marginHorizontal: 40,
                    padding: null,
                    flexGrow: 1,
                  }}
                  color="secondary"
                  onPress={() => {
                    deleteRoomChatMessage([message.userId, message.id]);
                    onClosePress();
                  }}
                />
              </View>
            )}
            {canDoModStuffOnThisUser &&
              !(id in bannedUserIdMap) &&
              (iAmCreator || !roomPermissions?.isMod) && (
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
                    onPress={() => {}}
                  />
                </View>
              )}
            {canDoModStuffOnThisUser &&
              !(id in bannedUserIdMap) &&
              (iAmCreator || !roomPermissions?.isMod) && (
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
                    onPress={() => {
                      banFromRoomChat([id]);
                      onClosePress();
                    }}
                  />
                  <Button
                    title={"Ban from room"}
                    style={{
                      paddingHorizontal: null,
                      flexGrow: 1,
                      marginLeft: 10,
                    }}
                    color="secondary"
                    onPress={() => {
                      blockFromRoom([id]);
                      onClosePress();
                    }}
                  />
                </View>
              )}
          </>
        )}
      </View>
    </View>
  );
};

export const UserPreviewModal: React.FC<JoinRoomAndGetInfoResponse> = ({
  room,
  users,
}) => {
  const { isCreator: iAmCreator, isMod } = useCurrentRoomInfo();
  const { data, setData } = useContext(UserPreviewModalContext);
  const conn = useConn();
  return (
    <>
      <Modal
        backdropOpacity={0.8}
        isVisible={!!data}
        onBackdropPress={() => setData(null)}
        propagateSwipe={true}
      >
        {data ? (
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          >
            <UserPreview
              id={data.userId}
              isCreator={room.creatorId === data.userId}
              roomPermissions={
                users.find((u) => u.id === data.userId)?.roomPermissions
              }
              iAmCreator={iAmCreator}
              isMe={conn.user.id === data.userId}
              iAmMod={isMod}
              message={data.message}
              onClosePress={() => setData(null)}
            />
          </ScrollView>
        ) : (
          <View></View>
        )}
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary900,
    alignItems: "center",
    borderRadius: radius.l,
  },
  avatar: { marginBottom: 10, marginTop: 20 },
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
    backgroundColor: colors.primary800,
    alignItems: "flex-start",
    paddingBottom: 20,
    borderBottomRightRadius: radius.l,
    borderBottomLeftRadius: radius.l,
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
