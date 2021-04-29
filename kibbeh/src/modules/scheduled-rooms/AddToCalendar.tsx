import React, { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { BaseOverlay } from "../../ui/BaseOverlay";
import { DropdownController } from "../../ui/DropdownController";
import { SettingsIcon } from "../../ui/SettingsIcon";
import makeUrls, { CalendarEvent } from "./makeUrls";

type CalendarURLs = ReturnType<typeof makeUrls>;

const useAutoFocus = () => {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const previous = document.activeElement;
    const element = elementRef.current;

    if (element) {
      element.focus();
    }

    if (previous instanceof HTMLElement) {
      return () => previous.focus();
    }

    return undefined;
  }, []);

  return elementRef;
};

type OpenStateToggle = (event?: React.MouseEvent) => void;

const useOpenState = (initialOpen: boolean): [boolean, OpenStateToggle] => {
  const [open, setOpen] = useState<boolean>(initialOpen);
  const onToggle = () => setOpen((current) => !current);

  useEffect(() => {
    if (open) {
      const onClose = () => setOpen(false);
      document.addEventListener("click", onClose);

      return () => document.removeEventListener("click", onClose);
    }

    return undefined;
  }, [open, setOpen]);

  return [open, onToggle];
};

type CalendarRef = HTMLAnchorElement;
type CalendarProps = {
  children: React.ReactNode;
  filename?: string;
  href: string;
};

const Calendar = React.forwardRef<CalendarRef, CalendarProps>(
  ({ children, filename = false, href }, ref) => (
    <a
      ref={ref}
      download={filename}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  )
);

Calendar.displayName = "Calendar";

type DropdownProps = {
  filename: string;
  onToggle: OpenStateToggle;
  urls: CalendarURLs;
};

const Dropdown: React.FC<DropdownProps> = ({ filename, onToggle, urls }) => {
  const ref = useAutoFocus() as React.RefObject<HTMLAnchorElement>;
  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      onToggle();
    }
  };

  return (
    <BaseOverlay onKeyDown={onKeyDown} role="presentation">
      <SettingsIcon
        onClick={onToggle}
        a={{
          href: urls.ics,
          download: filename,
          ref,
        }}
        label="Apple Calendar"
      />
      <SettingsIcon
        onClick={onToggle}
        a={{ href: urls.google }}
        label="Google"
      />
      <SettingsIcon
        onClick={onToggle}
        a={{ href: urls.ics, download: filename }}
        label="Outlook"
      />
      <SettingsIcon
        onClick={onToggle}
        a={{ href: urls.outlook }}
        label="Outlook Web App"
      />
      <SettingsIcon onClick={onToggle} a={{ href: urls.yahoo }} label="Yahoo" />
    </BaseOverlay>
  );
};

type AddToCalendarProps = {
  event: CalendarEvent;
  open?: boolean;
  filename?: string;
  children: (tog: () => void) => ReactNode;
};

export const AddToCalendar: React.FC<AddToCalendarProps> = ({
  children,
  event,
  filename = "download",
  open: initialOpen = false,
}) => {
  const [_, onToggle] = useOpenState(initialOpen);
  const urls = useMemo<CalendarURLs>(() => makeUrls(event), [event]);

  return (
    <div className="relative" title="Add to Calendar">
      <DropdownController
        portal={false}
        overlay={(close) => (
          <Dropdown filename={filename} onToggle={close} urls={urls} />
        )}
      >
        {children(onToggle)}
      </DropdownController>
    </div>
  );
};
