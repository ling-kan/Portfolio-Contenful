import React, { useEffect, useRef, useState } from 'react'
import useSafeReducedMotion from './motion/use-safe-reduced-motion'
import { GatsbyImage } from 'gatsby-plugin-image'
import {
  motion,
  AnimatePresence,
  useMotionValue,

  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'
import { ArrowDownRightIcon, ArrowRightIcon } from '@heroicons/react/24/solid'
import Container from './container'
import Marquee from './motion/marquee'
import Magnetic from './motion/magnetic'
import RotatingBadge from './motion/rotating-badge'
import { EASE } from './motion/reveal'
import { useIntroReady } from './motion/reveal-preloader'

const RoleTicker = ({ roles = [] }) => {
  const reduce = useSafeReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reduce || roles.length < 2) return undefined
    const id = setInterval(() => setIndex((i) => (i + 1) % roles.length), 2800)
    return () => clearInterval(id)
  }, [reduce, roles.length])

  if (!roles.length) return null
  if (reduce) return <span>{roles.join(' · ')}</span>

  return (
    <span className="relative block overflow-hidden h-[1.2em]">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={roles[index]}
          className="block whitespace-nowrap leading-[1.2]"
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          {roles[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

const Letters = ({ word, delay = 0, className = '', ready = true }) => {
  const reduce = useSafeReducedMotion()
  if (reduce) return <span className={`block ${className}`}>{word}</span>
  return (
    <span className={`block overflow-hidden pb-[0.06em] ${className}`} aria-hidden="true">
      {Array.from(word).map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ y: '105%' }}
          animate={ready ? { y: '0%' } : undefined}
          transition={{ duration: 1.1, delay: delay + i * 0.045, ease: EASE }}
        >
          {char === ' ' ? ' ' : char}
        </motion.span>
      ))}
    </span>
  )
}

