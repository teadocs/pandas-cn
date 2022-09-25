import sidebarDocsZh from './docs_zh';
import sidebarBlogZh from './blog_zh'
import sidebarDeepZh from './deep_zh'
import { SidebarConfig } from 'vuepress-theme-teadocs'

export const sidebarZh: SidebarConfig = {
    '/docs/': sidebarDocsZh,
    '/blog/': sidebarBlogZh,
    '/deep/': sidebarDeepZh,
}
