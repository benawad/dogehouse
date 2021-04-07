import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Room, User } from "@dogehouse/kebab";
import { useBreadcrumb } from "../global-stores/useBreadcrumb";
import { roomToCurrentRoom } from "../lib/roomToCurrentRoom";

interface Breadcrumbs {
  dash: Path[];
  room: Path[];
  u: Path[];
  "sound-effect-settings": Path[];
  "voice-settings": Path[];
  "overlay-settings": Path[];
}

export interface Path {
  [index: number]: {
    value: string;
    href: string | null;
  };
}

const dynamicallyGenerateBreadcrumbPaths = (
  currentPath: string[],
  room: Room,
  user: User
) => {
  const PathConstants = {
    dashboard: { value: "Dashboard", href: "/dash" },
    profile: { value: "Profile", href: `/u/${user.displayName || ""}` },
    room: {
      value: `Room (${room.name || ""})`,
      href: `/room/${room.id || ""}`,
    },
  };

  const Paths: Breadcrumbs = {
    dash: [PathConstants.dashboard],
    room: [PathConstants.dashboard, PathConstants.room],
    u: [PathConstants.dashboard, PathConstants.profile],
    "sound-effect-settings": [
      PathConstants.dashboard,
      PathConstants.profile,
      { value: "Sound Effect Settings", href: "/sound-effect-settings" },
    ],
    "voice-settings": [
      PathConstants.dashboard,
      PathConstants.profile,
      { value: "Voice Settings", href: "/voice-settings" },
    ],
    "overlay-settings": [
      PathConstants.dashboard,
      PathConstants.profile,
      { value: "Overlay Settings", href: "/overlay-settings" },
    ],
  };

  switch (currentPath[currentPath.length - 1]) {
    case "invite":
      Paths.room.push({
        value: "Invite",
        href: `/room/${room.id}/invite`,
      } as Path);
      break;
    case "followers":
      Paths.u.push({
        value: "Followers",
        href: `/u/${user.displayName}/followers`,
      } as Path);
      break;
    case "following":
      Paths.u.push({
        value: "Following",
        href: `/u/${user.displayName}/following`,
      } as Path);
      break;
    default:
      break;
  }

  if (!room && !user) {
    return Paths.dash;
  }

  return Paths[currentPath[0] as keyof Breadcrumbs];
};

const Breadcrumbs = () => {
  const router = useRouter();
  const [breadcrumbs, setBreadcrumbs] = useState(Array());
  const currentBreadcrumb = useBreadcrumb();

  useEffect(() => {
    if (router) {
      const linkPath: string[] = router.asPath.split("/");
      linkPath.shift();
      const current: Path[] = dynamicallyGenerateBreadcrumbPaths(
        linkPath,
        currentBreadcrumb.room,
        currentBreadcrumb.user
      );
      console.log(current);
      setBreadcrumbs(current);
    }
  }, [router]);

  if (!breadcrumbs.length) {
    return null;
  }

  return (
    <nav className="mb-2" aria-label="breadcrumbs">
      <ol>
        {breadcrumbs.map((breadcrumb, i: Number) => {
          return (
            <li className="text-tiny text-primary-200" key={breadcrumb.href}>
              <Link href={breadcrumb.href}>
                <a>{breadcrumb.value}</a>
              </Link>
              {i === breadcrumbs.length - 1 ? (
                ""
              ) : (
                <span className="mx-1">{">"}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
