import { graphql, useStaticQuery } from "gatsby";

// Copy used when a Site Settings field is empty or the entry doesn't exist yet
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

const useSiteSettings = () => {
  const { contentfulSiteSettings: s } = useStaticQuery(graphql`
    query SiteSettingsQuery {
      contentfulSiteSettings {
        siteTitle
        siteDescription
        socialShareImage { url }
        introLabel
        heroPrimaryCtaLabel
        heroSecondaryCtaLabel
        availability
        cvFile { url }
        valuePillarsLabel
        achievementsLabel
        logoStripLabel
        featuredProjectCount
        aboutImage { gatsbyImageData(layout: FULL_WIDTH, placeholder: BLURRED) description }
        aboutImageCaption
        expertiseImage { gatsbyImageData(layout: FULL_WIDTH, placeholder: BLURRED) }
        contactImage { gatsbyImageData(layout: FULL_WIDTH, placeholder: BLURRED) description }
        footerCopyright
        notFoundTitle
        notFoundButtonLabel
      }
    }
  `);

  // Empty Contentful fields fall back to the defaults above
  const merged = { ...SITE_DEFAULTS };
  Object.entries(s || {}).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') merged[key] = value;
  });
  return merged;
};

export default useSiteSettings;
