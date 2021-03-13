import DateFnsUtils from "@date-io/date-fns";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { add } from "date-fns";
import { Form, Formik } from "formik";
import React from "react";
import { wsFetch } from "../../../createWebsocket";
import { Button } from "../../components/Button";
import { InputField } from "../../components/form-fields/InputField";
import { InputErrorMsg } from "../../components/InputErrorMsg";
import { Modal } from "../../components/Modal";
import { BaseUser } from "../../types";
import { showErrorToast } from "../../utils/showErrorToast";
import { useTypeSafeTranslation } from "../../utils/useTypeSafeTranslation";

export interface ScheduleRoomFormData {
	name: string;
	description: string;
	cohosts: BaseUser[];
	scheduledFor: Date;
}

interface CreateRoomModalProps {
	editInfo?: { intialValues: ScheduleRoomFormData; id: string };
	onScheduledRoom: (data: ScheduleRoomFormData, resp: any) => void;
	onRequestClose: () => void;
}

const theme = createMuiTheme({
	palette: {
		type: "dark",
	},
});

export const ScheduleRoomModal: React.FC<CreateRoomModalProps> = ({
	onScheduledRoom,
	onRequestClose,
	editInfo,
}) => {
	const { t } = useTypeSafeTranslation();
	return (
		<ThemeProvider theme={theme}>
			<MuiPickersUtilsProvider utils={DateFnsUtils}>
				<Modal isOpen onRequestClose={onRequestClose}>
					<Formik<ScheduleRoomFormData>
						initialValues={
							editInfo?.intialValues || {
								name: "",
								description: "",
								cohosts: [] as BaseUser[],
								scheduledFor: add(new Date(), { days: 1 }),
							}
						}
						validateOnChange={false}
						validateOnBlur={false}
						validate={({ name, scheduledFor }) => {
							const errors: Record<string, string> = {};

							if (name.length < 2) {
								return {
									name: t("modules.scheduledRooms.modal.minLength"),
								};
							}

							if (scheduledFor.getTime() < new Date().getTime()) {
								return {
									scheduledFor: t("modules.scheduledRooms.modal.needsFuture"),
								};
							}

							return errors;
						}}
						onSubmit={async (allData) => {
							const { name, scheduledFor, ...data } = allData;
							const scheduledForISO = scheduledFor.toISOString();
							const resp = await wsFetch<any>(
								editInfo
									? {
											op: "edit_scheduled_room",
											d: {
												id: editInfo.id,
												data: {
													name,
													scheduledFor: scheduledForISO,
													...data,
												},
											},
									  }
									: {
											op: "schedule_room",
											d: {
												name,
												scheduledFor: scheduledForISO,
												...data,
											},
									  }
							);
							if (resp.error) {
								showErrorToast(resp.d);
								return;
							} else {
								onScheduledRoom(allData, resp);
							}
							onRequestClose();
						}}
					>
						{({ setFieldValue, values, errors, isSubmitting }) => (
							<Form>
								<InputField
									name="name"
									maxLength={60}
									placeholder={t("modules.scheduledRooms.modal.roomName")}
									autoFocus
								/>
								<div className={`mt-8`}>
									<DateTimePicker
										value={values.scheduledFor}
										minDate={new Date()}
										maxDate={add(new Date(), { months: 1 })}
										onChange={(x) => {
											if (x) {
												setFieldValue("scheduledFor", x);
											}
										}}
									/>
									{errors.scheduledFor ? (
										<div className={`mt-1`}>
											<InputErrorMsg>{errors.scheduledFor}</InputErrorMsg>
										</div>
									) : null}
									<div className={`mt-8`}>
										<InputField
											textarea
											placeholder="description"
											name="description"
											maxLength={200}
										/>
									</div>
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
									<Button
										loading={isSubmitting}
										type="submit"
										className={`ml-1.5`}
									>
										{t("common.ok")}
									</Button>
								</div>
							</Form>
						)}
					</Formik>
				</Modal>
			</MuiPickersUtilsProvider>
		</ThemeProvider>
	);
};
