// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck @todo this file needs to be fixed

import React from "react";

import { render } from "../../../test-utils";
import { Feed, FeedProps } from "../Feed";

jest.useFakeTimers();
// eslint-disable-next-line init-declarations
let defaultProps: FeedProps;

describe("Feed", () => {
  beforeEach(() => {
    defaultProps = {
      title: "Your feed",
      actionTitle: "New Room",
      emptyPlaceholder: <div>Empty</div>,
      onActionClicked: () => jest.fn(),
      rooms: [],
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render correctly", () => {
    const { getByTestId, getByText } = render(<Feed {...defaultProps} />);
    const component = getByTestId("feed");
    const title = getByText(defaultProps.title);
    const actionTitle = getByText(defaultProps.actionTitle);

    expect(component).toBeVisible();
    expect(title).toBeVisible();
    expect(actionTitle).toBeVisible();
  });

  it("should render empty placeholder if rooms length is 0", () => {
    const { getByText } = render(<Feed {...defaultProps} />);
    const placeholder = getByText("Empty");

    expect(placeholder).toBeVisible();
  });

  it("should render one room if room", async () => {
    defaultProps = {
      ...defaultProps,
      rooms: [
        {
          id: 1,
          name: "my room",
        },
      ],
    };
    const { findAllByText } = render(<Feed {...defaultProps} />);
    const rooms = await findAllByText("my room");

    expect(rooms).toHaveLength(1);

    let placeholder = null;
    try {
      placeholder = await findAllByText("Empty");
    } catch (error) {
      expect(placeholder).toBeNull();
    }
  });

  it("should match snapshot", () => {
    const { getByTestId } = render(<Feed {...defaultProps} />);
    const component = getByTestId("feed");

    expect(component).toMatchSnapshot();
  });
});
