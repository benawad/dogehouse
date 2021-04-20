import React from "react";

export interface ProfileTabsProps {
   activeTab: string
};

export const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab }) => {
   return (
      <div className="w-full flex items-center justify-around">
         <button 
            className={`py-1 text-primary-100 text-base font-bold border-b-2 border-primary-900 hover:border-accent 
               ${activeTab == "about" && `border-accent text-accent`}`
            }
         >
            About
         </button>
         <button 
            className={`py-1 text-primary-100 text-base font-bold border-b-2 border-primary-900 hover:border-accent 
               ${activeTab == "rooms" && `border-accent text-accent`}`
            }
         >
            Rooms
         </button>
         <button 
            className={`py-1 text-primary-100 text-base font-bold border-b-2 border-primary-900 hover:border-accent 
               ${activeTab == "scheduled" && `border-accent text-accent`}`
            }
         >
            Scheduled
         </button>
         <button 
            className={`py-1 text-primary-100 text-base font-bold border-b-2 border-primary-900 hover:border-accent 
               ${activeTab == "recorded" && `border-accent text-accent`}`
            }
         >
            Recorded
         </button>
         <button 
            className={`py-1 text-primary-100 text-base font-bold border-b-2 border-primary-900 hover:border-accent 
               ${activeTab == "clips" && `border-accent text-accent`}`
            }
         >
            Clips
         </button>
      </div>
   );
};
