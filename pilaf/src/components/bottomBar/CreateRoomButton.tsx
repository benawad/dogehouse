import React, { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import { CreateRoomPage } from "../../pages/CreateRoomPage";

export const CreateRoomButton: React.FC = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <>
      <TouchableOpacity {...props} onPress={() => setModalVisible(true)} />
      <Modal
        backdropOpacity={0.8}
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={styles.contentView}
      >
        <CreateRoomPage onRequestClose={() => setModalVisible(false)} />
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  contentView: {
    justifyContent: "flex-end",
    margin: 0,
  },
});
