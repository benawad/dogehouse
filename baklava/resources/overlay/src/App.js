import './App.css';
import { useEffect, useState } from 'react';
// import { FiMicOff } from "react-icons/fi";

const ipcRenderer = window.require("electron").ipcRenderer;

function App() {
  const [speakers, setSpeakers] = useState([]);
  useEffect(() => {
    ipcRenderer.send("@overlay/start_ipc", true);
    ipcRenderer.on("@overlay/overlayData", (event, data) => {
      if (data.currentRoom) {
        let s = [];
        data.currentRoom.users.forEach((u) => {
          if (u.roomPermissions) {
            if (
              u.roomPermissions.isSpeaker ||
              data.currentRoom.room.creatorId === u.id
            ) {
              u.isSpeaking = false;
              u.isMuted = false;
              if (data.currentRoom.activeSpeakerMap[u.id]) {
                u.isSpeaking = true;
              }
              if (data.currentRoom.muteMap[u.id]) {
                u.isMuted = true;
              }
              s.push(u);
            }
          } else {
            if (data.currentRoom.room.creatorId === u.id) {
              u.isSpeaking = false;
              u.isMuted = false;
              if (data.currentRoom.activeSpeakerMap[u.id]) {
                u.isSpeaking = true;
              }
              if (data.currentRoom.muteMap[u.id]) {
                u.isMuted = true;
              }
              s.push(u);
            }
          }

          console.log(u);
        });
        setSpeakers(s);
      }
    });
  }, []);

  return (
    <div className="App" width="100%">
      {speakers &&
        speakers.map((speaker) => (
          <SpeakerIcon speaker={speaker} key={speaker.id} />
        ))}
    </div>
  );
}

function SpeakerIcon(props) {
  return (
    <div>
      <div
        className={
          props.speaker.isSpeaking ? "active-speaker-cont left" : "left"
        }
      >
        <div className="img-div">
          <img
            alt="speaker bubble"
            width="50px"
            height="50px"
            className={props.speaker.isSpeaking ? "active-speaker" : ""}
            src={props.speaker.avatarUrl}
          />
          {/* {props.speaker.isMuted ?
          <div className="speaker-muted">
            <FiMicOff />
          </div>
          : null} */}
        </div>
        {/* {props.speaker.isSpeaking ? <div className="name-div"> <p>{props.speaker.displayName}</p> </div> : null} */}
      </div>
    </div>
  );
}

export default App;
