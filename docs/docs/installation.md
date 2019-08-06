# 安装

安装Pandas的最简单方法是将其安装为[Anaconda](http://docs.continuum.io/anaconda/)发行版的一部分，这是一种用于数据分析和科学计算的跨平台发行版。这是大多数用户的推荐安装方法。

还提供了从源，[PyPI](https://pypi.org/project/Pandas)，[ActivePython](https://www.activestate.com/activepython/downloads)，各种Linux发行版或[开发版本](http://github.com/Pandas-dev/Pandas)进行安装的说明。

## 计划移除对Python 2.7的支持

Python核心团队计划在2020年1月1日停止支持Python 2.7。按照NumPy的计划，2018年12月31日之前的所有Pandas版本都仍支持Python 2（译者注：之后的版本将不再支持）。

**2018年12月31日**之前的最终版本将是支持Python 2的最后一个版本。已发布的软件包将继续在PyPI和conda上提供。

  - 从 **2019年1月1日** 开始，所有版本都只支持Python 3。

如果有人对2018年12月31日之后对Python 2.7的持续支持感兴趣（反向移植错误修正或资金支持），请联系问题跟踪器上的维护人员。

有关更多信息，请参见 [Python 3 语法](http://python3statement.org/) 和 [移植到Python 3指南](https://docs.python.org/3/howto/pyporting.html)。

## Python版本支持

正式的 Python 2.7、3.5、3.6和3.7 版本。

## 安装 Pandas

### 通过Anaconda安装

对于没有经验的新手朋友来说，安装Pandas以及其余的[NumPy](http://www.numpy.org.cn/)和[SciPy](http://www.scipy.org/)等工具包可能会有点困难。

最简单的方法不是直接安装Pandas，而是安装Python和构成SciPy数据科学技术栈的最流行的工具包（[IPython](http://ipython.org/)，[NumPy](http://www.numpy.org.cn/)，[Matplotlib](http://matplotlib.org/)，...）的集合[Anaconda](http://docs.continuum.io/anaconda/)，它是一个跨平台（Linux，Mac OS X，Windows）的Python发行版，用于数据分析和科学计算。

在运行安装程序之后，用户将可以访问Pandas和[SciPy](http://www.scipy.org/)工具包的任何工具，而不需要安装任何其他东西，也不需要等待任何软件编译，非常的方便。

可以在[此处](http://docs.continuum.io/anaconda/)找到[Anaconda](http://docs.continuum.io/anaconda/)的安装说明。

可以在[这里](http://docs.continuum.io/anaconda/pkg-docs.html)找到作为[Anaconda](http://docs.continuum.io/anaconda/)发行版一部分的可用软件包的完整列表。

安装Anaconda的另一个优点是安装它不需要管理员权限。Anaconda可以安装在用户的主目录中，如果您决定删除Anaconda（只需删除该文件夹就可以），这就非常方便了。

### 通过Miniconda安装

上一节概述了如何安装Pandas作为[Anaconda](http://docs.continuum.io/anaconda/) 发行版的一部分。但是，这种方法意味着您将安装超过一百个包，并涉及下载几百兆字节的安装程序。

如果您只想要安装你需要的包，或者具有有限的互联网带宽，那么使用[Miniconda](http://conda.pydata.org/miniconda.html)安装Pandas可能是更好的解决方案。

[Conda](http://conda.pydata.org/docs/)是[Anaconda](http://docs.continuum.io/anaconda/)发行版所基于的软件包管理器。它是一个跨平台的且和语言无关的包管理器（它可以起到与pip和virtualenv组合类似的作用）。

[Miniconda](http://conda.pydata.org/miniconda.html)允许您创建最小的Python安装包，然后使用[Conda](http://conda.pydata.org/docs/)命令安装其他软件包。

首先你需要安装[Conda](http://conda.pydata.org/docs/)，下载并运行[Miniconda](http://conda.pydata.org/miniconda.html)会帮你做这件事。安装程序可以在[这里](http://conda.pydata.org/miniconda.html)找到。

下一步是创建一个新的conda环境。conda环境就像一个virtualenv，它允许您指定特定版本的Python和你需要的第三方库。从终端窗口运行以下命令：

``` bash
$ conda create -n name_of_my_env python
```

这将创建一个只安装了Python的最小环境。把你自己放在这个环境中（激活环境）：

``` bash
$ source activate name_of_my_env
```

在Windows上，命令是：

``` bash
$ activate name_of_my_env
```

最后一步是安装Pandas，可以使用以下命令完成：

``` bash
$ conda install Pandas
```

要安装特定的Pandas版本：

``` bash
$ conda install Pandas=0.20.3
```

要安装其他软件包，例如IPython：

``` bash
$ conda install ipython
```

要安装完整的Anaconda发行版：

``` bash
$ conda install anaconda
```

如果您需要可用于pip而不是conda的软件包，请安装pip，然后使用pip安装这些软件包：

``` bash
$ conda install pip
$ pip install django
```

### 从PyPI安装

Pandas可以通过[PyPI](https://pypi.org/project/Pandas).的pip安装。

``` bash
$ pip install Pandas
```

### 通过ActivePython安装

可以在[此处](https://www.activestate.com/activepython/downloads)找到[ActivePython](https://www.activestate.com/activepython)的安装说明。 版本2.7和3.5 包含了 pandas。

### 使用Linux发行版的包管理器进行安装。

此表中的命令将从您的发行版安装Python 3版本的Pandas。要安装Python 2版本的Pandas，您可能需要使用 ``python-Pandas`` 包。

发行版名称 | 状态 | 下载 / 仓库地址 | 安装方法
---|---|---|---
Debian | stable | [official Debian repository](http://packages.debian.org/search?keywords=Pandas&searchon=names&suite=all&section=all) | sudo apt-get install | python3-Pandas
Debian & Ubuntu | unstable (latest packages) | [NeuroDebian](http://neuro.debian.net/index.html#how-to-use-this-repository) |  | sudo apt-get install python3-Pandas
Ubuntu | stable | [official Ubuntu repository](http://packages.ubuntu.com/search?keywords=Pandas&searchon=names&suite=all&section=all) | sudo apt-get install python3-Pandas
OpenSuse | stable | [OpenSuse Repository](http://software.opensuse.org/package/python-Pandas?search_term=Pandas) | zypper in python3-Pandas
Fedora | stable | [official Fedora repository](https://admin.fedoraproject.org/pkgdb/package/rpms/python-Pandas/) | dnf install python3-Pandas
Centos/RHEL | stable | [EPEL repository](https://admin.fedoraproject.org/pkgdb/package/rpms/python-Pandas/) | yum install python3-Pandas

**However**，Linux的包管理器中的包通常落后几个版本，因此要获得最新版本的Pandas，建议使用上面描述的``pip``或``conda``方法进行安装。

### 从源码安装

有关从git源代码树构建的完整说明，请参阅[贡献指南](http://Pandas.pydata.org/Pandas-docs/stable/contributing.html#contributing)。此外，如果您希望创建一个pandas开发环境，请参阅[创建开发环境](http://Pandas.pydata.org/Pandas-docs/stable/contributing.html#contributing-dev-env)。

## 运行测试套件

大熊猫配备了一套详尽的单元测试，涵盖了撰写本文时约97％的代码库。要在您的计算机上运行它以验证一切正常（并且您已经安装了所有依赖项，软的和硬的），请确保您有 [pytest](http://docs.pytest.org/en/latest/) > = 4.0.2 和 [Hypothesis](https://hypothesis.readthedocs.io/) > = 3.58，然后运行：

``` python
>>> import Pandas as pd
>>> pd.test()
running: pytest --skip-slow --skip-network C:\Users\TP\Anaconda3\envs\py36\lib\site-packages\Pandas
============================= test session starts =============================
platform win32 -- Python 3.6.2, pytest-3.2.1, py-1.4.34, pluggy-0.4.0
rootdir: C:\Users\TP\Documents\Python\Pandasdev\Pandas, inifile: setup.cfg
collected 12145 items / 3 skipped
..................................................................S......
........S................................................................
.........................................................................

==================== 12130 passed, 12 skipped in 368.339 seconds =====================
```

## 依赖


Package | 最低支持版本
---|---
[setuptools](https://setuptools.readthedocs.io/en/latest/) | 24.2.0
[NumPy](http://www.numpy.org.cn/) | 1.13.3
[python-dateutil](http://https//dateutil.readthedocs.io/en/stable/) | 2.6.1
[pytz](http://pytz.sourceforge.net/) | 2017.2

### 推荐的依赖关系

- [numexpr](https://github.com/pydata/numexpr): 用于加速某些数值运算。``numexpr``使用多个内核以及智能分块和缓存来实现大型加速。如果已安装，则必须为2.6.2或更高版本。
- [bottleneck](https://github.com/kwgoodman/bottleneck): 加速某些类型的 ``nan`` 评估。 ``bottleneck`` 使用专门的cython例程来实现大的加速。 如果已安装，则必须为1.2.1或更高版本。

::: tip 注意

强烈建议您安装这些库，因为它们可以提高处理速度，尤其是在处理大型数据集时。

:::

### 可选的依赖项

Pandas有许多可选的依赖项，仅用于特定的方法。 例如，[pandas.read_hdf()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.read_hdf.html#pandas.read_hdf) 需要``pytables``包。 如果未安装可选依赖项，则在调用需要该依赖项的方法时，pandas将引发``ImportError``。

依赖名称 | 最低版本 | 注意
---|---|---
BeautifulSoup4 | 4.6.0 | HTML parser for read_html (see note)
Jinja2 |   | Conditional formatting with DataFrame.style
PyQt4 |   | Clipboard I/O
PyQt5 |   | Clipboard I/O
PyTables | 3.4.2 | HDF5-based reading / writing
SQLAlchemy | 1.1.4 | SQL support for databases other than sqlite
SciPy | 0.19.0 | Miscellaneous statistical functions
XLsxWriter | 0.9.8 | Excel writing
blosc |   | Compression for msgpack
fastparquet | 0.2.1 | Parquet reading / writing
gcsfs | 0.2.2 | Google Cloud Storage access
html5lib |   | HTML parser for read_html (see note)
lxml | 3.8.0 | HTML parser for read_html (see note)
matplotlib | 2.2.2 | Visualization
openpyxl | 2.4.8 | Reading / writing for xlsx files
pandas-gbq | 0.8.0 | Google Big Query access
psycopg2 |   | PostgreSQL engine for sqlalchemy
pyarrow | 0.9.0 | Parquet and feather reading / writing
pymysql | 0.7.11 | MySQL engine for sqlalchemy
pyreadstat |   | SPSS files (.sav) reading
pytables | 3.4.2 | HDF5 reading / writing
qtpy |   | Clipboard I/O
s3fs | 0.0.8 | Amazon S3 access
xarray | 0.8.2 | pandas-like API for N-dimensional data
xclip |   | Clipboard I/O on linux
xlrd | 1.1.0 | Excel reading
xlwt | 1.2.0 | Excel writing
xsel |   | Clipboard I/O on linux
zlib |   | Compression for msgpack

#### 用于解析HTML的可选依赖项

要使用顶级[read_html()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.read_html.html#pandas.read_html)函数，需要以下一种库组合：

*Changed in version 0.23.0*.

- [BeautifulSoup4](http://www.crummy.com/software/BeautifulSoup) 和 [html5lib](https://github.com/html5lib/html5lib-python)
- [BeautifulSoup4](http://www.crummy.com/software/BeautifulSoup) 和 [lxml](http://lxml.de/)
- [BeautifulSoup4](http://www.crummy.com/software/BeautifulSoup) 和 [html5lib](https://github.com/html5lib/html5lib-python) 和 [lxml](http://lxml.de/)
- 只有 [lxml](http://lxml.de/)，请参阅[HTML表解析](https://pandas.pydata.org/pandas-docs/stable/user_guide/io.html#io-html-gotchas)，以了解为什么您可能**不**应该采用这种方法。

::: danger 警告

- 如果您安装[BeautifulSoup4](http://www.crummy.com/software/BeautifulSoup)，您必须安装[lxml](http://lxml.de/)或[html5lib](https://github.com/html5lib/html5lib-python)或两个都安装。[``read_html()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.read_html.html#pandas.read_html) 不能*只*安装 [BeautifulSoup4](http://www.crummy.com/software/BeautifulSoup)。
- 我们强烈建议您阅读 [HTML表解析之坑](https://pandas.pydata.org/pandas-docs/stable/user_guide/io.html#io-html-gotchas)。 它解释了有关上述三个库的安装和使用的问题。

:::
