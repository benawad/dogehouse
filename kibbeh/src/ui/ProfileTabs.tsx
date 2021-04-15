import React from "react";

export interface ProfileTabsProps {
   activeTab: string
};

export const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab }) => {
   return (
      <div className="w-full flex items-center justify-around">
         <button 
            className={`py-1 text-primary-100 text-base font-bold hover:text-accent-hover 
               ${activeTab == "about" && `border-b border-accent text-accent`}`
            }
         >
            About
         </button>
         <button 
            className={`py-1 text-primary-100 text-base font-bold hover:text-accent-hover 
               ${activeTab == "rooms" && `border-b border-accent text-accent`}`
            }
         >
            Rooms
         </button>
         <button 
            className={`py-1 text-primary-100 text-base font-bold hover:text-accent-hover 
               ${activeTab == "scheduled" && `border-b border-accent text-accent`}`
            }
         >
            Scheduled
         </button>
         <button 
            className={`py-1 text-primary-100 text-base font-bold hover:text-accent-hover 
               ${activeTab == "recorded" && `border-b border-accent text-accent`}`
            }
         >
            Recorded
         </button>
         <button 
            className={`py-1 text-primary-100 text-base font-bold hover:text-accent-hover 
               ${activeTab == "clips" && `border-b border-accent text-accent`}`
            }
         >
            Clips
         </button>
      </div>
   );
};
