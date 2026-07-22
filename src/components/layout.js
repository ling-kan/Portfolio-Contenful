import React, { useState, useEffect } from 'react'
import Seo from './seo'
import Navigation from './navigation'
import Footer from './footer'
import { useReducedMotion } from "motion/react"
import HeaderList from './motion/header-list'
import useNavigationData from '../services/useNavigationData'
import RevealPreloader from './motion/reveal-preloader'

const Template = ({ children, fullHeaderHeight = false, data, author }) => {
  const navigation = useNavigationData();
  const prefersReducedMotion = useReducedMotion();
  const headerSpacing = fullHeaderHeight ? 'mt-0' : 'mt-20 md:mt-16'
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const duration = 2000
    const start = performance.now()
    let rafId = null

    const animate = (now) => {
      const elapsed = now - start
      const percent = Math.min(100, (elapsed / duration) * 100)
      setProgress(percent)

      if (percent < 100) {
        rafId = requestAnimationFrame(animate)
      } else {
        setIsLoading(false)
      }
    }

    rafId = requestAnimationFrame(animate)

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, []);

  const preloaderProps = {
    isLoading,
    progress,
    brandName: author?.name ?? 'LING KAN',
    brandImage: author?.image,
    animatedList: author?.animatedList,
    tagline: author?.tagline,
  }

  return (
    <RevealPreloader {...preloaderProps}>
      <div className="min-h-screen bg-background">
        <Seo />
        <Navigation navList={navigation} />
        {prefersReducedMotion || !isMounted ?
          <main className={headerSpacing} role="main">{children}</main>
          :
          <HeaderList>
            <div className={headerSpacing} role="main">{children}</div>
          </HeaderList>
        }
        <Footer navList={navigation} />
      </div>
    </RevealPreloader>
  )
}

export default Template
