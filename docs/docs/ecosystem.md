# Pandas 生态圈

越来越多的人在 Pandas的基础上构建包，以满足数据准备、分析和可视化方面的特定需求。这是令人激动的，因为这意味着 Pandas 不仅帮助用户处理他们的数据任务，而且它为开发人员提供了一个更好的起点，来构建功能强大和更有针对性的数据工具。创建扩充 Pandas 功能的类库也能让 Pandas 的发展保持围绕其初心不改的原则。

这是一个不会断更的项目列表，它们给予 Pandas 构建，以便在PyData空间中能不断的提供新的工具。有关依赖 Pandas 的项目列表，请参阅 [Pandas 的 libraries.io 用法页面](https://libraries.io/pypi/pandas/usage) 或 [在pypi中搜索 Pandas](https://pypi.org/search/?q=pandas)。

我们希望让用户更容易找到这些项目，如果您还知道您认为的应该在此列表中展示的其他不错的项目，请将它告诉我们。

## 统计和机器学习

### [Statsmodels](https://www.statsmodels.org/)

Statsmodels是着名的 Python“统计和计量经济学库”，它与Pandas长期有着的特殊关系。Statsmodels提供了超出Pandas能力范围的强大的统计数据功能，包括计量经济学，分析和建模等功能。Statsmodels利用Pandas对象作为计算的底层数据容器。

### [sklearn-pandas](https://github.com/paulgb/sklearn-pandas)

在 [scikit-learn](https://scikit-learn.org/) 机器学习中使用 pandas 的 DataFrames。

### [Featuretools](https://github.com/featuretools/featuretools/)

Featuretools是一个基于 pandas 的自动功能工程的Python库。它擅长使用可重用的特征工程“基元”将时间和关系数据集转换为用于机器学习的特征矩阵。用户可以使用Python贡献自己的原语，并与社区的其他人共享。

## 可视化

### [Altair](https://altair-viz.github.io/)

Altair是用于Python的声明性统计可视化库。 使用 Altair，您可以花费更多时间来理解数据及其含义。 Altair的API简单，友好且一致，并以强大的Vega-Lite JSON规范为基础。 这种优雅的简单性用最少的代码即可产生美观，有效的可视化效果。 Altair可与Pandas DataFrames配合使用。

### [Bokeh](https://bokeh.pydata.org/)

Bokeh是一个Python交互式可视化库，用于大型数据集，其本机使用最新的Web技术。 它的目标是以Protovis / D3的样式提供优雅，简洁的新颖图形构造，同时为瘦客户端提供大数据上的高性能交互性。

### [seaborn](https://seaborn.pydata.org/)

Seaborn 是基于 [matplotlib](https://matplotlib.org/) 的Python可视化库。它提供了一个高级的，面向数据集的界面，用于创建吸引人的统计图形。seaborn中的绘图功能可了解熊猫对象，并在内部利用熊猫分组操作来支持复杂可视化的简洁规范。Seaborn 深圳还超越了matplotlib 和 pandas，可以在绘制图表时进行统计估计，汇总观察结果并可视化统计模型的拟合以强调数据集中的模式。

### [yhat/ggpy](https://github.com/yhat/ggpy)

Hadley Wickham的 [ggplot2](https://ggplot2.tidyverse.org/) 是R语言的基础探索性可视化包。它以“[图形语法]((https://www.cs.uic.edu/~wilkinson/TheGrammarOfGraphics/GOG.html))”为基础，提供了一种强大的、说明性的、极其通用的方式来生成任何类型数据的定制绘图。这真是太不可思议了。其他语言的各种实现都是可用的，但是对于Python用户来说，一直缺少一个忠实的实现。尽管还很年轻(截至2014年1月)，[yhat/ggpy](https://github.com/yhat/ggpy) 项目在这个方向上进展很快。

### [IPython Vega](https://github.com/vega/ipyvega)

[IPython Vega](https://github.com/vega/ipyvega) 利用 [Vega](https://github.com/trifacta/vega) 在Jupyter Notebook中创建图形。

### [Plotly](https://plot.ly/python)

[Plotly’s](https://plot.ly/) 的  [Python API](https://plot.ly/python/) 支持交互式图形和网络共享。地图、2D、3D和实况流图是使用WebGL和D3.js渲染的。该库支持直接从 pandas 的 DataFrame打印和基于云的协作。[matplotlib、Python的gglot和Seborn](https://plot.ly/python/matplotlib-to-plotly-tutorial/) 的用户可以将图形转换为基于Web的交互式绘图。绘图可以在 [IPython Notebooks](https://plot.ly/ipython-notebooks/) 本中绘制，可以使用R或MATLAB编辑，可以在GUI中修改，也可以嵌入到应用程序和仪表板中。Ploly是免费的，可以无限制地共享，并且有[云](https://plot.ly/product/plans/)、[离线](https://plot.ly/python/offline/)或[内部](https://plot.ly/product/enterprise/)帐户供私人使用。

### [QtPandas](https://github.com/draperjames/qtpandas)

[qtpandas](https://github.com/draperjames/qtpandas) 库是从主Pandas库派生出来的，它支持在PyQt4和PySide应用程序中实现DataFrame可视化和操作。

## IDE

### [IPython](https://ipython.org/documentation.html)

IPython is an interactive command shell and distributed computing environment. IPython tab completion works with Pandas methods and also attributes like DataFrame columns.

### [Jupyter Notebook / Jupyter Lab](https://jupyter.org/)

Jupyter Notebook is a web application for creating Jupyter notebooks. A Jupyter notebook is a JSON document containing an ordered list of input/output cells which can contain code, text, mathematics, plots and rich media. Jupyter notebooks can be converted to a number of open standard output formats (HTML, HTML presentation slides, LaTeX, PDF, ReStructuredText, Markdown, Python) through ‘Download As’ in the web interface and ``jupyter convert`` in a shell.

Pandas DataFrames implement ``_repr_html_``and ``_repr_latex`` methods which are utilized by Jupyter Notebook for displaying (abbreviated) HTML or LaTeX tables. LaTeX output is properly escaped. (Note: HTML tables may or may not be compatible with non-HTML Jupyter output formats.)

See [Options and Settings](https://pandas.pydata.org/pandas-docs/stable/user_guide/options.html#options) and [Available Options](https://pandas.pydata.org/pandas-docs/stable/user_guide/options.html#options-available) for pandas ``display``. settings.

### [quantopian/qgrid](https://github.com/quantopian/qgrid)

qgrid is “an interactive grid for sorting and filtering DataFrames in IPython Notebook” built with SlickGrid.

### [Spyder](https://www.spyder-ide.org/)

Spyder is a cross-platform PyQt-based IDE combining the editing, analysis, debugging and profiling functionality of a software development tool with the data exploration, interactive execution, deep inspection and rich visualization capabilities of a scientific environment like MATLAB or Rstudio.

Its [Variable Explorer](https://docs.spyder-ide.org/variableexplorer.html) allows users to view, manipulate and edit pandas ``Index``, ``Series``, and ``DataFrame`` objects like a “spreadsheet”, including copying and modifying values, sorting, displaying a “heatmap”, converting data types and more. Pandas objects can also be renamed, duplicated, new columns added, copyed/pasted to/from the clipboard (as TSV), and saved/loaded to/from a file. Spyder can also import data from a variety of plain text and binary files or the clipboard into a new pandas DataFrame via a sophisticated import wizard.

Most pandas classes, methods and data attributes can be autocompleted in Spyder’s [Editor](https://docs.spyder-ide.org/editor.html) and [IPython Console](https://docs.spyder-ide.org/ipythonconsole.html), and Spyder’s [Help pane](https://docs.spyder-ide.org/help.html) can retrieve and render Numpydoc documentation on pandas objects in rich text with Sphinx both automatically and on-demand.

## API

### [pandas-datareader](https://github.com/pydata/pandas-datareader)

``pandas-datareader`` is a remote data access library for pandas (PyPI:``pandas-datareader``). It is based on functionality that was located in ``pandas.io.data`` and ``pandas.io.wb`` but was split off in v0.19. See more in the [pandas-datareader docs](https://pandas-datareader.readthedocs.io/en/latest/):

The following data feeds are available:

- Google Finance
- Tiingo
- Morningstar
- IEX
- Robinhood
- Enigma
- Quandl
- FRED
- Fama/French
- World Bank
- OECD
- Eurostat
- TSP Fund Data
- Nasdaq Trader Symbol Definitions
- Stooq Index Data
- MOEX Data

### [quandl/Python](https://github.com/quandl/Python)

Quandl API for Python wraps the Quandl REST API to return Pandas DataFrames with timeseries indexes.

### [pydatastream](https://github.com/vfilimonov/pydatastream)

PyDatastream is a Python interface to the [Thomson Dataworks Enterprise (DWE/Datastream)](http://dataworks.thomson.com/Dataworks/Enterprise/1.0/) SOAP API to return indexed Pandas DataFrames or Panels with financial data. This package requires valid credentials for this API (non free).

### [pandaSDMX](https://pandasdmx.readthedocs.io/)

pandaSDMX is a library to retrieve and acquire statistical data and metadata disseminated in [SDMX](https://www.sdmx.org/) 2.1, an ISO-standard widely used by institutions such as statistics offices, central banks, and international organisations. pandaSDMX can expose datasets and related structural metadata including data flows, code-lists, and data structure definitions as pandas Series or MultiIndexed DataFrames.

### [fredapi](https://github.com/mortada/fredapi)

fredapi is a Python interface to the [Federal Reserve Economic Data (FRED)](https://fred.stlouisfed.org/) provided by the Federal Reserve Bank of St. Louis. It works with both the FRED database and ALFRED database that contains point-in-time data (i.e. historic data revisions). fredapi provides a wrapper in Python to the FRED HTTP API, and also provides several convenient methods for parsing and analyzing point-in-time data from ALFRED. fredapi makes use of pandas and returns data in a Series or DataFrame. This module requires a FRED API key that you can obtain for free on the FRED website.

## Domain Specific

### [Geopandas](https://github.com/kjordahl/geopandas)

Geopandas extends pandas data objects to include geographic information which support geometric operations. If your work entails maps and geographical coordinates, and you love pandas, you should take a close look at Geopandas.

### [xarray](https://github.com/pydata/xarray)

xarray brings the labeled data power of pandas to the physical sciences by providing N-dimensional variants of the core pandas data structures. It aims to provide a pandas-like and pandas-compatible toolkit for analytics on multi- dimensional arrays, rather than the tabular data for which pandas excels.

## Out-of-core

### [Blaze](http://blaze.pydata.org/)

Blaze provides a standard API for doing computations with various in-memory and on-disk backends: NumPy, Pandas, SQLAlchemy, MongoDB, PyTables, PySpark.

### [Dask](https://dask.readthedocs.io/en/latest/)

Dask is a flexible parallel computing library for analytics. Dask provides a familiar ``DataFrame`` interface for out-of-core, parallel and distributed computing.

### [Dask-ML](https://dask-ml.readthedocs.io/en/latest/)

Dask-ML enables parallel and distributed machine learning using Dask alongside existing machine learning libraries like Scikit-Learn, XGBoost, and TensorFlow.

### [Odo](http://odo.pydata.org/)

Odo provides a uniform API for moving data between different formats. It uses pandas own ``read_csv`` for CSV IO and leverages many existing packages such as PyTables, h5py, and pymongo to move data between non pandas formats. Its graph based approach is also extensible by end users for custom formats that may be too specific for the core of odo.

### [Ray](https://ray.readthedocs.io/en/latest/pandas_on_ray.html)

Pandas on Ray is an early stage DataFrame library that wraps Pandas and transparently distributes the data and computation. The user does not need to know how many cores their system has, nor do they need to specify how to distribute the data. In fact, users can continue using their previous Pandas notebooks while experiencing a considerable speedup from Pandas on Ray, even on a single machine. Only a modification of the import statement is needed, as we demonstrate below. Once you’ve changed your import statement, you’re ready to use Pandas on Ray just like you would Pandas.

``` python
# import pandas as pd
import ray.dataframe as pd
```

### [Vaex](https://docs.vaex.io/)

Increasingly, packages are being built on top of pandas to address specific needs in data preparation, analysis and visualization. Vaex is a python library for Out-of-Core DataFrames (similar to Pandas), to visualize and explore big tabular datasets. It can calculate statistics such as mean, sum, count, standard deviation etc, on an N-dimensional grid up to a billion (109) objects/rows per second. Visualization is done using histograms, density plots and 3d volume rendering, allowing interactive exploration of big data. Vaex uses memory mapping, zero memory copy policy and lazy computations for best performance (no memory wasted).

- vaex.from_pandas
- vaex.to_pandas_df

## Data validation

### [Engarde](https://engarde.readthedocs.io/en/latest/)

Engarde is a lightweight library used to explicitly state your assumptions about your datasets and check that they’re ``actually`` true.

## Extension Data Types

Pandas provides an interface for defining [extension types](https://pandas.pydata.org/pandas-docs/stable/development/extending.html#extending-extension-types) to extend NumPy’s type system. The following libraries implement that interface to provide types not found in NumPy or pandas, which work well with pandas’ data containers.

### [cyberpandas](https://cyberpandas.readthedocs.io/en/latest)

Cyberpandas provides an extension type for storing arrays of IP Addresses. These arrays can be stored inside pandas’ Series and DataFrame.

## Accessors

A directory of projects providing [extension accessors](https://pandas.pydata.org/pandas-docs/stable/development/extending.html#extending-register-accessors). This is for users to discover new accessors and for library authors to coordinate on the namespace.

Library | Accessor | Classes
---|---|---
[cyberpandas](https://cyberpandas.readthedocs.io/en/latest) | ip | Series
[pdvega](https://jakevdp.github.io/pdvega/) | vgplot | Series, DataFrame
