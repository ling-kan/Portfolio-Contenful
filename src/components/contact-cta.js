import React from 'react'
import { ArrowUpRightIcon } from '@heroicons/react/24/solid'
import Container from './container'
import Magnetic from './motion/magnetic'
import { Reveal, SplitText } from './motion/reveal'
import useSocialData from '../services/useSocialData'
import ImageSlot, { slotVisible } from './image-slot'

const ContactCta = ({
  id = 'contact',
  number = '07',
  eyebrow = 'Contact',
  title = 'Let’s build an experience that performs.',
  highlight = ['performs.'],
  intro = 'Need someone who can shape the experience, prove it with data and build it too? Let’s talk about what you’re working on.',
  buttonLabel = 'Say hello',
  image,
  imageAlt,
  availability,
}) => {
  const socials = useSocialData() || []
  const email = socials.find((s) => s.type === 'Email')
  const others = socials.filter((s) => s.type !== 'Email')
  const withImage = slotVisible('contact', image)

  return (
    <section id={id} className="relative overflow-hidden bg-ink text-paper py-24 md:py-36">
      <div aria-hidden="true" className="absolute -top-40 left-1/2 -translate-x-1/2 w-[56rem] h-[40rem] rounded-full bg-mint/10 blur-[160px]" />

      <Container className="relative">
        <p className="eyebrow text-paper/60 flex items-center gap-4">
          <span className="text-accent">{number}</span>
          <span className="h-px w-16 bg-paper/30" />
          <span>{eyebrow}</span>
        </p>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-end">
          <div className="lg:col-span-8">
            <SplitText
              as="h2"
              text={title}
              highlight={highlight}
              className="display-lg block text-paper"
            />
            <Reveal delay={0.25}>
              <p className="lead mt-8 max-w-xl text-paper/70">
                {intro}
              </p>
            </Reveal>
            {availability && (
              <p className="mt-6 inline-flex items-center gap-2 text-sm text-paper/80">
                <span aria-hidden="true" className="w-2 h-2 rounded-full bg-accent" />
                {availability}
              </p>
            )}
          </div>

          {(email || withImage) && (
            <div className={`lg:col-span-4 flex lg:justify-end ${withImage ? 'pl-6 sm:pl-10 lg:pl-0' : ''}`}>
              <div className={withImage ? 'relative w-full max-w-xs' : ''}>
                {withImage && (
                  <Reveal className="aspect-[4/5] rounded-[1.5rem] overflow-hidden bg-paper/5">
                    <ImageSlot slot="contact" image={image} alt={imageAlt} dark />
                  </Reveal>
                )}
                {email && (
                  <div className={withImage ? 'absolute -left-6 sm:-left-10 -bottom-6' : ''}>
                    <Magnetic strength={0.45}>
                      <a
                        href={email.url}
                        className={`group relative grid place-items-center rounded-full bg-paper !text-ink font-sans font-medium overflow-hidden ${
                          withImage ? 'w-28 h-28 md:w-32 md:h-32 text-base shadow-[0_20px_40px_-20px_rgba(0,0,0,0.6)]' : 'w-40 h-40 md:w-44 md:h-44 text-lg'
                        }`}
                      >
                        <span className="absolute inset-0 rounded-full bg-accent scale-0 group-hover:scale-100 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                        <span className="relative flex flex-col items-center gap-2 group-hover:text-white transition-colors duration-500">
                          <ArrowUpRightIcon className="w-6 h-6 no-fill fill-current group-hover:rotate-45 transition-transform duration-500" />
                          {buttonLabel}
                        </span>
                      </a>
                    </Magnetic>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {others.length > 0 && (
          <ul className="mt-16 pt-10 border-t border-paper/10 flex flex-wrap gap-3 p-0">
            {others.map((s) => (
              <li key={s.url} className="list-none">
                <a
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-3 rounded-full border border-paper/15 pl-5 pr-4 py-2.5 !text-paper/85 hover:!text-paper hover:border-paper/40 hover:bg-paper/5 transition-colors duration-300"
                >
                  <span className="text-sm font-medium">{s.type}</span>
                  <ArrowUpRightIcon className="w-3.5 h-3.5 no-fill fill-paper/50 group-hover:fill-accent group-hover:rotate-45 transition-all duration-500" />
                </a>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </section>
  )
}

export default ContactCta
