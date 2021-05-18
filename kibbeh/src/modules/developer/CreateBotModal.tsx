import { Form, Formik } from "formik";
import React from "react";
import { InputField } from "../../form-fields/InputField";
import { useWrappedConn } from "../../shared-hooks/useConn";
import { useTypeSafeTranslation } from "../../shared-hooks/useTypeSafeTranslation";
import { Button } from "../../ui/Button";
import { ButtonLink } from "../../ui/ButtonLink";
import { Modal } from "../../ui/Modal";
import { showErrorToast } from "../../lib/showErrorToast";
interface CreateBotModalProps {
  onRequestClose: () => void;
  data?: {
    username: string;
  };
}

export const CreateBotModal: React.FC<CreateBotModalProps> = ({
  onRequestClose,
  data,
}) => {
  const { t } = useTypeSafeTranslation();
  const wrapper = useWrappedConn();

  return (
    <Modal isOpen onRequestClose={onRequestClose}>
      <Formik<{
        username: string;
      }>
        initialValues={
          data
            ? data
            : {
                username: "",
              }
        }
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={({ username }) => {
          wrapper.mutation.userCreateBot(username).then((r) => {
            if (r.isUsernameTaken) {
              showErrorToast(
                t("components.modals.createBotModal.usernameTaken")
              );
            }
            if (r.error) {
              showErrorToast(r.error);
            }
          });
          onRequestClose();
        }}
      >
        {({ isSubmitting }) => (
          <Form className={`grid grid-cols-3 gap-4 focus:outline-none w-full`}>
            <div className={`col-span-3 block`}>
              <h4 className={`mb-2 text-primary-100`}>
                {t("components.modals.createBotModal.title")}
              </h4>
              <div className={`text-primary-300`}>
                {t("components.modals.createBotModal.subtitle")}
              </div>
            </div>
            <div className={`flex h-full w-full col-span-2`}>
              <InputField
                className={`mb-4`}
                errorMsg={t("components.modals.editProfileModal.usernameError")}
                label={t("components.modals.editProfileModal.usernameLabel")}
                name="username"
              />
            </div>

            <div className={`flex pt-2 space-x-3 col-span-full items-center`}>
              <Button loading={isSubmitting} type="submit" className={`mr-3`}>
                {t("components.modals.createBotModal.title")}
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
