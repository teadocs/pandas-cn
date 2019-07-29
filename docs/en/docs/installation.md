# Installation

安装Pandas最简单的方法是直接安装[Anaconda](http://docs.continuum.io/anaconda/)发行版。Anaconda是一个用于数据分析和科学计算的跨平台Python发行版本，其中包含了Pandas库等众多科学计算库。这是大多数用户的推荐安装方法。

当然，文档也提供了从源码、[PyPI](https://pypi.org/project/Pandas)、[ActivePython](https://www.activestate.com/activepython/downloads)、各种Linux发行版或[开发版本](http://github.com/Pandas-dev/Pandas)进行安装的说明。

## 不再支持python2.7

Python核心团队计划在2020年1月1日停止对Python2.7的维护。根据NumPy的计划表，在2018年12月31号前，Pandas的所有发行版都支持Python2。

**2018年12月31**日之前的最终版本将是支持Python2的最后一个版本。已发布的Pandas将继续在PyPI和conda上提供下载。

从**2019年1月1日**起，所有的发行版均**只**支持Python3。

如果有人在2018年12月31日之后仍对Python2.7的支持感兴趣（修复错误或提供资金），请联系问题跟踪器上的维护人员。

更多相关信息，请参阅[Python3声明](http://python3statement.org/)和[Python3移植指南](https://docs.python.org/3/howto/pyporting.html)。

## 支持的Python版本

官方的Python 2.7，3.5，3.6，和 3.7。

## 安装Pandas

### 使用Anaconda进行安装

对于没有经验的用户来说，安装Pandas以及其它的[NumPy](http://www.numpy.org.cn/)和[SciPy](http://www.scipy.org/)库可能会有点困难。

最简单的安装Pandas和SciPy所需的依赖包([IPython](http://ipython.org/), [NumPy](http://www.numpy.org.cn/), [Matplotlib](http://matplotlib.org/), …)方法是使用[Anaconda](http://docs.continuum.io/anaconda/)，它一个跨平台的(Linux, Mac OS X, Windows)用于数据分析和科学计算的Python发行版。

运行Anconda的安装程序后，用户可以访问Pandas和SciPy的所有部分，而无需安装任何其他内容，也无需等待任何软件编译。

可以在[此处](http://docs.continuum.io/anaconda/)找到[Anaconda](http://docs.continuum.io/anaconda/)的安装说明。

可以在[此处](http://docs.continuum.io/anaconda/pkg-docs.html)找到[Anaconda](http://docs.continuum.io/anaconda/)发行版提供的所有库的列表。

安装Anaconda的另一个好处是您不需要管理员权限来安装。Anaconda可以安装在用户的主目录中，这意味着删除Anaconda的文件夹是无足轻重的（除了删除通过Anaconda安装的python环境和库，不会造成额外的影响）。

### 使用Miniconda进行安装

上一节概述了如何将Pandas作为[Anaconda](http://docs.continuum.io/anaconda/)发行版的一部分来安装。但是，使用Anaconda意味着您将安装上百个库，并且需要下载几百MB的安装程序。

如果您想要更自由地选择安装哪些库，或者您只有有限的网络带宽，那么使用[Miniconda](http://conda.pydata.org/miniconda.html)来安装Pandas可能是更好的解决方案。

Anaconda发行版是使用Conda来实现Python库管理的，Conda是一个跨平台的且语言无关的库管理器（它可以起到与pip+virtualenv类似的作用）。

[Miniconda](http://conda.pydata.org/miniconda.html)是一个只包含Python和Conda的Mini版本，安装之后可以使用Conda命令安装其他库。

首先您需要下载并安装[Miniconda](http://conda.pydata.org/miniconda.html)以使用 [Conda](http://conda.pydata.org/docs/)命令，下载请点击[此处](http://conda.pydata.org/miniconda.html)。

接下来需要创建一个conda虚拟环境。使用conda创建的虚拟环境和使用virtualenv创建的虚拟环境是类似的，它允许您指定特定的Python版本和安装一系列的Python库。在终端窗口中运行以下命令创建一个虚拟环境：

``` bash
$ conda create -n name_of_my_env python
```

这行命令将会创建一个只包含Python的最小环境，进入这个环境请运行以下命令：

``` bash
$ source activate name_of_my_env
```

Windows用户请运行：

``` bash
$ activate name_of_my_env
```

最后一步是安装Pandas，请使用以下命令：

``` bash
$ conda install Pandas
```

安装指定版本的Pandas：

``` bash
$ conda install Pandas=0.20.3
```

安装其他库，例如IPython：

``` bash
$ conda install ipython
```

安装完整的Anaconda发行版：

``` bash
$ conda install anaconda
```

如果你想要通过pip而不是conda来安装库，先安装pip，再通过pip来安装这些库：

``` bash
$ conda install pip
$ pip install django
```

### 从PyPI安装

Pandas也可以使用pip从[PyPI](https://pypi.org/project/Pandas)上安装.

``` bash
$ pip install Pandas
```

### 使用ActivePython进行安装

可以在[此处](https://www.activestate.com/activepython/downloads)找到[ActivePython](https://www.activestate.com/activepython)的安装说明。版本2.7和3.5包括中包含了Pandas。

### 使用Linux发行版的软件包管理器进行安装

此表中的命令将根据您的Linux发行版本安装Pandas for Python 3。要安装Pandas for Python 2，您可能需要使用python-Pandas包。

版本 | 状态 | 下载 / 软件库链接 | 安装方法
---|---|---|---
Debian | 稳定 | [official Debian repository](http://packages.debian.org/search?keywords=Pandas&searchon=names&suite=all&section=all) | sudo apt-get install | python3-Pandas
Debian & Ubuntu | 不稳定 (最新版) | [NeuroDebian](http://neuro.debian.net/index.html#how-to-use-this-repository)   | sudo apt-get install python3-Pandas
Ubuntu | 稳定 | [official Ubuntu repository](http://packages.ubuntu.com/search?keywords=Pandas&searchon=names&suite=all&section=all) | sudo apt-get install python3-Pandas
OpenSuse | 稳定 | [OpenSuse Repository](http://software.opensuse.org/package/python-Pandas?search_term=Pandas) | zypper in python3-Pandas
Fedora | 稳定 | [official Fedora repository](https://admin.fedoraproject.org/pkgdb/package/rpms/python-Pandas/) | dnf install python3-Pandas
Centos/RHEL | 稳定 | [EPEL repository](https://admin.fedoraproject.org/pkgdb/package/rpms/python-Pandas/) | yum install python3-Pandas

**但是**，Linux软件包管理器中的包通常只有几个版本，所以为了获得最新版本的Pandas，建议使用上面描述的pip或conda方法进行安装。

### 使用源码进行安装

有关从git源代码树构建库的完整说明，请参阅[参考文档](http://Pandas.pydata.org/Pandas-docs/stable/contributing.html#contributing)。此外，如果要创建Pandas开发环境，请参阅[创建开发环境](http://Pandas.pydata.org/Pandas-docs/stable/contributing.html#contributing-dev-env)。

## 运行测试套件

Pandas配备了一套详尽的单元测试，在本文撰写时，已涵盖了约97％的代码。要在您的计算机上运行这些测试以验证一切正常（您已经安装了所有的软件和硬件依赖项），请确保您已有pytest库，并运行：

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

## 依赖项

- [setuptools](https://setuptools.readthedocs.io/en/latest/)： 24.2.0或更高版本。
- [NumPy](http://www.numpy.org.cn/)：1.9.0或更高版本。
- [python-dateutil](http://https//dateutil.readthedocs.io/en/stable/)： 2.5.0或更高版本。
- [pytz](http://pytz.sourceforge.net/)

### 推荐的依赖项

- [numexpr](https://github.com/pydata/numexpr)： 用于加速某些数值运算。numexpr使用多个内核以及智能分块和缓存技术来实现大型加速运算。如果已安装，必须是2.4.6或更高版本。
- [bottleneck](https://github.com/kwgoodman/bottleneck)：用于加速某些包含空值的运算。bottleneck使用专门的cython程序来实现大型的加速。如果已安装，必须是1.0.0或更高版本。

**注意**：强烈建议您安装这些库，因为它们可以提高速度，尤其是在处理大型数据集时。

### 可选的依赖项

- [Cython](http://www.cython.org/)：只需要构建开发版本，0.24或更高版本。
- [SciPy](http://www.scipy.org/)：使用其他的统计函数，0.14.0或更高版本。
- [xarray](http://xarray.pydata.org/)：Pandas处理2维以上的数据时， 需要将Panel转换为xarray对象，推荐使用0.7.0或更高版本。
- [PyTables](http://www.pytables.org/)：用于HDF5类型的存储， 需要3.0.0或更高版本，强烈建议使用版本3.2.1或更高版本。
- [Feather Format](https://github.com/wesm/feather)：用于feather-based类型的存储， 必须是0.3.1或更高版本。
- [Apache Parquet](https://parquet.apache.org/)，[pyarrow](http://arrow.apache.org/docs/python/) (>= 0.4.1) 和 [fastparquet](https://fastparquet.readthedocs.io/en/latest) (>= 0.0.6)用于 parquet-based类型的存储. [snappy](https://pypi.org/project/python-snappy) 和[brotli](https://pypi.org/project/brotlipy)可提供压缩支持。
- [SQLAlchemy](http://www.sqlalchemy.org/)： 用于SQL数据库的支持。建议使用0.8.1或更高版本。除了SQLAlchemy之外，您还需要一个特定数据库的驱动程序。您可以在[SQLAlchemy文档](http://docs.sqlalchemy.org/en/latest/dialects/index.html)中找到每种SQL支持的驱动程序的概述。一些常见的驱动程序是：
    - [psycopg2](http://initd.org/psycopg/): 用于PostgreSQL。
    - [pymysql](https://github.com/PyMySQL/PyMySQL): 用于MySQL。
    - [SQLite](https://docs.python.org/3/library/sqlite3.html):用于SQLite，对于SQLite，默认情况下它包含在Python的标准库中。
- matplotlib: 用于绘图，1.4.3或更高版本。
- 用于Excel读写：
    - [xlrd/xlwt](http://www.python-excel.org/)：Excel读(xlrd)和写(xlwt)
    - [openpyxl](http://https//openpyxl.readthedocs.io/en/default/)： 用于编写.xlsx文件，2.4.0版本(xlrd >= 0.9.0)。
    - [XlsxWriter](https://pypi.org/project/XlsxWriter)： 可选的Excel编写器。
- [Jinja2](http://jinja.pocoo.org/)：用于处理HTML格式的模板引擎。
- [s3fs](http://s3fs.readthedocs.io/)：用于访问Amazon S3(s3fs >= 0.0.7)。
- [blosc](https://pypi.org/project/blosc)：使用blosc进行msgpack的压缩
- [read_clipboard()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.read_clipboard.html#Pandas.read_clipboard)函数需要用到[qtpy](https://github.com/spyder-ide/qtpy) (需要PyQt或者PySide)， [PyQt5](https://www.riverbankcomputing.com/software/pyqt/download5)， [PyQt4](http://www.riverbankcomputing.com/software/pyqt/download)， [pygtk](http://www.pygtk.org/)， [xsel](http://www.vergenet.net/~conrad/software/xsel/)或者 [xclip](https://github.com/astrand/xclip/)。Linux发行版上的大多数软件包管理器都可以立即安装xclip或xsel。
- [Pandas-gbq](https://Pandas-gbq.readthedocs.io/en/latest/install.html#dependencies)：用于Google BigQuery I/O.
- [Backports.lzma](https://pypi.org/project/backports.lzma/)： 仅适用于Python 2，用于以CSV格式写入和读取xz格式压缩的DataFrame；Python 3已内置于标准库中。

- 使用read_html()函数需要用到以下库组合中的一个。
    *在0.23.0版本中已修改*

    **注意**：BeautifulSoup4是最低的要求版本。

    - [BeautifulSoup4](http://www.crummy.com/software/BeautifulSoup) 和 [html5lib](https://github.com/html5lib/html5lib-python) (任何最近的[html5lib](https://github.com/html5lib/html5lib-python) 版本均可)
    - [BeautifulSoup4](http://www.crummy.com/software/BeautifulSoup) 和 [lxml](http://lxml.de/)
    - [BeautifulSoup4](http://www.crummy.com/software/BeautifulSoup)、[html5lib](https://github.com/html5lib/html5lib-python) 和 [lxml](http://lxml.de/)
    - 只有[lxml](http://lxml.de/)，请浏览[HTML Table Parsing](http://Pandas.pydata.org/Pandas-docs/stable/io.html#io-html-gotchas)，了解为什么你应该不采取这种方法。

    <div class="warning-warp">
    <b>警告</b>
    <p>
    <ul>
        <li>如果你安装了<a href="http://www.crummy.com/software/BeautifulSoup">BeautifulSoup4，</a>你应该安装 <a href="http://lxml.de/">lxml</a> 和<a href="https://github.com/html5lib/html5lib-python">html5lib</a>之中的一个或两个都安装。<a href="http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.read_html.html#Pandas.read_html">read_html()</a>无法在只安装<a href="http://www.crummy.com/software/BeautifulSoup">BeautifulSoup4</a>的情况下运行。
        </li>
        <li>我们强烈推荐您阅读<a href="http://Pandas.pydata.org/Pandas-docs/stable/io.html#io-html-gotchas">HTML Table Parsing gotchas</a> 。它解释了有关上述三个库的安装和使用问题。
        </li>
    </ul>
    </p>
    </div>

    **注意**：
    如果您使用的是apt-get系统，则可以执行以下命令：

    ``` bash
    sudo apt-get build-dep python-lxml
    ```
    获取安装lxml所需的依赖项，以将防止进一步的困扰。

**注意**：
如果没有安装可选的依赖项，许多有用的功能将无法使用。因此，强烈建议您安装这些库。像[Anaconda](http://docs.continuum.io/anaconda/)，[ActivePython](https://www.activestate.com/activepython/downloads)（版本2.7或3.5）或[Enthought Canopy](http://enthought.com/products/canopy)这样的已经打包好的Python发行版是值得考虑的。
