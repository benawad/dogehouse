import React from "react";

import { render } from "../../../test-utils";
import { Button } from "../Button";

describe("Button", () => {
  it("should render a button with CLick me text", () => {
    const { getByText } = render(<Button>Click me</Button>);
    const text = getByText("Click me");

    expect(text).toBeVisible();
  });

  it("should render a disabled button if loading prop is passed", () => {
    const { getByText } = render(<Button loading={true}>Click me</Button>);
    const text = getByText("Click me");

    expect(text.closest("button")).toBeDisabled();
  });

  it("should render a disabled button if disabled prop is passed", () => {
    const { getByTestId } = render(<Button disabled={true}>Click me</Button>);
    const button = getByTestId("button");

    expect(button).toBeDisabled();
  });

  it("should render an icon if icon props is passed", () => {
    const { getByText, container } = render(
      <Button icon={<div className="flex">Fake icon</div>}>Click me</Button>
    );
    const icon = getByText("Fake icon");

    expect(icon).toBeVisible();
  });

  it("should match snapshot", () => {
    const { getByTestId } = render(<Button disabled={true}>Click me</Button>);
    const button = getByTestId("button");

    expect(button).toMatchSnapshot();
  });
});
