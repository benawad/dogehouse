import { ProfileBlock, ProfileBlockProps } from '../ui/ProfileBlock';
import { ScheduledRoomSummaryCardProps } from "../ui/UpcomingRoomsCard";
import { UserSummaryCardProps } from '../ui/UserSummaryCard';
import { Story } from "@storybook/react";
import avatar from "../img/avatar.png";
import { addDays } from "date-fns";

const today = new Date();

export default {
  title: "ProfileBlock",
  component: ProfileBlock,
};

const upcoming: ScheduledRoomSummaryCardProps[] = [
  {
    scheduledFor: today,
    speakersInfo: {
      avatars: [avatar],
      speakers: ["Dough Terry"],
    },
    title: "Live with u/DeepFuckingValue",
  },
  {
    scheduledFor: addDays(today, 1),
    speakersInfo: {
      avatars: [avatar, avatar],
      speakers: ["Daniel Gailey", "Bennie Beyers"],
    },
    title: "Is Apple equipment worth it?",
  },
  {
    scheduledFor: addDays(today, 2),
    speakersInfo: {
      avatars: [avatar, avatar, avatar],
      speakers: ["Jessika Beyer", "Jefferey Bosco", "Hang Ness"],
    },
    title:
      "Starting your dream business in times of Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ut ultricies turpis, vitae consectetur quam. Suspendisse venenatis justo justo, in pulvinar urna facilisis ut.",
  },
];

const userDetail: UserSummaryCardProps = {
  avatar,
  userId: "1",
  displayName: "Arnau Jiménez",
  username: "@ajmnz",
  following: 89,
  followers: 3400,
  bio:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis nunc sit pulvinar ut tellus sit tincidunt faucibus sapien. ⚡️",
  website: "https://loremipsum.com",
  isOnline: true,
  badges: [
    { content: "ƉC", variant: "primary" },
    { content: "ƉS", variant: "primary" },
  ],
};

export const Main: Story<ProfileBlockProps> = ({
  userDetails = userDetail,
  upcomingRooms = upcoming
}) => (
  <ProfileBlock
    userDetails={userDetails}
    upcomingRooms={upcomingRooms}
  />
);

Main.bind({});

export const ConnectedRoom: Story<ProfileBlockProps> = ({
  connectedRoom = {
    name:
      "Senior Dev / Manager @ GoDaddy (TS/React/GQL) - Ask me whatever you want",
    speakers: ["Terry Owen", "Grace Abraham"],
    url: "/room/1829324",
    timeElapsed: { minutes: 58, seconds: 39 },
    myself: {
      isSpeaker: true,
      isMuted: false,
      switchMuted: () => {
        // no-op
      },
      isDeafened: false,
      switchDeafened: () => {
        // no-op
      },
      leave: () => {
        // no-op
      },
    },
  },
  upcomingRooms = upcoming
}) => (
  <ProfileBlock
    connectedRoom={connectedRoom}
    upcomingRooms={upcomingRooms}
  />
);

ConnectedRoom.bind({});
