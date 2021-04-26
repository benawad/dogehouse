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

const colors = {
  p100: "#dee3ea",
  p200: "#b2bdcd",
  p300: "#5d7290",
  p600: "#323d4d",
  p700: "#242c37",
  p800: "#151a21",
  p900: "#0b0e11",
  accent: "#fd4d4d",
  accentHover: "#fd6868",
  white: "#FFF",
};

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: colors.accent,
    },
    secondary: {
      main: colors.accent,
    },
  },
  overrides: {
    MuiPickersDay: {
      day: {
        "&:hover": {
          backgroundColor: colors.p700,
        },
        color: colors.p100,
      },
      current: {
        "&:hover": {
          backgroundColor: colors.p700,
        },
        color: colors.p100,
      },
      daySelected: {
        "&:hover": {
          backgroundColor: colors.accentHover,
        },
        backgroundColor: colors.accent,
        color: colors.white,
      },
      dayDisabled: {
        backgroundColor: colors.p800,
        color: colors.p600,
      },
    },
    MuiPickerDTHeader: {
      separator: {},
      toolbar: {},
    },
    MuiPickerDTTabs: {
      tabs: {
        backgroundColor: colors.p900,
      },
    },
    MuiPickersCalendar: {
      week: {
        backgroundColor: colors.p800,
        color: colors.p100,
      },
      progressContainer: {},
      transitionContainer: {
        backgroundColor: colors.p800,
      },
    },
    MuiPickersCalendarHeader: {
      switchHeader: {
        backgroundColor: colors.p800,
        color: colors.p100,
      },
      transitionContainer: {
        backgroundColor: colors.p800,
      },
      iconButton: {
        backgroundColor: colors.p800,
        color: colors.p100,
      },
      daysHeader: {
        backgroundColor: colors.p800,
        color: colors.p100,
      },
      dayLabel: {
        backgroundColor: colors.p800,
        color: colors.p100,
      },
    },
    MuiPickersSlideTransition: {
      transitionContainer: {},
    },
    MuiPickersYearSelectionStyles: {
      container: {
        backgroundColor: colors.p800,
        color: colors.p100,
      },
    },
    MuiPickersYear: {
      root: {
        backgroundColor: colors.p800,
        color: colors.p300,
      },
      yearSelected: {
        backgroundColor: colors.p800,
        color: colors.p100,
      },
      yearDisabled: {
        backgroundColor: colors.p800,
        color: colors.p600,
      },
    },
    MuiPickersMonthSelection: {
      container: {
        backgroundColor: colors.p800,
        color: colors.p100,
      },
    },
    MuiPickersMonth: {
      root: {
        backgroundColor: colors.p800,
        color: colors.p300,
      },
      monthSelected: {
        backgroundColor: colors.p800,
        color: colors.p100,
      },
      monthDisabled: {
        backgroundColor: colors.p800,
        color: colors.p600,
      },
    },
    MuiPickersTimePickerToolbar: {
      separator: {},
      toolbarLandscape: {},
      hourMinuteLabel: {},
      ampmLabel: {},
    },
    MuiPickersClock: {
      container: {
        backgroundColor: colors.p800,
        color: colors.p100,
      },
      clock: {
        backgroundColor: colors.p900,
        color: colors.accent,
      },
      pin: {
        backgroundColor: colors.accent,
      },
    },
    MuiPickersClockNumber: {
      clockNumber: {
        color: colors.p200,
      },
      clockNumberSelected: {
        color: colors.white,
      },
    },
    MuiPickersClockPointer: {
      animateTransform: {},
      pointer: {
        backgroundColor: colors.accent,
      },
      thumb: {
        backgroundColor: colors.accent,
        borderColor: colors.accent,
      },
      noPoint: {
        backgroundColor: colors.accent,
      },
    },
    MuiPickersModal: {
      dialog: {
        backgroundColor: colors.p800,
      },
      dialogRoot: {
        backgroundColor: colors.p800,
      },
      dialogRootWider: {
        backgroundColor: colors.p800,
      },
      withAdditionalAction: {
        backgroundColor: colors.p800,
      },
    },
    MuiPickersToolbar: {
      toolbar: {
        backgroundColor: colors.p900,
        color: colors.p100,
      },
    },
    MuiPickersToolbarButton: {
      toolbarBtn: {
        color: colors.p100,
      },
    },
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
                <div className={`flex mt-4 w-full flex-col`}>
                  <DateTimePicker
                    value={values.scheduledFor}
                    minDate={new Date()}
                    maxDate={add(new Date(), { months: 6 })}
                    onChange={(x) => {
                      if (x) {
                        setFieldValue("scheduledFor", x);
                      }
                    }}
                  />
                  {errors.scheduledFor ? (
                    <div className={`flex mt-1`}>
                      <InputErrorMsg>{errors.scheduledFor}</InputErrorMsg>
                    </div>
                  ) : null}
                  <div className={`flex mt-4`}>
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
