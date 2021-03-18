import React from "react";
import { Header } from "../components/header";
import { BottomNavigator } from "../navigators/bottomNavigator";

export const MainPage: React.FC = () => {
  return (
    <>
      <Header />
      <BottomNavigator />
    </>
  );
};
