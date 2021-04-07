import { Room, User } from "@dogehouse/kebab";
import create from "zustand";
import { combine } from "zustand/middleware";
import { Path } from "../ui/Breadcrumbs";

export const useBreadcrumb = create(
  combine(
    {
      current: [] as Path[],
      room: {} as Room,
      user: {} as User,
    },
    (set) => ({
      set,
      setCurrentBreadcrumb: (currentBreadcrumb: Path[]) => {
        set({ current: currentBreadcrumb });
      },
      setCurrentRoom: (currentRoom: Room) => {
        set({ room: currentRoom });
      },
      setCurrentUser: (currentUser: User) => {
        set({ user: currentUser });
      },
    })
  )
);
