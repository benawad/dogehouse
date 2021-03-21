import React from "react";
import ReactModal from "react-modal";
import { Codicon } from "../svgs/Codicon";
import { isMobile } from "../utils/isMobile";
import { SoundEffectSettings } from "./SoundEffectSettings";
import { VoiceSettings } from "./VoiceSettings";
import { KeybindSettings } from "./KeybindSettings";

interface SettingsModalProps {
  onClose: () => void;
  isOpen: boolean;
}

const customStyles = {
    overlay: {
        backgroundColor: "rgba(0,0,0,.5)",
        zIndex: 999,
    },
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "#3c3c3c",
        border: "none",
        width: "100%",
        maxWidth: 500,
    },
};

export const SettingsModal: React.FC<SettingsModalProps> = ({
    onClose,
    isOpen = false
}) => {
    return (
        <ReactModal
            isOpen={isOpen}
            contentLabel="settings"
            style={customStyles}
            onRequestClose={() => onClose()}
        >
            <div className={"mb-4 flex items-center"}>
                <button
                    onClick={() => {
                        onClose();
                    }}
                    className={"p-2 -ml-2"}
                >
                    <Codicon width={24} height={24} name="close" />
                </button>
                <h1 className="text-lg">Settings</h1>
            </div>

            <SoundEffectSettings />
            <div className="pt-4"></div>
            <VoiceSettings />
            {!isMobile() ? <KeybindSettings /> : null}

        </ReactModal>
    );
};
