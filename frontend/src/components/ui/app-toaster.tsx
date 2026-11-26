"use client";

import { Toaster } from "react-hot-toast";

export function AppToaster() {
  return (
    <Toaster
      position="bottom-center"
      reverseOrder={false}
      gutter={10}
      toastOptions={{
        duration: 2200,
        className:
          "!rounded-full !bg-navy !px-4 !py-2 !text-sm !font-medium !text-white !shadow-lg",
        success: {
          iconTheme: {
            primary: "#10b981",
            secondary: "#ffffff",
          },
        },
        error: {
          duration: 3200,
          className:
            "!rounded-full !bg-navy !px-4 !py-2 !text-sm !font-medium !text-white !shadow-lg",
          iconTheme: {
            primary: "#ef4444",
            secondary: "#ffffff",
          },
        },
      }}
    />
  );
}
