import { Formik } from "formik";
import { useAtom } from "jotai";
import React from "react";
import { useMutation } from "react-query";
import { object, pattern, size, string } from "superstruct";
import { wsMutation } from "../../createWebsocket";
import { setMeAtom } from "../atoms";
import { BaseUser } from "../types";
import { showErrorToast } from "../utils/showErrorToast";
import { validateStruct } from "../utils/validateStruct";
import { Button } from "./Button";
import { FieldSpacer } from "./form-fields/FieldSpacer";
import { InputField } from "./form-fields/InputField";
import { Modal } from "./Modal";
import { useTypeSafeTranslation } from "../utils/useTypeSafeTranslation";

const profileStruct = object({
	displayName: size(pattern(string(), /^[^\s]+(\s+[^\s]+)*$/), 2, 50),
	username: pattern(string(), /^(\w){4,15}$/),
	bio: size(string(), 0, 160),
	avatarUrl: pattern(
		string(),
		/https?:\/\/(www\.|)(pbs.twimg.com\/profile_images\/(.*)\.(jpg|png|jpeg|webp)|avatars\.githubusercontent\.com\/u\/)/
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
	const [, setMe] = useAtom(setMeAtom);
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
					validate={validateFn}
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
							setMe((me) => (!me ? me : { ...me, ...data }));
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
