import React, { useEffect } from 'react'
import get from 'lodash/get'
import Layout from './layout'
import HomeHero from './home-hero'
import Chapter from './chapter'
import StoryAbout from './story-about'
import KeyMetrics from './key-metrics'
import SkillsPanel from './skills-panel'
import Resume from './resume'
import ArticlePreview from './article-preview'
import ContactCta from './contact-cta'
import ImageReel from './image-reel'
import LogoStrip from './logo-strip'
import ValuePillars from './value-pillars'
import Testimonials from './testimonials'
import { Reveal } from './motion/reveal'
import useSiteSettings from '../services/useSiteSettings'

// Used for any section without a "Section Header" entry in Contentful (matched by key)
const SECTION_DEFAULTS = {
  about: { eyebrow: 'About', title: 'Where user experience meets measurable growth.', highlightWords: ['growth.'] },
  impact: {
    eyebrow: 'Impact',
    title: 'Proven results, not just pretty pixels.',
    highlightWords: ['results,'],
    intro: 'Every project is measured by what it changes, for users and for the business.',
  },
  expertise: {
    eyebrow: 'Expertise',
    title: 'A rare blend of design, data and code.',
    highlightWords: ['code.'],
    intro: 'Strategy, optimisation and hands-on build skills in one person. Choose a discipline, then a skill, to see how it’s applied.',
  },
  experience: {
    eyebrow: 'Experience',
    title: 'A track record of delivering at scale.',
    highlightWords: ['scale.'],
    intro: 'From consultancy and research to leading UX and front-end development today: the teams and products I’ve helped grow.',
  },
  education: { eyebrow: 'Education', title: 'Built on a technical foundation.', highlightWords: ['foundation.'] },
  work: {
    eyebrow: 'Selected work',
    title: 'Real projects, measurable outcomes.',
    highlightWords: ['outcomes.'],
    intro: 'A selection of case studies: the challenge, the approach and the result it delivered.',
  },
  testimonials: { eyebrow: 'Testimonials', title: 'What colleagues say.', highlightWords: ['say.'] },
  contact: {
    eyebrow: 'Contact',
    title: 'Let’s build an experience that performs.',
    highlightWords: ['performs.'],
    intro: 'Need someone who can shape the experience, prove it with data and build it too? Let’s talk about what you’re working on.',
    buttonLabel: 'Say hello',
  },
}

/**
 * The home page, structured as a positioning pitch:
 * intro → about + what I bring → impact → expertise → experience → education → selected work → testimonials → contact.
 * All copy comes from Contentful; see docs/CONTENT-MODEL.md.
 */
