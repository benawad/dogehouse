import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../../form-fields/InputField";
import { useCurrentRoomIdStore } from "../../global-stores/useCurrentRoomIdStore";
import { __prod__ } from "../../lib/constants";
import { showErrorToast } from "../../lib/showErrorToast";
import { useWrappedConn } from "../../shared-hooks/useConn";
import { useTypeSafePrefetch } from "../../shared-hooks/useTypeSafePrefetch";
import { useTypeSafeTranslation } from "../../shared-hooks/useTypeSafeTranslation";
import { Button } from "../../ui/Button";
import { ButtonLink } from "../../ui/ButtonLink";
import { InfoText } from "../../ui/InfoText";
import { Modal } from "../../ui/Modal";
import { NativeSelect } from "../../ui/NativeSelect";
import { useRoomChatStore } from "../room/chat/useRoomChatStore";

interface CreateRoomModalProps {
  onRequestClose: () => void;
  data?: {
    name: string;
    description: string;
    privacy: string;
  };
  edit?: boolean;
}

type FormData = {
  name: string;
  privacy: string;
  description: string;
  useElixirVoiceServer?: boolean;
};

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  onRequestClose,
  data,
  edit,
}) => {
  const conn = useWrappedConn();
  const { t } = useTypeSafeTranslation();
  const { push } = useRouter();
  const prefetch = useTypeSafePrefetch();

  return (
    <Modal isOpen onRequestClose={onRequestClose}>
      <Formik<FormData>
        initialValues={
          data
            ? data
            : {
                name: "",
                description: "",
                privacy: "public",
                useElixirVoiceServer: !__prod__,
              }
        }
        validateOnChange={false}
        validateOnBlur={false}
        validate={({ name, description }) => {
          const errors: Record<string, string> = {};

          if (name.length < 2 || name.length > 60) {
            return {
              name: t("components.modals.createRoomModal.nameError"),
            };
          } else if (description.length > 500) {
            return {
              description: t(
                "components.modals.createRoomModal.descriptionError"
              ),
            };
          }

          return errors;
        }}
        onSubmit={async ({
          name,
          privacy,
          description,
          useElixirVoiceServer,
        }) => {
          const d: FormData = { name, privacy, description };
          if (!edit) {
            d.useElixirVoiceServer = useElixirVoiceServer;
          }
          const resp = edit
            ? await conn.mutation.editRoom(d)
            : await conn.mutation.createRoom(d);

          if (typeof resp === "object" && "error" in resp) {
            showErrorToast(resp.error);

            return;
          } else if (resp.room) {
            const { room } = resp;

            prefetch(["joinRoomAndGetInfo", room.id], [room.id]);
            console.log("new room voice server id: " + room.voiceServerId);
            useRoomChatStore.getState().clearChat();
            useCurrentRoomIdStore.getState().setCurrentRoomId(room.id);
            push(`/room/[id]`, `/room/${room.id}`);
          }

          onRequestClose();
        }}
      >
        {({ setFieldValue, values, isSubmitting }) => (
          <Form className={`grid grid-cols-3 gap-4 focus:outline-none w-full`}>
            <div className={`col-span-3 block`}>
              <h4 className={`mb-2 text-primary-100`}>
                {edit ? t("pages.home.editRoom") : t("pages.home.createRoom")}
              </h4>
              <div className={`text-primary-300`}>
                {t("components.modals.createRoomModal.subtitle")}
              </div>
            </div>
            <div className={`flex h-full w-full col-span-2`}>
              <InputField
                className={`rounded-8 bg-primary-700 h-6`}
                name="name"
                maxLength={60}
                placeholder={t("components.modals.createRoomModal.roomName")}
                autoFocus
                autoComplete="off"
              />
            </div>
            <div className={`grid items-start grid-cols-1 h-6`}>
              <NativeSelect
                value={values.privacy}
                onChange={(e) => {
                  setFieldValue("privacy", e.target.value);
                }}
              >
                <option value="public" className={`hover:bg-primary-900`}>
                  {t("components.modals.createRoomModal.public")}
                </option>
                <option value="private" className={`hover:bg-primary-900`}>
                  {t("components.modals.createRoomModal.private")}
                </option>
              </NativeSelect>
            </div>

            <div className={`flex col-span-3 bg-primary-700 rounded-8`}>
              <InputField
                className={`h-11 col-span-3 w-full`}
                name="description"
                rows={3}
                maxLength={500}
                placeholder={t(
                  "components.modals.createRoomModal.roomDescription"
                )}
                textarea
              />
            </div>
            {!edit ? (
              <>
                <div className={`grid items-start grid-cols-1 h-6 mb-4`}>
                  <InfoText className="mb-2">Voice Server: </InfoText>
                  <NativeSelect
                    value={values.useElixirVoiceServer ? "elixir" : ""}
                    onChange={(e) => {
                      setFieldValue(
                        "useElixirVoiceServer",
                        e.target.value === "elixir"
                      );
                    }}
                  >
                    <option value="" className={`hover:bg-primary-900`}>
                      mediasoup
                    </option>
                    <option value="elixir" className={`hover:bg-primary-900`}>
                      elixir (beta)
                    </option>
                  </NativeSelect>
                </div>
              </>
            ) : null}

            <div className={`flex pt-2 space-x-3 col-span-full items-center`}>
              <Button loading={isSubmitting} type="submit" className={`mr-3`}>
                {edit ? t("common.save") : t("pages.home.createRoom")}
              </Button>
              <ButtonLink type="button" onClick={onRequestClose}>
                {t("common.cancel")}
              </ButtonLink>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};
