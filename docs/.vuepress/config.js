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
  head: [
    ['link', { rel: 'dns-prefetch', href: `//cdn.bootcss.com` }],
    ['link', { rel: 'dns-prefetch', href: `//cdn.mathjax.org` }],
    // 使主题能够支持数学公式
    ['script', {type: 'text/x-mathjax-config'}, `
    MathJax.Hub.Config({
      showProcessingMessages: false, //关闭js加载过程信息
      messageStyle: "none", //不显示信息
      tex2jax: {
        "inlineMath": [["$", "$"], ["\\\\(", "\\\\)"]], 
        "processEscapes": true, 
        "ignoreClass": "document",
        skipTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code', 'a', 'td'],
        "processClass": "math|output_area"
      },
      "HTML-CSS": {
        showMathMenu: false
      }
    })
    `],
    ['script', {src: '//cdn.bootcss.com/mathjax/2.7.0/MathJax.js?config=TeX-AMS-MML_HTMLorMML'}],
    // 监听路由重新渲染数学公式
    ['script', {}, `
      (function() {
        var url1 = window.location.href;
        var url2 = window.location.href;
        setInterval(function() {
          if (url1 === url2) {
            url2 = window.location.href;
          } else {
            url1 = url2;
            if (window.MathJax) window.MathJax.Hub.Typeset();
          }
        }, 200);
      })();
    `],
    ['link', { rel: 'icon', href: `/logo.png` }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['link', { rel: 'apple-touch-icon', href: `/icons/apple-touch-icon-152x152.png` }],
    ['link', { rel: 'mask-icon', href: '/icons/safari-pinned-tab.svg', color: '#3eaf7c' }],
    ['meta', { name: 'msapplication-TileImage', content: '/icons/msapplication-icon-144x144.png' }],
    ['meta', { name: 'msapplication-TileColor', content: '#000000' }]
  ],
  theme: 'teadocs',
  themeConfig: {
    repo: 'teadocs/pandas-cn',
    editLinks: true,
    docsDir: 'docs',
    locales: {
      '/': {
        label: '简体中文',
        selectText: '选择语言',
        editLinkText: '在 GitHub 上编辑此页',
        lastUpdated: '上次更新',
        nav: require('./nav/zh'),
        sidebar: {}
      },
      '/en/': {
        label: 'English',
        selectText: 'Languages',
        editLinkText: 'Edit this page on GitHub',
        lastUpdated: 'Last Updated',
        nav: require('./nav/en'),
        sidebar: require('./sidebar/en')()
      }
    }
  },
  plugins: [
    ['@vuepress/back-to-top', true],
    ['@vuepress/pwa', {
      serviceWorker: true,
      updatePopup: true
    }],
    ['@vuepress/medium-zoom', true],
    ['@vuepress/google-analytics', {
      ga: 'UA-128189152-1'
    }],
    ['container', {
      type: 'vue',
      before: '<pre class="vue-container"><code>',
      after: '</code></pre>',
    }],
    ['container', {
      type: 'upgrade',
      before: info => `<UpgradePath title="${info}">`,
      after: '</UpgradePath>',
    }],
  ],
  extraWatchFiles: [
    '.vuepress/nav/en.js',
    '.vuepress/nav/zh.js',
    '.vuepress/sidebar/en.js',
    '.vuepress/sidebar/zh.js'
  ]
})
