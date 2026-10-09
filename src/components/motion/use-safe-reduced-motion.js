import { useEffect, useState } from 'react'
import { useReducedMotion } from 'motion/react'

/** Honors reduced-motion preferences and avoids motion on low-powered devices. */
const useSafeReducedMotion = () => {
  const reduce = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  const [lowPower, setLowPower] = useState(false)

  useEffect(() => {
    setLowPower(navigator.hardwareConcurrency <= 2 || navigator.deviceMemory <= 2)
    setMounted(true)
  }, [])

  return mounted && (!!reduce || lowPower)
}

export default useSafeReducedMotion
