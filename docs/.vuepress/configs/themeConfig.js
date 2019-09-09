module.exports = {
  // logo配置
  logo: {
    text: 'Pandas',
    subText: '中文网',
    image: '/logo.svg',
  },
  // 公告/提醒 配置
  alert: [{
    id: '2019-7-29',
    title: '文档公告',
    content: `我们经常发布文档更新，部分页面的翻译可能仍在进行中。有关最新信息，请访问<a href="/en/">英文文档</a>。如果某个页面上的翻译有问题，请提issues<a href="https://github.com/teadocs/pandas-cn/issues" target="_blank">告诉我们</a>。`
  }],
  // 评论面板配置
  comment: {
    title: 'Pandas 爱好者'
  },
  repo: 'teadocs/pandas-cn',
  editLinks: true,
  docsDir: 'docs',
  locales: {
    '/': {
      label: '简体中文',
      selectText: '选择语言',
      editLinkText: '在 GitHub 上编辑此页',
      lastUpdated: '上次更新',
      nav: require('../nav/zh'),
      sidebar: {
        '/docs/': require('../sidebar/docs_zh')(),
        '/blog/': require('../sidebar/blog_zh')()
      }
    },
    '/en/': {
      label: 'English',
      selectText: 'Languages',
      editLinkText: 'Edit this page on GitHub',
      lastUpdated: 'Last Updated',
      nav: require('../nav/en'),
      sidebar: {
        '/en/docs/': require('../sidebar/docs_en')(),
        '/en/blog/': require('../sidebar/blog_en')()
      }
    }
  }
};
