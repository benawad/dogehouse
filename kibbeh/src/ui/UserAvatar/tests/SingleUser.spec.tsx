import React from "react";

import { render } from "../../../../test-utils";
import { SingleUser } from "../";

describe("UserAvatar", () => {
  describe("SingleUser", () => {
    const src = "";
    it("should render correctly", () => {
      const { getByTestId } = render(<SingleUser src={src} size="default" />);
      const avatar = getByTestId("single-user-avatar");

      expect(avatar).toBeVisible();
    });

    it("should show the online indicator is the isOnline prop is ture", () => {
      const { getByTestId } = render(
        <SingleUser src={src} size="default" isOnline />
      );
      const onlineIndicator = getByTestId("online-indictor");

      expect(onlineIndicator).toBeVisible();
    });

    it("should match snapshot", () => {
      const { getByTestId } = render(<SingleUser src={src} size="default" />);
      const avatar = getByTestId("single-user-avatar");

      expect(avatar).toMatchSnapshot();
    });
  });
});
