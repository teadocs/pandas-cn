# IO工具(文本，CSV，HDF5，…)

The pandas I/O API is a set of top level ``reader`` functions accessed like [pandas.read_csv()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.read_csv.html#pandas.read_csv) that generally return a pandas object. The corresponding ``writer`` functions are object methods that are accessed like [DataFrame.to_csv()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.to_csv.html#pandas.DataFrame.to_csv). Below is a table containing available ``readers`` and ``writers``.

Format Type | Data Description | Reader | Writer
---|---|---|---
text | CSV | read_csv | to_csv
text | JSON | read_json | to_json
text | HTML | read_html | to_html
text | Local clipboard | read_clipboard | to_clipboard
binary | MS Excel | read_excel | to_excel
binary | HDF5 Format | read_hdf | to_hdf
binary | Feather Format | read_feather | to_feather
binary | Parquet Format | read_parquet | to_parquet
binary | Msgpack | read_msgpack | to_msgpack
binary | Stata | read_stata | to_stata
binary | SAS | read_sas |  
binary | Python Pickle Format | read_pickle | to_pickle
SQL | SQL | read_sql | to_sql
SQL | Google Big Query | read_gbq | to_gbq

[Here](https://pandas.pydata.org/pandas-docs/stable/user_guide/io.html#io-perf) is an informal performance comparison for some of these IO methods.

::: tip Note
For examples that use the ``StringIO`` class, make sure you import it according to your Python version, i.e. ``from StringIO import StringIO`` for Python 2 and ``from io import StringIO`` for Python 3.
:::

## CSV & Text files

The workhorse function for reading text files (a.k.a. flat files) is [read_csv()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.read_csv.html#pandas.read_csv). See the [cookbook](https://pandas.pydata.org/pandas-docs/stable/user_guide/cookbook.html#cookbook-csv) for some advanced strategies.

### Parsing options

[read_csv()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.read_csv.html#pandas.read_csv) accepts the following common arguments:

### Basic

- filepath_or_buffer : various
    - Either a path to a file (a str, pathlib.Path, or py._path.local.LocalPath), URL (including http, ftp, and S3 locations), or any object with a read() method (such as an open file or StringIO).
- sep : str, defaults to ',' for read_csv(), \t for read_table()
    - Delimiter to use. If sep is None, the C engine cannot automatically detect the separator, but the Python parsing engine can, meaning the latter will be used and automatically detect the separator by Python’s builtin sniffer tool, csv.Sniffer. In addition, separators longer than 1 character and different from '\s+' will be interpreted as regular expressions and will also force the use of the Python parsing engine. Note that regex delimiters are prone to ignoring quoted data. Regex example: '\\r\\t'.
- delimiter : str, default None
    - Alternative argument name for sep.
- delim_whitespace : boolean, default False
    - Specifies whether or not whitespace (e.g. ' ' or '\t') will be used as the delimiter. Equivalent to setting sep='\s+'. If this option is set to True, nothing should be passed in for the delimiter parameter.

  *New in version 0.18.1: support for the Python parser.*

### Column and Index Locations and Names


