import {
    ipcMain,
    Notification
} from "electron";

export async function StartNotificationHandler() {
    ipcMain.on("@notification/mention", (event, msg) => {
        if (Notification.isSupported()) {
            let body = "";
            msg.tokens.forEach((token) => {
                if (token.t == "mention") {
                    body += "@" + token.v + " "
                } else {
                    body += token.v + " "
                }
            });
            let notification = {
                title: msg.displayName,
                body: body,
            }
            new Notification(notification).show()
        }
    })
    ipcMain.on("@notification/invitation", (event, invite) => {
        if (Notification.isSupported()) {
            let notification = {
                title: "Room Invitation",
                body: `${invite.username} has invited you to ${invite.roomName}`,
            }
            new Notification(notification).show()
        }
    })
    ipcMain.on("@notification/indirect_invitation", (event, invite) => {
        if (Notification.isSupported()) {
            let notification = {
                title: "DogeHouse",
                body: `${invite.username} has just created ${invite.roomName}\nJoin them now!`,
            }
            new Notification(notification).show()
        }
    })
    ipcMain.on("@notification/mod", (event, isMod: boolean) => {
        if (Notification.isSupported()) {
            let notification = {
                title: "DogeHouse",
                body: `You are ${isMod ? "now" : "no longer"} a mod`,
            }
            new Notification(notification).show()
        }
    })
}