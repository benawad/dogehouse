import React from "react";

import { render, act } from "../../../test-utils";
import { ErrorToast } from "../Toast";

jest.useFakeTimers();

describe("ErrorMessage", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render correctly", () => {
    const message = "some error message";
    const { getByTestId, getByText } = render(
      <ErrorToast message={message} onClose={() => {}} />
    );
    const component = getByTestId("error-message");
    const child = getByText(message);

    expect(component).toBeVisible();
    expect(child).toBeVisible();
  });

  it("should call onClose after 7000ms", () => {
    const message = "some error message";
    const onClick = jest.fn();
    render(<ErrorToast message={message} onClose={onClick} />);
    act(() => {
      jest.runAllTimers();
    });

    expect(onClick).toHaveBeenCalled();
  });

  it("shouldn't call onClose after 7000ms if duration props is sticky", () => {
    const message = "some error message";
    const onClick = jest.fn();
    render(
      <ErrorToast message={message} onClose={onClick} duration="sticky" />
    );
    act(() => {
      jest.runAllTimers();
    });

    expect(onClick).not.toHaveBeenCalled();
  });

  it("should call onClose the close button is clicked", () => {
    const message = "some error message";
    const onClick = jest.fn();

    const { getByTestId } = render(
      <ErrorToast message={message} onClose={onClick} />
    );

    const closeBtn = getByTestId("close-btn");
    closeBtn.click();
    expect(onClick).toHaveBeenCalled();
  });

  it("should match snapshot", () => {
    const { getByTestId } = render(
      <ErrorToast message="" onClose={() => {}} />
    );
    const component = getByTestId("error-message");

    expect(component).toMatchSnapshot();
  });
});
