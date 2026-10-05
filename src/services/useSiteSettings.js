import { graphql, useStaticQuery } from "gatsby";

// Copy used when a Landing settings field is empty
export const SITE_DEFAULTS = {
  siteTitle: 'LING KAN',
  siteDescription: 'LING KAN — London-based digital experience leader combining UX, conversion optimisation and front-end development to drive measurable growth.',
  introLabel: 'Digital experience & growth',
  heroPrimaryCtaLabel: 'View selected work',
  heroSecondaryCtaLabel: 'Get in touch',
  valuePillarsLabel: 'What I bring',
  achievementsLabel: 'Key achievements',
  logoStripLabel: 'Organisations I’ve worked with',
  featuredProjectCount: 6,
  aboutImageCaption: 'Seeing the bigger picture',
  footerCopyright: 'LING KAN Portfolio. All rights reserved.',
  notFoundTitle: 'Sorry, this page can’t be found.',
  notFoundButtonLabel: 'Back to home',
};

/** Landing fields with empty values filled from SITE_DEFAULTS. */
export const withDefaults = (landing) => {
  const merged = { ...SITE_DEFAULTS };
  Object.entries(landing || {}).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') merged[key] = value;
  });
  return merged;
};

/**
 * Site-wide settings for components outside page queries (layout, SEO, footer, 404).
 * They live on the same Landing entry the home page reads via allContentfulLanding.
 */
const useSiteSettings = () => {
  const { contentfulLanding } = useStaticQuery(graphql`
    query SiteSettingsQuery {
      contentfulLanding(contentful_id: { eq: "5gcA2XyhjtzTDF0oz2Mz2" }) {
        siteTitle
        siteDescription
        socialShareImage { url }
        introLabel
        footerCopyright
        notFoundTitle
        notFoundButtonLabel
      }
    }
  `);
  return withDefaults(contentfulLanding);
};

export default useSiteSettings;
