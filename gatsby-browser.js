import './src/styles/variables.scss'
import './src/styles/global.scss'
import './src/styles/image.scss'

import React from "react"
import { AnimatePresence } from "framer-motion"

export const wrapPageElement = ({ element }) => (
    <AnimatePresence exitBeforeEnter>{element}</AnimatePresence>
)

export const shouldUpdateScroll = ({
    routerProps: { location },
    getSavedScrollPosition
}) => {
    // transition duration from `layout.js` * 1000 to get time in ms
    const TRANSITION_DELAY = 0.1 * 1000 * 2

    if (location.action === "PUSH") {
        window.setTimeout(() => window.scrollTo(0, 0), TRANSITION_DELAY)
    }

    else {
        const savedPosition = getSavedScrollPosition(location) || [0, 0]

        window.setTimeout(() => window.scrollTo(...savedPosition), TRANSITION_DELAY)
    }

    return false
}
