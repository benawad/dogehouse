import { Room } from "@dogehouse/kebab";
import React, { useEffect, useState } from "react";
import { Share, StyleSheet, Text, View, ViewStyle } from "react-native";
import { SingleUserAvatar } from "../../components/avatars/SingleUserAvatar";
import { Button } from "../../components/buttons/Button";
import { TitledHeader } from "../../components/header/TitledHeader";
import { ScrollViewLoadMore } from "../../components/ScrollViewLoadMore";
import { Spinner } from "../../components/Spinner";
import { colors, paragraph, small } from "../../constants/dogeStyle";
import { useWrappedConn } from "../../shared-hooks/useConn";
import { useTypeSafeQuery } from "../../shared-hooks/useTypeSafeQuery";

const InviteButton: React.FC<{ style: ViewStyle; onPress: () => void }> = ({
  style,
  onPress,
}) => {
  const [invited, setInvited] = useState(false);
  return (
    <Button
      style={style}
      size="small"
      disabled={invited}
      onPress={() => {
        onPress();
        setInvited(true);
      }}
      title={invited ? "Invited" : "Invite"}
    />
  );
};

const Page = ({
  cursor,
  onLoad,
}: {
  cursor: number;
  onLoad: (nextpage: number) => void;
}) => {
  const conn = useWrappedConn();
  const { isLoading, data } = useTypeSafeQuery(
    ["getInviteList", cursor],
    {
      staleTime: Infinity,
      enabled: true,
      refetchOnMount: "always",
    },
    [cursor]
  );
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (data && !loaded) {
      setLoaded(true);
      onLoad(data.nextCursor);
    }
  }, [data, loaded, onLoad, setLoaded]);
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.primary900,
        }}
      >
        <Spinner />
      </View>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <>
      {data.users.map((user) => (
        <View
          key={user.id}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <SingleUserAvatar size="sm" src={{ uri: user.avatarUrl }} />
          <View style={{ paddingHorizontal: 10, flex: 1 }}>
            <Text style={{ ...paragraph }} numberOfLines={1}>
              {user.displayName}
            </Text>
            <Text
              style={{ ...small, lineHeight: 14, color: colors.primary300 }}
              numberOfLines={1}
            >
              @{user.username}
            </Text>
          </View>
          <InviteButton
            onPress={() => conn.mutation.inviteToRoom(user.id)}
            style={{ alignSelf: "center", marginLeft: 10 }}
          />
        </View>
      ))}
    </>
  );
};

type InviteRoomControllerPropse = {
  room: Room;
};

const onShare = async (message: string) => {
  try {
    await Share.share({
      message,
    });
  } catch (error) {
    console.error("Sharing failed with : ", error);
  }
};

export const InviteRoomController: React.FC<InviteRoomControllerPropse> = ({
  room,
}) => {
  const [cursors, setCursors] = useState([0]);
  const [isLoading, setLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const url = `https://next.dogehouse.tv/room/${room.id}`;

  return (
    <>
      <TitledHeader title={"Invite people"} showBackButton={true} />
      <View style={styles.container}>
        {room.isPrivate ? null : (
          <>
            <Button
              size="big"
              onPress={() => {
                onShare(url);
              }}
              title={"Send a link"}
              style={{ alignSelf: "center", marginBottom: 20 }}
            />
          </>
        )}
        <ScrollViewLoadMore
          shouldLoadMore={nextCursor != null}
          isLoading={isLoading}
          onLoadMore={() => {
            setLoading(true);
            setCursors([...cursors, nextCursor]);
            setNextCursor(null);
          }}
        >
          {cursors.map((cursor) => (
            <Page
              key={cursor}
              cursor={cursor}
              onLoad={(c) => {
                setLoading(false);
                if (c) {
                  setNextCursor(c);
                }
              }}
            />
          ))}
        </ScrollViewLoadMore>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary900,
    paddingHorizontal: 20,
  },
});
