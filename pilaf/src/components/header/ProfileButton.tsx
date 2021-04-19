import { useNavigation } from "@react-navigation/core";
import React, { useState } from "react";
import {
  ImageSourcePropType,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import Modal from "react-native-modal";
import { AccountModalContent } from "../accountModal/AccountModalContent";
import { SingleUserAvatar } from "../avatars/SingleUserAvatar";

interface ProfileButtonProps {
  style?: StyleProp<ViewStyle>;
  icon: ImageSourcePropType;
}

export const ProfileButton: React.FC<ProfileButtonProps> = (props) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <SingleUserAvatar src={props.icon} size={"xxs"} isOnline={true} />
      </TouchableOpacity>
      <Modal
        backdropOpacity={0.8}
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={styles.contentView}
        onSwipeComplete={() => setModalVisible(false)}
        swipeDirection="down"
        swipeThreshold={50}
      >
        <AccountModalContent
          onPress={(pageName: string) => {
            setModalVisible(false);
            navigation.navigate(pageName);
          }}
        />
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  contentView: {
    justifyContent: "flex-end",
    flex: 1,
    margin: 0,
  },
});
