import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { useNavigation } from "@react-navigation/core";
import { Formik } from "formik";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Spinner } from "../components/Spinner";
import {
  colors,
  fontFamily,
  fontSize,
  h4,
  paragraph,
  paragraphBold,
  radius,
  small,
} from "../constants/dogeStyle";
import { useCurrentRoomIdStore } from "../global-stores/useCurrentRoomIdStore";
import { useRoomChatStore } from "../modules/room/chat/useRoomChatStore";
import { useWrappedConn } from "../shared-hooks/useConn";
import { useTypeSafePrefetch } from "../shared-hooks/useTypeSafePrefetch";

interface CreateRoomModalProps {
  onRequestClose: () => void;
  name?: string;
  description?: string;
  isPrivate?: boolean;
  edit?: boolean;
}

export const CreateRoomPage: React.FC<CreateRoomModalProps> = ({
  onRequestClose,
  name: currentName,
  description: currentDescription,
  isPrivate,
  edit,
}) => {
  const [segmentIndex, setSegmentIndex] = useState(0);
  const conn = useWrappedConn();
  const prefetch = useTypeSafePrefetch();
  const navigation = useNavigation();
  const inset = useSafeAreaInsets();
  const [clearChat] = useRoomChatStore((s) => [s.clearChat]);
  const [loading, setLoading] = useState(false);
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={"padding"}>
      <View
        style={[
          styles.container,
          { paddingBottom: 20 + inset.bottom, paddingTop: 20 + inset.top },
        ]}
      >
        <Formik<{
          name: string;
          privacy: string;
          description: string;
        }>
          initialValues={{
            name: currentName || "",
            description: currentDescription || "",
            privacy: isPrivate ? "private" : "public",
          }}
          validateOnChange={false}
          validateOnBlur={false}
          validate={({ name, description }) => {
            const errors: Record<string, string> = {};

            if (name.length < 2 || name.length > 60) {
              return {
                name: "name error",
              };
            } else if (description.length > 500) {
              return {
                description: "Description error",
              };
            }

            return errors;
          }}
          onSubmit={async ({ name, privacy, description }) => {
            setLoading(true);
            const d = { name, privacy, description };
            const resp = edit
              ? await conn.mutation.editRoom(d)
              : await conn.mutation.createRoom(d);

            if ("error" in resp) {
              //showErrorToast(resp.error);
              setLoading(false);
              return;
            } else if (resp.room) {
              const { room } = resp;
              clearChat();
              prefetch(["joinRoomAndGetInfo", room.id], [room.id]);
              useCurrentRoomIdStore.getState().setCurrentRoomId(room.id);
              navigation.navigate("Room", { roomId: room.id });
              onRequestClose();
              setLoading(false);
            }
          }}
        >
          {({ values, setFieldValue, handleChange, handleSubmit, errors }) => (
            <ScrollView keyboardShouldPersistTaps="handled">
              <Text style={styles.titleText}>Create Room</Text>
              <Text style={styles.descriptionText}>
                Fill the following fields to start a new room
              </Text>
              <TextInput
                placeholder={"Room name"}
                placeholderTextColor={colors.primary300}
                style={[
                  styles.roomNameEditText,
                  errors.name && {
                    borderWidth: 1,
                    borderColor: colors.secondary,
                  },
                ]}
                autoFocus={true}
                value={values.name}
                onChangeText={handleChange("name")}
              />
              {errors.name && (
                <Text style={styles.errorMessage}>{errors.name}</Text>
              )}
              <SegmentedControl
                style={styles.segment}
                tintColor={colors.accent}
                backgroundColor={colors.primary700}
                values={["Public", "Private"]}
                fontStyle={{
                  fontFamily: fontFamily.bold,
                  fontSize: fontSize.paragraph,
                  fontWeight: "700",
                  color: colors.text,
                }}
                activeFontStyle={{
                  fontFamily: fontFamily.bold,
                  fontSize: fontSize.paragraph,
                  fontWeight: "700",
                  color: colors.text,
                }}
                selectedIndex={segmentIndex}
                onChange={(event) => {
                  setSegmentIndex(event.nativeEvent.selectedSegmentIndex);
                  setFieldValue("privacy", event.nativeEvent.value);
                }}
              />
              <TextInput
                placeholder={"Room description"}
                placeholderTextColor={colors.primary300}
                multiline={true}
                style={[
                  styles.roomDescriptionEditText,
                  errors.description && {
                    borderWidth: 1,
                    borderColor: colors.secondary,
                  },
                ]}
                value={values.description}
                onChangeText={handleChange("description")}
              />
              {errors.description && (
                <Text style={styles.errorMessage}>{errors.description}</Text>
              )}
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={styles.createButton}
                  onPress={() => handleSubmit()}
                >
                  {loading ? (
                    <Spinner />
                  ) : (
                    <Text style={styles.createButtonText}>Create room</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => onRequestClose()}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </Formik>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.primary800,
  },
  titleText: {
    ...h4,
  },
  descriptionText: {
    ...paragraph,
    marginTop: 16,
    color: colors.primary300,
  },
  roomNameEditText: {
    height: 40,
    backgroundColor: colors.primary700,
    paddingHorizontal: 16,
    borderRadius: radius.m,
    marginTop: 16,
    color: colors.text,
  },
  roomDescriptionEditText: {
    height: 200,
    backgroundColor: colors.primary700,
    padding: 16,
    borderRadius: radius.m,
    marginTop: 16,
    color: colors.text,
  },
  buttonsContainer: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  createButton: {
    flex: 1,
    backgroundColor: colors.accent,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: radius.m,
    height: 38,
  },
  createButtonText: {
    ...paragraphBold,
    alignSelf: "center",
  },
  cancelButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: radius.m,
    height: 38,
  },
  cancelButtonText: {
    ...paragraphBold,
    alignSelf: "center",
    textDecorationLine: "underline",
  },
  segment: {
    marginTop: 16,
  },
  dropDownContainer: {
    backgroundColor: colors.primary700,
  },
  dropDownItem: {
    backgroundColor: colors.primary700,
  },
  dropDownPickerCustom: {
    backgroundColor: colors.primary700,
    borderWidth: 0,
    color: colors.primary300,
  },
  errorMessage: {
    ...small,
    marginLeft: 16,
    color: colors.secondary,
  },
});
