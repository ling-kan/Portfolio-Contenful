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
    if (location.hash) {
        // const element = document.querySelector(location.hash);
        // if (element) {
        //     element.scrollIntoView({
        //         behavior: 'smooth',
        //         block: 'start',
        //         inline: 'nearest',
        //     });
        // }
        const element = location.pathname === "/" ? document.querySelector(location.hash).offsetTop - 75 : document.querySelector(location.hash);
        if (element) {
            window.scrollTo({ top: element, behavior: "smooth" });
        }
    }
    if (location.action === "PUSH") {
        window.setTimeout(() => window.scrollTo(0, 0), TRANSITION_DELAY)
    }

    else {
        if (location.pathname !== "/") {
            const savedPosition = getSavedScrollPosition(location) || [0, 0]
            window.setTimeout(() => window.scrollTo(...savedPosition), TRANSITION_DELAY)
        }
    }
    return false
}
