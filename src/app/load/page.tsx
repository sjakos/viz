"use client";

import { useRef } from "react";
import StoreProvider from "../../components/StoreProvider";
import Content from "./content";
import { AppStore, makeStore } from "@/lib/state/store";
import { Provider } from "react-redux";

export default function Page() {
  const storeRef = useRef<AppStore>()
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore()
  }
  return (
    <StoreProvider>
      <Content />
    </StoreProvider>
  );
}
