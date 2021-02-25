import React from "react";
import { useLayer, Arrow } from "react-laag";
import { motion, AnimatePresence } from "framer-motion";

interface PopoverMenuProps {
  trigger: React.ReactNode;
}

export const PopoverMenu: React.FC<PopoverMenuProps> = ({
  children,
  trigger,
}) => {
  const [isOpen, setOpen] = React.useState(false);

  function close() {
    setOpen(false);
  }

  const { renderLayer, triggerProps, layerProps, arrowProps } = useLayer({
    isOpen,
    onOutsideClick: close,
    onDisappear: close,
    overflowContainer: false,
    auto: true,
    placement: "top-end",
    triggerOffset: 16,
    containerOffset: 16,
    arrowOffset: 5,
  });

  return (
    <>
      <button {...triggerProps} onClick={() => setOpen(!isOpen)}>
        {trigger}
      </button>
      {renderLayer(
        <AnimatePresence>
          {isOpen && (
            <motion.ul {...layerProps}>
              {children}
              <Arrow backgroundColor="#1e1e1e" {...arrowProps} />
            </motion.ul>
          )}
        </AnimatePresence>
      )}
    </>
  );
};

interface MenuItemProps {
  onClick?: () => void;
}

export const MenuItem: React.FC<MenuItemProps> = ({ children, onClick }) => {
  return (
    <li
      className="px-3 bg-simple-gray-1e text-white cursor-pointer hover:bg-simple-gray-4d active:bg-simple-gray-1e select-none text-sm font-normal"
      onClick={onClick}
    >
      {children}
    </li>
  );
};
