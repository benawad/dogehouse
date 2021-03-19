import React, { useState, useEffect } from "react";
import { Redirect, withRouter, useRouteMatch } from "react-router-dom";
import { CurrentRoom } from "../../app/types";
import { Backbar } from "../components/Backbar";
import { BodyWrapper } from "../components/BodyWrapper";
import { RoomUserNode } from "../components/RoomUserNode";
import { Wrapper } from "../components/Wrapper";
import { BaseUser } from "../types";
import { isUuid } from "../utils/isUuid";
import { useTypeSafeTranslation } from "../utils/useTypeSafeTranslation";
import isElectron from "is-electron";
import { render } from "@testing-library/react";

let ipcRenderer: any = undefined;

interface State {
    room: CurrentRoom,
    muted: boolean,
    me: BaseUser,
    userProfileId: string,
}


export class OverlayPage extends React.Component<{}, State> {

    componentDidMount() {
        if (isElectron()) {
            // history.push('/')
            ipcRenderer = window.require("electron").ipcRenderer;
        }

        const {
            params: { id },
        } = useRouteMatch<{ id: string }>();
        const { t } = useTypeSafeTranslation();
        const history = useHistory();
        ipcRenderer.on("@overlay/shouldRunIPC", async (event: any, data: any) => {
            ipcRenderer.send("@overlay/start_ipc", id);
        });
        ipcRenderer.on("@overlay/overlayData", async (event: any, data: any) => {
            this.setState({
                room: data.currentRoom,
                muted: data.muted,
                me: data.me,
            })
        })

        if (!isUuid(id)) {
            return <Redirect to="/" />;
        }

        if (!room) {
            return (
                <Wrapper>
                    <Backbar />
                    <BodyWrapper>
                        <div>{t("common.loading")}</div>
                    </BodyWrapper>
                </Wrapper>
            );
        }

        const profile = room.users.find((x) => x.id === userProfileId);

        const speakers: BaseUser[] = [];
        const unansweredHands: BaseUser[] = [];
        const listeners: BaseUser[] = [];
        let canIAskToSpeak = false;

        room.users.forEach((u) => {
            if (u.id === room.creatorId || u.roomPermissions?.isSpeaker) {
                speakers.push(u);
            } else if (u.roomPermissions?.askedToSpeak) {
                unansweredHands.push(u);
            } else {
                canIAskToSpeak = true;
                listeners.push(u);
            }
        });
    }

    render() {
        return (
            <>

                {speakers.map((u) => (
                    <RoomUserNode
                        key={u.id}
                        room={room}
                        u={u}
                        muted={muted}
                        setUserProfileId={setUserProfileId}
                        me={me}
                        profile={profile}
                    />
                ))}

            </>
        );
    }

};
