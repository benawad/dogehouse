import React from "react";

import { render } from "../../../test-utils";
import { MainGrid } from "../MainGrid";

describe("DashboardGrid", () => {
  it("should render correctly", () => {
    const { getByTestId, getByText } = render(<MainGrid>Child</MainGrid>);
    const component = getByTestId("dashboard-grid");
    const child = getByText("Child");

    expect(component).toBeVisible();
    expect(child).toBeVisible();
  });

  it("should match snapshot", () => {
    const { getByTestId } = render(<MainGrid>Child</MainGrid>);
    const component = getByTestId("dashboard-grid");

    expect(component).toMatchSnapshot();
  });
});
