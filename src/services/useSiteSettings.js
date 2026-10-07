import { graphql, useStaticQuery } from "gatsby";


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

  return contentfulLanding || {};
};

export default useSiteSettings;
