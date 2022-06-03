require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

function checkEnv(envName) {
  if (typeof process.env[envName] === 'undefined' || process.env[envName] === '') {
    throw `Missing required environment variables: ${envName}`
  }
}

try {
  checkEnv('GATSBY_CONTENTFUL_SPACE_ID')
  checkEnv('GATSBY_CONTENTFUL_ACCESS_TOKEN')
  checkEnv('GATSBY_PORTFOLIO_ACCESS_PASS')
} catch (e) {
  throw new Error(e)
}


const contentfulConfig = {
  spaceId: process.env.GATSBY_CONTENTFUL_SPACE_ID,
  accessToken: process.env.GATSBY_CONTENTFUL_ACCESS_TOKEN ||
    process.env.GATSBY_CONTENTFUL_DELIVERY_TOKEN,
};

// If you want to use the preview API please define
// CONTENTFUL_HOST and CONTENTFUL_PREVIEW_ACCESS_TOKEN in your
// environment config.
//
// CONTENTFUL_HOST should map to `preview.contentful.com`
// CONTENTFUL_PREVIEW_ACCESS_TOKEN should map to your
// Content Preview API token
//
// For more information around the Preview API check out the documentation at
// https://www.contentful.com/developers/docs/references/content-preview-api/#/reference/spaces/space/get-a-space/console/js
//
// To change back to the normal CDA, remove the CONTENTFUL_HOST variable from your environment.
if (process.env.CONTENTFUL_HOST) {
  contentfulConfig.host = process.env.CONTENTFUL_HOST;
  contentfulConfig.accessToken = process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN;
}

const {
  spaceId,
  accessToken
} = contentfulConfig;

if (!spaceId || !accessToken) {
  throw new Error(
    "Contentful spaceId and the access token need to be provided."
  );
}

module.exports = {
  siteMetadata: {
    title: "Ling Kan",
    description: "Ling Kan Portfolio",
  },
  pathPrefix: "/gatsby-contentful-starter",
  plugins: [
    'gatsby-plugin-postcss',
    "gatsby-transformer-remark",
    "gatsby-transformer-sharp",
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sharp",
    "gatsby-plugin-image",
    "gatsby-plugin-nprogress",
    {
      resolve: "gatsby-source-contentful",
      options: contentfulConfig,
    },
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /assets/ // See below to configure properly
        }
      }
    },
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        postCssPlugins: [
          require("tailwindcss"),
          require("./tailwind.config.js"), // Optional: Load custom Tailwind CSS configuration
        ],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Ling Kan Portfolio`,
        short_name: `Ling`,
        description: `Portfolio showcasing Ling Kan's work.`,
        start_url: `/`,
        icon: `src/assets/favicon/favicon.png`,
        icons: [{
          "src": "src/assets/favicon/favicon-16x16.png",
          "sizes": "16x16",
          "type": "image/png"
        }, {
          "src": "src/assets/favicon/favicon-32x32.png",
          "sizes": "32x32",
          "type": "image/png"
        }]

        ,
        background_color: `var(--primary)`,
        theme_color: `var(--primary)`,
        display: `standalone`,
      },
    },
    `gatsby-plugin-offline`,

  ],
};
