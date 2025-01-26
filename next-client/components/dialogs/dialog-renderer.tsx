"use client";

import { ComponentType, MouseEvent, useState } from "react";

interface DialogRendererProps {
  Dialog: ComponentType<{ isOpen: boolean; onClose: () => void }>;
  Trigger: ComponentType<{ onClick: (event: MouseEvent) => void }>;
}

export const DialogRenderer = ({ Dialog, Trigger }: DialogRendererProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} />

      <Trigger onClick={() => setIsOpen(true)} />
    </>
  );
};
