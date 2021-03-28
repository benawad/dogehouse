import { Formik } from "formik";
import React from "react";
import { useMutation, useQueryClient } from "react-query";
import { object, pattern, size, string } from "superstruct";
import { auth_query, wsMutation } from "../../createWebsocket";
import { BaseUser } from "../types";
import { showErrorToast } from "../utils/showErrorToast";
import { validateStruct } from "../utils/validateStruct";
import { Button } from "./Button";
import { FieldSpacer } from "./form-fields/FieldSpacer";
import { InputField } from "./form-fields/InputField";
import { Modal } from "./Modal";
import { useTypeSafeTranslation } from "../utils/useTypeSafeTranslation";

const profileStruct = object({
  displayName: size(string(), 2, 50),
  username: pattern(string(), /^(\w){4,15}$/),
  bio: size(string(), 0, 160),
  avatarUrl: pattern(
    string(),
    /https?:\/\/(www\.|)((a|p)bs.twimg.com\/(profile_images|sticky\/default_profile_images)\/(.*)\.(jpg|png|jpeg|webp)|avatars\.githubusercontent\.com\/u\/)/
  ),
});

interface Shared {
  user: BaseUser;
  onRequestClose: () => void;
}

interface EditProfileModalProps extends Shared {
  isOpen: boolean;
}

const validateFn = validateStruct(profileStruct);

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onRequestClose,
  user,
}) => {
  const { mutateAsync, isLoading } = useMutation(wsMutation);
  const queryClient = useQueryClient();
  const { t } = useTypeSafeTranslation();
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      {isOpen ? (
        <Formik
          initialValues={{
            displayName: user.displayName,
            username: user.username,
            bio: user.bio,
            avatarUrl: user.avatarUrl,
          }}
          validateOnChange={false}
          validate={(values) => {
            return validateFn({
              ...values,
              displayName: values.displayName.trim(),
            });
          }}
          onSubmit={async (data) => {
            const { isUsernameTaken } = ((await mutateAsync({
              op: "edit_profile",
              d: { data },
            })) as unknown) as { isUsernameTaken: boolean };
            if (isUsernameTaken) {
              showErrorToast(
                t("components.modals.editProfileModal.usernameTaken")
              );
            } else {
              queryClient.setQueryData<{ user: BaseUser } | undefined>(
                auth_query,
                (x) =>
                  !x
                    ? x
                    : {
                        ...x,
                        user: {
                          ...x.user,
                          ...data,
                          bio: data.bio.trim(),
                          displayName: data.displayName.trim(),
                        },
                      }
              );
              onRequestClose();
            }
          }}
        >
          {({ handleSubmit }) => (
            <div>
              <InputField
                errorMsg={t(
                  "components.modals.editProfileModal.avatarUrlError"
                )}
                label={t("components.modals.editProfileModal.avatarUrlLabel")}
                name="avatarUrl"
              />
              <FieldSpacer />
              <InputField
                errorMsg={t(
                  "components.modals.editProfileModal.displayNameError"
                )}
                label={t("components.modals.editProfileModal.displayNameLabel")}
                name="displayName"
              />
              <FieldSpacer />
              <InputField
                errorMsg={t("components.modals.editProfileModal.usernameError")}
                label={t("components.modals.editProfileModal.usernameLabel")}
                name="username"
              />
              <FieldSpacer />
              <InputField
                errorMsg={t("components.modals.editProfileModal.bioError")}
                label={t("components.modals.editProfileModal.bioLabel")}
                textarea
                name="bio"
              />
              <div className={`flex mt-12`}>
                <Button
                  type="button"
                  onClick={onRequestClose}
                  className={`mr-2`}
                  color="secondary"
                >
                  {t("common.cancel")}
                </Button>
                <Button
                  type="button"
                  loading={isLoading}
                  onClick={() => handleSubmit()}
                  className={`ml-2`}
                >
                  {t("common.save")}
                </Button>
              </div>
            </div>
          )}
        </Formik>
      ) : null}
    </Modal>
  );
};