const HomeStory = (props) => {
  const posts = get(props, 'data.allContentfulBlogPost.nodes', [])
  const [author = {}] = get(props, 'data.allContentfulLanding.nodes', [])
  const timeline = get(props, 'data.allContentfulTimeline.nodes', [])
  const education = get(props, 'data.allContentfulEducation.nodes', [])
  const headers = get(props, 'data.allContentfulSectionHeader.nodes', [])
  const pillars = get(props, 'data.allContentfulValuePillar.nodes', [])
  const testimonials = get(props, 'data.allContentfulTestimonial.nodes', [])
  const settings = useSiteSettings()
  const hash = props.location?.hash

  useEffect(() => {
    if (!hash) return undefined
    const id = setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }), 500)
    return () => clearTimeout(id)
  }, [hash])

  // Contentful entry for a section, with empty fields filled from the defaults
  const section = (key) => {
    const entry = headers.find((h) => h.key === key) || {}
    const base = SECTION_DEFAULTS[key]
    return {
      eyebrow: entry.eyebrow || base.eyebrow,
      title: entry.title || base.title,
      highlight: entry.highlightWords?.length ? entry.highlightWords : base.highlightWords,
      intro: entry.intro || base.intro,
      buttonLabel: entry.buttonLabel || base.buttonLabel,
    }
  }

  const visiblePosts = posts.filter((p) => !p.hiddenPage)
  const skillNames = (author.skills || []).flatMap((s) => (s.skills || []).map((k) => k.name))
  const achievements = author.keyAchievements?.childMarkdownRemark?.html

  // Number sections by what is actually present so the sequence never skips.
  let n = 0
  const next = () => String(++n).padStart(2, '0')

  const about = section('about')
  const impact = section('impact')
  const expertise = section('expertise')
  const experience = section('experience')
  const learning = section('education')
  const work = section('work')
  const quotes = section('testimonials')
  const contact = section('contact')

  return (
    <Layout location={props.location} fullHeaderHeight={true} author={author}>
      <div id="bio" />
      <HomeHero
        name={author.name}
        animatedList={author.animatedList}
        image={author.image}
        tagline={author.tagline}
        marqueeItems={skillNames.length ? skillNames : author.animatedList}
        primaryCta={settings.heroPrimaryCtaLabel}
        secondaryCta={settings.heroSecondaryCtaLabel}
        availability={settings.availability}
        cvUrl={settings.cvFile?.url}
      />

      {author.bio?.childMarkdownRemark?.html && (
        <Chapter id="about" number={next()} eyebrow={about.eyebrow} title={about.title} highlight={about.highlight} intro={about.intro}>
          <StoryAbout
            html={author.bio.childMarkdownRemark.html}
            image={settings.aboutImage?.gatsbyImageData}
            imageAlt={settings.aboutImage?.description}
            caption={settings.aboutImageCaption}
          />
          <ValuePillars items={pillars} label={settings.valuePillarsLabel} />
        </Chapter>
      )}

      <ImageReel posts={visiblePosts} />

      {author.keyMetrics?.length > 0 && (
        <Chapter
          id="impact"
          tone="dark"
          number={next()}
          eyebrow={impact.eyebrow}
          title={impact.title}
          highlight={impact.highlight}
          intro={impact.intro}
          className="overflow-hidden"
          backdrop={
            <div aria-hidden="true" className="absolute -top-40 -right-40 w-[36rem] h-[36rem] rounded-full bg-mint/10 blur-[120px] pointer-events-none" />
          }
        >
          <KeyMetrics list={author.keyMetrics} />
          {achievements && (
            <Reveal className="mt-16 max-w-4xl">
              <p className="eyebrow text-paper/65 mb-6">{settings.achievementsLabel}</p>
              <div
                className="rich-text lead text-paper/80 [&_strong]:!text-paper [&_li]:mb-3"
                dangerouslySetInnerHTML={{ __html: achievements }}
              />
            </Reveal>
          )}
        </Chapter>
      )}

      {author.skills?.length > 0 && (
        <Chapter
          id="skills"
          number={next()}
          eyebrow={expertise.eyebrow}
          title={expertise.title}
          highlight={expertise.highlight}
          intro={expertise.intro}
        >
          <SkillsPanel list={author.skills} image={settings.expertiseImage?.gatsbyImageData} />
        </Chapter>
      )}

      <div id="resume" />
      {timeline.length > 0 && (
        <Chapter
          id="experience"
          tone="sand"
          number={next()}
          eyebrow={experience.eyebrow}
          title={experience.title}
          highlight={experience.highlight}
          intro={experience.intro}
        >
          <LogoStrip items={timeline} label={settings.logoStripLabel} />
          <Resume timeline={timeline} idPrefix="experience" />
        </Chapter>
      )}

      {education.length > 0 && (
        <Chapter
          id="education"
          tone="sand"
          number={next()}
          eyebrow={learning.eyebrow}
          title={learning.title}
          highlight={learning.highlight}
          intro={learning.intro}
          className="!pt-0"
        >
          <Resume timeline={education} idPrefix="education" />
        </Chapter>
      )}

      {visiblePosts.length > 0 && (
        <Chapter id="portfolio" number={next()} eyebrow={work.eyebrow} title={work.title} highlight={work.highlight} intro={work.intro}>
          <ArticlePreview posts={posts} limit={settings.featuredProjectCount} />
        </Chapter>
      )}

      {testimonials.length > 0 && (
        <Chapter
          id="testimonials"
          tone="sand"
          number={next()}
          eyebrow={quotes.eyebrow}
          title={quotes.title}
          highlight={quotes.highlight}
          intro={quotes.intro}
        >
          <Testimonials items={testimonials} />
        </Chapter>
      )}

      <ContactCta
        number={next()}
        eyebrow={contact.eyebrow}
        title={contact.title}
        highlight={contact.highlight}
        intro={contact.intro}
        buttonLabel={contact.buttonLabel}
        image={settings.contactImage?.gatsbyImageData}
        imageAlt={settings.contactImage?.description}
        availability={settings.availability}
      />
    </Layout>
  )
}

export default HomeStory
