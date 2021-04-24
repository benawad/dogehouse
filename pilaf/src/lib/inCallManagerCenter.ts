import InCallManager from "react-native-incall-manager";

export const InCallManagerStart = () => {
  if (InCallManager.recordPermission !== "granted") {
    InCallManager.requestRecordPermission()
      .then((requestedRecordPermissionResult) => {
        if (requestedRecordPermissionResult === "granted") {
          InCallManager.start({ media: "audio" });
        }
      })
      .catch((err) => {
        console.log("InCallManager.requestRecordPermission() catch: ", err);
      });
  }
};

export const InCallManagerSetSpeakerOn = (on: boolean) => {
  InCallManager.setSpeakerphoneOn(on);
};
