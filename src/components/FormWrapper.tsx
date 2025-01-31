import React from "react";

export default function FormWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md space-y-8 p-8 bg-card rounded-xl shadow-lg">
        {children}
      </div>
    </div>
  );
}