const HomeHero = ({ name = '', animatedList = [], image, tagline, metric, caseStudyCount = 0, marqueeItems = [] }) => {
  const ref = useRef(null)
  const reduce = useSafeReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const textY = useTransform(scrollYProgress, [0, 1], [0, -140])
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 90])
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  // Soft cursor-follow for the background orbs
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const orbX = useSpring(mx, { stiffness: 40, damping: 20 })
  const orbY = useSpring(my, { stiffness: 40, damping: 20 })
  const orbXInverse = useTransform(orbX, (v) => -v)
  const orbYInverse = useTransform(orbY, (v) => -v)

  const handleMouseMove = (e) => {
    if (reduce) return
    const rect = e.currentTarget.getBoundingClientRect()
    mx.set(((e.clientX - rect.left) / rect.width - 0.5) * 60)
    my.set(((e.clientY - rect.top) / rect.height - 0.5) * 60)
  }

  const safeName = name || ''
  const [first, ...rest] = safeName.trim().split(' ')
  const last = rest.join(' ')
  const roles = animatedList || []
  const ready = useIntroReady()
  const play = (target) => (ready ? target : undefined)
  const intro = { initial: reduce ? false : { opacity: 0, y: 20 }, animate: play({ opacity: 1, y: 0 }) }

  return (
    <section
      id="home"
      ref={ref}
      onMouseMove={handleMouseMove}
      className="relative isolate overflow-hidden min-h-[100svh] flex flex-col pt-28 md:pt-32 grain"
    >
      {/* Background imagery: grid, drifting colour fields, floating geometry */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid opacity-70" />
        <motion.div
          style={{ x: orbX, y: orbY }}
          className="absolute -top-32 -right-24 w-[38rem] h-[38rem] rounded-full bg-mint/60 blur-[110px]"
        />
        <motion.div
          style={{ x: orbXInverse, y: orbYInverse }}
          className="absolute bottom-0 -left-40 w-[32rem] h-[32rem] rounded-full bg-accent-soft/80 blur-[110px]"
        />
        <svg className="absolute top-[18%] left-[46%] w-16 text-ink/20 animate-float-slow hidden md:block" viewBox="0 0 40 40">
          <path d="M20 0v40M0 20h40" stroke="currentColor" strokeWidth="2" />
        </svg>
        <svg className="absolute bottom-[22%] right-[6%] w-24 text-accent/50 animate-spin-slow" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 8" />
        </svg>
      </div>

      <Container className="flex-1 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full">
          <motion.div style={reduce ? undefined : { y: textY, opacity: fade }} className="lg:col-span-7">
            <motion.p
              {...intro}
              transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
              className="eyebrow text-ink/70 flex items-center gap-3 mb-6"
            >
              <span className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse" />
              Portfolio — Chapter 00 / Introduction
            </motion.p>

            <h1 className="display-xl text-ink uppercase" aria-label={name}>
              <Letters word={first || ''} delay={0.15} ready={ready} />
              {last && <Letters word={last} delay={0.4} ready={ready} className="text-outline text-ink" />}
            </h1>

            {roles.length > 0 && (
              <motion.p
                {...intro}
                transition={{ duration: 0.8, delay: 0.8, ease: EASE }}
                className="mt-6 text-2xl md:text-3xl font-display font-medium tracking-tight text-ink"
              >
                <span className="editorial block text-ink/60">I am a</span>
                <span className="text-accent">
                  <RoleTicker roles={roles} />
                </span>
              </motion.p>
            )}

            {tagline?.childMarkdownRemark?.html && (
              <motion.div
                {...intro}
                transition={{ duration: 0.8, delay: 1, ease: EASE }}
                className="rich-text lead mt-6 max-w-xl text-ink/75"
                dangerouslySetInnerHTML={{ __html: tagline.childMarkdownRemark.html }}
              />
            )}

            <motion.div
              {...intro}
              transition={{ duration: 0.8, delay: 1.15, ease: EASE }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Magnetic>
                <a
                  href="#portfolio"
                  className="group inline-flex items-center gap-3 rounded-full bg-ink !text-paper pl-6 pr-2 py-2 font-medium hover:bg-accent transition-colors duration-300"
                >
                  View selected work
                  <span className="grid place-items-center w-10 h-10 rounded-full bg-paper/10 group-hover:rotate-[-45deg] transition-transform duration-500">
                    <ArrowRightIcon className="w-4 h-4 no-fill fill-paper" />
                  </span>
                </a>
              </Magnetic>
              <a href="#contact" className="text-link font-medium !text-ink">
                Let's talk
              </a>
            </motion.div>
          </motion.div>

          {/* Portrait composition */}
          <motion.div
            style={reduce ? undefined : { y: portraitY }}
            className="lg:col-span-5 relative mx-auto w-full max-w-[22rem] sm:max-w-sm lg:max-w-none"
          >
            <motion.div
              initial={reduce ? false : { clipPath: 'inset(100% 0 0 0 round 2rem)' }}
              animate={play({ clipPath: 'inset(0% 0 0 0 round 2rem)' })}
              transition={{ duration: 1.4, delay: 0.3, ease: EASE }}
              className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-gradient-to-br from-ink to-ink-soft shadow-[0_40px_80px_-30px_rgba(6,42,43,0.55)]"
            >
              {image?.gatsbyImageData ? (
                <GatsbyImage
                  image={image.gatsbyImageData}
                  alt={`Portrait of ${name}`}
                  className="!absolute inset-0 w-full h-full"
                  imgClassName="object-cover"
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center display-xl text-paper/10">{first?.[0]}</div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-paper">
                <span className="eyebrow">{name}</span>
                <span className="eyebrow opacity-70">©{new Date().getFullYear()}</span>
              </div>
            </motion.div>

            <motion.div
              initial={reduce ? false : { scale: 0, rotate: -90 }}
              animate={play({ scale: 1, rotate: 0 })}
              transition={{ duration: 1.2, delay: 1.1, ease: EASE }}
              className="absolute -left-6 -top-8 sm:-left-12 sm:-top-10 w-28 h-28 sm:w-36 sm:h-36"
            >
              <a
                href="#about"
                aria-label="Scroll to the story"
                className="group block w-full h-full rounded-full bg-paper !text-ink shadow-xl hover:bg-ink hover:!text-paper transition-colors duration-500"
              >
                <RotatingBadge text={`${safeName.toUpperCase()} • SCROLL THE STORY • `} className="w-full h-full p-1">
                  <ArrowDownRightIcon className="w-7 h-7 no-fill fill-accent group-hover:rotate-45 transition-transform duration-500" />
                </RotatingBadge>
              </a>
            </motion.div>

            {metric && (
              <motion.div
                initial={reduce ? false : { opacity: 0, x: 40 }}
                animate={play({ opacity: 1, x: 0 })}
                transition={{ duration: 1, delay: 1.35, ease: EASE }}
                className="absolute -right-3 sm:-right-8 top-1/3 glass rounded-2xl px-5 py-4 shadow-lg border border-white/60 animate-float-slow"
              >
                <p className="font-display text-3xl font-semibold text-ink leading-none">{metric.value}</p>
                <p className="text-xs text-ink/70 mt-1 max-w-[9rem]">{metric.label}</p>
              </motion.div>
            )}

            {caseStudyCount > 0 && (
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 30 }}
                animate={play({ opacity: 1, y: 0 })}
                transition={{ duration: 1, delay: 1.5, ease: EASE }}
                className="absolute -bottom-6 right-6 rounded-2xl bg-accent text-white px-5 py-3 shadow-lg"
              >
                <p className="eyebrow !text-[0.65rem] opacity-80">Case studies</p>
                <p className="font-display text-2xl font-semibold leading-tight">{String(caseStudyCount).padStart(2, '0')}</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </Container>

      {/* Ticker + scroll cue */}
      <div className="relative mt-16 border-y border-line py-5 bg-paper/50 backdrop-blur-sm">
        <Marquee duration={45}>
          {(marqueeItems?.length ? marqueeItems : roles).map((item, i) => (
            <span key={`${item}-${i}`} className="flex items-center gap-12 font-display text-xl md:text-2xl font-medium text-ink/80 whitespace-nowrap">
              {item}
              <span className="text-accent">✦</span>
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  )
}

export default HomeHero
