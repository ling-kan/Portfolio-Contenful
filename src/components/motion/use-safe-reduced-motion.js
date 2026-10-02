import { useEffect, useState } from 'react'
import { useReducedMotion } from 'motion/react'

/**
 * Like motion's useReducedMotion, but returns false until after hydration so the
 * first client render matches the server HTML (which can't know the preference).
 */
const useSafeReducedMotion = () => {
  const reduce = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted && !!reduce
}

export default useSafeReducedMotion
