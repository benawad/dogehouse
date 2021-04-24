import React from "react";

import { render } from "../../../test-utils";
import { MessageElementProps } from "../MessageElement";
import { MessagesDropdown } from "../MessagesDropdown";

const messageList: MessageElementProps[] = [
  {
    msg: {
      text: "message text 1",
      ts: 1234,
    },
    user: {
      username: "username",
      avatar: "",
      isOnline: true,
    },
  },
  {
    msg: {
      text: "message text 2",
      ts: 12344,
    },
    user: {
      username: "username1",
      avatar: "",
      isOnline: true,
    },
  },
];

describe("MessagesDropdown", () => {
  it("should render 3 message elements", () => {
    const { getAllByTestId } = render(
      <MessagesDropdown messageList={messageList} />
    );
    const component = getAllByTestId("msg-element");

    expect(component.length).toBe(2);
  });

  it("should render empty state message elements if messageList length is 0", () => {
    const { getByTestId } = render(<MessagesDropdown messageList={[]} />);

    const component = getByTestId("empty-state-msg");

    expect(component).toBeVisible();
  });
});
