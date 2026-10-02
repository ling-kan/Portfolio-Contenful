import React, { useEffect, useRef, useState } from 'react'
import useSafeReducedMotion from './motion/use-safe-reduced-motion'
import { motion, animate, useInView } from 'motion/react'
import { EASE } from './motion/reveal'

// "£2.5M" -> { prefix: "£", number: 2.5, suffix: "M", decimals: 1 }
const parseValue = (value = '') => {
  const match = String(value).match(/^([^\d-]*)(-?[\d,]*\.?\d+)(.*)$/)
  if (!match) return null
  const [, prefix, raw, suffix] = match
  const number = parseFloat(raw.replace(/,/g, ''))
  const decimals = raw.includes('.') ? raw.split('.')[1].length : 0
  return Number.isNaN(number) ? null : { prefix, number, suffix, decimals }
}

const AnimatedNumber = ({ value, start }) => {
  const parsed = parseValue(value)
  const reduce = useSafeReducedMotion()
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!parsed || !start) return undefined
    if (reduce) {
      setDisplay(parsed.number)
      return undefined
    }
    const controls = animate(0, parsed.number, {
      duration: 2.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    })
    return () => controls.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, start, reduce])

  if (!parsed) return <span>{value}</span>

  const formatted = display.toLocaleString(undefined, {
    minimumFractionDigits: parsed.decimals,
    maximumFractionDigits: parsed.decimals,
  })

  return (
    <span className="tabular-nums">
      {parsed.prefix}
      {formatted}
      <span className="text-accent">{parsed.suffix}</span>
    </span>
  )
}

const KeyMetrics = ({ list = [] }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const reduce = useSafeReducedMotion()

  return (
    <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-paper/10 rounded-[1.75rem] overflow-hidden border border-paper/10">
      {list.map((stat, i) => (
        <motion.div
          key={stat.label}
          className="group relative bg-ink p-8 md:p-10 min-h-[14rem] flex flex-col justify-between overflow-hidden"
          initial={reduce ? false : { opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: i * 0.12, ease: EASE }}
        >
          <div
            aria-hidden="true"
            className="absolute -bottom-24 -right-24 w-56 h-56 rounded-full bg-accent/0 group-hover:bg-accent/25 blur-3xl transition-colors duration-700"
          />
          <span className="eyebrow text-paper/40">{String(i + 1).padStart(2, '0')}</span>
          <div className="relative">
            <p className="display-lg !text-[clamp(2.75rem,5vw,4.5rem)] text-paper">
              <AnimatedNumber value={stat.value} start={isInView} />
            </p>
            <p className="mt-3 text-paper/70 text-base max-w-[16rem]">{stat.label}</p>
            <motion.span
              aria-hidden="true"
              className="block mt-6 h-px bg-paper/30 origin-left"
              initial={reduce ? false : { scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.4, delay: 0.3 + i * 0.12, ease: EASE }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default KeyMetrics
