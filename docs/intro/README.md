---
sidebarDepth: 3
sidebar: auto
meta:
  - name: keywords
    content: 数据分析库
  - name: description
    content: Pandas 是一个开源的，BSD许可的库，为Python编程语言提供高性能，易于使用的数据结构和数据分析工具。
---

# 一个Python的数据分析库

``Pandas``是一个开源的，BSD许可的库，为[Python](https://www.python.org/)编程语言提供高性能，易于使用的数据结构和数据分析工具。

``Pandas``是[NumFOCUS](https://www.numfocus.org/open-source-projects.html)赞助的项目。这将有助于确保Pandas成为世界级开源项目的成功，并有可能[捐赠](https://pandas.pydata.org/donate.html)给该项目。

![NumFOCUS Logo](/static/images/SponsoredProjectStamp_300px.png)

## v0.25.0 (发布于：2019年7月18日)

这是从0.24.2开始的主要版本，包括大量API更改、新功能、增强功能和性能改进以及大量错误修复。

亮点包括：

- 不再支持 Python 2.x
- [重新标记的Groupby聚合](https://pandas.pydata.org/pandas-docs/version/0.25/whatsnew/v0.25.0.html#groupby-aggregation-with-relabeling)
- [更好的多索引repr](https://pandas.pydata.org/pandas-docs/version/0.25/whatsnew/v0.25.0.html#better-repr-for-multiindex)
- [针对Series和DataFrame的更好的截断repr](https://pandas.pydata.org/pandas-docs/version/0.25/whatsnew/v0.25.0.html#shorter-truncated-repr-for-series-and-dataframe)
- [Series.explode将类似列表的值拆分为行MultiIndexes](https://pandas.pydata.org/pandas-docs/version/0.25/whatsnew/v0.25.0.html#series-explode-to-split-list-like-values-to-rows)

该版本可以使用conda-forge或默认频道的conda进行安装：

``` bash
$ conda install pandas
```

或者通过 PyPI:

``` bash
python3 -m pip install --upgrade pandas
```

请参阅 [v0.25.0版本特性](/docs/whatsnew/v0.25.0.html) 以获取全部更新情况。

## v0.24.2（发布于：2019年3月14日）

这是0.24.x系列中的一个小错误修复版本，包括一些回归修复，错误修复和性能改进。 我们建议所有用户升级到此版本。

该版本可以使用conda-forge或默认频道的conda进行安装：

``` bash
$ conda install Pandas
```

或者通过 PyPI:

``` bash
$ python3 -m pip install --upgrade Pandas
```

请参阅 [历代特性](https://pandas.pydata.org/pandas-docs/version/0.24.2/whatsnew/v0.24.2.html) 以获取所有更新日志。

## 最好的安装方式

获得 Pandas 的最佳方式是通过 [conda](http://Pandas.pydata.org/Pandas-docs/stable/install.html#installing-Pandas-with-anaconda)

``` bash
$ conda install Pandas
```

在Windows、Linux和MacOS上，[所有受支持的python版本](http://Pandas.pydata.org/Pandas-docs/stable/install.html#python-version-support)都可以使用包。

pands 也被上传到[PyPI](https://pypi.org/project/Pandas/)中，并且可以通过以下方式安装：

``` bash
$ pip install Pandas
```

## 快速了解

<iframe src="https://player.vimeo.com/video/59324550" style="margin-top: 20px;" width="500" height="309" frameborder="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen=""></iframe>

[Wes McKinney](https://vimeo.com/user10077863) 在 [Vimeo](https://vimeo.com/) 上的 [10分钟 Pandas 之旅](https://vimeo.com/59324550) 视频教程

## Pandas解决了什么问题？

Python在数据处理和准备方面一直做得很好，但在数据分析和建模方面就没那么好了。Pandas帮助填补了这一空白，使您能够在Python中执行整个数据分析工作流程，而不必切换到更特定于领域的语言，如R。

与出色的 [IPython](https://ipython.org/) 工具包和其他库相结合，Python中用于进行数据分析的环境在性能、生产率和协作能力方面都是卓越的。

Pandas没有在线性和面板回归之外实现重要的建模功能; 为此，请查看 [statsmodels](http://statsmodels.sf.net/) 和[scikit-learn](http://scikit-learn.org/)。为了使Python成为一流的统计建模环境，仍然需要做更多的工作，但我们正朝着这个目标迈进。

## 我们的用户有什么要说的？

- **Roni Israelov**(博士，[AQR资本管理](https://www.aqr.com/)的组合投资经理)：Pandas让我们更专注于研究而不是编程。我们发现 Pandas 易于学习，易于使用且易于维护。最重要的是，它提高了我们的生产力。
  - ![AQR资本管理 Logo](/static/images/aqr_capital_management_logo.png)
- **David Himrod**([appNexus](https://www.appnexus.com/)的优化分析总监)：Pandas 是一种完美的工具，可以在快速迭代的特殊分析和产品质量代码之间架起一座桥梁。如果你想在一个由工程师、数学家和分析师组成的多学科组织中使用一种工具，那就别再看了。
  - ![AppNexus Logo](/static/images/appnexus_logo.png)
- **Olivier Pomel**([Datadog](https://www.datadoghq.com/)的CEO)：我们使用Pandas处理生产服务器上的时间序列数据。其API的简单性和优雅性以及高容量数据集的高性能使其成为我们的完美选择。
  - ![Datadog Logo](/static/images/datadog_logo.png)

## Pandas库的亮点

- 一个快速、高效的**DataFrame**对象，用于数据操作和综合索引；
- 用于在内存数据结构和不同格式之间**读写数据**的工具：CSV和文本文件、Microsoft Excel、SQL数据库和快速HDF 5格式；
- 智能**数据对齐**和丢失数据的综合处理：在计算中获得基于标签的自动对齐，并轻松地将凌乱的数据操作为有序的形式；
- 数据集的**灵活调整**和旋转；
- 基于智能标签的**切片、花式索引**和大型数据集的**子集**；
- 可以从数据结构中插入和删除列，以实现**大小可变**；
- 通过在强大的引擎中**聚合**或转换数据，允许对数据集进行拆分应用组合操作;
- 数据集的高性能**合并和连接**；
- **层次轴索引**提供了在低维数据结构中处理高维数据的直观方法；
- **时间序列**-功能：日期范围生成和频率转换、移动窗口统计、移动窗口线性回归、日期转换和滞后。甚至在不丢失数据的情况下创建特定领域的时间偏移和加入时间序列；
- 对**性能进行了高度优化**，用Cython或C编写了关键代码路径。
- Python与Pandas在广泛的**学术和商业**领域中使用，包括金融，神经科学，经济学，统计学，广告，网络分析，等等。