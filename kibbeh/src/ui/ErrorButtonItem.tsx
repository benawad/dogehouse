import React from "react";
import { BaseSettingsItem } from "./BaseSettingsItem";
import { Button } from "./Button";
import { SolidWarning } from "../icons";

export interface ErrorButtonItemProps {
   errorMessageHeading?: string,
   errorMessageText: string,
   actionButtonText?: string
}

export const ErrorButtonItem: React.FC<ErrorButtonItemProps> = ({
   errorMessageHeading,
   errorMessageText,
   actionButtonText
}) => {
   return (
      <BaseSettingsItem className="flex items-center justify-between px-3 py-2">
         <div className="">
            <SolidWarning className="text-secondary w-4 h-4"/>
         </div>
         <div className="flex flex-col px-3 flex-auto">
            {!!errorMessageHeading &&
               <p className="text-sm font-bold text-secondary">{errorMessageHeading}</p>
            }
            <p className="text-sm font-medium text-primary-300">{errorMessageText}</p>
         </div>
         <div>
            {!!actionButtonText &&
               <Button size="small" color="accent-secondary" className="px-3">{actionButtonText}</Button>
            }
         </div>
      </BaseSettingsItem>
   );
}
