import React, { useState } from 'react'
import useSafeReducedMotion from './motion/use-safe-reduced-motion'
import { motion, AnimatePresence } from 'motion/react'
import SpaceIllustration from '../assets/illustration/space-discovery.svg'
import { EASE } from './motion/reveal'

const SkillsPanel = ({ list = [] }) => {
  const reduce = useSafeReducedMotion()
  const [active, setActive] = useState(0)
  const [focused, setFocused] = useState(null)
  const section = list[active] || { skills: [] }
  const skills = section.skills || []
  const detail = skills.find((s) => s.name === focused) || skills[0]

  const selectCategory = (i) => {
    setActive(i)
    setFocused(null)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div className="lg:col-span-8">
        {/* Category tabs */}
        <div role="tablist" aria-label="Skill categories" className="flex flex-wrap gap-2 mb-10">
          {list.map((cat, i) => (
            <button
              key={cat.category}
              role="tab"
              aria-selected={active === i}
              onClick={() => selectCategory(i)}
              className={`relative rounded-full px-5 py-2.5 text-sm font-medium transition-colors duration-300 ${
                active === i ? '!text-paper' : '!text-ink/70 hover:!text-ink bg-ink/5'
              }`}
            >
              {active === i && (
                <motion.span
                  layoutId="skills-tab"
                  className="absolute inset-0 rounded-full bg-ink"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative">{cat.category}</span>
            </button>
          ))}
        </div>

        {/* Skill chips */}
        <AnimatePresence mode="wait">
          <motion.ul
            key={section.category}
            className="flex flex-wrap gap-3"
            initial="hidden"
            animate="show"
            exit="exit"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: reduce ? 0 : 0.04 } },
              exit: { opacity: 0, transition: { duration: 0.2 } },
            }}
          >
            {skills.map((skill) => {
              const isActive = detail?.name === skill.name
              return (
                <motion.li
                  key={skill.name}
                  variants={{
                    hidden: { opacity: 0, y: 20, scale: 0.9 },
                    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: EASE } },
                  }}
                >
                  <button
                    type="button"
                    onMouseEnter={() => setFocused(skill.name)}
                    onFocus={() => setFocused(skill.name)}
                    onClick={() => setFocused(skill.name)}
                    aria-pressed={isActive}
                    className={`rounded-2xl border px-5 py-3 text-base md:text-lg font-display font-medium tracking-tight transition-all duration-300 hover:-translate-y-0.5 ${
                      isActive
                        ? 'bg-accent border-accent !text-white shadow-[0_12px_30px_-12px_rgba(242,107,58,0.7)]'
                        : 'bg-paper border-line !text-ink hover:border-ink'
                    }`}
                  >
                    {skill.name}
                  </button>
                </motion.li>
              )
            })}
          </motion.ul>
        </AnimatePresence>
      </div>

      {/* Detail card */}
      <aside className="lg:col-span-4">
        <div className="relative rounded-[1.75rem] bg-ink text-paper p-8 overflow-hidden min-h-[20rem] lg:sticky lg:top-28">
          <SpaceIllustration
            aria-hidden="true"
            className="absolute -right-10 -bottom-6 w-[115%] opacity-[0.12] invert pointer-events-none"
          />
          <p className="eyebrow text-paper/50 relative">{section.category}</p>
          <AnimatePresence mode="wait">
            <motion.div
              key={detail?.name || 'empty'}
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="relative mt-8"
            >
              <h3 className="display-md text-paper">{detail?.name}</h3>
              {detail?.description && <p className="mt-4 text-paper/70 leading-relaxed">{detail.description}</p>}
            </motion.div>
          </AnimatePresence>
          <p className="relative mt-10 eyebrow text-paper/40">
            {String(skills.length).padStart(2, '0')} skills · hover or tap to explore
          </p>
        </div>
      </aside>
    </div>
  )
}

export default SkillsPanel
