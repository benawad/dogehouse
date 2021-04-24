import React from "react";
import { Story } from "@storybook/react";
import profileCover from "./img/profile-cover.png";

import {
  ChangeBannerCard,
  ChangeBannerCardProps,
} from "../ui/ChangeBannerCard";

export default {
  title: "ChangeBannerCard",
  component: ChangeBannerCard,
};

ChangeBannerCard.defaultProps = {
  bannerUrl: profileCover,
};

export const Main: Story<ChangeBannerCardProps> = ({ ...props }) => (
  <div style={{ width: "600px" }}>
    <ChangeBannerCard {...props} />
  </div>
);
