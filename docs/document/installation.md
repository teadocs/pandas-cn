# Pandas 安装

The easiest way to install pandas is to install it as part of the [Anaconda](http://docs.continuum.io/anaconda/) distribution, a cross platform distribution for data analysis and scientific computing. This is the recommended installation method for most users.

Instructions for installing from source, [PyPI](https://pypi.org/project/pandas), [ActivePython](https://www.activestate.com/activepython/downloads), various Linux distributions, or a [development version](http://github.com/pandas-dev/pandas) are also provided.

## Plan for dropping Python 2.7

The Python core team plans to stop supporting Python 2.7 on January 1st, 2020. In line with NumPy’s plans, all pandas releases through December 31, 2018 will support Python 2.

The final release before **December 31, 2018** will be the last release to support Python 2. The released package will continue to be available on PyPI and through conda.

Starting **January 1, 2019**, all releases will be Python 3 only.

If there are people interested in continued support for Python 2.7 past December 31, 2018 (either backporting bugfixes or funding) please reach out to the maintainers on the issue tracker.

For more information, see the [Python 3 statement](http://python3statement.org/) and the [Porting to Python 3 guide](https://docs.python.org/3/howto/pyporting.html).

## Python version support

Officially Python 2.7, 3.5, 3.6, and 3.7.

## Installing pandas

### Installing with Anaconda

Installing pandas and the rest of the [NumPy](http://www.numpy.org.cn/) and [SciPy](http://www.scipy.org/) stack can be a little difficult for inexperienced users.

The simplest way to install not only pandas, but Python and the most popular packages that make up the SciPy stack ([IPython](http://ipython.org/), [NumPy](http://www.numpy.org.cn/), [Matplotlib](http://matplotlib.org/), …) is with [Anaconda](http://docs.continuum.io/anaconda/), a cross-platform (Linux, Mac OS X, Windows) Python distribution for data analytics and scientific computing.

After running the installer, the user will have access to pandas and the rest of the [SciPy](http://www.scipy.org/) stack without needing to install anything else, and without needing to wait for any software to be compiled.

Installation instructions for [Anaconda](http://docs.continuum.io/anaconda/) [can be found here](http://docs.continuum.io/anaconda/).

A full list of the packages available as part of the [Anaconda](http://docs.continuum.io/anaconda/) distribution [can be found here](http://docs.continuum.io/anaconda/pkg-docs.html).

Another advantage to installing Anaconda is that you don’t need admin rights to install it. Anaconda can install in the user’s home directory, which makes it trivial to delete Anaconda if you decide (just delete that folder).

### Installing with Miniconda

The previous section outlined how to get pandas installed as part of the [Anaconda](http://docs.continuum.io/anaconda/) distribution. However this approach means you will install well over one hundred packages and involves downloading the installer which is a few hundred megabytes in size.

If you want to have more control on which packages, or have a limited internet bandwidth, then installing pandas with [Miniconda](http://conda.pydata.org/miniconda.html) may be a better solution.

[Conda](http://conda.pydata.org/docs/) is the package manager that the [Anaconda](http://docs.continuum.io/anaconda/) distribution is built upon. It is a package manager that is both cross-platform and language agnostic (it can play a similar role to a pip and virtualenv combination).

[Miniconda](http://conda.pydata.org/miniconda.html) allows you to create a minimal self contained Python installation, and then use the [Conda](http://conda.pydata.org/docs/) command to install additional packages.

First you will need [Conda](http://conda.pydata.org/docs/) to be installed and downloading and running the [Miniconda](http://conda.pydata.org/miniconda.html) will do this for you. The installer [can be found here](http://conda.pydata.org/miniconda.html)

The next step is to create a new conda environment. A conda environment is like a virtualenv that allows you to specify a specific version of Python and set of libraries. Run the following commands from a terminal window:

```sh
conda create -n name_of_my_env python
```

This will create a minimal environment with only Python installed in it. To put your self inside this environment run:

```sh
source activate name_of_my_env
```

On Windows the command is:

```sh
activate name_of_my_env
```

The final step required is to install pandas. This can be done with the following command:

```sh
conda install pandas
```

To install a specific pandas version:

```sh
conda install pandas=0.20.3
```

To install other packages, IPython for example:

```sh
conda install ipython
```

To install the full Anaconda distribution:

```sh
conda install anaconda
```

If you need packages that are available to pip but not conda, then install pip, and then use pip to install those packages:

```sh
conda install pip
pip install django
```

### Installing from PyPI

pandas can be installed via pip from [PyPI](https://pypi.org/project/pandas).

```sh
pip install pandas
```

### Installing with ActivePython

Installation instructions for [ActivePython](https://www.activestate.com/activepython) can be found [here](https://www.activestate.com/activepython/downloads). Versions 2.7 and 3.5 include pandas.

### Installing using your Linux distribution’s package manager.

The commands in this table will install pandas for Python 3 from your distribution. To install pandas for Python 2, you may need to use the python-pandas package.

Distribution | Status | Download / Repository Link | Install method
---|---|---|---
Debian | stable | [official Debian repository](http://packages.debian.org/search?keywords=pandas&searchon=names&suite=all&section=all) | sudo apt-get install | python3-pandas
Debian & Ubuntu | unstable (latest packages) | [NeuroDebian](http://neuro.debian.net/index.html#how-to-use-this-repository)	 | sudo apt-get install python3-pandas
Ubuntu | stable | [official Ubuntu repository](http://packages.ubuntu.com/search?keywords=pandas&searchon=names&suite=all&section=all) | sudo apt-get install python3-pandas
OpenSuse | stable | [OpenSuse Repository](http://software.opensuse.org/package/python-pandas?search_term=pandas) | zypper in python3-pandas
Fedora | stable | [official Fedora repository](https://admin.fedoraproject.org/pkgdb/package/rpms/python-pandas/) | dnf install python3-pandas
Centos/RHEL | stable | [EPEL repository](https://admin.fedoraproject.org/pkgdb/package/rpms/python-pandas/) | yum install python3-pandas

**However**, the packages in the linux package managers are often a few versions behind, so to get the newest version of pandas, it’s recommended to install using the pip or conda methods described above.

### Installing from source

See the [contributing documentation](http://pandas.pydata.org/pandas-docs/stable/contributing.html#contributing) for complete instructions on building from the git source tree. Further, see [creating a development environment](http://pandas.pydata.org/pandas-docs/stable/contributing.html#contributing-dev-env) if you wish to create a pandas development environment.

## Running the test suite

pandas is equipped with an exhaustive set of unit tests, covering about 97% of the codebase as of this writing. To run it on your machine to verify that everything is working (and that you have all of the dependencies, soft and hard, installed), make sure you have [pytest](http://doc.pytest.org/en/latest/) and run:

```python
>>> import pandas as pd
>>> pd.test()
running: pytest --skip-slow --skip-network C:\Users\TP\Anaconda3\envs\py36\lib\site-packages\pandas
============================= test session starts =============================
platform win32 -- Python 3.6.2, pytest-3.2.1, py-1.4.34, pluggy-0.4.0
rootdir: C:\Users\TP\Documents\Python\pandasdev\pandas, inifile: setup.cfg
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

- [numexpr](https://github.com/pydata/numexpr): for accelerating certain numerical operations. numexpr uses multiple cores as well as smart chunking and caching to achieve large speedups. If installed, must be Version 2.4.6 or higher.
- [bottleneck](https://github.com/kwgoodman/bottleneck): for accelerating certain types of nan evaluations. bottleneck uses specialized cython routines to achieve large speedups. If installed, must be Version 1.0.0 or higher.

**Note**：You are highly encouraged to install these libraries, as they provide speed improvements, especially when working with large data sets.

### Optional Dependencies

- [Cython](http://www.cython.org/): Only necessary to build development version. Version 0.24 or higher.
- [SciPy](http://www.scipy.org/): miscellaneous statistical functions, Version 0.14.0 or higher
- [xarray](http://xarray.pydata.org/): pandas like handling for > 2 dims, needed for converting Panels to xarray objects. Version 0.7.0 or higher is recommended.
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
- One of [qtpy](https://github.com/spyder-ide/qtpy) (requires PyQt or PySide), [PyQt5](https://www.riverbankcomputing.com/software/pyqt/download5), [PyQt4](http://www.riverbankcomputing.com/software/pyqt/download), [pygtk](http://www.pygtk.org/), [xsel](http://www.vergenet.net/~conrad/software/xsel/), or [xclip](https://github.com/astrand/xclip/): necessary to use [read_clipboard()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.read_clipboard.html#pandas.read_clipboard). Most package managers on Linux distributions will have xclip and/or xsel immediately available for installation.
- [pandas-gbq](https://pandas-gbq.readthedocs.io/en/latest/install.html#dependencies): for Google BigQuery I/O.
- [Backports.lzma](https://pypi.org/project/backports.lzma/): Only for Python 2, for writing to and/or reading from an xz compressed DataFrame in CSV; Python 3 support is built into the standard library.
- One of the following combinations of libraries is needed to use the top-level read_html() function:
    *Changed in version 0.23.0.*

    **Note**：If using BeautifulSoup4 a minimum version of 4.2.1 is required

    - [BeautifulSoup4](http://www.crummy.com/software/BeautifulSoup) and [html5lib](https://github.com/html5lib/html5lib-python) (Any recent version of [html5lib](https://github.com/html5lib/html5lib-python) is okay.)
    - [BeautifulSoup4](http://www.crummy.com/software/BeautifulSoup) and [lxml](http://lxml.de/)
    - [BeautifulSoup4](http://www.crummy.com/software/BeautifulSoup) and [html5lib](https://github.com/html5lib/html5lib-python) and [lxml](http://lxml.de/)
    - Only [lxml](http://lxml.de/), although see [HTML Table Parsing](http://pandas.pydata.org/pandas-docs/stable/io.html#io-html-gotchas) for reasons as to why you should probably **not** take this approach.

    <div class="warning-warp">
    <b>警告</b>
    <p>
    <ul>
        <li>if you install <a href="http://www.crummy.com/software/BeautifulSoup">BeautifulSoup4</a> you must install either <a href="http://lxml.de/">lxml</a> or <a href="https://github.com/html5lib/html5lib-python">html5lib</a> or both.<a href="http://pandas.pydata.org/pandas-docs/stable/generated/pandas.read_html.html#pandas.read_html">read_html()</a> will not work with only <a href="http://www.crummy.com/software/BeautifulSoup">BeautifulSoup4</a> installed.
        </li>
        <li>You are highly encouraged to read <a href="http://pandas.pydata.org/pandas-docs/stable/io.html#io-html-gotchas">HTML Table Parsing gotchas</a>. It explains issues surrounding the installation and usage of the above three libraries.
        </li>
    </ul>
    </p>
    </div>

    **Note**：
    if you’re on a system with apt-get you can do

    ```sh
    sudo apt-get build-dep python-lxml
    ```
    to get the necessary dependencies for installation of lxml. This will prevent further headaches down the line.

**Note**: Without the optional dependencies, many useful features will not work. Hence, it is highly recommended that you install these. A packaged distribution like [Anaconda](http://docs.continuum.io/anaconda/), [ActivePython](https://www.activestate.com/activepython/downloads) (version 2.7 or 3.5), or [Enthought Canopy](http://enthought.com/products/canopy) may be worth considering.