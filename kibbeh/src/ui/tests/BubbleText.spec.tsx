import React from "react";

import { render } from "../../../test-utils";
import { BubbleText } from "../BubbleText";

describe("BubbleText", () => {
  it("should render correctly", () => {
    const { getByTestId, getByText } = render(<BubbleText>Child</BubbleText>);
    const component = getByTestId("bubble-text");
    const child = getByText("Child");

    expect(component).toBeVisible();
    expect(child).toBeVisible();
  });

  it("should have bg-accent class if live prop is true", () => {
    const { getByTestId } = render(<BubbleText live={true}>Child</BubbleText>);
    const component = getByTestId("bubble-text");

    expect(
      (component.firstChild as HTMLDListElement).classList.contains("bg-accent")
    ).toBeTruthy();
    expect(
      (component.firstChild as HTMLDListElement).classList.contains(
        "bg-primary-300"
      )
    ).toBeFalsy();
  });

  it("should have bg-primary-300 class if live prop is false", () => {
    const { getByTestId } = render(<BubbleText live={false}>Child</BubbleText>);
    const component = getByTestId("bubble-text");

    expect(
      (component.firstChild as HTMLDListElement).classList.contains("bg-accent")
    ).toBeFalsy();
    expect(
      (component.firstChild as HTMLDListElement).classList.contains(
        "bg-primary-300"
      )
    ).toBeTruthy();
  });

  it("should match snapshot", () => {
    const { getByTestId } = render(<BubbleText>Child</BubbleText>);
    const component = getByTestId("bubble-text");

    expect(component).toMatchSnapshot();
  });
});
