import React from "react";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
} from "react-native";
import { colors, paragraph, radius } from "../../../constants/dogeStyle";
import { customEmojis, emoteMap } from "./EmoteData";
import { ScrollView } from "react-native-gesture-handler";

export type EmotePickerProps = ViewProps & {
  isNitro?: boolean;
  onEmoteSelected: (emote: { name: string; src: ImageSourcePropType }) => void;
};

export const EmotePicker: React.FC<EmotePickerProps> = ({
  style,
  isNitro = false,
  onEmoteSelected,
}) => {
  return (
    <ScrollView style={[styles.container, style]}>
      {isNitro && (
        <>
          <View>
            <Text style={styles.text}>DogeNitro exclusive</Text>
            <View style={styles.emoteContainer}>
              {customEmojis.slice(0, 16).map((e) => (
                <TouchableOpacity
                  key={e.name}
                  style={{ height: 40, width: 40, padding: 5 }}
                  onPress={() =>
                    onEmoteSelected({ name: e.name, src: e.imageUrl })
                  }
                >
                  <Image source={e.imageUrl} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View
            style={{
              backgroundColor: colors.primary700,
              height: 1,
              marginVertical: 10,
            }}
          />
        </>
      )}
      <View style={styles.emoteContainer}>
        {customEmojis.map((e) => (
          <TouchableOpacity
            key={e.name}
            style={{ height: 40, width: 40, padding: 5 }}
            onPress={() => onEmoteSelected({ name: e.name, src: e.imageUrl })}
          >
            <Image source={e.imageUrl} />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.m,
    backgroundColor: colors.primary700,
    flex: 1,
    paddingHorizontal: 0,
    paddingVertical: 10,
  },
  emoteContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
  },
  text: {
    ...paragraph,
    color: colors.primary300,
    paddingHorizontal: 20,
    marginTop: 10,
  },
});
