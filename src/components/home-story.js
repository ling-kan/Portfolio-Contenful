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
import { Reveal } from './motion/reveal'

/**
 * The home page, told as a sequence of chapters:
 * intro → who I am → impact → craft → journey → learning → selected work → next chapter.
 */
const HomeStory = (props) => {
  const posts = get(props, 'data.allContentfulBlogPost.nodes', [])
  const [author = {}] = get(props, 'data.allContentfulLanding.nodes', [])
  const timeline = get(props, 'data.allContentfulTimeline.nodes', [])
  const education = get(props, 'data.allContentfulEducation.nodes', [])
  const hash = props.location?.hash

  useEffect(() => {
    if (!hash) return undefined
    const id = setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' }), 500)
    return () => clearTimeout(id)
  }, [hash])

  const visiblePosts = posts.filter((p) => !p.hiddenPage)
  const skillNames = (author.skills || []).flatMap((s) => (s.skills || []).map((k) => k.name))
  const achievements = author.keyAchievements?.childMarkdownRemark?.html

  // Number chapters by what is actually present so the sequence never skips.
  let n = 0
  const next = () => String(++n).padStart(2, '0')

  return (
    <Layout location={props.location} fullHeaderHeight={true} author={author}>
      <div id="bio" />
      <HomeHero
        name={author.name}
        animatedList={author.animatedList}
        image={author.image}
        tagline={author.tagline}
        metric={author.keyMetrics?.[0]}
        caseStudyCount={visiblePosts.length}
        marqueeItems={skillNames.length ? skillNames : author.animatedList}
      />

      {author.bio?.childMarkdownRemark?.html && (
        <Chapter
          id="about"
          number={next()}
          eyebrow="Who I am"
          title="A story of turning complexity into clarity."
          highlight={['clarity.']}
        >
          <StoryAbout html={author.bio.childMarkdownRemark.html} />
        </Chapter>
      )}

      {author.keyMetrics?.length > 0 && (
        <Chapter
          id="impact"
          tone="dark"
          number={next()}
          eyebrow="Impact"
          title="Numbers that tell the story."
          highlight={['story.']}
          intro="Outcomes over output — a snapshot of the difference the work has made."
          className="overflow-hidden"
          backdrop={
            <>
              <div aria-hidden="true" className="absolute inset-0 bg-grid-dark pointer-events-none" />
              <div aria-hidden="true" className="absolute -top-40 -right-40 w-[36rem] h-[36rem] rounded-full bg-mint/10 blur-[120px] pointer-events-none" />
            </>
          }
        >
          <KeyMetrics list={author.keyMetrics} />
          {achievements && (
            <Reveal className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-8">
              <p className="lg:col-span-3 eyebrow text-paper/50">Key achievements</p>
              <div
                className="lg:col-span-9 rich-text lead text-paper/80 [&_strong]:!text-paper [&_li]:mb-3"
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
          eyebrow="Craft"
          title="The toolkit behind the work."
          highlight={['toolkit']}
          intro="Explore the disciplines — select a category, then hover or tap a skill to learn how it’s used."
        >
          <SkillsPanel list={author.skills} />
        </Chapter>
      )}

      <div id="resume" />
      {timeline.length > 0 && (
        <Chapter
          id="experience"
          tone="sand"
          number={next()}
          eyebrow="The journey"
          title="Every role, a new chapter."
          highlight={['chapter.']}
          intro="From first steps to current role — the places, teams and problems that shaped my perspective."
        >
          <Resume timeline={timeline} idPrefix="experience" />
        </Chapter>
      )}

      {education.length > 0 && (
        <Chapter id="education" tone="sand" number={next()} eyebrow="Learning" title="Foundations." highlight={['Foundations.']} className="!pt-0">
          <Resume timeline={education} idPrefix="education" />
        </Chapter>
      )}

      {visiblePosts.length > 0 && (
        <Chapter
          id="portfolio"
          number={next()}
          eyebrow="Selected work"
          title="Proof in the work."
          highlight={['work.']}
          intro="Case studies that show how ideas became products — the challenge, the approach and the outcome."
        >
          <ArticlePreview posts={posts} />
        </Chapter>
      )}

      <ContactCta number={next()} />
    </Layout>
  )
}

export default HomeStory
