"use client";

import type { ReactNode } from "react";
import { HydrationBoundary, type DehydratedState } from "@tanstack/react-query";

export default function HydrationBoundaryWrapper({
  state,
  children,
}: {
  state: DehydratedState;
  children: ReactNode;
}) {
  return <HydrationBoundary state={state}>{children}</HydrationBoundary>;
}