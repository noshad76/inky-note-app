"use client";
import { Tooltip as ArkTooltip, Portal } from "@ark-ui/react";
import { ReactNode } from "react";

interface TooltipProps {
  children: ReactNode;
  content: string;
}

export const Tooltip = ({ children, content }: TooltipProps) => (
  <ArkTooltip.Root closeDelay={0} openDelay={500}>
    <ArkTooltip.Trigger asChild>{children}</ArkTooltip.Trigger>
    <Portal>
      <ArkTooltip.Positioner>
        <ArkTooltip.Content className="bg-text text-bg text-[10px] px-2 py-1 rounded shadow-lg z-50 font-sans">
          <ArkTooltip.Arrow>
             <ArkTooltip.ArrowTip className="bg-text" />
          </ArkTooltip.Arrow>
          {content}
        </ArkTooltip.Content>
      </ArkTooltip.Positioner>
    </Portal>
  </ArkTooltip.Root>
);
