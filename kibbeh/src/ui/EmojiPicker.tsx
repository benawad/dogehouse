import React from "react";
import { CustomEmote } from "../modules/room/chat/EmoteData";

interface EmojiPickerProps {
  emojiSet: Array<CustomEmote>;
  onEmojiSelect: (emoji: CustomEmote) => void
}

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ emojiSet, onEmojiSelect }) => {
  return (
    <div
      className={`bg-primary-700 rounded-8 flex flex-row flex-grow p-1 max-h-24 pt-2 px-2`}
    >
      <div
        className={`grid grid-cols-7 pr-3 gap-2 max-h-16 overflow-y-scroll scrollbar-thin scrollbar-thumb-rounded-xl scrollbar-thumb-primary-800`}
      >
        {emojiSet.map((emoji) => (
          <img
            key={emoji.name}
            src={emoji.imageUrl}
            className={`w-5 max-w-5`}
            onClick={() => onEmojiSelect(emoji)}
          ></img>
        ))}
      </div>
    </div>
  );
};
