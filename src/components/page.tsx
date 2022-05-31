import React from "react";
import { GlobalStateProvider, Theme } from "../../context";
import { useSiteConfiguration } from "../../hooks/useSiteConfiguration";
import { Layout } from "./layout";

interface PageProps {
  children: React.ReactElement;
  useSplashScreenAnimation?: boolean;
}

export function Page(props: PageProps): React.ReactElement {
  const siteConfiguration = useSiteConfiguration();
  return (
    <GlobalStateProvider
      useSplashScreenAnimation={props.useSplashScreenAnimation || false}
    >
      <Layout
        useSplashScreenAnimation={props.useSplashScreenAnimation || false}
        useCookieBar={siteConfiguration.featureToggles.useCookieBar}
      >
        {props.children}
      </Layout>
    </GlobalStateProvider>
  );
}
