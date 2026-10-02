import React from 'react'
import { Reveal } from './reveal'

// Kept for backwards compatibility — prefer <Reveal> for new code.
const FadeIn = ({ children, className }) => <Reveal className={className}>{children}</Reveal>

export default FadeIn;
