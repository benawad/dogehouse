import React from 'react'
import { MultipleUsers } from '../UserAvatar';

export type FeaturedRoomCardAvatarsProps = {
    avatars: string[],
}

export const FeaturedRoomCardAvatars: React.FC<FeaturedRoomCardAvatarsProps> = ({
  avatars,
}) => {  

  return (
    <div className="z-0">
      <div className="w-full flex items-center">
        <MultipleUsers srcArray={avatars} size="md" />
      </div>
    </div>
  );
}; 