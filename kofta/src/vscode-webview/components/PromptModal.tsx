import * as React from "react";
import { Modal } from "./Modal";
import create from "zustand";
import { combine } from "zustand/middleware";
import { Button } from "./Button";
import { Input } from "./Input";

interface Props {}

type Fn = (v: string) => void;

const usePromptModalStore = create(
  combine(
    {
      message: "",
      value: "",
      onConfirm: undefined as undefined | Fn,
    },
    (set) => ({
      close: () => set({ onConfirm: undefined, message: "", value: "" }),
      set,
    })
  )
);

export const modalPrompt = (
  message: string,
  onConfirm: Fn,
  defaultValue = ""
) => {
  usePromptModalStore
    .getState()
    .set({ onConfirm, message, value: defaultValue });
};

export const PromptModal: React.FC<Props> = () => {
  const { onConfirm, message, close, value, set } = usePromptModalStore();
  return (
    <Modal isOpen={!!onConfirm} onRequestClose={() => close()}>
      <div className={`mb-4`}>{message}</div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          close();
          onConfirm?.(value);
        }}
      >
        <Input
          autoFocus
          value={value}
          onChange={(e) => set({ value: e.target.value })}
        />
        <div className={`flex mt-12`}>
          <Button
            type="button"
            onClick={close}
            className={`mr-3`}
            color="secondary"
          >
            cancel
          </Button>
          <Button type="submit" className={`ml-3`}>
            ok
          </Button>
        </div>
      </form>
    </Modal>
  );
};
