import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

// Mock next/link
jest.mock('next/link', () => {
  const React = require('react');
  return React.forwardRef(
    (
      { children, href, ...rest }: { children: React.ReactNode; href: string; [key: string]: unknown },
      ref: React.Ref<HTMLAnchorElement>
    ) => {
      return React.createElement('a', { href, ref, ...rest }, children);
    }
  );
});

// Mock framer-motion
jest.mock('framer-motion', () => {
  const React = require('react');

  const motion = new Proxy(
    {},
    {
      get: (_target: unknown, prop: string) => {
        return React.forwardRef(
          ({ children, ...rest }: { children?: React.ReactNode; [key: string]: unknown }, ref: React.Ref<HTMLElement>) => {
            // Filter out framer-motion specific props
            const validProps: Record<string, unknown> = {};
            const invalidProps = [
              'initial',
              'animate',
              'exit',
              'transition',
              'variants',
              'whileHover',
              'whileTap',
              'whileInView',
              'whileFocus',
              'whileDrag',
              'drag',
              'dragConstraints',
              'dragElastic',
              'dragMomentum',
              'dragTransition',
              'layout',
              'layoutId',
              'onAnimationStart',
              'onAnimationComplete',
            ];
            Object.entries(rest).forEach(([key, value]) => {
              if (!invalidProps.includes(key)) {
                validProps[key] = value;
              }
            });
            return React.createElement(prop, { ref, ...validProps }, children);
          }
        );
      },
    }
  );

  return {
    __esModule: true,
    motion,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
    useAnimation: () => ({
      start: jest.fn(),
      stop: jest.fn(),
      set: jest.fn(),
    }),
    useInView: () => true,
    useMotionValue: (initial: number) => ({
      get: () => initial,
      set: jest.fn(),
      onChange: jest.fn(),
    }),
    useTransform: (value: unknown, inputRange: number[], outputRange: number[]) => ({
      get: () => outputRange[0],
      set: jest.fn(),
      onChange: jest.fn(),
    }),
  };
});

// Mock lucide-react icons
jest.mock('lucide-react', () => {
  const React = require('react');
  return new Proxy(
    {},
    {
      get: (_target: unknown, prop: string) => {
        if (prop === '__esModule') return true;
        return (props: Record<string, unknown>) =>
          React.createElement('svg', {
            'data-testid': `icon-${prop}`,
            ...props,
          });
      },
    }
  );
});

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] ?? null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: jest.fn((index: number) => Object.keys(store)[index] ?? null),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
