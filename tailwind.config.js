const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;
const tone = (name) => ({ DEFAULT: v(name), soft: v(`${name}-soft`), fg: v(`${name}-fg`) });

export default {
  content: [
  './app/**/*.{js,ts,jsx,tsx}',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize: {
        '2xs': ['11px', '16px'],
      },
      colors: {
        canvas: v('canvas'),
        surface: v('surface'),
        subtle: v('subtle'),
        muted: v('muted'),
        line: v('line'),
        'line-strong': v('line-strong'),
        ink: v('ink'),
        'ink-2': v('ink-2'),
        'ink-3': v('ink-3'),
        primary: { DEFAULT: v('primary'), hover: v('primary-hover'), fg: v('primary-fg') },
        accent: tone('accent'),
        info: tone('info'),
        violet: tone('violet'),
        warning: tone('warning'),
        success: tone('success'),
        orange: tone('orange'),
        danger: tone('danger'),
        neutral: tone('neutral'),
      },
      boxShadow: {
        card: '0 1px 2px 0 rgb(24 24 27 / 0.04)',
        pop: '0 12px 32px -8px rgb(24 24 27 / 0.18), 0 2px 6px -2px rgb(24 24 27 / 0.08)',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.23, 1, 0.32, 1)',
      },
    },
  },
  plugins: [],
};
