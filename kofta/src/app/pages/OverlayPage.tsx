import React from "react";
import { Redirect } from "react-router-dom";
import { CurrentRoom } from "../../app/types";
import { RoomUserNode } from "../components/RoomUserNode";
import { BaseUser } from "../types";
import isElectron from "is-electron";

let ipcRenderer: any = undefined;
if (isElectron()) {
    ipcRenderer = window.require("electron").ipcRenderer;
}
interface State {
    room: CurrentRoom,
    muted: boolean,
    me: BaseUser,
    userProfileId: string,
    roomID: string,
    loadingTranslation: string,
}


export class OverlayPage extends React.Component<{}, State> {

    constructor(props: any) {

        const emptyUsers = [
            {
                id: "",
                displayName: "",
                numFollowers: 0,
            }
        ];

        const emtpyUser = {
            username: "",
            online: false,
            lastOnline: new Date(),
            id: "",
            bio: "",
            displayName: "",
            avatarUrl: "",
            numFollowers: 0,
            numFollowing: 0,
        }

        super(props);
        //let servers: any = [];
        this.state = {
            me: emtpyUser,
            room: {
                id: "",
                name: "",
                isPrivate: false,
                numPeopleInside: 0,
                creatorId: "",
                peoplePreviewList: emptyUsers,
                users: [emtpyUser],
                inserted_at: "",
                muteMap: {},
                activeSpeakerMap: {},
                autoSpeaker: false,
            },
            loadingTranslation: "",
            roomID: "",
            muted: true,
            userProfileId: "",
        }

    }

    componentDidMount() {

        if (!isElectron()) {
            return <Redirect to="/" />
        }
        ipcRenderer.on("@overlay/shouldRunIPC", async (event: any, data: any) => {
            ipcRenderer.send("@overlay/start_ipc", this.state.roomID);
        });
        ipcRenderer.on("@overlay/overlayData", async (event: any, data: any) => {
            this.setState({
                room: data.currentRoom,
                muted: data.muted,
                me: data.me,
                loadingTranslation: data.loadingTranslation,
                roomID: data.roomID,
            })
        })

    }

    render() {
        const profile = this.state.room.users.find((x) => x.id === this.state.userProfileId);
        const speakers: BaseUser[] = [];
        const unansweredHands: BaseUser[] = [];
        const listeners: BaseUser[] = [];
        let canIAskToSpeak = false;

        const setUserProfileId = (userProfileId: string) => {
            this.setState({
                userProfileId: userProfileId,
            })
        }

        this.state.room.users.forEach((u) => {
            if (u.id === this.state.room.creatorId || u.roomPermissions?.isSpeaker) {
                speakers.push(u);
            } else if (u.roomPermissions?.askedToSpeak) {
                unansweredHands.push(u);
            } else {
                canIAskToSpeak = true;
                listeners.push(u);
            }
        });
        return (
            <>
                {!isElectron() ? <Redirect to="/" /> : null}
                {speakers.map((u) => (
                    <RoomUserNode
                        key={u.id}
                        room={this.state.room}
                        u={u}
                        muted={this.state.muted}
                        setUserProfileId={setUserProfileId}
                        me={this.state.me}
                        profile={profile}
                    />
                ))}

            </>
        );
    }

};
