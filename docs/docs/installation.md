# 安装

安装Pandas的最简单方法是将其安装为[Anaconda](http://docs.continuum.io/anaconda/)发行版的一部分，这是一种用于数据分析和科学计算的跨平台发行版。这是大多数用户的推荐安装方法。

还提供了从源，[PyPI](https://pypi.org/project/Pandas)，[ActivePython](https://www.activestate.com/activepython/downloads)，各种Linux发行版或[开发版本](http://github.com/Pandas-dev/Pandas)进行安装的说明。

## 计划移除对Python 2.7的支持

Python核心团队计划在2020年1月1日停止支持Python 2.7。按照NumPy的计划，2018年12月31日之前的所有Pandas版本都仍支持Python 2（译者注：之后的版本将不再支持）。

**2018年12月31日**之前的最终版本将是支持Python 2的最后一个版本。已发布的软件包将继续在PyPI和conda上提供。

  - Starting **January 1, 2019**, all releases will be Python 3 only.

If there are people interested in continued support for Python 2.7 past December 31, 2018 (either backporting bugfixes or funding) please reach out to the maintainers on the issue tracker.

For more information, see the [Python 3 statement](http://python3statement.org/) and the [Porting to Python 3 guide](https://docs.python.org/3/howto/pyporting.html).

## Python version support

Officially Python 2.7, 3.5, 3.6, and 3.7.

## Installing Pandas

### Installing with Anaconda

Installing Pandas and the rest of the [NumPy](http://www.numpy.org.cn/) and [SciPy](http://www.scipy.org/) stack can be a little difficult for inexperienced users.

The simplest way to install not only Pandas, but Python and the most popular packages that make up the SciPy stack ([IPython](http://ipython.org/), [NumPy](http://www.numpy.org.cn/), [Matplotlib](http://matplotlib.org/), …) is with [Anaconda](http://docs.continuum.io/anaconda/), a cross-platform (Linux, Mac OS X, Windows) Python distribution for data analytics and scientific computing.

After running the installer, the user will have access to Pandas and the rest of the [SciPy](http://www.scipy.org/) stack without needing to install anything else, and without needing to wait for any software to be compiled.

Installation instructions for [Anaconda](http://docs.continuum.io/anaconda/) [can be found here](http://docs.continuum.io/anaconda/).

A full list of the packages available as part of the [Anaconda](http://docs.continuum.io/anaconda/) distribution [can be found here](http://docs.continuum.io/anaconda/pkg-docs.html).

Another advantage to installing Anaconda is that you don’t need admin rights to install it. Anaconda can install in the user’s home directory, which makes it trivial to delete Anaconda if you decide (just delete that folder).

### Installing with Miniconda

The previous section outlined how to get Pandas installed as part of the [Anaconda](http://docs.continuum.io/anaconda/) distribution. However this approach means you will install well over one hundred packages and involves downloading the installer which is a few hundred megabytes in size.

If you want to have more control on which packages, or have a limited internet bandwidth, then installing Pandas with [Miniconda](http://conda.pydata.org/miniconda.html) may be a better solution.

[Conda](http://conda.pydata.org/docs/) is the package manager that the [Anaconda](http://docs.continuum.io/anaconda/) distribution is built upon. It is a package manager that is both cross-platform and language agnostic (it can play a similar role to a pip and virtualenv combination).

[Miniconda](http://conda.pydata.org/miniconda.html) allows you to create a minimal self contained Python installation, and then use the [Conda](http://conda.pydata.org/docs/) command to install additional packages.

First you will need [Conda](http://conda.pydata.org/docs/) to be installed and downloading and running the [Miniconda](http://conda.pydata.org/miniconda.html) will do this for you. The installer [can be found here](http://conda.pydata.org/miniconda.html)

The next step is to create a new conda environment. A conda environment is like a virtualenv that allows you to specify a specific version of Python and set of libraries. Run the following commands from a terminal window:

``` bash
$ conda create -n name_of_my_env python
```

This will create a minimal environment with only Python installed in it. To put your self inside this environment run:

``` bash
$ source activate name_of_my_env
```

On Windows the command is:

``` bash
$ activate name_of_my_env
```

The final step required is to install Pandas. This can be done with the following command:

``` bash
$ conda install Pandas
```

To install a specific Pandas version:

``` bash
$ conda install Pandas=0.20.3
```

To install other packages, IPython for example:

``` bash
$ conda install ipython
```

To install the full Anaconda distribution:

``` bash
$ conda install anaconda
```

If you need packages that are available to pip but not conda, then install pip, and then use pip to install those packages:

``` bash
$ conda install pip
$ pip install django
```

### Installing from PyPI

Pandas can be installed via pip from [PyPI](https://pypi.org/project/Pandas).

``` bash
$ pip install Pandas
```

### Installing with ActivePython

Installation instructions for [ActivePython](https://www.activestate.com/activepython) can be found [here](https://www.activestate.com/activepython/downloads). Versions 2.7 and 3.5 include Pandas.

### Installing using your Linux distribution’s package manager.

The commands in this table will install Pandas for Python 3 from your distribution. To install Pandas for Python 2, you may need to use the ``python-Pandas`` package.

Distribution | Status | Download / Repository Link | Install method
---|---|---|---
Debian | stable | [official Debian repository](http://packages.debian.org/search?keywords=Pandas&searchon=names&suite=all&section=all) | sudo apt-get install | python3-Pandas
Debian & Ubuntu | unstable (latest packages) | [NeuroDebian](http://neuro.debian.net/index.html#how-to-use-this-repository)	 | sudo apt-get install python3-Pandas
Ubuntu | stable | [official Ubuntu repository](http://packages.ubuntu.com/search?keywords=Pandas&searchon=names&suite=all&section=all) | sudo apt-get install python3-Pandas
OpenSuse | stable | [OpenSuse Repository](http://software.opensuse.org/package/python-Pandas?search_term=Pandas) | zypper in python3-Pandas
Fedora | stable | [official Fedora repository](https://admin.fedoraproject.org/pkgdb/package/rpms/python-Pandas/) | dnf install python3-Pandas
Centos/RHEL | stable | [EPEL repository](https://admin.fedoraproject.org/pkgdb/package/rpms/python-Pandas/) | yum install python3-Pandas

**However**, the packages in the linux package managers are often a few versions behind, so to get the newest version of Pandas, it’s recommended to install using the ``pip`` or ``conda`` methods described above.

### Installing from source

See the [contributing documentation](http://Pandas.pydata.org/Pandas-docs/stable/contributing.html#contributing) for complete instructions on building from the git source tree. Further, see [creating a development environment](http://Pandas.pydata.org/Pandas-docs/stable/contributing.html#contributing-dev-env) if you wish to create a Pandas development environment.

## Running the test suite

pandas is equipped with an exhaustive set of unit tests, covering about 97% of the code base as of this writing. To run it on your machine to verify that everything is working (and that you have all of the dependencies, soft and hard, installed), make sure you have [pytest](http://docs.pytest.org/en/latest/) >= 3.6 and [Hypothesis](https://hypothesis.readthedocs.io/) >= 3.58, then run:

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

## Dependencies

- [setuptools](https://setuptools.readthedocs.io/en/latest/): 24.2.0 or higher
- [NumPy](http://www.numpy.org.cn/): 1.9.0 or higher
- [python-dateutil](http://https//dateutil.readthedocs.io/en/stable/): 2.5.0 or higher
- [pytz](http://pytz.sourceforge.net/)

### Recommended Dependencies

- [numexpr](https://github.com/pydata/numexpr): for accelerating certain numerical operations. ``numexpr`` uses multiple cores as well as smart chunking and caching to achieve large speedups. If installed, must be Version 2.4.6 or higher.
- [bottleneck](https://github.com/kwgoodman/bottleneck): for accelerating certain types of ``nan`` evaluations. ``bottleneck`` uses specialized cython routines to achieve large speedups. If installed, must be Version 1.0.0 or higher.

::: tip Note
You are highly encouraged to install these libraries, as they provide speed improvements, especially when working with large data sets.
:::

### Optional Dependencies

- [Cython](http://www.cython.org/): Only necessary to build development version. Version 0.24 or higher.
- [SciPy](http://www.scipy.org/): miscellaneous statistical functions, Version 0.14.0 or higher
- [xarray](http://xarray.pydata.org/): Pandas like handling for > 2 dims, needed for converting Panels to xarray objects. Version 0.7.0 or higher is recommended.
- [PyTables](http://www.pytables.org/): necessary for HDF5-based storage. Version 3.0.0 or higher required, Version 3.2.1 or higher highly recommended.
- [Feather Format](https://github.com/wesm/feather): necessary for feather-based storage, version 0.3.1 or higher.
- [Apache Parquet](https://parquet.apache.org/), either [pyarrow](http://arrow.apache.org/docs/python/) (>= 0.4.1) or [fastparquet](https://fastparquet.readthedocs.io/en/latest) (>= 0.0.6) for parquet-based storage. The [snappy](https://pypi.org/project/python-snappy) and [brotli](https://pypi.org/project/brotlipy) are available for compression support.
- [SQLAlchemy](http://www.sqlalchemy.org/): for SQL database support. Version 0.8.1 or higher recommended. Besides SQLAlchemy, you also need a database specific driver. You can find an overview of supported drivers for each SQL dialect in the [SQLAlchemy docs](http://docs.sqlalchemy.org/en/latest/dialects/index.html). Some common drivers are:
    - [psycopg2](http://initd.org/psycopg/): for PostgreSQL
    - [pymysql](https://github.com/PyMySQL/PyMySQL): for MySQL.
    - [SQLite](https://docs.python.org/3/library/sqlite3.html): for SQLite, this is included in Python’s standard library by default.
- matplotlib: for plotting, Version 1.4.3 or higher.
- For Excel I/O:
    - [xlrd/xlwt](http://www.python-excel.org/): Excel reading (xlrd) and writing (xlwt)
    - [openpyxl](http://https//openpyxl.readthedocs.io/en/default/): openpyxl version 2.4.0 for writing .xlsx files (xlrd >= 0.9.0)
    - [XlsxWriter](https://pypi.org/project/XlsxWriter): Alternative Excel writer
- [Jinja2](http://jinja.pocoo.org/): Template engine for conditional HTML formatting.
- [s3fs](http://s3fs.readthedocs.io/): necessary for Amazon S3 access (s3fs >= 0.0.7).
- [blosc](https://pypi.org/project/blosc): for msgpack compression using blosc
- [gcsfs](http://gcsfs.readthedocs.io/): necessary for Google Cloud Storage access (gcsfs >= 0.1.0).
- One of [qtpy](https://github.com/spyder-ide/qtpy) (requires PyQt or PySide), [PyQt5,](https://www.riverbankcomputing.com/software/pyqt/download5) [PyQt4](http://www.riverbankcomputing.com/software/pyqt/download), [pygtk](http://www.pygtk.org/), [xsel](http://www.vergenet.net/~conrad/software/xsel/), or [xclip](http://www.vergenet.net/~conrad/software/xsel/): necessary to use [read_clipboard()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.read_clipboard.html#pandas.read_clipboard). Most package managers on Linux distributions will have ``xclip`` and/or ``xsel`` immediately available for installation.
- [pandas-gbq](https://pandas-gbq.readthedocs.io/en/latest/install.html#dependencies): for Google BigQuery I/O. (pandas-gbq >= 0.8.0)
- [Backports.lzma](https://pypi.org/project/backports.lzma/): Only for Python 2, for writing to and/or reading from an xz compressed DataFrame in CSV; Python 3 support is built into the standard library.
- One of the following combinations of libraries is needed to use the top-level [read_html()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.read_html.html#pandas.read_html) function: *Changed in version 0.23.0.*
    ::: tip Note
    If using BeautifulSoup4 a minimum version of 4.2.1 is required
    :::
    - [BeautifulSoup4](http://www.crummy.com/software/BeautifulSoup) and [html5lib](https://github.com/html5lib/html5lib-python) (Any recent version of [html5lib](https://github.com/html5lib/html5lib-python) is okay.)
    - [BeautifulSoup4](http://www.crummy.com/software/BeautifulSoup) and [lxml](http://lxml.de/)
    - [BeautifulSoup4](http://www.crummy.com/software/BeautifulSoup) and [html5lib](https://github.com/html5lib/html5lib-python) and [lxml](http://lxml.de/)
    - Only [lxml](http://lxml.de/), although see [HTML Table Parsing](http://Pandas.pydata.org/Pandas-docs/stable/io.html#io-html-gotchas) for reasons as to why you should probably **not** take this approach.

    ::: warning Warning
    - if you install [BeautifulSoup4](http://www.crummy.com/software/BeautifulSoup) you must install either [lxml](http://lxml.de/) or [html5lib](https://github.com/html5lib/html5lib-python) or both. [read_html()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.read_html.html#pandas.read_html) will not work with *only* [BeautifulSoup4](http://www.crummy.com/software/BeautifulSoup) installed.
    - You are highly encouraged to read [HTML Table Parsing gotchas](https://pandas.pydata.org/pandas-docs/stable/user_guide/io.html#io-html-gotchas). It explains issues surrounding the installation and usage of the above three libraries.
    :::

    ::: tip Note
    if you’re on a system with apt-get you can do

    ``` bash
    sudo apt-get build-dep python-lxml
    ```
    to get the necessary dependencies for installation of lxml. This will prevent further headaches down the line.
    :::

::: tip Note
Without the optional dependencies, many useful features will not work. Hence, it is highly recommended that you install these. A packaged distribution like [Anaconda](http://docs.continuum.io/anaconda/), [ActivePython](https://www.activestate.com/activepython/downloads) (version 2.7 or 3.5), or [Enthought Canopy](http://enthought.com/products/canopy) may be worth considering.
:::