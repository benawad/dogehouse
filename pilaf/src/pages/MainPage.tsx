import React from "react";
import { Header } from "../components/Header";
import { BottomNavigator } from "../navigators/BottomNavigator";

export const MainPage: React.FC = (props) => {
  return (
    <>
      <Header />
      <BottomNavigator />
    </>
  );
};
