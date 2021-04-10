import React, { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";
import { ScrollViewLoadMore } from "../../components/ScrollViewLoadMore";
import { colors, h3 } from "../../constants/dogeStyle";
import { useTypeSafeQuery } from "../../shared-hooks/useTypeSafeQuery";
import { FollowerOnline } from "./FollowersOnline";

export type FriendsOnlineControllerProps = {
  cursor: number;
  onLoad: (nextpage: number) => void;
};

const Page: React.FC<FriendsOnlineControllerProps> = ({ cursor, onLoad }) => {
  const { data, isLoading } = useTypeSafeQuery(
    ["getMyFollowing", cursor],
    {
      refetchOnWindowFocus: true,
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

  if (cursor === 0 && !isLoading && !data?.users.length) {
    return <Text>You have 0 friends online right now</Text>;
  }

  return (
    <>
      {data?.users.map((u) => (
        <FollowerOnline {...u} key={u.id} />
      ))}
    </>
  );
};

export const FollowingOnlineController: React.FC<FriendsOnlineControllerProps> = ({}) => {
  const [cursors, setCursors] = useState([0]);
  const [isLoading, setLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);

  return (
    <ScrollViewLoadMore
      scrollViewProps={{ style: styles.container }}
      shouldLoadMore={nextCursor != null}
      isLoading={isLoading}
      onLoadMore={() => {
        setLoading(true);
        setCursors([...cursors, nextCursor]);
        setNextCursor(null);
      }}
    >
      <Text style={styles.title}>People</Text>
      {cursors.map((c) => (
        <Page
          key={c}
          cursor={c}
          onLoad={(nextpage) => {
            setLoading(false);
            if (nextpage) {
              setNextCursor(nextpage);
            }
          }}
        />
      ))}
    </ScrollViewLoadMore>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary900,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  title: {
    ...h3,
    marginBottom: 20,
  },
});
