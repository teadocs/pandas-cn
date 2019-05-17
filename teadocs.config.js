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
        <meta name="description" content="这里是pandas的官方中文文档，本文档100%翻译覆盖所有的包括API、教程、下载、安装、进阶等所有的知识点，pandas是一个开源的，BSD许可的库，为Python编程语言提供高性能，易于使用的数据结构和数据分析工具。" />
        <meta name="keywords" content="pandas中文文档,pandas中文api,pandas中文手册,pandas教程,pandas下载安装,pandas" />
        <link rel="shortcut icon" href="/static/favicon.ico"/>
        `,
        footHtml: `
        <script>
        var _hmt = _hmt || [];
        (function() {
          var hm = document.createElement("script");
          hm.src = "https://hm.baidu.com/hm.js?198a327b7394c4873952b3dc378df8c0";
          var s = document.getElementsByTagName("script")[0]; 
          s.parentNode.insertBefore(hm, s);
        })();
        </script>
        <script>
            var comments = window.document.createElement("div");
            comments.style.maxWidth = "900px";
            comments.style.backgroundColor = "#fff";
            comments.style.padding = "20px";
            comments.style.boxSizing = "border-box";
            comments.id = "comments";
            document.querySelector(".tea-container").appendChild(comments);
        </script>
        <script>
        (function() {
            var ipc = window.document.createElement("div");
            ipc.id = "ipcBox";
            ipc.style.fontSize = "12px";
            ipc.style.maxWidth = "900px";
            ipc.style.padding = "20px";  
            ipc.style.boxSizing = "border-box";
            ipc.style.margin = "0px";
            ipc.style.textAlign = "center";
            ipc.style.backgroundColor = "#fff";
            ipc.innerHTML = "<span style='color: #bdbdbd;'>@2018 pypandas.cn </span><a style='color: #bdbdbd;' href='http://www.beian.miit.gov.cn/' target='_blank'>粤ICP备16025085号-8</a>"
            document.querySelector(".tea-container").appendChild(ipc);
        })();
        </script>
        <script>
            var script = document.createElement("script");
            script.src = "https://code.tellto.cn/dist/js/init.min.js";
            script.setAttribute('data-el', '#comments');
            document.body.appendChild(script); 
        </script>        
        `,
        isMinify: true, 
        rootPath: "/"
    },
    nav: {
        tree: "./tree"
    }
}