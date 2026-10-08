import React, { createContext, useContext, useRef } from 'react'
import { useMotionValueEvent, useScroll } from 'motion/react'

const initialDirection = { current: false }
const ScrollDirectionContext = createContext(initialDirection)

export const ScrollDirectionProvider = ({ children }) => {
  const { scrollY } = useScroll()
  const direction = useRef(false)

  useMotionValueEvent(scrollY, 'change', (current) => {
    const previous = scrollY.getPrevious()
    if (previous === undefined || current === previous) return
    direction.current = current > previous
  })

  return (
    <ScrollDirectionContext.Provider value={direction}>
      {children}
    </ScrollDirectionContext.Provider>
  )
}

export const useScrollingDown = () => useContext(ScrollDirectionContext)
