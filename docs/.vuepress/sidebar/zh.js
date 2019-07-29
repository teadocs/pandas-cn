module.exports = function () {
  return [{
      title: '新版本特性',
      collapsable: true,
      sidebarDepth: 3,
      children: [
        ['/docs/whatsnew/v0.25.0', 'v0.25.0 版本特性']
      ]
    },
    {
      title: '安装方法',
      collapsable: true,
      sidebarDepth: 3,
      children: [
        ['/docs/installation', '安装方法']
      ]
    },
    {
      title: '快速入门',
      collapsable: true,
      sidebarDepth: 1,
      children: [
        ['/docs/getting_started/', '目录'],
        ['/docs/getting_started/overview', '包概述'],
        ['/docs/getting_started/10min', '十分钟入门Pandas'],
        ['/docs/getting_started/basics', '基本使用方法'],
        ['/docs/getting_started/dsintro', '数据结构简介'],
        ['/docs/getting_started/comparison', '与其他工具比较'],
        ['/docs/getting_started/tutorials', '教程资料']
      ]
    },
    {
      title: '用户指南',
      collapsable: true,
      sidebarDepth: 1,
      children: [
        ['/docs/user_guide/', '目录'],
        ['/docs/user_guide/io', 'IO工具（文本，CSV，HDF5，…）'],
        ['/docs/user_guide/indexing', '索引和数据选择器'],
        ['/docs/user_guide/advanced', '多索引和高级索引'],
        ['/docs/user_guide/merging', '合并、联接和连接'],
        ['/docs/user_guide/reshaping', '重塑和数据透视表'],
        ['/docs/user_guide/text', '处理文本字符串'],
        ['/docs/user_guide/missing_data', '处理丢失的数据'],
        ['/docs/user_guide/categorical', '分类数据'],
        ['/docs/user_guide/integer_na', 'Nullable整型数据类型'],
        ['/docs/user_guide/visualization', '可视化'],
        ['/docs/user_guide/computation', '计算工具'],
        ['/docs/user_guide/groupby', '组操作: 拆分-应用-组合'],
        ['/docs/user_guide/timeseries', '时间序列/日期方法'],
        ['/docs/user_guide/timedeltas', '时间增量'],
        ['/docs/user_guide/style', '样式'],
        ['/docs/user_guide/options', '选项和设置'],
        ['/docs/user_guide/enhancingperf', '提高性能'],
        ['/docs/user_guide/sparse', '稀疏数据结构'],
        ['/docs/user_guide/gotchas', '常见问题(FAQ)'],
        ['/docs/user_guide/cookbook', '烹饪指南']
      ]
    },
    {
      title: 'Pandas 生态',
      collapsable: true,
      sidebarDepth: 3,
      children: [
        ['/docs/ecosystem', 'Pandas 生态']
      ]
    },
    {
      title: 'API 参考手册',
      collapsable: true,
      sidebarDepth: 3,
      children: [
        ['/docs/reference', '目录']
      ]
    },
    {
      title: '开发者文档',
      collapsable: true,
      sidebarDepth: 3,
      children: [
        ['/docs/development/', '目录']
      ]
    },
    {
      title: '版本发布日志',
      collapsable: true,
      sidebarDepth: 3,
      children: [
        ['/docs/whatsnew/', '发布日志']
      ]
    }
  ]
}