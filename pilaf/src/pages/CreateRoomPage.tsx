import React, { useState } from "react";
import { Form, Formik } from "formik";
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { colors, fontFamily, fontSize } from "../constants/dogeStyle";

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
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={"padding"}>
      <SafeAreaView style={styles.safeAreaView}>
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
            console.log(name, privacy, description);
          }}
        >
          {({
            values,
            setFieldValue,
            handleChange,
            handleBlur,
            handleSubmit,
            errors,
          }) => (
            <ScrollView keyboardShouldPersistTaps="handled">
              <Text style={styles.titleText}>Create Room</Text>
              <Text style={styles.descriptionText}>
                Fill the following fileds to start a new room
              </Text>
              <TextInput
                placeholder={"Room name"}
                placeholderTextColor={colors.primary300}
                style={styles.roomNameEditText}
                autoFocus={true}
                value={values.name}
                onChangeText={handleChange("name")}
              />
              {errors.name && (
                <Text
                  style={{
                    marginTop: 4,
                    fontSize: fontSize.small,
                    fontFamily: fontFamily.regular,
                    color: colors.accent,
                  }}
                >
                  {errors.name}
                </Text>
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
                style={styles.roomDescriptionEditText}
                value={values.description}
                onChangeText={handleChange("description")}
              />
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={styles.createButton}
                  onPress={() => handleSubmit()}
                >
                  <Text style={styles.createButtonText}>Create room</Text>
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
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.primary800,
    borderTopStartRadius: 8,
    borderTopEndRadius: 8,
  },
  titleText: {
    fontFamily: fontFamily.extraBold,
    fontSize: fontSize.h4,
    color: colors.text,
  },
  descriptionText: {
    marginTop: 16,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.paragraph,
    color: colors.primary300,
  },
  roomNameEditText: {
    height: 40,
    backgroundColor: colors.primary700,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 16,
    color: colors.text,
  },
  roomDescriptionEditText: {
    height: 200,
    backgroundColor: colors.primary700,
    padding: 16,
    borderRadius: 8,
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createButtonText: {
    color: colors.text,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.paragraph,
    fontWeight: "700",
    alignSelf: "center",
  },
  cancelButton: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 16,
  },
  cancelButtonText: {
    color: colors.text,
    fontFamily: fontFamily.regular,
    fontSize: fontSize.paragraph,
    fontWeight: "700",
    alignSelf: "center",
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
});
