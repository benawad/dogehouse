import { useEmojiPickerStore } from "../../../global-stores/useEmojiPickerStore";
import { useRoomChatStore } from "./useRoomChatStore";

export const navigateThroughQueriedEmojis = (e: any) => {
  const { message, setMessage } = useRoomChatStore.getState();
  const {
    queryMatches,
    keyboardHoveredEmoji,
    setQueryMatches,
    setKeyboardHoveredEmoji,
    setOpen,
    query,
  } = useEmojiPickerStore.getState();

  // Use dom method, GlobalHotkeys apparently don't catch arrow-key events on inputs
  if (
    !["ArrowLeft", "ArrowRight", "Enter"].includes(e.code) ||
    !queryMatches.length
  ) {
    return;
  }

  e.preventDefault();

  let changeToIndex: number | null = null;
  const activeIndex = queryMatches.findIndex(
    (emoji) => emoji.name === keyboardHoveredEmoji
  );

  if (e.code === "ArrowLeft") {
    changeToIndex =
      activeIndex === 0 ? queryMatches.length - 1 : activeIndex - 1;
  } else if (e.code === "ArrowRight") {
    changeToIndex =
      activeIndex === queryMatches.length - 1 ? 0 : activeIndex + 1;
  } else if (e.code === "Enter") {
    const selected = queryMatches[activeIndex];

    setMessage(message.slice(0, ~(query.length - 1)) + `:${selected.name}: `);
    setOpen(false);
    setQueryMatches([]);
  }

  // navigate to next/prev mention suggestion item
  if (changeToIndex !== null) {
    setKeyboardHoveredEmoji(queryMatches[changeToIndex]?.name);
  }
};
