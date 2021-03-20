import React from 'react';
import { FeaturedRoomCardAvatars } from './FeaturedRoomCardAvatars';

export type FeaturedRoomCardHostsProps = {
    avatars: string[],
    names: string[]
}

export const FeaturedRoomCardHosts: React.FC<FeaturedRoomCardHostsProps> = ({
  avatars,
  names
}) => {  

  return (
    <div className="flex-row border border-primary-300 px-6 py-6">
        <FeaturedRoomCardAvatars avatars={avatars} />
        <div className="flex-col pl-7">
            <p className="text-primary-300">Hosted by</p>
            <p className="text-button">{ names.join(', ') }</p>
        </div>
    </div>
  );
}; 