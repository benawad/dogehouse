import React, { useState } from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  Image,
  ImageSourcePropType,
} from "react-native";
import Modal from "react-native-modal";
import { colors } from "../../constants/dogeStyle";
import { AccountModalContent } from "../accountModal/AccountModalContent";
import { SingleUserAvatar } from "../avatars/SingleUserAvatar";

interface ProfileButtonProps {
  style?: StyleProp<ViewStyle>;
  icon: ImageSourcePropType;
}

export const ProfileButton: React.FC<ProfileButtonProps> = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <SingleUserAvatar src={props.icon} size={"m"} isOnline={true} />
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
        <AccountModalContent />
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary900,
  },
  contentView: {
    justifyContent: "flex-end",
    flex: 1,
    margin: 0,
  },
});
