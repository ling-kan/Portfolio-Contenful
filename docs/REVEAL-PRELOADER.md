# Reveal Preloader

A sophisticated, animated preloader component that reveals content as the page loads. This component provides a smooth, professional loading experience with progress indication.

## Features

- ✨ Smooth reveal animation with clip-path effects
- 📊 Real-time progress bar with gradient styling
- 🎨 Dark mode support with automatic detection
- ♿ Respects prefers-reduced-motion for accessibility
- 🎯 Fully customizable with Tailwind CSS and Framer Motion
- ⚡ Lightweight and performant
- 📱 Responsive design

## Installation

The Reveal Preloader is already integrated into your codebase:

1. **Component**: [src/components/motion/reveal-preloader.js](../src/components/motion/reveal-preloader.js)
2. **Styles**: [src/styles/reveal-preloader.scss](../src/styles/reveal-preloader.scss)
3. **Layout Integration**: [src/components/layout.js](../src/components/layout.js)

## Usage

### Basic Usage (Already Integrated)

The preloader is automatically integrated into your Layout component:

```jsx
import RevealPreloader from './motion/reveal-preloader'

const Template = ({ children, fullHeaderHeight = false, data }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Loading logic here
    setProgress(100);
    setIsLoading(false);
  }, []);

  return (
    <RevealPreloader isLoading={isLoading} progress={progress}>
      {/* Your content */}
    </RevealPreloader>
  )
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isLoading` | boolean | true | Controls visibility of the preloader |
| `progress` | number | 0 | Progress percentage (0-100) |
| `children` | ReactNode | - | Content to display after loading |

## Customization

### Change Colors

Edit [src/styles/reveal-preloader.scss](../src/styles/reveal-preloader.scss):

```scss
.reveal-preloader__ring {
  border-top-color: #your-color;
  border-right-color: #your-accent-color;
}

.reveal-preloader__progress-fill {
  background: linear-gradient(90deg, #color1, #color2);
}
```

### Adjust Animation Duration

Modify the RevealPreloader component [src/components/motion/reveal-preloader.js](../src/components/motion/reveal-preloader.js):

```jsx
const revealVariants = {
  visible: {
    transition: {
      duration: 0.8, // Change this value
    },
  },
};
```

### Customize Loading Time

In [src/components/layout.js](../src/components/layout.js):

```javascript
const timer = setTimeout(() => {
  setProgress(100);
  setIsLoading(false);
}, 2000); // Adjust duration (milliseconds)
```

## Animation Details

### Reveal Clip-Path Animation
- Entrance: Reveals from left to right
- Exit: Slides up with fade out
- Duration: 0.8 seconds

### Progress Bar
- Smooth scaling from left
- Gradient fill (Blue → Purple)
- Real-time progress updates

### Spinner Ring
- Continuous rotation
- Dual-color border (Blue → Purple)
- 2-second rotation cycle

## Browser Support

- Chrome/Edge 88+
- Firefox 87+
- Safari 14+
- iOS Safari 14+

## Accessibility

The component respects user preferences for reduced motion through Framer Motion's `useReducedMotion` hook. Users who prefer reduced motion will see a simplified version without animations.

## Dark Mode

The preloader automatically adapts to dark mode using CSS media queries:

```scss
@media (prefers-color-scheme: dark) {
  /* Dark mode styles */
}
```

## Performance Tips

1. **Loading Progress**: Simulate realistic progress with random increments
2. **Minimum Duration**: Keep at least 1-2 seconds for smooth perception
3. **Content Ready**: Only set `isLoading={false}` when content is fully rendered

## Files Modified

- ✅ [src/components/motion/reveal-preloader.js](../src/components/motion/reveal-preloader.js) - New component
- ✅ [src/styles/reveal-preloader.scss](../src/styles/reveal-preloader.scss) - New styles
- ✅ [src/components/layout.js](../src/components/layout.js) - Integrated preloader
- ✅ [gatsby-browser.js](../gatsby-browser.js) - Added style import

## Examples

### Custom Loading Logic

```jsx
useEffect(() => {
  // Fetch data and update progress
  fetchData().then(() => {
    setProgress(100);
    setIsLoading(false);
  }).catch(error => {
    console.error(error);
    setIsLoading(false);
  });
}, []);
```

### Simulated Progress

```jsx
const interval = setInterval(() => {
  setProgress((prev) => {
    if (prev >= 90) {
      clearInterval(interval);
      return 90;
    }
    return prev + Math.random() * 30;
  });
}, 300);
```

## Troubleshooting

### Preloader Stuck
- Check that `setIsLoading(false)` is called in your useEffect
- Verify the timer is set correctly

### Animation Not Smooth
- Ensure Framer Motion is installed: `npm list framer-motion`
- Check browser hardware acceleration is enabled

### Dark Mode Not Working
- Verify Tailwind config includes dark mode
- Check `prefers-color-scheme` preference in browser

## License

This component is part of your portfolio project.
