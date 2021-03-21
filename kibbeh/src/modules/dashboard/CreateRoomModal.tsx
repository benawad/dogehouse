import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../../form-fields/InputField";
import { useCurrentRoomStore } from "../../global-stores/useCurrentRoomStore";
import { useRoomChatStore } from "../../global-stores/useRoomChatStore";
import { roomToCurrentRoom } from "../../lib/roomToCurrentRoom";
import { showErrorToast } from "../../lib/showErrorToast";
import { useWrappedConn } from "../../shared-hooks/useConn";
import { useTypeSafePrefetch } from "../../shared-hooks/useTypeSafePrefetch";
import { useTypeSafeTranslation } from "../../shared-hooks/useTypeSafeTranslation";
import { Button } from "../../ui/Button";
import { ButtonLink } from "../../ui/ButtonLink";
import { Modal } from "../../ui/Modal";
import { NativeSelect } from "../../ui/NativeSelect";

interface CreateRoomModalProps {
  onRequestClose: () => void;
  name?: string;
  description?: string;
  isPrivate?: boolean;
  edit?: boolean;
}

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  onRequestClose,
  name: currentName,
  description: currentDescription,
  isPrivate,
  edit,
}) => {
  const conn = useWrappedConn();
  const { t } = useTypeSafeTranslation();
  const { push } = useRouter();

  return (
    <Modal isOpen onRequestClose={onRequestClose}>
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
        onSubmit={async ({ name, privacy, description }) => {
          const d = { name, privacy, description };
          // @todo pretty sure this logic for editing is broken
          const resp = edit
            ? await conn.mutation.editRoom(d)
            : await conn.mutation.createRoom(d);

          if ("error" in resp) {
            showErrorToast(resp.error);

            return;
          } else if (resp.room) {
            const { room } = resp;

            console.log("new room voice server id: " + room.voiceServerId);
            useRoomChatStore.getState().clearChat();
            useCurrentRoomStore.getState().setCurrentRoom(() => room);
            push(`/room/[id]`, `/room/${room.id}`);
          }

          onRequestClose();
        }}
      >
        {({ setFieldValue, values, isSubmitting }) => (
          <Form className={`grid grid-cols-3 gap-4 focus:outline-none w-full`}>
            <div className={`col-span-3 block`}>
              <h4 className={`mb-2 text-primary-100`}>
                {t("pages.home.createRoom")}
              </h4>
              <p className={`text-primary-300`}>
                Fill the following fields to start a new room
              </p>
            </div>
            <div className={`h-full w-full col-span-2`}>
              <InputField
                className={`rounded-8 bg-primary-700 pl-2 h-6`}
                name="name"
                maxLength={60}
                placeholder={t("components.modals.createRoomModal.roomName")}
                autoFocus
                autoComplete="off"
              />
            </div>
            <div className={`grid mt-8 items-start grid-cols-1 h-6`}>
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
            <div className={`col-span-3 bg-primary-700 rounded-8`}>
              <InputField
                className={`px-2 h-11 col-span-3 w-full`}
                name="description"
                rows={3}
                maxLength={500}
                placeholder={t(
                  "components.modals.createRoomModal.roomDescription"
                )}
                textarea
              />
            </div>

            <div className={`flex pt-2 space-x-3 col-span-full items-center`}>
              <Button loading={isSubmitting} type="submit" className={`mr-3`}>
                {t("pages.home.createRoom")}
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
