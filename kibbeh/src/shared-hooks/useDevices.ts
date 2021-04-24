import { useState, useEffect, useCallback } from "react";

export const useDevices = () => {
  const [devices, setDevices] = useState<Array<{ id: string; label: string }>>(
    []
  );

  const fetchMics = useCallback(() => {
    navigator.mediaDevices?.getUserMedia({ audio: true }).then(() => {
      navigator.mediaDevices
        ?.enumerateDevices()
        .then((d) =>
          setDevices(
            d
              .filter(
                (device) => device.kind === "audioinput" && device.deviceId
              )
              .map((device) => ({ id: device.deviceId, label: device.label }))
          )
        );
    });
  }, []);

  useEffect(() => {
    fetchMics();
  }, [fetchMics]);

  return {
    devices,
    fetchMics,
  };
};
