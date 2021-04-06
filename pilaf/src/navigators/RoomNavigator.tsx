import { JoinRoomAndGetInfoResponse } from "@dogehouse/kebab";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { UserPreview } from "../components/UserPreview";
import { WaitForWsAndAuth } from "../modules/auth/WaitForWsAndAuth";
import { RoomChatMessage } from "../modules/room/chat/useRoomChatStore";
import { RoomDescriptionPage } from "../modules/room/RoomDescriptionPage";
import { RoomPanelController } from "../modules/room/RoomPanelController";

export type RoomStackParamList = {
  RoomMain: { data: JoinRoomAndGetInfoResponse };
  RoomDescription: { data: JoinRoomAndGetInfoResponse };
  RoomUserPreview: {
    data: JoinRoomAndGetInfoResponse;
    userId: string;
    message?: RoomChatMessage;
  };
};

const Stack = createStackNavigator<RoomStackParamList>();

type RoomNavigatorProps = {
  data: JoinRoomAndGetInfoResponse;
};

export const RoomNavigator: React.FC<RoomNavigatorProps> = ({ data }) => {
  return (
    <WaitForWsAndAuth>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animationEnabled: false,
        }}
      >
        <Stack.Screen
          name="RoomMain"
          component={RoomPanelController}
          initialParams={{ data }}
        />
        <Stack.Screen name="RoomDescription" component={RoomDescriptionPage} />
        <Stack.Screen
          name="RoomUserPreview"
          component={UserPreview}
          initialParams={{ data }}
        />
      </Stack.Navigator>
    </WaitForWsAndAuth>
  );
};
