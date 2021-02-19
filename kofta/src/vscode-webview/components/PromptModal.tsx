import * as React from "react";
import { Modal } from "./Modal";
import create from "zustand";
import { combine } from "zustand/middleware";
import { Button } from "./Button";
import { tw } from "twind";
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
      <div className={tw`mb-4`}>{message}</div>
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
      </form>
      <div className={tw`flex mt-12`}>
        <Button
          type="button"
          onClick={close}
          style={{ marginRight: 8 }}
          color="secondary"
        >
          cancel
        </Button>
        <Button type="submit" style={{ marginLeft: 8 }}>
          ok
        </Button>
      </div>
    </Modal>
  );
};
