module.exports = function () {
  return [{
      title: 'What\'s New',
      collapsable: true,
      sidebarDepth: 3,
      children: [
        ['/en/docs/whatsnew/v0.24.2', 'What\'s New in 0.24.2']
      ]
    },
    {
      title: 'Installation',
      collapsable: true,
      sidebarDepth: 3,
      children: [
        ['/en/docs/installation', 'Installation']
      ]
    },
    {
      title: 'Getting started',
      collapsable: true,
      sidebarDepth: 1,
      children: [
        ['/en/docs/getting_started/', 'Index'],
        ['/en/docs/getting_started/overview', 'Package overview'],
        ['/en/docs/getting_started/10min', '10 Minutes to pandas'],
        ['/en/docs/getting_started/basics', 'Essential Basic Functionality'],
        ['/en/docs/getting_started/dsintro', 'Intro to Data Structures'],
        ['/en/docs/getting_started/comparison', 'Comparison with other tools'],
        ['/en/docs/getting_started/tutorials', 'Tutorials']
      ]
    },
    {
      title: 'User Guide',
      collapsable: true,
      sidebarDepth: 1,
      children: [
        ['/en/docs/user_guide/', 'Index'],
        ['/en/docs/user_guide/io', 'IO Tools (Text, CSV, HDF5, …)']
      ]
    },
    {
      title: 'pandas Ecosystem',
      collapsable: true,
      sidebarDepth: 3,
      children: [
        ['/en/docs/ecosystem', 'pandas Ecosystem']
      ]
    },
    {
      title: 'API Reference',
      collapsable: true,
      sidebarDepth: 3,
      children: [
        ['/en/docs/reference', 'API Reference']
      ]
    },
    {
      title: 'Development',
      collapsable: true,
      sidebarDepth: 3,
      children: [
        ['/en/docs/development/', 'Index']
      ]
    },
    {
      title: 'Release Notes',
      collapsable: true,
      sidebarDepth: 3,
      children: [
        ['/en/docs/whatsnew/', 'Release Notes']
      ]
    }
  ]
}