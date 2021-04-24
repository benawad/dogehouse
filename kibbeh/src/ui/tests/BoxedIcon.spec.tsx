import React from "react";

import { render } from "../../../test-utils";
import { BoxedIcon } from "../BoxedIcon";

describe("BoxedIcon", () => {
  describe("BoxedIcon", () => {
    it("should render correctly", () => {
      const { getByTestId, getByText } = render(<BoxedIcon>Child</BoxedIcon>);
      const component = getByTestId("boxed-icon");
      const child = getByText("Child");

      expect(component).toBeVisible();
      expect(child).toBeVisible();
    });

    it("should match snapshot", () => {
      const { getByTestId } = render(<BoxedIcon />);
      const component = getByTestId("boxed-icon");

      expect(component).toMatchSnapshot();
    });
  });
});
