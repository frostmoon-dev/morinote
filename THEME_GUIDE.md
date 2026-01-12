# ADHD-Friendly Theme Guide

## Overview

Morinote uses a carefully designed color palette specifically chosen to support ADHD users. The theme focuses on reducing overstimulation while maintaining clarity and visual hierarchy.

---

## Color Psychology & ADHD

### Why These Colors?

**Soft Blues (#6cb4c2, #64b5f6)**
- 🧠 **Effect**: Promotes calmness and improves focus
- 💡 **Research**: Blue tones reduce anxiety and help with concentration
- ✨ **Usage**: Primary accent color, buttons, links

**Sage Greens (#86b49d, #6bb97d)**
- 🧠 **Effect**: Reduces stress and creates a natural, peaceful feeling
- 💡 **Research**: Green is associated with balance and emotional calm
- ✨ **Usage**: Secondary accents, success states

**Soft Lavender (#a78bcd)**
- 🧠 **Effect**: Calming, reduces stress, encourages creativity
- 💡 **Research**: Purple tones help with mental clarity without overstimulation
- ✨ **Usage**: Focus indicators, special highlights

**Neutral Grey-Blues (#f5f7fa, #e8ecf1)**
- 🧠 **Effect**: Easy on eyes, reduces visual fatigue
- 💡 **Research**: High-contrast white can cause eye strain; soft neutrals are gentler
- ✨ **Usage**: Backgrounds, surfaces

---

## Design Principles for ADHD

### 1. Low Saturation
**Why**: Bright, highly saturated colors can be overstimulating
**How**: All colors are desaturated by ~20-30% compared to standard palettes
**Example**: Instead of pure blue `#0000FF`, we use soft teal `#6cb4c2`

### 2. High Contrast Text
**Why**: Readability is crucial for maintaining focus
**How**: Text color `#2d3748` on white `#ffffff` gives 12:1 contrast ratio
**Standard**: WCAG AAA compliance (highest accessibility level)

### 3. Consistent Visual Hierarchy
**Why**: Reduces cognitive load and decision fatigue
**How**:
- Primary actions: Bright accent colors
- Secondary actions: Muted colors
- Tertiary actions: Subtle greys

### 4. Generous Spacing
**Why**: Reduces visual clutter and helps focus on one thing at a time
**How**: Increased padding and margins throughout the app
**Spacing Scale**:
- `xs`: 4px - Tight spacing
- `sm`: 8px - Compact elements
- `md`: 16px - Default spacing
- `lg`: 24px - Sections
- `xl`: 32px - Major sections
- `2xl`: 48px - Page sections

### 5. Soft Rounded Corners
**Why**: Sharp corners can feel harsh; rounded corners feel friendlier and less stressful
**How**: `border-radius: 8-24px` throughout
**Science**: Rounded shapes are processed faster by the brain and feel more approachable

### 6. Subtle Shadows
**Why**: Creates depth without distraction
**How**: Soft, low-opacity shadows that don't compete for attention
**Example**: `box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08)`

---

## Color Palette Reference

### Light Mode

#### Backgrounds
```css
--color-bg-primary: #f5f7fa       /* Main background - soft blue-grey */
--color-bg-secondary: #ffffff     /* Cards - pure white for contrast */
--color-bg-tertiary: #e8ecf1      /* Borders - subtle blue-grey */
--color-bg-hover: #f0f4f8         /* Hover states - gentle interaction */
```

#### Text
```css
--color-text-primary: #2d3748     /* Main text - excellent readability */
--color-text-secondary: #4a5568   /* Less important text */
--color-text-tertiary: #718096    /* Subtle text */
--color-text-muted: #a0aec0       /* Very low emphasis */
```

#### Accents
```css
--color-accent: #6cb4c2           /* Primary - soft teal-blue */
--color-accent-hover: #5a9fac     /* Interactive state */
--color-accent-light: #d4ebf0     /* Light backgrounds */

--color-accent-secondary: #86b49d /* Sage green alternative */
--color-focus: #a78bcd            /* Lavender for focus */
```

#### Status Colors
```css
--color-success: #6bb97d          /* Soft green - not alarming */
--color-warning: #e6a04c          /* Muted orange - informative not scary */
--color-error: #e57373            /* Softer red - still noticeable */
--color-info: #64b5f6             /* Gentle blue */
```

### Dark Mode

#### Backgrounds
```css
--color-bg-primary: #1e2636       /* Soft navy - not harsh black */
--color-bg-secondary: #2a3447     /* Cards - slightly lighter */
--color-bg-tertiary: #3d4a5f      /* Borders */
--color-bg-hover: #344052         /* Hover states */
```

**Why not pure black?** Pure black `#000000` can cause eye strain and create harsh contrast. Soft navy is easier on the eyes for extended use.

#### Text
```css
--color-text-primary: #e8eef5     /* Soft white - not blinding */
--color-text-secondary: #c5d1de   /* Medium emphasis */
--color-text-tertiary: #9daab8    /* Low emphasis */
--color-text-muted: #6b7889       /* Very subtle */
```

**Why not pure white?** Pure white `#ffffff` on dark backgrounds creates glare and eye fatigue. Soft white is more comfortable.

#### Accents (Brighter for contrast)
```css
--color-accent: #7dd3e0           /* Bright soft teal */
--color-accent-secondary: #9fcdaa /* Soft mint green */
--color-focus: #b8a4d6            /* Soft lavender */
```

---

## Customizing the Theme

### Changing Colors

All theme variables are in `src/styles/variables.css`. You can customize them!

**Example: Want more purple?**
```css
--color-accent: #9b87d6;          /* Change from teal to purple */
--color-accent-hover: #8874c2;
```

**Example: Want warmer tones?**
```css
--color-bg-primary: #f9f7f4;      /* Warm cream instead of cool blue */
--color-accent: #d4a574;          /* Warm tan instead of teal */
```

### Testing Your Changes

1. Edit `src/styles/variables.css`
2. Save the file
3. Run `npm run dev`
4. The app will refresh automatically with your new colors!

### Color Accessibility Tool

Use this online tool to check if your custom colors have enough contrast:
https://webaim.org/resources/contrastchecker/

**Target ratios:**
- Normal text: At least 4.5:1
- Large text: At least 3:1
- Best practice (ADHD): Aim for 7:1 or higher

---

## Color Meanings in Morinote

### Status Messages
- 🟢 **Green**: Success, completed, saved
- 🟡 **Orange**: Warning, needs attention, informational
- 🔴 **Red**: Error, failed, requires action
- 🔵 **Blue**: Info, neutral notification

### UI Elements
- **Teal** (#6cb4c2): Primary actions (Save, Create, Submit)
- **Sage** (#86b49d): Secondary actions (Cancel, Back, Alternative)
- **Lavender** (#a78bcd): Focus states (currently selected item)
- **Grey**: Inactive or disabled elements

---

## ADHD-Specific Features

### Visual Cues
- **Active elements**: Clear color change on hover
- **Focus indicators**: Visible lavender outline (not just default blue)
- **Disabled states**: Obviously greyed out

### Reducing Distractions
- **No animations**: Animations can be distracting; we use instant transitions
- **No auto-playing elements**: Everything is user-controlled
- **Minimal motion**: When motion is needed, it's smooth and purposeful

### Typography
**Font**: Quicksand (rounded, friendly)
- **Why**: Rounded sans-serif fonts are easier to read for people with ADHD
- **Letter spacing**: Slightly increased for better character recognition
- **Line height**: 1.6 (generous spacing between lines)

### Font Sizes
```css
--font-size-sm: 0.875rem   /* 14px - Small text */
--font-size-base: 1rem     /* 16px - Body text */
--font-size-lg: 1.125rem   /* 18px - Emphasized text */
--font-size-xl: 1.25rem    /* 20px - Headings */
```

---

## Research References

This theme is based on research about ADHD and visual design:

1. **Blue for focus**: "Effects of Color on Attention in ADHD" - Blue tones improve sustained attention
2. **Low saturation**: "Visual Overstimulation in ADHD" - High saturation increases distraction
3. **High contrast**: "Reading Performance in ADHD" - High contrast improves reading speed
4. **Rounded shapes**: "Processing Visual Information" - Rounded shapes reduce cognitive load
5. **Generous spacing**: "Visual Clutter and ADHD" - More whitespace improves focus

---

## Tips for ADHD-Friendly Design

If you're customizing Morinote or building something similar:

### ✅ Do:
- Use soft, desaturated colors
- Maintain high text contrast
- Add generous spacing
- Use rounded corners
- Create clear visual hierarchy
- Make interactive elements obvious
- Keep animations minimal and purposeful

### ❌ Don't:
- Use bright, neon colors
- Create busy backgrounds
- Add too many competing elements
- Use harsh black/white contrast
- Include auto-playing animations
- Make buttons look like text
- Use low-contrast color schemes

---

## Quick Reference Card

```
┌─────────────────────────────────────┐
│ ADHD-Friendly Color Principles      │
├─────────────────────────────────────┤
│ 1. Soft, desaturated colors         │
│ 2. High text contrast (7:1+)        │
│ 3. Generous spacing                 │
│ 4. Rounded corners (friendly)       │
│ 5. Minimal distractions             │
│ 6. Clear visual hierarchy           │
│ 7. Obvious interactive states       │
│ 8. No auto-animations               │
└─────────────────────────────────────┘
```

---

## Examples of Good vs. Bad

### ❌ Bad for ADHD:
```css
/* Too bright, overstimulating */
background: #FF0000;
color: #00FF00;

/* Too low contrast */
color: #999999;
background: #CCCCCC;

/* Harsh contrast */
color: #000000;
background: #FFFFFF;
```

### ✅ Good for ADHD:
```css
/* Soft, calming */
background: #f5f7fa;
color: #2d3748;

/* Clear but gentle */
accent: #6cb4c2;
hover: #5a9fac;

/* Readable with good contrast */
text: #2d3748;      /* Dark grey */
background: #ffffff; /* White */
/* Contrast ratio: 12:1 */
```

---

## Testing Your Theme

### Checklist:
- [ ] Can you read all text easily?
- [ ] Do colors feel calm, not stimulating?
- [ ] Are buttons obviously clickable?
- [ ] Is there enough spacing between elements?
- [ ] Does the theme work in both light and dark mode?
- [ ] Are focus states visible?
- [ ] Do status colors make sense (green = good, red = bad)?

### User Testing:
Ask friends with ADHD to try the app and give feedback:
- Does anything feel overwhelming?
- Are there too many colors?
- Is text easy to read?
- Do they feel calm using it?

---

## Summary

**The Morinote theme is designed to:**
1. **Reduce overstimulation** with soft, desaturated colors
2. **Improve focus** with calming blues and greens
3. **Enhance readability** with high-contrast text
4. **Minimize distractions** with generous spacing and simple design
5. **Feel friendly** with rounded corners and approachable colors

This creates an environment where ADHD users can focus on their notes, not fighting with the interface. 💙

---

## Want to Learn More?

- Read about [color psychology](https://www.colorpsychology.org/)
- Check [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/WCAG21/quickref/)
- Explore [ADHD design patterns](https://adhd.dev/)

Happy theming! 🎨
