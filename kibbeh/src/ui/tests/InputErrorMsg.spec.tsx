import React from "react";

import { render } from "../../../test-utils";
import { InputErrorMsg } from "../InputErrorMsg";

describe("InputErrorMsg", () => {
  it("should render correctly", () => {
    const { getByTestId } = render(<InputErrorMsg />);
    const component = getByTestId("input-error-msg");

    expect(component).toBeVisible();
  });

  it("should match snapshot", () => {
    const { getByTestId } = render(<InputErrorMsg />);
    const component = getByTestId("input-error-msg");
    expect(component).toMatchSnapshot();
  });
});
