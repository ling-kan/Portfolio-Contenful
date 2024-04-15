# Portfolio using Contenful CMS

## 🚩 Table of Contents

1. [Technologies](#technologies)
2. [Features](#features)
3. [Crucial Commands](#crucial-commands)

## Technologies

- [Gatsby](http://gatsbyjs.com/)
- [Contentful](https://www.contentful.com)
- [React.js](https://reactjs.org/)
- [Netlify](https://www.netlify.com/).

## Features

- Simple content model and structure. Easy to adjust to your needs.
- Use the [synchronization feature](https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/synchronization) of our [Delivery API](https://www.contentful.com/developers/docs/references/content-delivery-api/).
- Responsive/adaptive images via [gatsby-plugin-image](https://www.gatsbyjs.org/packages/gatsby-plugin-image/) and our [Images API](https://www.contentful.com/developers/docs/references/content-delivery-api/#/reference/synchronization/initial-synchronization-of-entries-of-a-specific-content-type).

## Crucial Commands

`npm run dev`

Run the project locally with live reload in development mode.

`npm run build`

Run a production build into `./public`. The result is ready to be put on any static hosting you prefer.

`npm run serve`

Spin up a production-ready server with your blog. Don't forget to build your page beforehand.

### Set up of the needed content model and create a configuration file

This project comes with a Contentful setup command `npm run setup`.

This command will ask you for a space ID, and access tokens for the Contentful Management and Delivery API and then import the needed content model into the space you define and write a config file (`./.contentful.json`).

`npm run setup` automates that for you but if you want to do it yourself rename `.contentful.json.sample` to `.contentful.json` and add your configuration in this file.

### Deployment

Gatsby integrates easily with Netlify and can be deployed from the command line by running these commands. You will have to create an account with Netlify to proceed.

`npm run netlify:login`

`npm run netlify:deploy`

And now your new site is live. Feel free to make this project your own by installing your favorite Gatsby plugins, changing things up with a different Gatsby theme or giving your blog a new landing page. Happy building!

.env.development file
`GATSBY_CONTENTFUL_SPACE_ID=xxx
GATSBY_CONTENTFUL_ACCESS_TOKEN=xxx
GATSBY_CONTENTFUL_DELIVERY_TOKEN=xxx
ENABLE_GATSBY_REFRESH_ENDPOINT=true
GATSBY_GOOGLE_ANALYTICS_TRACKING_ID=xxx
GATSBY_GOOGLE_TAG_MANAGER_ID=xxx
GATSBY_PORTFOLIO_ACCESS_PASS=xxx`

You’ll need are the spaceId and the accessToken, both of these can be found in Contentful by navigating to Settings > API Keys
