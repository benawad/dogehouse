import DateFnsUtils from "@date-io/date-fns";
import { BaseUser } from "@dogehouse/kebab";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { add } from "date-fns";
import { Form, Formik } from "formik";
import React from "react";
import { InputField } from "../../form-fields/InputField";
import { showErrorToast } from "../../lib/showErrorToast";
import { useWrappedConn } from "../../shared-hooks/useConn";
import { useTypeSafeTranslation } from "../../shared-hooks/useTypeSafeTranslation";
import { Button } from "../../ui/Button";
import { ButtonLink } from "../../ui/ButtonLink";
import { InputErrorMsg } from "../../ui/InputErrorMsg";
import { Modal } from "../../ui/Modal";

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

export const CreateScheduleRoomModal: React.FC<CreateRoomModalProps> = ({
  onScheduledRoom,
  onRequestClose,
  editInfo,
}) => {
  const conn = useWrappedConn();
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
              const resp = await (editInfo
                ? conn.mutation.editScheduledRoom(editInfo.id, {
                    name,
                    scheduledFor: scheduledForISO,
                    ...data,
                  })
                : conn.mutation.createScheduledRoom({
                    name,
                    scheduledFor: scheduledForISO,
                    ...data,
                  }));

              if ("error" in resp && resp.error) {
                showErrorToast(resp.error);
                return;
              } else {
                onScheduledRoom(allData, resp);
              }
              onRequestClose();
            }}
          >
            {({ setFieldValue, values, errors, isSubmitting }) => (
              <Form className="flex-col w-full">
                <InputField
                  name="name"
                  maxLength={60}
                  placeholder={t("modules.scheduledRooms.modal.roomName")}
                  autoFocus
                />
                <div className={`mt-4 w-full flex-col`}>
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
                  <div className={`mt-4`}>
                    <InputField
                      textarea
                      placeholder={t(
                        "modules.scheduledRooms.modal.roomDescription"
                      )}
                      name="description"
                      maxLength={200}
                    />
                  </div>
                </div>

                <div
                  className={`flex pt-4 space-x-3 col-span-full items-center`}
                >
                  <Button
                    loading={isSubmitting}
                    type="submit"
                    className={`mr-3`}
                  >
                    {t("common.ok")}
                  </Button>
                  <ButtonLink type="button" onClick={onRequestClose}>
                    {t("common.cancel")}
                  </ButtonLink>
                </div>
              </Form>
            )}
          </Formik>
        </Modal>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  );
};
