import React from 'react'
import { Stagger, StaggerItem } from './motion/reveal'

const ValuePillars = ({ items, label }) => {
  if (!items?.length) return null

  return (
    <div className="mt-20 md:mt-28">
      {label && <p className="eyebrow text-ink/75 mb-8">{label}</p>}
      <Stagger
        as="ul"
        className={`grid grid-cols-1 ${items.length % 2 === 0 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-px bg-line rounded-[1.5rem] overflow-hidden border border-line p-0 m-0`}
      >
        {items.map((p, i) => (
          <StaggerItem as="li" key={p.title} className="list-none bg-paper p-8 md:p-10">
            <span className="eyebrow text-accent">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="mt-6 display-md !text-[clamp(1.4rem,2vw,1.75rem)] text-ink">{p.title}</h3>
            {p.description && <p className="mt-3 text-ink/75 leading-relaxed">{p.description}</p>}
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  )
}

export default ValuePillars
