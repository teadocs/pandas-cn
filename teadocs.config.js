'use strict';
const path = require('path');

module.exports = {
    doc: {
        name: "Pandas 中文文档",
        description: "pandas是一个开源的，BSD许可的库，为Python编程语言提供高性能，易于使用的数据结构和数据分析工具。",
        version: "0.23.4",
        dir: "",
        outDir: "",
        staticDir: ""
    },
    theme: {
        dir: "", 
        title: "Pandas官方中文文档",
        headHtml: `
        <meta name="description" content="pandas是一个开源的，BSD许可的库，为Python编程语言提供高性能，易于使用的数据结构和数据分析工具。" />
        <meta name="keywords" content="pandas中文文档,pandas中文api,pandas中文手册,pandas教程,pandas下载安装,pandas" />
        <link rel="shortcut icon" href="/static/favicon.ico"/>
        `,
        footHtml: `
        `,
        isMinify: true, 
        rootPath: "/"
    },
    nav: {
        tree: "./tree"
    }
}