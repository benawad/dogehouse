import React from "react";

interface NativeSelectProps {}

export const NativeSelect: React.FC<
  React.ComponentPropsWithoutRef<"select">
> = ({ children, className, ...props }) => {
  return (
    <select
      className={`h-full bg-primary-700 text-primary-100 placeholder-primary-300 focus:outline-none rounded-8 px-4 py-2 appearance-none bg-no-repeat bg-auto ${className}`}
      style={{
        backgroundImage:
          "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iNiIgdmlld0JveD0iMCAwIDEwIDYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0wIDAuNUw1IDUuNUwxMCAwLjVIMFoiIGZpbGw9IiNERUUzRUEiLz4KPC9zdmc+Cgo=')",
        backgroundPosition: "right 8.5px center",
      }}
      {...props}
    >
      {children}
    </select>
  );
};
