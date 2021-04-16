import { RoomUser } from "@dogehouse/kebab";
import { RouteProp, useNavigation } from "@react-navigation/native";
import React from "react";
import { ScrollView, StyleSheet, Text, View, ViewProps } from "react-native";
import { useQueryClient } from "react-query";
import {
  colors,
  fontSize,
  paragraph,
  paragraphBold,
  smallBold,
} from "../constants/dogeStyle";
import {
  RoomChatMessage,
  useRoomChatStore,
} from "../modules/room/chat/useRoomChatStore";
import { RoomStackParamList } from "../navigation/mainNavigator/RoomNavigator";
import { useConn } from "../shared-hooks/useConn";
import { useCurrentRoomInfo } from "../shared-hooks/useCurrentRoomInfo";
import { useTypeSafeMutation } from "../shared-hooks/useTypeSafeMutation";
import { useTypeSafeQuery } from "../shared-hooks/useTypeSafeQuery";
import { useTypeSafeUpdateQuery } from "../shared-hooks/useTypeSafeUpdateQuery";
import { SingleUserAvatar } from "./avatars/SingleUserAvatar";
import { Button } from "./buttons/Button";
import { TitledHeader } from "./header/TitledHeader";
import { Spinner } from "./Spinner";
import { Tag } from "./Tag";

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

export const UserPreviewInternal: React.FC<UserPreviewProps> = ({
  style,
  id,
  isMe,
  iAmCreator,
  iAmMod,
  isCreator,
  message,
  roomPermissions,
  onClosePress,
}) => {
  const updater = useTypeSafeUpdateQuery();
  const {
    mutateAsync: setFollow,
    isLoading: followLoading,
  } = useTypeSafeMutation("follow");
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

  const queryClient = useQueryClient();

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.primary900,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spinner />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Spinner />
      </View>
    );
  }

  const canDoModStuffOnThisUser = !isMe && (iAmCreator || iAmMod) && !isCreator;

  return (
    <View style={[style, styles.container]}>
      <TitledHeader showBackButton={true} title={data.displayName} />
      <ScrollView contentContainerStyle={{ flex: 1, alignItems: "center" }}>
        <SingleUserAvatar
          src={{ uri: data.avatarUrl }}
          isOnline={data.online}
          style={styles.avatar}
        />
        <Text style={styles.displayName}>{data.username}</Text>
        <View style={styles.tagsContainer}>
          {["DC", "DS"].map((tag) => (
            <Tag
              key={tag}
              style={{ marginLeft: 2.5, marginRight: 2.5, height: 16 }}
            >
              <Text
                style={{ ...smallBold, fontSize: fontSize.xs, lineHeight: 16 }}
              >
                {tag}
              </Text>
            </Tag>
          ))}
          {data.followsYou && (
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
        <View style={styles.followInfoContainer}>
          <View
            style={{
              flexDirection: "row",
              flex: 1,
              justifyContent: "flex-end",
              marginRight: 10,
            }}
          >
            <Text style={{ ...paragraphBold }}>{data.numFollowers}</Text>
            <Text
              style={{ ...paragraph, color: colors.primary300, marginLeft: 6 }}
            >
              {"followers"}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              flex: 1,
              marginLeft: 10,
            }}
          >
            <Text
              style={{
                ...paragraphBold,
              }}
            >
              {data.numFollowing}
            </Text>
            <Text
              style={{ ...paragraph, color: colors.primary300, marginLeft: 6 }}
            >
              {"following"}
            </Text>
          </View>
        </View>
        {data.bio ? (
          <Text
            style={{
              ...paragraph,
              color: colors.primary300,
              paddingHorizontal: 40,
              marginTop: 10,
              textAlign: "center",
            }}
            numberOfLines={3}
          >
            {data.bio}
          </Text>
        ) : (
          <></>
        )}
        {/* TODO: Should be data.link or something */}
        <Text style={{ ...paragraphBold, color: colors.accent, marginTop: 10 }}>
          https://mapwize.io
        </Text>
        <View style={styles.followDMContainer}>
          <Button
            iconSrc={require("../assets/images/md-person-add.png")}
            title={data.youAreFollowing ? "Unfollow" : "Follow"}
            style={{
              flex: 1,
              alignSelf: "center",
              paddingHorizontal: undefined,
            }}
            color={data.youAreFollowing ? "secondary" : "primary"}
            onPress={async () => {
              await setFollow([data.id, !data.youAreFollowing]);
              queryClient.invalidateQueries("getMyFollowing");
              updater(["getUserProfile", data.id], (u) =>
                !u
                  ? u
                  : {
                      ...u,
                      numFollowers:
                        u.numFollowers + (data.youAreFollowing ? -1 : 1),
                      youAreFollowing: !data.youAreFollowing,
                    }
              );
            }}
          />
          <Button
            title={"Send DM"}
            iconSrc={require("../assets/images/header/sm-solid-messages.png")}
            style={{
              marginLeft: 10,
              flex: 1,
              alignSelf: "center",
              paddingHorizontal: undefined,
            }}
            color={"secondary"}
          />
        </View>
        <View style={styles.controlsContainer}>
          {/* <Text
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
              onValueChange={(value) => setVolume(id, value)}
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
          </View> */}
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
      </ScrollView>
    </View>
  );
};

type UserPreviewRoutePageProp = RouteProp<
  RoomStackParamList,
  "RoomUserPreview"
>;

type UserPreviewRouteProp = {
  route: UserPreviewRoutePageProp;
  message?: RoomChatMessage;
};

export const UserPreview: React.FC<UserPreviewRouteProp> = ({ route }) => {
  const room = route.params.data.room;
  const users = route.params.data.users;
  const userId = route.params.userId;
  const message = route.params.message;
  const navigation = useNavigation();
  const { isCreator: iAmCreator, isMod } = useCurrentRoomInfo();
  const conn = useConn();
  return (
    <>
      <View style={{ flexGrow: 1 }}>
        <UserPreviewInternal
          id={userId}
          isCreator={room.creatorId === userId}
          roomPermissions={users.find((u) => u.id === userId)?.roomPermissions}
          iAmCreator={iAmCreator}
          isMe={conn.user.id === userId}
          iAmMod={isMod}
          message={message}
          onClosePress={() => navigation.goBack()}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary900,
  },
  avatar: { marginBottom: 7, marginTop: 13 },
  displayName: { ...paragraphBold },
  username: { ...paragraph, color: colors.primary300, marginLeft: 5 },
  tagsContainer: { flexDirection: "row", marginTop: 7 },
  followInfoContainer: {
    flexDirection: "row",
    marginTop: 17,
  },
  followDMContainer: {
    flexDirection: "row",
    marginTop: 23,
    paddingHorizontal: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  controlsContainer: {
    marginTop: 30,
    backgroundColor: colors.primary800,
    alignItems: "flex-start",
    paddingBottom: 20,
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
