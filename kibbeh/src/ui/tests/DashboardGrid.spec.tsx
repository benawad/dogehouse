import React from "react";

import { render } from "../../../test-utils";
import { DashboardGrid } from "../DashboardGrid";

describe("DashboardGrid", () => {
  it("should render correctly", () => {
    const { getByTestId, getByText } = render(
      <DashboardGrid>Child</DashboardGrid>
    );
    const component = getByTestId("dashboard-grid");
    const child = getByText("Child");

    expect(component).toBeVisible();
    expect(child).toBeVisible();
  });

  it("should match snapshot", () => {
    const { getByTestId } = render(<DashboardGrid>Child</DashboardGrid>);
    const component = getByTestId("dashboard-grid");

    expect(component).toMatchSnapshot();
  });
});
