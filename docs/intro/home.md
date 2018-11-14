# Pandas：Python数据分析库

pandas是一个开源的，BSD许可的库，为Python编程语言提供高性能，易于使用的数据结构和数据分析工具。

pandas是NumFOCUS赞助的项目。这将有助于确保pandas成为世界级开源项目的成功，并有可能捐赠给该项目。

![NumFOCUS Logo](/static/images/SponsoredProjectStamp_300px.png)

## 版本 v0.23.4 (2018年8月3日)

这是0.23.x系列中的一个小错误修复版本，包括一些回归修复，错误修复和性能改进。 我们建议所有用户升级到此版本。

该版本可以使用conda-forge或默认频道的conda进行安装：

```sh
conda install pandas
```

或者通过 PyPI:

```sh
python3 -m pip install --upgrade pandas
```

请参阅 [历代特性](/document/whatsnew) 以获取所有更新日志。

## 版本 v0.23.0 (2018年5月15日)

这是0.22.0的主要版本，包括许多API更改，新功能，增强功能和性能改进以及大量错误修复。

亮点包括：

- Round-trippable JSON format with ‘table’ orient.
- 来自dicts的实例化遵循Python 3.6+的顺序。
- 用于赋值的依赖列参数。
- 对列和索引级别的组合进行合并/排序。
- 用自定义类型扩展Pandas。
- 在分组中不包括未观察的类别。

从我们的开发渠道(OSX-64版本、Linux64版本和Python 2.7版本的Win 64版本、Python3.5版本和Python3.6版本都可以使用Conda)可以安装候选版本：

```sh
conda install pandas
```

或 conda forge:

```sh
conda install -c conda-forge pandas
```

或者通过 PyPI:

```sh
python3 -m pip install --upgrade pandas==0.23.0
```

请参阅 [历代特性](/document/whatsnew) 以获取所有更新日志。

## 最好的安装方式

获得 pandas 的最佳方式是通过 [conda](http://pandas.pydata.org/pandas-docs/stable/install.html#installing-pandas-with-anaconda)

```sh
conda install pandas
```

在Windows、Linux和MacOS上，[所有受支持的python版本](http://pandas.pydata.org/pandas-docs/stable/install.html#python-version-support)都可以使用包。

pands 也被上传到[PyPI](https://pypi.org/project/pandas/)中，并且可以通过以下方式安装：

```sh
pip install pandas
```

## 快速了解

[Wes McKinney](https://vimeo.com/user10077863) 在 [Vimeo](https://vimeo.com/) 上的 [10分钟 pandas 之旅](https://vimeo.com/59324550) 视频教程

## pandas解决了什么问题？

Python在数据处理和准备方面一直做得很好，但在数据分析和建模方面就没那么好了。熊猫帮助填补了这一空白，使您能够在Python中执行整个数据分析工作流程，而不必切换到更特定于领域的语言，如R。

与出色的 [IPython](https://ipython.org/) 工具包和其他库相结合，Python中用于进行数据分析的环境在性能、生产率和协作能力方面都是卓越的。

pandas没有在线性和面板回归之外实现重要的建模功能; 为此，请查看 [statsmodels](http://statsmodels.sf.net/) 和[scikit-learn](http://scikit-learn.org/)。为了使Python成为一流的统计建模环境，仍然需要做更多的工作，但我们正朝着这个目标迈进。

## 我们的用户有什么要说的？

- **Roni Israelov**(博士，[AQR资本管理](https://www.aqr.com/)的组合投资经理)：pandas让我们更专注于研究而不是编程。我们发现 pandas 易于学习，易于使用且易于维护。最重要的是，它提高了我们的生产力。
    ![AQR资本管理 Logo](/static/images/aqr_capital_management_logo.png)
- **David Himrod**([appNexus](https://www.appnexus.com/)的优化分析总监)：pandas 是一种完美的工具，可以在快速迭代的特殊分析和产品质量代码之间架起一座桥梁。如果你想在一个由工程师、数学家和分析师组成的多学科组织中使用一种工具，那就别再看了。
    ![AppNexus Logo](/static/images/appnexus_logo.png)
- **Olivier Pomel**([Datadog](https://www.datadoghq.com/)的CEO)：我们使用pandas处理生产服务器上的时间序列数据。其API的简单性和优雅性以及高容量数据集的高性能使其成为我们的完美选择。
    ![Datadog Logo](/static/images/datadog_logo.png)

## Pandas库的亮点

- 一个快速、高效的DataFrame对象，用于数据操作和综合索引；
- 用于在内存数据结构和不同格式之间读写数据的工具：CSV和文本文件、Microsoft Excel、SQL数据库和快速HDF 5格式；
- 智能数据对齐和丢失数据的综合处理：在计算中获得基于标签的自动对齐，并轻松地将凌乱的数据操作为有序的形式；
- 数据集的灵活调整和旋转；
- 基于智能标签的切片、花哨的索引和大型数据集的子集；
- 可以从数据结构中插入和删除列，以实现大小可变；
- 通过引擎与强大的组聚合或转换数据，允许对数据集进行拆分-应用-组合操作；
- 数据集的高性能合并和连接；
- 层次轴索引提供了在低维数据结构中处理高维数据的直观方法；
- 时间序列-功能：日期范围生成和频率转换、移动窗口统计、移动窗口线性回归、日期转换和滞后。甚至在不丢失数据的情况下创建特定领域的时间偏移和加入时间序列；
- 对性能进行了高度优化，用Cython或C编写了关键代码路径。
- Python与Pandas在广泛的学术和商业领域中使用，包括金融，神经科学，经济学，统计学，广告，网络分析，等等。