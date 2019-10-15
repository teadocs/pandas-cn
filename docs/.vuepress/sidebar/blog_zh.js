module.exports = function () {
  return [{
    title: '熊猫博客文章列表',
    collapsable: true,
    sidebarDepth: 3,
    children: [
      ['/blog/2019-pandas-user-survey', '2019年 Pandas 用户调查'],
      ['/blog/pandas-extension-arrays', 'Pandas 的扩展数组']
    ]
  }]
};
