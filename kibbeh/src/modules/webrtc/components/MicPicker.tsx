import React, { useEffect, useState } from "react";
import { useMicIdStore } from "../stores/useMicIdStore";

interface MicPickerProps {}

export const MicPicker: React.FC<MicPickerProps> = () => {
  const { micId, setMicId } = useMicIdStore();
  const [options, setOptions] = useState<
    Array<{ id: string; label: string } | null>
  >([]);
  useEffect(() => {
    navigator.mediaDevices
      .enumerateDevices()
      .then((x) =>
        setOptions(
          x.map((y) =>
            y.kind !== "audioinput" ? null : { id: y.deviceId, label: y.label }
          )
        )
      );
  }, []);
  return (
    <>
      {options.length === 0 ? (
        <div className="flex">no mics available</div>
      ) : null}
      {options.length ? (
        <select
          value={micId}
          onChange={(e) => {
            const id = e.target.value;
            setMicId(id);
          }}
        >
          {options.map((x) =>
            !x ? null : (
              <option key={x.id} value={x.id}>
                {x.label}
              </option>
            )
          )}
        </select>
      ) : null}
    </>
  );
};
