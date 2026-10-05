import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { useStaticQuery, graphql } from 'gatsby';
import { hasImage } from './image-slot';
import imagery from '../data/imagery';
import useSiteSettings from '../services/useSiteSettings';

const Seo = ({ title, description = '', lang = 'en', meta = [], image = '' }) => {

  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            siteUrl
            social {
              twitter
            }
          }
        }
      }
    `
  );

  const settings = useSiteSettings();
  // Landing entry settings first, then gatsby-config siteMetadata
  const metaDescription = description || settings.siteDescription || site.siteMetadata.description;
  const defaultTitle = settings.siteTitle || site.siteMetadata?.title;
  // Share image: page-specific, then Contentful, then static/images/og-image.jpg
  const shareImage = image || settings.socialShareImage?.url || (hasImage('social') ? `${site.siteMetadata.siteUrl}/images/${imagery.social.file}` : '');

  return (
    <Helmet
      htmlAttributes={{ lang }}
      title={title}
      defaultTitle={defaultTitle}
      titleTemplate={defaultTitle ? `%s | ${defaultTitle}` : null}
      meta={[
        { name: 'description', content: metaDescription },
        { name: 'image', content: shareImage },
        { property: 'og:title', content: title },
        { property: 'og:description', content: metaDescription },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: shareImage },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:creator', content: '' },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: metaDescription },
      ].concat(meta)}
    />
  );
};

export default Seo;
