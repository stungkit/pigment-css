# Pigment CSS

Pigment CSS is a zero-runtime CSS-in-JS library that extracts the colocated styles to their own CSS files at build time.

- [Getting started](#getting-started)
  - [Why this project exists?](#why-choose-pigment-css)
  - [Start with Next.js](#start-with-nextjs)
  - [Start with Vite](#start-with-vite)
- [Basic usage](#basic-usage)
  - [Creating styles](#creating-styles)
  - [Creating components](#creating-components)
    - [Styling based on props](#styling-based-on-props)
    - [Styling based on runtime values](#styling-based-on-runtime-values)
    - [Styled component as a CSS selector](#styled-component-as-a-css-selector)
    - [Typing props](#typing-props)
- [Theming](#theming)
  - [Accesing theme values](#accesing-theme-values)
  - [CSS variables support](#css-variables-support)
  - [Color schemes](#color-schemes)
  - [Switching color schemes](#switching-color-schemes)
  - [TypeScript](#typescript)
- [How-to guides](#how-to-guides)
  - [Coming from Emotion or styled-components](#coming-from-emotion-or-styled-components)

## Getting started

Pigment CSS supports Next.js and Vite with support for more bundlers in the future.
You must install the corresponding plugin, as shown below.

### Why choose Pigment CSS

Thanks to recent advancements in CSS (like CSS variables and `color-mix()`), "traditional" CSS-in-JS solutions that process styles at runtime are no longer required for unlocking features like color transformations and theme variables which are necessary for maintaining a sophisticated design system.

Pigment CSS addresses the needs of the modern React developer by providing a zero-runtime CSS-in-JS styling solution as a successor to tools like Emotion and styled-components.

Compared to its predecessors, Pigment CSS offers improved DX and runtime performance (though at the cost of increased build time) while also being compatible with React Server Components.
Pigment CSS is built on top of [WyW-in-JS](https://wyw-in-js.dev/), enabling to provide the smoothest possible experience for Material UI users when migrating from Emotion in v5 to Pigment CSS in v6.

### Start with Next.js

Use the following commands to create a new Next.js project with Pigment CSS set up:

```bash
curl https://codeload.github.com/mui/material-ui/tar.gz/master | tar -xz --strip=2  material-ui-master/examples/pigment-css-nextjs-ts
cd pigment-css-nextjs-ts
```

#### Manual installation

```bash
npm install @pigment-css/react
npm install --save-dev @pigment-css/nextjs-plugin
```

Then, in your `next.config.js` file, import the plugin and wrap the exported config object:

```js
const { withPigment } = require('@pigment-css/nextjs-plugin');

module.exports = withPigment({
  // ... Your nextjs config.
});
```

Finally, import the stylesheet in the root `layout.tsx` file:

```diff
 import type { Metadata } from 'next';
+import '@pigment-css/react/styles.css';

 export const metadata: Metadata = {
   title: 'Create Next App',
   description: 'Generated by create next app',
 };

 export default function RootLayout(props: { children: React.ReactNode }) {
   return (
     <html lang="en">
       <body>{props.children}</body>
     </html>
   );
 }
```

### Start with Vite

Use the following commands to create a new Vite project with Pigment CSS set up:

```bash
curl https://codeload.github.com/mui/material-ui/tar.gz/master | tar -xz --strip=2 material-ui-master/examples/pigment-css-vite-ts
cd pigment-css-vite-ts
```

#### Manual installation

```bash
npm install @pigment-css/react
npm install --save-dev @pigment-css/vite-plugin
```

Then, in your Vite config file, import the plugin and pass it to the `plugins` array as shown:

```js
import { pigment } from '@pigment-css/vite-plugin';

export default defineConfig({
  plugins: [
    pigment(),
    // ... Your other plugins.
  ],
});
```

Finally, import the stylesheet in the root `main.tsx` file:

```diff
 import * as React from 'react';
 import { createRoot } from 'react-dom/client';
+import '@pigment-css/react/styles.css';
 import App from './App';

 const rootElement = document.getElementById('root');
 const root = createRoot(rootElement);

 root.render(
   <React.StrictMode>
     <App />
   </React.StrictMode>,
 );
```

## Basic usage

**You must configure Pigment CSS with [Next.js](#nextjs) or [Vite](#vite) first.**

### Creating styles

Use the `css` API to create reusable styles:

```js
import { css } from '@pigment-css/react';

const visuallyHidden = css({
  border: 0,
  clip: 'rect(0 0 0 0)',
  height: '1px',
  margin: -1,
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: '1px',
});

function App() {
  return <div className={visuallyHidden}>I am invisible</div>;
}
```

The call to the `css` function is replaced with a unique string that represents the CSS class name for the generated styles.

Use a callback function to get access to the [theme](#theming) values:

```js
const title = css(({ theme }) => ({
  color: theme.colors.primary,
  fontSize: theme.spacing.unit * 4,
  fontFamily: theme.typography.fontFamily,
}));
```

### Creating components

Use the `styled` API to create a component by passing styles at the end. The usage should be familiar if you've worked with Emotion or styled-components:

```js
import { styled } from '@pigment-css/react';

const Heading = styled('div')({
  fontSize: '4rem',
  fontWeight: 'bold',
  padding: '10px 0px',
});

function App() {
  return <Heading>Hello</Heading>;
}
```

The Pigment CSS library differs from "standard" runtime CSS-in-JS libraries in a few ways:

1. You never get direct access to props in your styled declarations. This is because prop values are only available at runtime, but the CSS is extracted at build time. See [Styling based on runtime values](#styling-based-on-runtime-values) for a workaround.
2. Your styles must be declarative and must account for all combinations of props that you want to style.
3. The theme lets you declare CSS tokens that become part of the CSS bundle after the build. Any other values and methods that it might have are only available during build time—not at runtime. This leads to smaller bundle sizes.

#### Styling based on props

> 💡 This approach is recommended when the value of the prop is known at build time (finite values).

Use the `variants` key to define styles for a combination of the component's props.

Each variant is an object with `props` and `style` keys. The styles are applied when the component's props match the `props` object.

**Example 1** — A button component with `small` and `large` sizes:

```jsx
const Button = styled('button')({
  border: 'none',
  padding: '0.75rem',
  // ...other base styles
  variants: [
    {
      props: { size: 'large' },
      style: { padding: '1rem' },
    },
    {
      props: { size: 'small' },
      style: { padding: '0.5rem' },
    },
  ],
});

<Button>Normal button</Button>; // padding: 0.75rem
<Button size="large">Large button</Button>; // padding: 1rem
<Button size="small">Small button</Button>; // padding: 0.5rem
```

**Example 2** — A button component with variants and colors:

```jsx
const Button = styled('button')({
  border: 'none',
  padding: '0.75rem',
  // ...other base styles
  variants: [
    {
      props: { variant: 'contained', color: 'primary' },
      style: { backgroundColor: 'tomato', color: 'white' },
    },
  ],
});

// `backgroundColor: 'tomato', color: 'white'`
<Button variant="contained" color="primary">
  Submit
</Button>;
```

**Example 3** — Apply styles based on a condition:

The value of the `props` can be a function that returns a boolean. If the function returns `true`, the styles are applied.

```jsx
const Button = styled('button')({
  border: 'none',
  padding: '0.75rem',
  // ...other base styles
  variants: [
    {
      props: (props) => props.variant !== 'contained',
      style: { backgroundColor: 'transparent' },
    },
  ],
});
```

Note that the `props` function doesn't work if it is inside another closure, for example, inside an `array.map`:

```jsx
const Button = styled('button')({
  border: 'none',
  padding: '0.75rem',
  // ...other base styles
  variants: ['red', 'blue', 'green'].map((item) => ({
    props: (props) => {
      // ❌ Cannot access `item` in this closure
      return props.color === item && !props.disabled;
    },
    style: { backgroundColor: 'tomato' },
  })),
});
```

Instead, use plain objects to define the variants:

```jsx
const Button = styled('button')({
  border: 'none',
  padding: '0.75rem',
  // ...other base styles
  variants: ['red', 'blue', 'green'].map((item) => ({
    props: { color: item, disabled: false },
    style: { backgroundColor: 'tomato' },
  })),
});
```

#### Styling based on runtime values

> 💡 This approach is recommended when the value of a prop is **unknown** ahead of time or possibly unlimited values, for example styling based on the user's input.

There are two ways to acheive this (both involve using a CSS variable):

1. Declare a CSS variable directly in the styles and set its value using inline styles:

```jsx
const Heading = styled('h1')({
  color: 'var(--color)',
});

function Heading() {
  const [color, setColor] = React.useState('red');

  return <Heading style={{ '--color': color }} />;
}
```

2. Use a callback function as a value to create a dynamic style for the specific CSS property:

```jsx
const Heading = styled('h1')({
  color: ({ isError }) => (isError ? 'red' : 'black'),
});
```

Pigment CSS replaces the callback with a CSS variable and inject the value through inline style. This makes it possible to create a static CSS file while still allowing dynamic styles.

```css
.Heading_class_akjsdfb {
  color: var(--Heading_class_akjsdfb-0);
}
```

```jsx
<h1
  style={{
    '--Heading_class_akjsdfb-0': ({ isError }) => (isError ? 'red' : 'black'),
  }}
>
  Hello
</h1>
```

#### Styled component as a CSS selector

All of the components that you create are also available as CSS selectors. For example, for the `Heading` component described in the previous section, you can target that component inside another styled component like this:

```jsx
const Wrapper = styled.div({
  [`& ${Heading}`]: {
    color: 'blue',
  },
});
```

This enables you to override the default `color` of the Heading component rendered inside the Wrapper:

```tsx
<Wrapper>
  <Heading>Hello</Heading>
</Wrapper>
```

You can also export any styled component you create and use it as the base for additional components:

```jsx
const ExtraHeading = styled(Heading)({
  // ... overridden styled
});
```

#### Media and Container queries

Pigment CSS APIs have built-in support for writing media queries and container queries. Use the `@media` and `@container` keys to define styles for different screen and container sizes.

```jsx
import { css, styled } from '@pigment-css/react';

const styles = css({
  fontSize: '2rem',
  '@media (min-width: 768px)': {
    fontSize: '3rem',
  },
  '@container (max-width: 768px)': {
    fontSize: '1.5rem',
  },
});

const Heading = styled('h1')({
  fontSize: '2rem',
  '@media (min-width: 768px)': {
    fontSize: '3rem',
  },
  '@container (max-width: 768px)': {
    fontSize: '1.5rem',
  },
});
```

> 💡 **Good to know**:
>
> Pigment CSS uses Emotion behind the scenes for turning tagged templates and objects into CSS strings.

#### Typing props

If you use TypeScript, add the props typing before the styles to get the type checking:

```tsx
const Heading = styled('h1')<{ isError?: boolean }>({
  color: ({ isError }) => (isError ? 'red' : 'black'),
});
```

### Creating animation keyframes

Use the `keyframes` API to create reusable [animation keyframes](https://developer.mozilla.org/en-US/docs/Web/CSS/@keyframes):

```js
import { keyframes } from '@pigment-css/react';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

function Example1() {
  return <div style={{ animation: `${fadeIn} 0.5s` }}>I am invisible</div>;
}
```

The call to the `keyframes` function is replaced with a unique string that represents the CSS animation name. It can be used with `css` or `styled` too.

```js
import { css, styled, keyframes } from '@pigment-css/react';

const fadeIn = keyframes(...);

const Example2 = styled('div')({
  animation: `${fadeIn} 0.5s`,
});

function App() {
  return (
    <>
      <Example1 />
      <div
        className={css`
          animation: ${fadeIn} 0.5s;
        `}
      />
    </>
  )
}
```

### Theming

Theming is an **optional** feature that lets you reuse the same values, such as colors, spacing, and typography, across your application. It is a plain object of any structure that you can define in your config file.

> **💡 Good to know**:
>
> The **theme** object is used at build time and does not exist in the final JavaScript bundle. This means that components created using Pigment CSS's `styled` can be used with React Server Components by default while still getting the benefits of theming.

For example, in Next.js, you can define a theme in the `next.config.js` file like this:

```js
const { withPigment } = require('@pigment-css/nextjs-plugin');

module.exports = withPigment(
  {
    // ...other nextConfig
  },
  {
    theme: {
      colors: {
        primary: 'tomato',
        secondary: 'cyan',
      },
      spacing: {
        unit: 8,
      },
      typography: {
        fontFamily: 'Inter, sans-serif',
      },
      // ...more keys and values, it's free style!
    },
  },
);
```

#### Accessing theme values

A callback can be used with **styled()** and **css()** APIs to access the theme values:

```js
const Heading = styled('h1')(({ theme }) => ({
  color: theme.colors.primary,
  fontSize: theme.spacing.unit * 4,
  fontFamily: theme.typography.fontFamily,
}));
```

#### CSS variables support

Pigment CSS can generate CSS variables from the theme values when you wrap your theme with `extendTheme` utility. For example, in a `next.config.js` file:

```js
const { withPigment, extendTheme } = require('@pigment-css/nextjs-plugin');

module.exports = withPigment(
  {
    // ...nextConfig
  },
  {
    theme: extendTheme({
      colors: {
        primary: 'tomato',
        secondary: 'cyan',
      },
      spacing: {
        unit: 8,
      },
      typography: {
        fontFamily: 'Inter, sans-serif',
      },
    }),
  },
);
```

The `extendTheme` utility goes through the theme and create a `vars` object which represents the tokens that refer to CSS variables.

```jsx
const theme = extendTheme({
  colors: {
    primary: 'tomato',
    secondary: 'cyan',
  },
});

console.log(theme.colors.primary); // 'tomato'
console.log(theme.vars.colors.primary); // 'var(--colors-primary)'
```

#### Adding a prefix to CSS variables

You can add a prefix to the generated CSS variables by providing a `cssVarPrefix` option to the `extendTheme` utility:

```jsx
extendTheme({
  cssVarPrefix: 'pigment',
});
```

The generated CSS variables has the `pigment` prefix:

```css
:root {
  --pigment-colors-background: #f9f9f9;
  --pigment-colors-foreground: #121212;
}
```

#### Color schemes

Some tokens, especially color-related tokens, can have different values for different scenarios. For example in a daylight condition, the background color might be white, but in a dark condition, it might be black.

The `extendTheme` utility lets you define a theme with a special `colorSchemes` key:

```jsx
extendTheme({
  colorSchemes: {
    light: {
      colors: {
        background: '#f9f9f9',
        foreground: '#121212',
      },
    },
    dark: {
      colors: {
        background: '#212121',
        foreground: '#fff',
      },
    },
  },
});
```

In the above example, `light` (default) and `dark` color schemes are defined. The structure of each color scheme must be a plain object with keys and values.

#### Switching color schemes

By default, when `colorSchemes` is defined, Pigment CSS uses the [`prefers-color-scheme`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) media query to switch between color schemes based on the user's system settings.

However, if you want to control the color scheme based on application logic, for example, using a button to switch between light and dark mode, you can customize the behavior by providing a `getSelector` function:

```diff
  extendTheme({
    colorSchemes: {
      light: { ... },
      dark: { ... },
    },
+   getSelector: (colorScheme) => colorScheme ? `.theme-${colorScheme}` : ':root',
  });
```

Note that you need to add the logic to a button by yourself. Here is an example of how to do it:

```jsx
function App() {
  return (
    <button
      onClick={() => {
        document.documentElement.classList.toggle('theme-dark');
      }}
    >
      Toggle color scheme
    </button>
  );
}
```

#### Styling based on color scheme

The `extendTheme` utility attaches a function called `applyStyles` to the theme object. It receives a color scheme as the first argument followed by a style object.
It returns a proper CSS selector based on the theme configuration.

```jsx
const Heading = styled('h1')(({ theme }) => ({
  color: theme.colors.primary,
  fontSize: theme.spacing.unit * 4,
  fontFamily: theme.typography.fontFamily,
  ...theme.applyStyles('dark', {
    color: theme.colors.primaryLight,
  }),
}));
```

#### TypeScript

To get the type checking for the theme, you need to augment the theme type:

```ts
// any file that is included in your tsconfig.json
import type { ExtendTheme } from '@pigment-css/react/theme';

declare module '@pigment-css/react/theme' {
  interface ThemeTokens {
    // the structure of your theme
  }

  interface ThemeArgs {
    theme: ExtendTheme<{
      colorScheme: 'light' | 'dark';
      tokens: ThemeTokens;
    }>;
  }
}
```

## How-to guides

### Coming from Emotion or styled-components

Emotion and styled-components are runtime CSS-in-JS libraries. What you write in your styles is what you get in the final bundle, which means the styles can be as dynamic as you want with bundle size and performance overhead trade-offs.

On the other hand, Pigment CSS extracts CSS at build time and replaces the JavaScript code with hashed class names and some CSS variables. This means that it has to know all of the styles to be extracted ahead of time, so there are rules and limitations that you need to be aware of when using JavaScript callbacks or variables in Pigment CSS's APIs.

Here are some common patterns and how to achieve them with Pigment CSS:

1. **Fixed set of styles**

In Emotion or styled-components, you can use props to create styles conditionally:

```js
const Flex = styled('div')((props) => ({
  display: 'flex',
  ...(props.vertical // ❌ Pigment CSS will throw an error
    ? {
        flexDirection: 'column',
        paddingBlock: '1rem',
      }
    : {
        paddingInline: '1rem',
      }),
}));
```

But in Pigment CSS, you need to define all of the styles ahead of time using the `variants` key:

```js
const Flex = styled('div')((props) => ({
  display: 'flex',
  variants: [
    {
      props: { vertical: true },
      style: {
        flexDirection: 'column',
        paddingBlock: '1rem',
      },
    },
    {
      props: { vertical: false },
      style: {
        paddingInline: '1rem',
      },
    },
  ],
}));
```

> 💡 Keep in mind that the `variants` key is for fixed values of props, for example, a component's colors, sizes, and states.

2. **Programatically generated styles**

For Emotion and styled-components, the styles is different on each render and instance because the styles are generated at runtime:

```js
function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function generateBubbleVars() {
  return `
    --x: ${randomBetween(10, 90)}%;
    --y: ${randomBetween(15, 85)}%;
  `;
}

function App() {
  return (
    <div>
      {[...Array(10)].map((_, index) => (
        <div key={index} className={css`${generateBubbleVars()}`} />
      ))}
    </div>
  )
}
```

However, in Pigment CSS with the same code as above, all instances have the same styles and won't change between renders because the styles are extracted at build time.

To achieve the same result, you need to move the dynamic logic to props and pass the value to CSS variables instead:

```js
function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const Bubble = styled('div')({
  '--x': props => props.x,
  '--y': props => props.y,
});

function App() {
  return (
    <div>
      {[...Array(10)].map((_, index) => (
        <Bubble key={index} x={`${randomBetween(10, 90)}%`} y={`${randomBetween(15, 85)}%`} />
      ))}
    </div>
  )
}
```