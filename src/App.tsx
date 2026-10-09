import type { FC } from "react";

import { Bids } from "@/components/Bids";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Steps } from "@/components/Steps";
import { Timer } from "@/components/Timer";

import styles from "./app.module.css";

export const App: FC = () => {
  return (
    <div className={styles.container}>
      <Header />
      <Timer />
      <main className={styles.main}>
        <Steps />
        <Bids />
      </main>
      <Footer />
    </div>
  );
};
