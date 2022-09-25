import type { NavbarConfig } from 'vuepress-theme-teadocs'

export const navbarZh: NavbarConfig = [
  {
    text: '它是什么',
    link: '/intro/'
  },
  {
    text: '关于项目',
    link: '/about/'
  },
  {
    text: 'Pandas 论坛',
    link: 'https://www.kuxai.com/f/pandas'
  },
  // {
  //   text: '深度学习',
  //   link: '/deep/',
  //   important: true
  // },
  {
    text: '获取与安装',
    link: '/get_pandas/'
  },
  {
    text: '参考文档',
    link: '/docs/'
  },
  {
    text: '精选资源',
    link: '/awesome/'
  },
  {
    text: '了解更多',
    children: [
      { text: '熊猫博客', link: '/blog/' },
      { text: '社区', link: '/community/' },
      { text: '讨论', link: '/talks/' }
    ]
  }
]
