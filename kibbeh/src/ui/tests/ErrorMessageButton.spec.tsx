import React from "react";

import { render } from "../../../test-utils";
import { ErrorMessageButton } from "../ErrorMessageButton";

describe("ErrorMessageButton", () => {
  it("should render and input correctly", () => {
    const { getByTestId } = render(<ErrorMessageButton />);
    const component = getByTestId("error-msg-btn");

    expect(component).toBeVisible();
  });

  it("should match snapshot", () => {
    const { getByTestId } = render(<ErrorMessageButton />);
    const component = getByTestId("error-msg-btn");
    expect(component).toMatchSnapshot();
  });
});
