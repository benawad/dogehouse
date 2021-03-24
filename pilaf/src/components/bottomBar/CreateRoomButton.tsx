import React, { useState } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
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
  content: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 17,
    borderTopLeftRadius: 17,
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
  contentView: {
    justifyContent: "flex-end",
    margin: 0,
  },
  buttonStyle: {
    height: 80,
    width: 80,
    borderRadius: 100,
    alignItems: "center",
  },
});
