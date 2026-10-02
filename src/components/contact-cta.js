import React from 'react'
import { ArrowUpRightIcon } from '@heroicons/react/24/solid'
import Container from './container'
import Marquee from './motion/marquee'
import Magnetic from './motion/magnetic'
import { Reveal, SplitText } from './motion/reveal'
import useSocialData from '../services/useSocialData'

const ContactCta = ({ id = 'contact', number = '07' }) => {
  const socials = useSocialData() || []
  const email = socials.find((s) => s.type === 'Email')
  const others = socials.filter((s) => s.type !== 'Email')

  return (
    <section id={id} className="relative overflow-hidden bg-ink text-paper pt-24 md:pt-36 grain">
      <div aria-hidden="true" className="absolute inset-0 bg-grid-dark" />
      <div aria-hidden="true" className="absolute -top-40 left-1/2 -translate-x-1/2 w-[50rem] h-[50rem] rounded-full bg-accent/20 blur-[140px]" />

      <Container className="relative">
        <p className="eyebrow text-paper/60 flex items-center gap-4">
          <span className="text-accent">{number}</span>
          <span className="h-px w-16 bg-paper/30" />
          <span>The next chapter</span>
        </p>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-8">
            <SplitText
              as="h2"
              text="Let's write the next chapter together."
              highlight={['next', 'chapter']}
              className="display-lg block text-paper"
            />
            <Reveal delay={0.25}>
              <p className="lead mt-8 max-w-xl text-paper/70">
                Have a product to shape, a team to grow or a problem worth solving? I'd love to hear about it.
              </p>
            </Reveal>
          </div>

          {email && (
            <div className="lg:col-span-4 flex lg:justify-end">
              <Magnetic strength={0.45}>
                <a
                  href={email.url}
                  className="group relative grid place-items-center w-44 h-44 md:w-52 md:h-52 rounded-full bg-accent !text-white font-display text-xl font-semibold overflow-hidden"
                >
                  <span className="absolute inset-0 rounded-full bg-paper scale-0 group-hover:scale-100 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                  <span className="relative flex flex-col items-center gap-2 group-hover:text-ink transition-colors duration-500">
                    <ArrowUpRightIcon className="w-7 h-7 no-fill fill-current group-hover:rotate-45 transition-transform duration-500" />
                    Say hello
                  </span>
                </a>
              </Magnetic>
            </div>
          )}
        </div>

        {others.length > 0 && (
          <ul className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-paper/15 p-0">
            {others.map((s) => (
              <li key={s.url} className="list-none border-b border-paper/15 sm:[&:nth-child(odd)]:border-r lg:border-r lg:last:border-r-0">
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between px-1 sm:px-6 py-6 !text-paper hover:bg-paper/5 transition-colors"
                >
                  <span className="font-display text-lg">{s.type}</span>
                  <ArrowUpRightIcon className="w-5 h-5 no-fill fill-paper/50 group-hover:fill-accent group-hover:rotate-45 transition-all duration-500" />
                </a>
              </li>
            ))}
          </ul>
        )}
      </Container>

      <div className="relative mt-20 pb-6 select-none" aria-hidden="true">
        <Marquee duration={30} gap="2rem">
          {['Let’s talk', 'Get in touch', 'Build together', 'Say hello'].map((w) => (
            <span key={w} className="flex items-center gap-8 display-xl uppercase whitespace-nowrap text-outline text-paper/25">
              {w}
              <span className="text-accent [-webkit-text-stroke:0] text-[0.4em]">✦</span>
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  )
}

export default ContactCta
