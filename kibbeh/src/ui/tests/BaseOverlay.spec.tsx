import React from "react";

import { render } from "../../../test-utils";
import { BaseOverlay } from "../BaseOverlay";

describe("BaseOverlay", () => {
  it("should render correctly", () => {
    const { getByTestId, getByText } = render(
      <BaseOverlay>
        <div className="flex">Child</div>
      </BaseOverlay>
    );
    const baseOverlay = getByTestId("base-overlay");
    const child = getByText("Child");

    expect(baseOverlay).toBeVisible();
    expect(child).toBeVisible();
  });

  it("should render title if title prop is passed", () => {
    const { getByText } = render(
      <BaseOverlay title="Messages">
        <div className="flex">Child</div>
      </BaseOverlay>
    );
    const title = getByText("Messages");

    expect(title).toBeVisible();
  });

  it("should render actionButton if actionButton prop is passed", () => {
    const { getByText } = render(
      <BaseOverlay actionButton="Show more">
        <div className="flex">Child</div>
      </BaseOverlay>
    );
    const actionButton = getByText("Show more");

    expect(actionButton).toBeVisible();
  });

  it("should render call onActionButtonClicked if actionButton is clicked", () => {
    const onActionButtonClickedMock = jest.fn();
    const { getByText } = render(
      <BaseOverlay
        actionButton="Show more"
        onActionButtonClicked={onActionButtonClickedMock}
      >
        <div className="flex">Child</div>
      </BaseOverlay>
    );
    const actionButton = getByText("Show more");

    actionButton.click();

    expect(onActionButtonClickedMock).toHaveBeenCalled();
  });

  it("should match snapshot", () => {
    const { getByTestId } = render(
      <BaseOverlay>
        <div className="flex">Child</div>
      </BaseOverlay>
    );
    const baseOverlay = getByTestId("base-overlay");

    expect(baseOverlay).toMatchSnapshot();
  });
});
