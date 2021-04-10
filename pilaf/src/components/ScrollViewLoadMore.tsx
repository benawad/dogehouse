import React from "react";
import { ScrollViewProps } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Spinner } from "./Spinner";

export type ScrollViewLoadMoreProps = {
  scrollViewProps?: ScrollViewProps;
  shouldLoadMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
};

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

export const ScrollViewLoadMore: React.FC<ScrollViewLoadMoreProps> = ({
  children,
  scrollViewProps,
  shouldLoadMore,
  isLoading,
  onLoadMore,
}) => {
  return (
    <ScrollView
      {...scrollViewProps}
      onScroll={({ nativeEvent }) => {
        if (isCloseToBottom(nativeEvent) && shouldLoadMore) {
          onLoadMore();
        }
      }}
      scrollEventThrottle={400}
    >
      {children}
      {isLoading && (
        <Spinner style={{ alignSelf: "center", paddingBottom: 20 }} />
      )}
    </ScrollView>
  );
};
