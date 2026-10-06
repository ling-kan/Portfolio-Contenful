import { graphql, useStaticQuery } from "gatsby";

const useSiteSettings = () => {
  const { contentfulSiteSettings: s } = useStaticQuery(graphql`
    query SiteSettingsQuery {
      contentfulSiteSettings {
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
        tagline
        bio
        keyAchievements
        image {
          gatsbyImageData(layout: FULL_WIDTH, placeholder: BLURRED)
        }
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
  const merged = {   };
  Object.entries(s || {}).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') merged[key] = value;
  });
  return merged;
};

export default useSiteSettings;
