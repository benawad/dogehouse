import React from "react";

import { render } from "../../../test-utils";
import {
  FriendsOnline,
  FriendsOnlineProps,
  FriendOnlineType,
} from "../FriendsOnline";

jest.useFakeTimers();

const friendOnline: FriendOnlineType = {
  avatar: "",
  isOnline: true,
  username: "Some name",
  activeRoom: {
    name: "Some room",
    link: "",
  },
};

const showMoreAction = jest.fn();

let defaultProps: FriendsOnlineProps = {
  onlineFriendCount: 1,
  onlineFriendList: [friendOnline],
  showMoreAction,
};

describe("FriendsOnline", () => {
  beforeEach(() => {
    defaultProps = {
      ...defaultProps,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render correctly", () => {
    const { getByTestId, getByText } = render(
      <FriendsOnline {...defaultProps} />
    );
    const component = getByTestId("friends-online");

    expect(component).toBeVisible();
  });

  it("should render You have 0 friends online right now if online friends list length is 0", () => {
    const props = {
      ...defaultProps,
      onlineFriendList: [],
    };
    const { getByTestId } = render(<FriendsOnline {...props} />);
    const placeholder = getByTestId("placeholder");

    expect(placeholder).toBeVisible();
  });

  it("should call showMoreAction if Show more button clicked", () => {
    const { getByTestId } = render(<FriendsOnline {...defaultProps} />);
    const showMoreBtn = getByTestId("show-more-btn");
    showMoreBtn.click();

    expect(showMoreAction).toHaveBeenCalled();
  });

  it("should match snapshot", () => {
    const { getByTestId } = render(<FriendsOnline {...defaultProps} />);
    const component = getByTestId("friends-online");

    expect(component).toMatchSnapshot();
  });
});
