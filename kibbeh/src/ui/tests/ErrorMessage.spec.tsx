import React from "react";

import { render, act } from "../../../test-utils";
import { ErrorMessage } from "../ErrorMessage";

jest.useFakeTimers();

describe("ErrorMessage", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render correctly", () => {
    const message = "some error message";
    const { getByTestId, getByText } = render(
      <ErrorMessage message={message} />
    );
    const component = getByTestId("error-message");
    const child = getByText(message);

    expect(component).toBeVisible();
    expect(child).toBeVisible();
  });

  it("should have translateY(0%) when rendered", () => {
    const message = "some error message";
    const { getByTestId } = render(
      <ErrorMessage message={message} autoClose={true} />
    );

    const component = getByTestId("error-message");

    expect(component.style.transform).toContain("translateY(0%)");
  });

  it("should have translateY(100%) after 7000ms if autoClose prop is true", () => {
    const message = "some error message";
    const { getByTestId } = render(
      <ErrorMessage message={message} autoClose={true} />
    );

    const component = getByTestId("error-message");

    act(() => {
      jest.runAllTimers();
    });
    expect(component.style.transform).toContain("translateY(100%)");
  });

  it("should have translateY(0%) after t > 7000ms if autoClose prop is false", () => {
    const message = "some error message";
    const { getByTestId } = render(
      <ErrorMessage message={message} autoClose={false} />
    );

    const component = getByTestId("error-message");

    act(() => {
      jest.advanceTimersByTime(8000);
    });

    expect(component.style.transform).toContain("translateY(0%)");
  });

  it("should have translateY(100%) after if the close button is clicked", () => {
    const message = "some error message";
    const { getByTestId } = render(
      <ErrorMessage message={message} autoClose={true} />
    );

    const component = getByTestId("error-message");
    const closeBtn = getByTestId("close-btn");
    closeBtn.click();

    expect(component.style.transform).toContain("translateY(100%)");
  });

  it("should match snapshot", () => {
    const { getByTestId } = render(<ErrorMessage />);
    const component = getByTestId("error-message");

    expect(component).toMatchSnapshot();
  });
});
