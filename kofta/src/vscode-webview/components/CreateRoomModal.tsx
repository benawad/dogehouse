import { Form, Formik } from "formik";
import React from "react";
import { useHistory } from "react-router-dom";
import { wsend, wsFetch } from "../../createWebsocket";
import { useCurrentRoomStore } from "../../webrtc/stores/useCurrentRoomStore";
import { useRoomChatStore } from "../modules/room-chat/useRoomChatStore";
import { roomToCurrentRoom } from "../utils/roomToCurrentRoom";
import { showErrorToast } from "../utils/showErrorToast";
import { Button } from "./Button";
import { InputField } from "./form-fields/InputField";
import { Modal } from "./Modal";
import { useTranslation } from 'react-i18next';

interface CreateRoomModalProps {
  onRequestClose: () => void;
}

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  onRequestClose,
}) => {
  const [name, setName] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const { t } = useTranslation();
  const history = useHistory();
  return (
    <Modal isOpen onRequestClose={onRequestClose}>
      <Formik<{
        name: string;
        privacy: string;
      }>
        initialValues={{
          name: "",
          privacy: "public",
        }}
        validateOnChange={false}
        validateOnBlur={false}
        validate={({ name }) => {
          const errors: Record<string, string> = {};

          if (name.length < 2) {
            return {
              name: "min length 2",
            };
          }

          return errors;
        }}
        onSubmit={async ({ name, privacy }) => {
          const resp = await wsFetch<any>({
            op: "create_room",
            d: { name, privacy },
          });
          if (resp.error) {
            showErrorToast(resp.d);
            return;
          } else if (resp.room) {
            const { room } = resp;
            console.log("new room voice server id: " + room.voiceServerId);
            useRoomChatStore.getState().clearChat();
            wsend({ op: "get_current_room_users", d: {} });
            history.push("/room/" + room.id);
            useCurrentRoomStore
              .getState()
              .setCurrentRoom(() => roomToCurrentRoom(room));
          }
          onRequestClose();
        }}
      >
        {({ setFieldValue, values, isSubmitting }) => (
          <Form>
            <InputField
              name="name"
              maxLength={60}
              placeholder="room name"
              autoFocus
            />
            <div className={`grid mt-8 items-start grid-cols-1`}>
              <select
                className={`border border-simple-gray-3c`}
                value={values.privacy}
                onChange={(e) => {
                  const v = e.target.value;
                  setFieldValue("privacy", v);
                }}
              >
                <option value="public" className={`bg-simple-gray-3c`}>
                  {t("components.modals.createRoomModal.public")}
                </option>
                <option value="private" className={`bg-simple-gray-3c`}>
                   {t("components.modals.createRoomModal.private")}
                </option>
              </select>
            </div>

            <div className={`flex mt-12`}>
              <Button
                type="button"
                onClick={onRequestClose}
                className={`mr-1.5`}
                color="secondary"
              >
                {t("common.cancel")}
              </Button>
              <Button loading={isSubmitting} type="submit" className={`ml-1.5`}>
                 {t("common.ok")}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};
