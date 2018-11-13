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

Packages are available for [all supported python versions](http://pandas.pydata.org/pandas-docs/stable/install.html#python-version-support) on Windows, Linux, and MacOS.

Wheels are also uploaded to [PyPI](https://pypi.org/project/pandas/) and can be installed with

```sh
pip install pandas
```

## Quick vignette



10-minute tour of pandas from Wes McKinney on Vimeo.

## What problem does pandas solve?

Python has long been great for data munging and preparation, but less so for data analysis and modeling. pandas helps fill this gap, enabling you to carry out your entire data analysis workflow in Python without having to switch to a more domain specific language like R.

Combined with the excellent [IPython](https://ipython.org/) toolkit and other libraries, the environment for doing data analysis in Python excels in performance, productivity, and the ability to collaborate.

pandas does not implement significant modeling functionality outside of linear and panel regression; for this, look to [statsmodels](http://statsmodels.sf.net/) and [scikit-learn](http://scikit-learn.org/). More work is still needed to make Python a first class statistical modeling environment, but we are well on our way toward that goal.

## What do our users have to say?

AQR Capital Management Logo
Roni Israelov, PhD
Portfolio Manager
AQR Capital Management
“pandas allows us to focus more on research and less on programming. We have found pandas easy to learn, easy to use, and easy to maintain. The bottom line is that it has increased our productivity.”

AppNexus Logo
David Himrod
Director of Optimization & Analytics
AppNexus
“pandas is the perfect tool for bridging the gap between rapid iterations of ad-hoc analysis and production quality code. If you want one tool to be used across a multi-disciplined organization of engineers, mathematicians and analysts, look no further.”

Datadog Logo
Olivier Pomel
CEO
Datadog
“We use pandas to process time series data on our production servers. The simplicity and elegance of its API, and its high level of performance for high-volume datasets, made it a perfect choice for us.”

## Library Highlights

- A fast and efficient DataFrame object for data manipulation with integrated indexing;
- Tools for reading and writing data between in-memory data structures and different formats: CSV and text files, Microsoft Excel, SQL databases, and the fast HDF5 format;
- Intelligent data alignment and integrated handling of missing data: gain automatic label-based alignment in computations and easily manipulate messy data into an orderly form;
- Flexible reshaping and pivoting of data sets;
- Intelligent label-based slicing, fancy indexing, and subsetting of large data sets;
- Columns can be inserted and deleted from data structures for size mutability;
- Aggregating or transforming data with a powerful group by engine allowing split-apply-combine operations on data sets;
- High performance merging and joining of data sets;
- Hierarchical axis indexing provides an intuitive way of working with high-dimensional data in a lower-dimensional data structure;
- Time series-functionality: date range generation and frequency conversion, moving window statistics, moving window linear regressions, date shifting and lagging. Even create domain-specific time offsets and join time series without losing data;
- Highly optimized for performance, with critical code paths written in Cython or C.
- Python with pandas is in use in a wide variety of academic and commercial domains, including Finance, Neuroscience, Economics, Statistics, Advertising, Web Analytics, and more.