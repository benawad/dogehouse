// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck @todo this file needs to be fixed

import React from "react";

import { render } from "../../../../test-utils";
import { AccountOverlay } from "../AccountOverlay";

describe("AccountOverlay", () => {
  it("should render correctly", () => {
    const { getByTestId, getByText } = render(
      <AccountOverlay>
        <div>Child</div>
      </AccountOverlay>
    );
    const component = getByTestId("account-overlay");
    const child = getByText("Child");

    expect(component).toBeVisible();
    expect(child).toBeVisible();
  });

  it("should match snapshot", () => {
    const { getByTestId } = render(
      <AccountOverlay>
        <div>Child</div>
      </AccountOverlay>
    );
    const component = getByTestId("account-overlay");

    expect(component).toMatchSnapshot();
  });
});
