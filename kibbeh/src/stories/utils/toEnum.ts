export const toEnum = <T>(arr: T[]) => ({
  control: {
    type: "inline-radio",
    options: arr,
  },
});
