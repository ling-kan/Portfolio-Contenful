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
  const display = className.includes('inline') ? '' : 'block'
  if (reduce) return <span className={`${display} ${className}`}>{word}</span>
  return (
    <span className={`${display} overflow-hidden pb-[0.08em] ${className}`} aria-hidden="true">
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

const HomeHero = ({
  name = '',
  animatedList = [],
  image,
  tagline,
  marqueeItems = [],
  primaryCta = 'View selected work',
  secondaryCta = 'Get in touch',
  availability,
  cvUrl,
}) => {
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
      className="relative isolate overflow-hidden min-h-[100svh] flex flex-col pt-28 md:pt-32"
    >
      {/* Soft colour washes that drift with the cursor */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <motion.div
          style={{ x: orbX, y: orbY }}
          className="absolute -top-40 -right-32 w-[44rem] h-[44rem] rounded-full bg-mint/35 blur-[140px]"
        />
        <motion.div
          style={{ x: orbXInverse, y: orbYInverse }}
          className="absolute -bottom-40 -left-40 w-[36rem] h-[36rem] rounded-full bg-accent-soft/40 blur-[140px]"
        />
      </div>

      <Container className="flex-1 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-10 items-center w-full">
          <motion.div style={reduce ? undefined : { y: textY, opacity: fade }} className="lg:col-span-7">
            <h1 className="display-xl text-ink uppercase whitespace-nowrap !tracking-[-0.035em] !text-[clamp(3.25rem,9vw,8.5rem)]" aria-label={name}>
              <Letters word={first || ''} delay={0.15} ready={ready} className="inline-block align-top" />
              {last && (
                <>
                  {' '}
                  <Letters
                    word={last}
                    delay={0.35}
                    ready={ready}
                    className="inline-block align-top"
                  />
                </>
              )}
            </h1>

            {roles.length > 0 && (
              <motion.div
                {...intro}
                transition={{ duration: 0.8, delay: 0.75, ease: EASE }}
                className="mt-8 flex items-center gap-4 text-xl md:text-2xl font-sans font-medium tracking-tight text-ink"
              >
                <span aria-hidden="true" className="h-px w-10 bg-accent/60 shrink-0" />
                <span className="min-w-0 flex-1">
                  <RoleTicker roles={roles} />
                </span>
              </motion.div>
            )}

            {tagline?.childMarkdownRemark?.html && (
              <motion.div
                {...intro}
                transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
                className="rich-text lead mt-5 max-w-lg text-ink/75"
                dangerouslySetInnerHTML={{ __html: tagline.childMarkdownRemark.html }}
              />
            )}

            <motion.div
              {...intro}
              transition={{ duration: 0.8, delay: 1.05, ease: EASE }}
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              <Magnetic>
                <a
                  href="#portfolio"
                  className="group inline-flex items-center gap-3 rounded-full bg-ink !text-paper pl-6 pr-1.5 py-1.5 text-sm font-medium hover:bg-ink-soft transition-colors duration-300"
                >
                  {primaryCta}
                  <span className="grid place-items-center w-9 h-9 rounded-full bg-paper/10 group-hover:bg-accent transition-colors duration-500">
                    <ArrowRightIcon className="w-4 h-4 no-fill fill-paper group-hover:-rotate-45 transition-transform duration-500" />
                  </span>
                </a>
              </Magnetic>
              <a
                href="#contact"
                className="inline-flex items-center rounded-full border border-ink/15 px-6 py-3 text-sm font-medium !text-ink hover:border-ink/40 hover:bg-white/60 transition-colors duration-300"
              >
                {secondaryCta}
              </a>
              {cvUrl && (
                <a
                  href={cvUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center px-2 py-3 text-sm font-medium text-link !text-ink"
                >
                  Download CV
                </a>
              )}
            </motion.div>

            {availability && (
              <motion.p
                {...intro}
                transition={{ duration: 0.8, delay: 1.2, ease: EASE }}
                className="mt-6 inline-flex items-center gap-2 text-sm text-ink/75"
              >
                <span aria-hidden="true" className="w-2 h-2 rounded-full bg-accent" />
                {availability}
              </motion.p>
            )}
          </motion.div>

          {/* Portrait */}
          <motion.div
            style={reduce ? undefined : { y: portraitY }}
            className="lg:col-span-5 relative mx-auto w-full max-w-[22rem] sm:max-w-sm lg:max-w-[28rem] lg:ml-auto lg:mr-0"
          >

            <motion.div
              initial={reduce ? false : { clipPath: 'inset(100% 0 0 0 round 1.5rem)' }}
              animate={play({ clipPath: 'inset(0% 0 0 0 round 1.5rem)' })}
              transition={{ duration: 1.4, delay: 0.3, ease: EASE }}
              className="relative aspect-[4/5] rounded-[1.5rem] overflow-hidden bg-gradient-to-br from-ink to-ink-soft shadow-[0_30px_70px_-35px_rgba(23,51,43,0.45)]"
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
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent" />
              <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between text-paper text-[0.75rem] font-medium">
                <span className="uppercase tracking-wider">{name}</span>
                <span>©{new Date().getFullYear()}</span>
              </div>
            </motion.div>

            <motion.div
              initial={reduce ? false : { scale: 0.85, opacity: 0 }}
              animate={play({ scale: 1, opacity: 1 })}
              transition={{ duration: 1.2, delay: 1.1, ease: EASE }}
              className="absolute -left-5 bottom-10 sm:-left-10 w-24 h-24 sm:w-28 sm:h-28"
            >
              <a
                href="#about"
                aria-label="Scroll to About"
                className="group block w-full h-full rounded-full bg-ink !text-paper/80 shadow-[0_20px_40px_-20px_rgba(23,51,43,0.6)] hover:!text-paper transition-colors duration-500"
              >
                <RotatingBadge text={`EXPLORE • ${safeName.toUpperCase()} • `} className="w-full h-full p-1">
                  <ArrowDownRightIcon className="w-5 h-5 no-fill fill-accent group-hover:rotate-45 transition-transform duration-500" />
                </RotatingBadge>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </Container>

      {/* Discipline ticker */}
      <div className="relative mt-20 py-6">
        <Marquee duration={50} gap="2.5rem">
          {(marqueeItems?.length ? marqueeItems : roles).map((item, i) => (
            <span key={`${item}-${i}`} className="flex items-center gap-10 font-sans text-base md:text-lg font-medium text-ink/70 whitespace-nowrap">
              {item}
              <span aria-hidden="true" className="w-1 h-1 rounded-full bg-ink/25" />
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  )
}

export default HomeHero
