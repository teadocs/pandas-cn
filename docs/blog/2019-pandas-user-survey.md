---
sidebarDepth: 3
sidebar: auto
meta:
  - name: keywords
    content: Pandas用户调查
  - name: description
    content: Pandas 最近设计进行了一项用户调查，以帮助指导未来的发展。感谢所有参与的人！这篇文章介绍了浓缩后的结果。
---

# 2019年 Pandas 用户调查

**发布于：** 2019年8月22日星期四

**英文原文地址：** [https://dev.pandas.io/pandas-blog/2019-pandas-user-survey.html](https://dev.pandas.io/pandas-blog/2019-pandas-user-survey.html)

Pandas 最近设计进行了一项用户调查，以帮助指导未来的发展。感谢所有参与的人！这篇文章介绍了浓缩后的结果。

这个分析和原始数据可以在 [GitHub]((https://github.com/pandas-dev/pandas-user-surveys)) 上找到并在Binder上运行。

<a href="https://mybinder.org/v2/gh/pandas-dev/pandas-user-surveys/master?filepath=2019.ipynb"><img alt="Binder" src="https://mybinder.org/badge_logo.svg"></a>

在2019年夏天我们进行调查的15天内，我们收到了大约1250份回复。

## 关于受访者

在 Pandas 的经验和使用频率上都有相当数量的代表，尽管大多数受访者都是非常的有经验。

![png](https://dev.pandas.io/pandas-blog/images/2019_files/2019_4_0.png)

![png](https://dev.pandas.io/pandas-blog/images/2019_files/2019_5_0.png)

我们提了一些问题，这些问题也在Python开发者调查中提出，因此我们可以将[Pandas的用户数量](https://www.jetbrains.com/research/python-developers-survey-2018/)与Python的用户数量进行比较。

90%的受访者使用Python作为主要语言(相比之下，PSF调查的比例为84%)。

```
Yes    90.67%
No      9.33%
Name: Is Python your main language?, dtype: object
```

Windows 操作系统的用户很有代表性（请参阅 [Steve Dower关于此主题的讨论]((https://www.youtube.com/watch?v=uoI57uMdDD4))）。

```
Linux      61.57%
Windows    60.21%
MacOS      42.75%
Name: What Operating Systems do you use?, dtype: object
```

对于环境隔离层面的工具来说，[conda](https://conda.io/en/latest/)是最受欢迎的。

![png](https://dev.pandas.io/pandas-blog/images/2019_files/2019_13_0.png)

大多数受访者只用Python 3。

```
3        92.39%
2 & 3     6.80%
2         0.81%
Name: Python 2 or 3?, dtype: object
```

## Pandas APIs

开源项目很难知道实际使用的是哪些功能，所以我们问了几个问题才得到下面的统计结果。

CSV 和 Excel 无疑是（这里不讨论好坏）最流行的格式。

![png](https://dev.pandas.io/pandas-blog/images/2019_files/2019_18_0.png)

在可能的 Pandas 内部重构的准备中，我们想要了解 DataFrame 有多常见（100列或更多）。

![png](https://dev.pandas.io/pandas-blog/images/2019_files/2019_20_0.png)

Pandas 正在慢慢增加新的扩展类型。分类是最受欢迎的，可空的整数类型已经几乎和具有时区的日期时间功能一样的受欢迎。

![png](https://dev.pandas.io/pandas-blog/images/2019_files/2019_22_0.png)

更多更好的例子似乎是一个高度优先的发展计划。Pandas 最近获得了NumFOCUS拨款以改进我们的文档，我们用它来编写教程式文档，这应该有助于满足这一需求。

![png](https://dev.pandas.io/pandas-blog/images/2019_files/2019_24_0.png)

我们还询问了特定的常用功能。

![png](https://dev.pandas.io/pandas-blog/images/2019_files/2019_26_0.png)

其中最突出的是 “扩展” 到大型数据集。一些反馈：

1. 也许 Pandas 的文档中应该更好地体现出提供可扩展的 dataframes 的库（如[Dask](https://dask.org/)、[vaex](https://dask.org/) 和 [modin](https://modin.readthedocs.io/en/latest/)）。
1. 内存效率（可能来自原生字符串数据类型，较少的内部副本等），是一个值得实现的目标。

在那之后，下一个最关键的改进是整数缺失值。这些功能实际上在 [Pandas 0.24](https://pandas.pydata.org/pandas-docs/stable/whatsnew/v0.24.0.html#optional-integer-na-support) 中已经添加了，但它们不是默认值，并且仍然存在与 pandas API 的某些部分不太兼容性。

与 NumPy 相比，Pandas 是一个喜欢折腾的库。我们自从 1.0 以来，做了许多弃用和一些彻头彻尾的API突破性变更。幸运的是，大多数的用户都可以做出决策和权衡。

```
Yes    94.89%
No      5.11%
Name: Is Pandas stable enough for you?, dtype: object
```

有一种看法（很多 Pandas 维护者都这么认为）是认为熊猫 API 太大了。为了考量这一点，我们询问了用户是否认为 Pandas 的API太大、太小、还是恰到好处。

![png](https://dev.pandas.io/pandas-blog/images/2019_files/2019_31_0.png)

最后，我们要求给出对 Pandas 库的总体满意度，从 1（非常不满意）到 5（非常满意）打分。

![png](https://dev.pandas.io/pandas-blog/images/2019_files/2019_33_0.png)

大多数人都非常满意。平均回答是4.39。我期待随着时间的推移跟踪关注这些评分数字。

如果您正在分析原始数据，请务必将结果共享给我们 [@pandas_dev](https://twitter.com/pandas_dev)。
