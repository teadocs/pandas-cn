module.exports = ctx => ({
  dest: './dist',
  locales: {
    '/': {
      lang: 'zh-CN',
      title: 'Pandas 中文',
      description: 'Pandas中文网、Pandas官方中文文档。'
    },
    '/en/': {
      lang: 'en-US',
      title: 'Pandas',
      description: 'Python Data Analysis Library.'
    }
  },
  head: require('./configs/head'),
  theme: 'teadocs',
  themeConfig: require('./configs/themeConfig'),
  plugins: require('./configs/plugins'),
  extraWatchFiles: [
    '.vuepress/nav/en.js',
    '.vuepress/nav/zh.js',
    '.vuepress/sidebar/en.js',
    '.vuepress/sidebar/zh.js',
    '.vuepress/configs/head.js',
    '.vuepress/configs/plugins.js',
    '.vuepress/configs/themeConfig.js'
  ]
});
