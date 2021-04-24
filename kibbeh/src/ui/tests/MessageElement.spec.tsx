import React from "react";

import { render } from "../../../test-utils";
import { MessageElement } from "../MessageElement";

describe("MessageElement", () => {
  it("should render correctly", () => {
    const { getByTestId } = render(
      <MessageElement
        msg={{ text: "some text", ts: 123 }}
        user={{ avatar: "", isOnline: true, username: "someUserNAme" }}
      />
    );
    const component = getByTestId("msg-element");

    expect(component).toBeVisible();
  });

  it("should match snapshot", () => {
    const { getByTestId } = render(
      <MessageElement
        msg={{ text: "some text", ts: 123 }}
        user={{ avatar: "", isOnline: true, username: "someUserNAme" }}
      />
    );
    const component = getByTestId("msg-element");
    expect(component).toMatchSnapshot();
  });
});
