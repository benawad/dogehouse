import { NextPage } from "next";

export type PageComponent<T> = NextPage<T> & { ws?: boolean };
