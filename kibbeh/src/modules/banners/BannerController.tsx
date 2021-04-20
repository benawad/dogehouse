import React from "react";
import { MainInnerGrid } from "../../ui/MainGrid";
import { useBannerStore } from "./useBannerStore";
import { Banner } from "../../ui/Banner";

interface BannerControllerProps {}

export const BannerController: React.FC<BannerControllerProps> = ({}) => {
  const { banners, hideBanner } = useBannerStore();
  return (
    <div
      style={{ zIndex: 1001 }}
      className={`flex w-full fixed bottom-0 justify-center`}
    >
      <MainInnerGrid>
        <div />
        <div className={`flex flex-col w-full`}>
          {banners.map((b) => (
            <div key={b.id} className={`flex mb-3`}>
              <Banner
                message={b.message}
                duration={b.duration}
                onClose={() => {
                  hideBanner(b.id);
                  if (b.onClose) {
                    b.onClose();
                  }
                }}
                button={b.button}
              />
            </div>
          ))}
        </div>
        <div />
      </MainInnerGrid>
    </div>
  );
};
