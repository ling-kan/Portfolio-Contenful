import React from "react";
import { useGlobalState } from "./../services/context";
import { SplashScreen } from "./splash-screen";
import Navigation from "./navigation";
import Footer from "./footer";
import { CookieBar } from "./cookie-banner";
import { motion, useReducedMotion } from "framer-motion";

interface LayoutProps {
  children: React.ReactElement;
  useSplashScreenAnimation: boolean;
  useCookieBar: boolean;
  socials: object;
  navigation: object;
  fullHeaderHeight: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  useSplashScreenAnimation,
  useCookieBar,
  socials,
  navigation,
  fullHeaderHeight,
}) => {
  const { globalState } = useGlobalState();
  const showSplashScreen =
    useSplashScreenAnimation && !globalState.splashScreenDone;
  const prefersReducedMotion = useReducedMotion();
  const headerSpacing = fullHeaderHeight ? "mt-0 md:mt-0" : "mt-20 md:mt-16";

  const splashScreenView = (
    <>
      <SplashScreen />
    </>
  );

  const layoutView = (
    <>
      <Navigation navList={navigation} socialList={socials} />
      {prefersReducedMotion ? (
        <main className={headerSpacing} role="main">
          {children}
        </main>
      ) : (
        <>
          <motion.main
            layout
            initial={{
              opacity: 0,
              y: -150,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: 150,
            }}
            transition={{
              type: "spring",
              mass: 0.5,
              stiffness: 100,
              duration: 0.1,
            }}
          >
            <div className={headerSpacing} role="main">
              {children}
            </div>
          </motion.main>
        </>
      )}
      <Footer navList={navigation} socialList={socials} />
      {useCookieBar && <CookieBar />}
    </>
  );

  return showSplashScreen ? splashScreenView : layoutView;
};
