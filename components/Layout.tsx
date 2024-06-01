import { Container } from "@mui/material";
import NavBar from "./NavBar";
import { NextComponentType, NextPageContext } from "next";

export default function Layout({ children }: {children: React.ReactNode}) {
  return (
    <>
      <NavBar />
      <Container>{children}</Container>
    </>
  );
}
