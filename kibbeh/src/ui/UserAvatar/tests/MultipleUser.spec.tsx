import React from "react";

import { render } from "../../../../test-utils";
import { MultipleUsers } from "../";

describe("UserAvatar", () => {
  describe("MultipleUsers", () => {
    it("should render 3 single users max.", () => {
      const srcArray = ["", "", "", ""];
      const { getAllByTestId } = render(<MultipleUsers srcArray={srcArray} />);
      const avatar = getAllByTestId("single-user-avatar");

      expect(avatar).toHaveLength(3);
    });

    it("should render 2 single users", () => {
      const srcArray = ["", ""];
      const { getAllByTestId } = render(<MultipleUsers srcArray={srcArray} />);
      const avatar = getAllByTestId("single-user-avatar");

      expect(avatar).toHaveLength(2);
    });

    it("should match snapshot", () => {
      const srcArray = ["", "", "", ""];

      const { getAllByTestId } = render(<MultipleUsers srcArray={srcArray} />);
      const avatar = getAllByTestId("single-user-avatar");

      expect(avatar).toMatchSnapshot();
    });
  });
});
