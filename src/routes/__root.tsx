import { TanStackDevtools } from '@tanstack/react-devtools'
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import Footer from '../components/Footer'
import Header from '../components/Header'
import { AuthProvider } from '../context/AuthContext'
import appCss from '../styles.css?url'

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`

const SITE_URL = 'https://vivafemini-frontend.vercel.app';
const SITE_NAME = 'VivaFemini';
const SITE_DESC =
  'Track your menstrual cycle, log daily symptoms, and unlock personalized health insights — all in one beautiful app.';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: SITE_NAME },
      { name: 'description', content: SITE_DESC },
      { name: 'theme-color', content: '#EC4899' },
      { name: 'robots', content: 'index, follow' },
      /* Open Graph */
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: SITE_NAME },
      { property: 'og:url', content: SITE_URL },
      { property: 'og:title', content: SITE_NAME },
      { property: 'og:description', content: SITE_DESC },
      { property: 'og:image', content: `${SITE_URL}/logo512.png` },
      { property: 'og:image:width', content: '512' },
      { property: 'og:image:height', content: '512' },
      /* Twitter card */
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: SITE_NAME },
      { name: 'twitter:description', content: SITE_DESC },
      { name: 'twitter:image', content: `${SITE_URL}/logo512.png` },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
      { rel: 'apple-touch-icon', href: '/logo192.png' },
      { rel: 'manifest', href: '/manifest.json' },
      { rel: 'canonical', href: SITE_URL },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(79,184,178,0.24)]">
        <AuthProvider>
          <Header />
          {children}
          <Footer />
        </AuthProvider>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
