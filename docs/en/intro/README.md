---
sidebarDepth: 3
sidebar: auto
---

# Python Data Analysis Library

``pandas`` is an open source, BSD-licensed library providing high-performance, easy-to-use data structures and data analysis tools for the [Python](https://www.python.org/) programming language.

``pandas`` is a [NumFOCUS](https://www.numfocus.org/open-source-projects.html) sponsored project. This will help ensure the success of development of pandas as a world-class open-source project, and makes it possible to [donate](https://pandas.pydata.org/donate.html) to the project.

![NumFOCUS Logo](/static/images/SponsoredProjectStamp_300px.png)

## v0.25.0 Final (July 18, 2019)

This is a major release from 0.24.2 and includes a number of API changes, new features, enhancements, and performance improvements along with a large number of bug fixes.

Highlights include:

- Dropped Python 2 support
- [Groupby aggregation with relabeling](https://pandas.pydata.org/pandas-docs/version/0.25/whatsnew/v0.25.0.html#groupby-aggregation-with-relabeling)
- [Better repr for MultiIndex](https://pandas.pydata.org/pandas-docs/version/0.25/whatsnew/v0.25.0.html#better-repr-for-multiindex)
- [Better truncated repr for Series and DataFrame](https://pandas.pydata.org/pandas-docs/version/0.25/whatsnew/v0.25.0.html#shorter-truncated-repr-for-series-and-dataframe)
- [Series.explode to split list-like values to rows MultiIndexes](https://pandas.pydata.org/pandas-docs/version/0.25/whatsnew/v0.25.0.html#series-explode-to-split-list-like-values-to-rows)

The release can be installed with conda from conda-forge or the default channel:

``` bash
$ conda install pandas
```

Or via PyPI:

``` bash
python3 -m pip install --upgrade pandas
```

See the full [whatsnew](/en/docs/whatsnew/v0.25.0.html) for a list of all the changes.

## v0.24.2 Final (March 14, 2019)

This is a minor bug-fix release in the 0.24.x series and includes some regression fixes, bug fixes, and performance improvements. We recommend that all users upgrade to this version.

The release can be installed with conda from conda-forge or the default channel:

``` bash
$ conda install Pandas
```

Or via PyPI:

``` bash
$ python3 -m pip install --upgrade Pandas
```

See the [full whatsnew](https://pandas.pydata.org/pandas-docs/version/0.24.2/whatsnew/v0.24.2.html) for a list of all the changes.

## Best way to Install

The best way to get pandas is via [conda](http://pandas.pydata.org/pandas-docs/stable/install.html#installing-pandas-with-anaconda)

``` bash
$ conda install Pandas
```

Packages are available for [all supported python versions](http://pandas.pydata.org/pandas-docs/stable/install.html#python-version-support) on Windows, Linux, and MacOS.

Wheels are also uploaded to [PyPI](https://pypi.org/project/pandas/) and can be installed with

``` bash
$ pip install Pandas
```

## Quick vignette

<iframe src="https://player.vimeo.com/video/59324550" style="margin-top: 20px;" width="500" height="309" frameborder="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen=""></iframe>

[10-minute tour of pandas](https://vimeo.com/59324550) from [Wes McKinney](https://vimeo.com/user10077863) on [Vimeo](https://vimeo.com/).

## What problem does pandas solve?

Python has long been great for data munging and preparation, but less so for data analysis and modeling. pandas helps fill this gap, enabling you to carry out your entire data analysis workflow in Python without having to switch to a more domain specific language like R.

Combined with the excellent [IPython](https://ipython.org/) toolkit and other libraries, the environment for doing data analysis in Python excels in performance, productivity, and the ability to collaborate.

pandas does not implement significant modeling functionality outside of linear and panel regression; for this, look to [statsmodels](http://statsmodels.sf.net/) and [scikit-learn](http://scikit-learn.org/). More work is still needed to make Python a first class statistical modeling environment, but we are well on our way toward that goal.

## What do our users have to say?

- **Roni Israelov，Phd**(Portfolio Manager [AQR Capital Management](https://www.aqr.com/)): “pandas allows us to focus more on research and less on programming. We have found pandas easy to learn, easy to use, and easy to maintain. The bottom line is that it has increased our productivity.”
  - ![AQR Capital Management](/static/images/aqr_capital_management_logo.png)
- **David Himrod**(Director of Optimization & Analytics [AppNexus](https://www.appnexus.com/)): “pandas is the perfect tool for bridging the gap between rapid iterations of ad-hoc analysis and production quality code. If you want one tool to be used across a multi-disciplined organization of engineers, mathematicians and analysts, look no further.”
  - ![AppNexus Logo](/static/images/appnexus_logo.png)
- **Olivier Pomel**(CEO [Datadog](https://www.datadoghq.com/)): “We use pandas to process time series data on our production servers. The simplicity and elegance of its API, and its high level of performance for high-volume datasets, made it a perfect choice for us.”
  - ![Datadog Logo](/static/images/datadog_logo.png)

## Library Highlights

- A fast and efficient **DataFrame** object for data manipulation with integrated indexing;
- Tools for **reading and writing data** between in-memory data structures and different formats: CSV and text files, Microsoft Excel, SQL databases, and the fast HDF5 format;
- Intelligent **data alignment** and integrated handling of **missing data**: gain automatic label-based alignment in computations and easily manipulate messy data into an orderly form;
- Flexible **reshaping** and pivoting of data sets;
- Intelligent label-based **slicing, fancy indexing**, and **subsetting** of large data sets;
- Columns can be inserted and deleted from data structures for **size mutability**;
- Aggregating or transforming data with a powerful **group by** engine allowing split-apply-combine operations on data sets;
- High performance **merging and joining** of data sets;
- **Hierarchical axis indexing** provides an intuitive way of working with high-dimensional data in a lower-dimensional data structure;
- **Time series**-functionality: date range generation and frequency conversion, moving window statistics, moving window linear regressions, date shifting and lagging. Even create domain-specific time offsets and join time series without losing data;
- Highly **optimized for performance**, with critical code paths written in Cython or C.
- Python with pandas is in use in a wide variety of **academic and commercial** domains, including Finance, Neuroscience, Economics, Statistics, Advertising, Web Analytics, and more.