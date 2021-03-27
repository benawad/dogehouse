import React from "react";

import { render } from "../../../test-utils";
import { Input, InputProps } from "../Input";

// jest.useFakeTimers();

// const friendOnline: FriendOnlineType = {
//   avatar: "",
//   isOnline: true,
//   username: "Some name",
//   activeRoom: {
//     name: "Some room",
//     link: "",
//   },
// };

// const showMoreAction = jest.fn();

// let defaultProps: InputProps = {
//   onlineFriendCount: 1,
//   onlineFriendList: [friendOnline],
//   showMoreAction,
// };

describe("Input", () => {
  it("should render and input correctly", () => {
    const { getByTestId } = render(<Input />);
    const component = getByTestId("input");

    expect(component).toBeVisible();
  });

  it("should render and input correctly", () => {
    const { getByTestId } = render(<Input textarea={true} />);
    const component = getByTestId("textarea");

    expect(component).toBeVisible();
  });

  it("should match snapshot", () => {
    const { getByTestId } = render(<Input />);
    const component = getByTestId("input");
    expect(component).toMatchSnapshot();
  });
});
