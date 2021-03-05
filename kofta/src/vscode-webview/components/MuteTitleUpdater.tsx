import React, { useEffect } from "react";
import { useMuteStore } from "../../webrtc/stores/useMuteStore";
import { useTranslation } from 'react-i18next';

interface MuteTitleUpdaterProps {}

export const MuteTitleUpdater: React.FC<MuteTitleUpdaterProps> = ({}) => {
  const { muted } = useMuteStore();
  const { t } = useTranslation();
  useEffect(() => {
    if (muted) {
      document.title = t("header.mutedTitle");
    } else {
      document.title = t("header.title");
    }
  }, [muted, t]);
  return null;
};
