"use client";

import StoreProvider from "../../components/StoreProvider";
import Content from "./content";

export default function Page() {
  return (
    <StoreProvider>
      <Content />
    </StoreProvider>
  );
}
