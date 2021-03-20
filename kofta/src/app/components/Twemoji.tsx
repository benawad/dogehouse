import React from 'react';
import twemoji from 'twemoji';

type TwiimojiProps = {
  emoji: string
}

export const Twemoji = ({ emoji }: TwiimojiProps) => {
  return (
    <span
      dangerouslySetInnerHTML={{
        __html: twemoji.parse(emoji, {
          folder: 'svg',
          ext: '.svg'
        })
      }}
      className="w-8 h-8"
    />
  )
}