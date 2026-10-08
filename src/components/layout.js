import React, { useEffect } from 'react'
import useSafeReducedMotion from './motion/use-safe-reduced-motion'
import { MotionConfig } from 'motion/react'
import { ScrollDirectionProvider } from './motion/scroll-direction'
import Seo from './seo'
import Navigation from './navigation'
import Footer from './footer'
import ScrollProgress from './motion/scroll-progress'
import useNavigationData from '../services/useNavigationData'
import RevealPreloader from './motion/reveal-preloader'
import useSiteSettings from '../services/useSiteSettings'

const Template = ({ children, fullHeaderHeight = false, author }) => {
  const navigation = useNavigationData()
  const prefersReducedMotion = useSafeReducedMotion()
  const { introLabel } = useSiteSettings()
  const headerSpacing = fullHeaderHeight ? '' : 'pt-28 md:pt-32'

  useEffect(() => {
    const root = document.documentElement
    if (prefersReducedMotion) root.dataset.reduceMotion = 'true'
    else delete root.dataset.reduceMotion
    return () => delete root.dataset.reduceMotion
  }, [prefersReducedMotion])

  return (
    <MotionConfig reducedMotion={prefersReducedMotion ? 'always' : 'never'}>
      <RevealPreloader brandName={author?.name ?? 'LING KAN'} label={introLabel} skipAnimation={prefersReducedMotion}>
        <ScrollDirectionProvider>
          <Seo />
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-ink focus:!text-paper focus:px-4 focus:py-2 focus:rounded-full"
          >
            Skip to content
          </a>
          <ScrollProgress />
          <Navigation navList={navigation} />
          <main id="main" className={headerSpacing}>{children}</main>
          <Footer navList={navigation} />
        </ScrollDirectionProvider>
      </RevealPreloader>
    </MotionConfig>
  )
}

export default Template
