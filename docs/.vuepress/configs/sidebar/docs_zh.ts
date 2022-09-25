export default [{
  text: '新版本特性',
  collapsible: true,
  sidebarDepth: 3,
  children: [
    '/docs/whatsnew/v0.25.0', // { link: '/docs/whatsnew/v0.25.0', text: 'v0.25.0 版本特性' },
  ]
},
{
  text: '安装方法',
  collapsible: true,
  sidebarDepth: 3,
  children: [
    '/docs/installation', // { link: '/docs/installation', text: '安装方法' },
  ]
},
{
  text: '快速入门',
  collapsible: true,
  sidebarDepth: 1,
  children: [
    { link: '/docs/getting_started/', text: '目录' }, // { link: '/docs/getting_started/', text: '目录' },
    '/docs/getting_started/overview', // { link: '/docs/getting_started/overview', text: 'Pandas 概览' },
    '/docs/getting_started/10min', // { link: '/docs/getting_started/10min', text: '十分钟入门Pandas' },
    '/docs/getting_started/basics', // { link: '/docs/getting_started/basics', text: '基础用法' },
    '/docs/getting_started/dsintro', // { link: '/docs/getting_started/dsintro', text: '数据结构简介' },
    '/docs/getting_started/comparison', // { link: '/docs/getting_started/comparison', text: '与其他工具比较' },
    '/docs/getting_started/tutorials', // { link: '/docs/getting_started/tutorials', text: '教程资料' },
  ]
},
{
  text: '用户指南',
  collapsible: true,
  sidebarDepth: 1,
  children: [
    { link: '/docs/user_guide/', text: '目录' }, // { link: '/docs/user_guide/', text: '目录' },
    '/docs/user_guide/io', // { link: '/docs/user_guide/io', text: 'IO工具（文本，CSV，HDF5，…）' },
    '/docs/user_guide/indexing', // { link: '/docs/user_guide/indexing', text: '索引和数据选择器' },
    '/docs/user_guide/advanced', // { link: '/docs/user_guide/advanced', text: '多索引和高级索引' },
    '/docs/user_guide/merging', // { link: '/docs/user_guide/merging', text: '合并、联接和连接' },
    '/docs/user_guide/reshaping', // { link: '/docs/user_guide/reshaping', text: '重塑和数据透视表' },
    '/docs/user_guide/text', // { link: '/docs/user_guide/text', text: '处理文本字符串' },
    '/docs/user_guide/missing_data', // { link: '/docs/user_guide/missing_data', text: '处理丢失的数据' },
    '/docs/user_guide/categorical', // { link: '/docs/user_guide/categorical', text: '分类数据' },
    '/docs/user_guide/integer_na', // { link: '/docs/user_guide/integer_na', text: 'Nullable整型数据类型' },
    '/docs/user_guide/visualization', // { link: '/docs/user_guide/visualization', text: '可视化' },
    '/docs/user_guide/computation', // { link: '/docs/user_guide/computation', text: '计算工具' },
    '/docs/user_guide/groupby', // { link: '/docs/user_guide/groupby', text: '组操作: 拆分-应用-组合' },
    '/docs/user_guide/timeseries', // { link: '/docs/user_guide/timeseries', text: '时间序列/日期方法' },
    '/docs/user_guide/timedeltas', // { link: '/docs/user_guide/timedeltas', text: '时间增量' },
    '/docs/user_guide/style', // { link: '/docs/user_guide/style', text: '样式' },
    '/docs/user_guide/options', // { link: '/docs/user_guide/options', text: '选项和设置' },
    '/docs/user_guide/enhancingperf', // { link: '/docs/user_guide/enhancingperf', text: '提高性能' },
    '/docs/user_guide/sparse', // { link: '/docs/user_guide/sparse', text: '稀疏数据结构' },
    '/docs/user_guide/gotchas', // { link: '/docs/user_guide/gotchas', text: '常见问题(FAQ)' },
    '/docs/user_guide/cookbook', // { link: '/docs/user_guide/cookbook', text: '烹饪指南' },
  ]
},
{
  text: 'Pandas 生态',
  collapsible: true,
  sidebarDepth: 3,
  children: [
    '/docs/ecosystem', // { link: '/docs/ecosystem', text: 'Pandas 生态' },
  ]
},
{
  text: 'API 参考手册',
  collapsible: true,
  sidebarDepth: 3,
  children: [
    { link: '/docs/reference', text: '目录' }, // { link: '/docs/reference', text: '目录' },
  ]
},
{
  text: '开发者文档',
  collapsible: true,
  sidebarDepth: 3,
  children: [
    { link: '/docs/development/', text: '目录' }, // { link: '/docs/development/', text: '目录' },
  ]
},
{
  text: '版本发布日志',
  collapsible: true,
  sidebarDepth: 3,
  children: [
    '/docs/whatsnew/', // { link: '/docs/whatsnew/', text: '发布日志' },
  ]
}
]
