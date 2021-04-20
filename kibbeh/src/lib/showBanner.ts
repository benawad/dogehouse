import { useBannerStore } from "../modules/banners/useBannerStore";
import { BannerDurations } from "../ui/Banner";

export const showBanner = (m: string, duration?: BannerDurations, button?: JSX.Element, onClose?: () => void,) => {
  useBannerStore.getState().showBanner({ message: m, onClose, button, duration });
};
