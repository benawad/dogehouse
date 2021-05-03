import React from "react";

import { render } from "../../../test-utils";
import {
  MinimizedRoomCard,
  MinimizedRoomCardProps,
} from "../MinimizedRoomCard";

const defaultProps: MinimizedRoomCardProps = {
  room: {
    name: "",
    roomStartedAt: new Date(),
    speakers: ["user1", "user2", "user3"],
    myself: {
      isDeafened: false,
      isMuted: false,
      isSpeaker: true,
      switchDeafened: () => {},
      leave: () => {},
      switchMuted: () => {},
    },
  },
};

describe("MinimizedRoomCard", () => {
  it("should render correctly", () => {
    const { getByTestId } = render(<MinimizedRoomCard {...defaultProps} />);
    const component = getByTestId("minimized-room-card");

    expect(component).toBeVisible();
  });

  it("should render mic icon if myself isn't muted", () => {
    const { getByTestId } = render(<MinimizedRoomCard {...defaultProps} />);
    const component = getByTestId("mic-on");

    expect(component).toBeVisible();
  });

  it("should render mic-off icon if myself is muted", () => {
    const props: MinimizedRoomCardProps = {
      ...defaultProps,
      room: {
        ...defaultProps.room,
        myself: {
          ...defaultProps.room.myself,
          isMuted: true,
        },
      },
    };
    const { getByTestId } = render(<MinimizedRoomCard {...props} />);
    const component = getByTestId("mic-off");

    expect(component).toBeVisible();
  });

  it("should match snapshot", () => {
    const { getByTestId } = render(<MinimizedRoomCard {...defaultProps} />);
    const component = getByTestId("minimized-room-card");

    expect(component).toMatchSnapshot();
  });
});
