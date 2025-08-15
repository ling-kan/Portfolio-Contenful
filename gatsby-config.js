require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

function checkEnv(envName) {
  if (!process.env[envName]) {
    throw new Error(`Missing required environment variable: ${envName}`);
  }
}

try {
  checkEnv('GATSBY_CONTENTFUL_SPACE_ID');
  checkEnv('GATSBY_CONTENTFUL_ACCESS_TOKEN');
  checkEnv('GATSBY_PORTFOLIO_ACCESS_PASS');
  checkEnv('GATSBY_GOOGLE_ANALYTICS_TRACKING_ID');
} catch (e) {
  throw new Error(e);
}

const contentfulConfig = {
  spaceId: process.env.GATSBY_CONTENTFUL_SPACE_ID,
  accessToken: process.env.GATSBY_CONTENTFUL_ACCESS_TOKEN,
};

if (process.env.CONTENTFUL_HOST) {
  contentfulConfig.host = process.env.CONTENTFUL_HOST;
  contentfulConfig.accessToken = process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN;
}

const { spaceId, accessToken } = contentfulConfig;

if (!spaceId || !accessToken) {
  throw new Error("Contentful spaceId and the access token need to be provided.");
}

module.exports = {
  siteMetadata: {
    title: "Ling Kan",
    description: "Ling Kan Portfolio",
    siteUrl: `https://lingkan.netlify.app`,
    author: `@yourhandle`,
    social: {
      twitter: `your_twitter_handle`,
      github: `your_github_handle`,
    },
  },
  pathPrefix: "/gatsby-contentful-starter",
  plugins: [
    'gatsby-plugin-postcss',
    "gatsby-transformer-remark",
    "gatsby-transformer-sharp",
    "gatsby-plugin-react-helmet-async",
    'gatsby-plugin-styled-components',
    "gatsby-plugin-sharp",
    "gatsby-plugin-image",
    "gatsby-plugin-nprogress",
    "gatsby-plugin-sitemap",
    'gatsby-plugin-sass',
    {
      resolve: "gatsby-source-contentful",
      options: contentfulConfig,
    },
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: { include: /assets/ }
      }
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Ling Kan Portfolio`,
        short_name: `Ling`,
        description: `Portfolio showcasing Ling Kan's work.`,
        start_url: `/`,
        icon: `src/assets/favicon/favicon.png`,
        icons: [
          { "src": "src/assets/favicon/favicon-16x16.png", "sizes": "16x16", "type": "image/png" },
          { "src": "src/assets/favicon/favicon-32x32.png", "sizes": "32x32", "type": "image/png" }
        ],
        background_color: `#f3f3f3`,
        theme_color: `#949494`,
        display: `standalone`,
      },
    },
    {
      resolve: 'gatsby-plugin-google-gtag',
      options: {
        trackingIds: [process.env.GATSBY_GOOGLE_ANALYTICS_TRACKING_ID],
        gtagConfig: { anonymize_ip: true, cookie_expires: 365 },
        pluginConfig: { head: true },
      }
    },

  ],
  flags: {
    DEV_SSR: true,
    FAST_DEV: true,
    PRESERVE_WEBPACK_CACHE: true,
    PRESERVE_FILE_DOWNLOAD_CACHE: true,
  },
};
