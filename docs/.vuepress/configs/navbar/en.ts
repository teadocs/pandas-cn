import type { NavbarConfig } from 'vuepress-theme-teadocs'

export const navbarEn: NavbarConfig = [
  {
    text: 'Introduction',
    link: '/en/intro/',
  },
  {
    text: 'About',
    link: '/en/about/'
  },
  {
    text: 'Get Pandas',
    link: '/en/get_pandas/'
  },
  {
    text: 'Documentation',
    link: '/en/docs/'
  },
  {
    text: 'Awesome',
    link: '/en/awesome/'
  },
  {
    text: 'Learn More',
    children: [
      { text: 'Blog', link: '/en/blog/' },
      { text: 'Community', link: '/en/community/' },
      { text: 'Talks', link: '/en/talks/' }
    ]
  }
]
