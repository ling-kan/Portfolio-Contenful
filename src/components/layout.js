import React, { useState, useEffect } from 'react'
import Seo from './seo'
import Navigation from './navigation'
import Footer from './footer'
import { useReducedMotion } from "motion/react"
import HeaderList from './motion/header-list'
import useNavigationData from '../services/useNavigationData'
import ClickSpark from './motion/click-spark'
import RevealPreloader from './motion/reveal-preloader'
// import CookieConsent from './cookie-consent'

const Template = ({ children, fullHeaderHeight = false, data }) => {
  const navigation = useNavigationData();
  const prefersReducedMotion = useReducedMotion();
  const headerSpacing = fullHeaderHeight ? 'mt-0 md:mt-0' : 'mt-20 md:mt-16'
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.random() * 30;
      });
    }, 300);

    // Complete loading when page is ready
    const timer = setTimeout(() => {
      setProgress(100);
      setIsLoading(false);
    }, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <RevealPreloader isLoading={isLoading} progress={progress}>
      <div >
        <ClickSpark>
          <Seo />
          {/* <CookieConsent /> */}
          <Navigation navList={navigation} />
          {prefersReducedMotion ?
            <main className={headerSpacing} role="main">{children}</main>
            :
            <HeaderList>
              <div className={headerSpacing} role="main">{children}</div>
            </HeaderList>
          }
          <Footer navList={navigation} />
        </ClickSpark>
      </div>
    </RevealPreloader>
  )
}

export default Template
