import React from "react";
import { Backbar } from "../components/Backbar";
import { BodyWrapper } from "../components/BodyWrapper";
import { OverlaySettings } from "../components/OverlaySettings";
import { Wrapper } from "../components/Wrapper";

interface OverlaySettingsPageProps { }

export const OverlaySettingsPage: React.FC<OverlaySettingsPageProps> = () => {
    return (
        <Wrapper>
            <Backbar actuallyGoBack />
            <BodyWrapper>
                <OverlaySettings />
            </BodyWrapper>
        </Wrapper>
    );
};
