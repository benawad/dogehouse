import React from "react";
import { MainInnerGrid } from "../../ui/MainGrid";
import { ErrorToast } from "../../ui/ErrorToast";
import { useErrorToastStore } from "./useErrorToastStore";

interface ErrorToastControllerProps {}

export const ErrorToastController: React.FC<ErrorToastControllerProps> = ({}) => {
  const { toasts, hideToast } = useErrorToastStore();
  return (
    <div
      style={{ zIndex: 1001 }}
      className={`w-full fixed bottom-0 justify-center`}
    >
      <MainInnerGrid>
        <div />
        <div className={`flex-col`}>
          {toasts.map((t) => (
            <div key={t.id} className={`mb-3`}>
              <ErrorToast
                message={t.message}
                duration={t.duration}
                onClose={() => hideToast(t.id)}
              />
            </div>
          ))}
        </div>
        <div />
      </MainInnerGrid>
    </div>
  );
};
