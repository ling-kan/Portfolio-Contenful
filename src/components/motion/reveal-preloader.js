import React, { createContext, useContext, useEffect, useState } from 'react'
import { motion, AnimatePresence, animate } from 'motion/react'
import { EASE } from './reveal'

const SESSION_KEY = 'lk-intro-played'
// Module-level flags survive client-side route changes so the intro only plays once per visit.
let playedThisSession = false
let hasHydrated = false

const IntroContext = createContext(true)
/** True once the preloader curtain has lifted (or immediately if it never shows). */
export const useIntroReady = () => useContext(IntroContext)

const shouldPlay = () => {
  if (typeof window === 'undefined') return true
  if (playedThisSession) return false
  try {
    if (window.sessionStorage.getItem(SESSION_KEY)) return false
  } catch (e) {
    /* storage unavailable */
  }
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

const RevealPreloader = ({ brandName = 'Ling Kan', children, duration = 1.6 }) => {
  // The very first render must match the server HTML (which always includes the curtain).
  const [visible, setVisible] = useState(() => (hasHydrated ? shouldPlay() : true))
  const [count, setCount] = useState(0)
  // When the intro is skipped, remove the server-rendered curtain without animating it away
  const [instant, setInstant] = useState(false)

  useEffect(() => {
    hasHydrated = true
    if (!shouldPlay()) {
      setInstant(true)
      setVisible(false)
      return undefined
    }
    const controls = animate(0, 100, {
      duration,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setCount(Math.round(v)),
      onComplete: () => {
        playedThisSession = true
        try {
          window.sessionStorage.setItem(SESSION_KEY, '1')
        } catch (e) {
          /* storage unavailable */
        }
        setVisible(false)
      },
    })
    return () => controls.stop()
  }, [duration])

  return (
    <>
      <noscript>
        <style>{'.lk-preloader{display:none!important}'}</style>
      </noscript>
      <AnimatePresence>
        {visible && (
          <motion.div
            key="preloader"
            className="lk-preloader fixed inset-0 z-[9999] bg-ink text-paper flex flex-col justify-between p-6 md:p-10 overflow-hidden"
            exit={instant ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: instant ? 0 : 0.9, ease: EASE }}
            aria-hidden="true"
          >
            <div aria-hidden="true" className="absolute inset-0 bg-grid-dark" />
            <div className="relative flex justify-between eyebrow text-paper/50">
              <span>Portfolio</span>
              <span>Loading the story</span>
            </div>

            <div className="relative overflow-hidden">
              <motion.p
                className="display-xl uppercase"
                initial={{ y: '100%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.9, ease: EASE }}
              >
                {brandName}
                <span className="text-accent">.</span>
              </motion.p>
            </div>

            <div className="relative flex items-end justify-between gap-6">
              <div className="flex-1 h-px bg-paper/15 overflow-hidden mb-4">
                <div className="h-full bg-accent origin-left" style={{ transform: `scaleX(${count / 100})` }} />
              </div>
              <span className="font-display font-semibold tabular-nums text-6xl md:text-[8rem] leading-none">
                {String(count).padStart(3, '0')}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <IntroContext.Provider value={!visible}>{children}</IntroContext.Provider>
    </>
  )
}

export default RevealPreloader
