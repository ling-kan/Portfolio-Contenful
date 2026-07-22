import React, { useEffect } from 'react'
import { graphql } from "gatsby";
import get from "lodash/get";
import Layout from "../components/layout";
import ArticlePreview from "../components/article-preview";
import HomeHero from "../components/home-hero";
import Resume from '../components/resume';
import Socials from '../components/socials';
import KeyMetrics from '../components/key-metrics';
import SkillsPanel from '../components/skills-panel';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import useSocialData from '../services/useSocialData';

const RootIndex = (props) => {
  const posts = get(props, "data.allContentfulBlogPost.nodes");
  const [author] = get(props, "data.allContentfulLanding.nodes");
  const timeline = get(props, "data.allContentfulTimeline.nodes");
  const education = get(props, "data.allContentfulEducation.nodes");
  const socials = useSocialData();

  useEffect(() => {
    const scroll = () => {
      if (props.location.hash) {
        const element = document.querySelector(props.location.hash);
        if (element) {
          const offset = element.offsetTop - 75;
          window.scrollTo({ top: offset, behavior: "smooth" });
        }
      }
    };

    setTimeout(scroll, 500);
  }, [props.location.hash]);

  const emailSocial = socials?.find(({ type }) => type === 'Email');

  return (
    <Layout location={props.location} fullHeaderHeight={true}>
      <div className="min-h-screen bg-background">
        <div id="bio" />
        <HomeHero
          animatedList={author?.animatedList}
          image={author?.image}
          title={author?.title}
          name={author?.name}
          tagline={author?.tagline}
        />

        {author?.bio?.childMarkdownRemark.html && (
          <section id="about" className="px-6 pt-28 sm:px-12 sm:pt-36">
            <div className="mx-auto max-w-6xl">
              <div
                className="mx-auto max-w-3xl text-balance text-center font-serif text-2xl leading-snug text-foreground sm:text-3xl lg:text-4xl"
                dangerouslySetInnerHTML={{
                  __html: author.bio.childMarkdownRemark.html,
                }}
              />
              {author.keyMetrics && <KeyMetrics list={author.keyMetrics} />}
            </div>
          </section>
        )}

        {!author?.bio?.childMarkdownRemark.html && author?.keyMetrics && (
          <section id="about" className="px-6 pt-28 sm:px-12 sm:pt-36">
            <div className="mx-auto max-w-6xl">
              <KeyMetrics list={author.keyMetrics} />
            </div>
          </section>
        )}

        {author.skills && <SkillsPanel list={author.skills} />}

        <section
          id="resume"
          className="bg-card px-6 pt-28 pb-28 sm:px-12 sm:pt-36 sm:pb-36"
        >
          <div className="mx-auto max-w-6xl">
            <div className="flex items-baseline justify-between border-t border-foreground/20 pt-4">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
                — Resume
              </span>
              <span className="font-serif text-sm italic text-muted-foreground">
                Experience &amp; Education
              </span>
            </div>

            <h2 className="mt-10 font-serif text-5xl font-semibold italic tracking-tight text-foreground sm:text-6xl">
              Curriculum
            </h2>

            <div className="mt-16 grid gap-x-16 gap-y-20 lg:grid-cols-2">
              <div>
                <div id="experience">
                  <h3 className="mb-8 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
                    <span className="h-px w-8 bg-accent" />
                    Work Experience
                  </h3>
                  <Resume timeline={timeline} idPrefix="exp" />
                </div>

                <div id="education">
                  <h3 className="mb-8 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
                    <span className="h-px w-8 bg-accent" />
                    Education
                  </h3>
                  <Resume timeline={education} idPrefix="edu" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <ArticlePreview posts={posts} />

        <section id="contact" className="px-6 pt-28 pb-28 sm:px-12 sm:pt-36 sm:pb-36">
          <div className="mx-auto max-w-6xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
              — Let&apos;s Talk
            </span>
            <h2 className="mx-auto mt-8 max-w-4xl text-balance font-serif text-5xl font-semibold leading-[0.95] tracking-tight text-foreground sm:text-7xl lg:text-8xl">
              Want to work <span className="italic text-accent">together?</span>
              <br />
              Let&apos;s connect.
            </h2>

            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              {emailSocial?.url && (
                <a
                  href={emailSocial.url}
                  className="inline-flex items-center gap-3 rounded-full bg-primary px-7 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-primary-foreground transition-opacity hover:opacity-90"
                >
                  {emailSocial.url.replace('mailto:', '')}
                  <ArrowRightIcon className="h-4 w-4" />
                </a>
              )}
              <Socials width="w-5" className="justify-center gap-4" />
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

export default RootIndex;

export const pageQuery = graphql`
  query HomeQuery {
    allContentfulSocials {
      nodes {
        url
        type
      }
    }
    allContentfulNavigation(sort: { fields: [order], order: ASC }) {
      nodes {
        title
        url
        order
      }
    }
    allContentfulBlogPost(sort: { fields: [endDate], order: DESC }) {
      nodes {
        title
        slug
        endDate(formatString: "MMMM YYYY")
        tags
        hiddenPage
        heroImage {
          gatsbyImageData(
            layout: FULL_WIDTH
            placeholder: BLURRED
          )
        }
        description {
          childMarkdownRemark {
            html
          }
        }
      }
    }
    allContentfulTimeline(sort: { fields: [endDate], order: DESC }) {
      nodes {
        jobTitle
        startDate(formatString: "MMMM YYYY")
        endDate(formatString: "MMMM YYYY")
        currentRole
        company
        description {
        childMarkdownRemark {
          html
        }
        }
        bio {
        childMarkdownRemark {
          html
        }
        }
        icon {
          gatsbyImageData(
            layout: FULL_WIDTH
            placeholder: BLURRED
            width: 40
            height: 20
          )
        }
      }
    }
     allContentfulEducation(sort: { fields: [endDate], order: DESC }) {
      nodes {
        jobTitle
        startDate(formatString: "MMMM YYYY")
        endDate(formatString: "MMMM YYYY")
        company
        bio {
        childMarkdownRemark {
          html
        }
        }
        icon {
          gatsbyImageData(
            layout: FULL_WIDTH
            placeholder: BLURRED
            width: 40
            height: 20
          )
        }
      }
    }
    allContentfulLanding(
      filter: { contentful_id: { eq: "5gcA2XyhjtzTDF0oz2Mz2" } }
    ) {
      nodes {
        name
        animatedList
        keyMetrics {
          label
          value
        }
        skills {
          category
          skills {
            name
            description
          }
        }
        tagline {
        childMarkdownRemark {
          html
        } 
        }
        bio {
        childMarkdownRemark {
          html
        } 
        }
        keyAchievements {
          childMarkdownRemark {
            html
          }
        }
        

        image{ 
          gatsbyImageData(
            layout: FULL_WIDTH
            placeholder: BLURRED
          )
        }
      }
    }
  }
`;
