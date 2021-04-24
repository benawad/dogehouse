import React, { createContext, useContext, useEffect, useState } from "react";
import { Message, raw, Room, stringToToken, tokensToString, wrap, Wrapper } from "@dogehouse/kebab";
import "./App.css";

const APIWrapperContext = createContext<Wrapper>({} as Wrapper);

const MessageView = (props: { message: Message }) => (
  <span>
    <strong>{props.message.displayName}</strong>: {tokensToString(props.message.tokens)}
  </span>
);

const ChatMessages = () => {
  const wrapper = useContext(APIWrapperContext);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => wrapper.subscribe.newChatMsg(({msg}) => setMessages(messages.concat(msg))));

  return (
    <div className="chat-messages">
      {messages.map(it => <MessageView message={it} key={it.sentAt}/>)}
    </div>
  );
};

const ChatPrompt = () => {
  const wrapper = useContext(APIWrapperContext);
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    if(message.length > 0) {
      await wrapper.mutation.sendRoomChatMsg(stringToToken(message));
      setMessage("");
    }
  };

  return (
    <div className="chat-prompt">
      <input value={message} onChange={e => setMessage(e.target.value)}/>
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

const RoomChat = (props: { room: Room }) => {
  const wrapper = useContext(APIWrapperContext);
  const [joined, setJoined] = useState(false);

  if(!joined) {
    wrapper.query.joinRoomAndGetInfo(props.room.id).then(() => setJoined(true));

    return <span>loading 3/3</span>;
  }

  return (
    <div className="room-chat">
      <h1>{props.room.name}</h1>
      <ChatMessages/>
      <ChatPrompt/>
    </div>
  );
};

const LoggedInPage = (props: { token: string, refreshToken: string }) => {
  const [connection, setConnection] = useState<raw.Connection | null>(null);
  const [publicRooms, setPublicRooms] = useState<Room[]>([]);

  useEffect(() => {
    raw.connect(props.token, props.refreshToken, {}).then(setConnection);
  }, [props.token, props.refreshToken]);

  if(!connection) {
    return <span>loading 1/3</span>;
  }

  const wrapper = wrap(connection);

  if(publicRooms.length === 0) {
    wrapper.query.getTopPublicRooms().then(({ rooms }) => setPublicRooms(rooms));

    return <span>loading 2/3</span>;
  }

  return (
    <APIWrapperContext.Provider value={wrapper}>
      <RoomChat room={publicRooms[0]}/>
    </APIWrapperContext.Provider>
  );
};

const LogInPage = (props: { logIn: (token: string, refreshToken: string) => void }) => {
  const [token, setToken] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const submit = () => props.logIn(token, refreshToken);

  return (
    <form
      className="login-form"
      onSubmit={e => {
        e.preventDefault();
        submit();
      }}
    >
      <input
        type="password"
        placeholder="Token"
        minLength={24}
        value={token} onChange={({ target }) => setToken(target.value)}
      />
      <input
        type="password"
        placeholder="Refresh token"
        minLength={24}
        value={refreshToken} onChange={({ target }) => setRefreshToken(target.value)}
      />
      <input type="submit" value="Log in"/>
    </form>
  );
};

export const App = () => {
  const [creds, setCreds] = useState({ token: "", refreshToken: "" });
  const loggedIn = creds.token.length > 0 && creds.refreshToken.length > 0 // lmao

  return loggedIn
    ? <LoggedInPage token={creds.token} refreshToken={creds.refreshToken}/>
    : <LogInPage
        logIn={(newToken, newRefreshToken) =>
          setCreds({ token: newToken, refreshToken: newRefreshToken })
        }
      />;
};
