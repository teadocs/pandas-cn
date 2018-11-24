# 概述

pandas has an options system that lets you customize some aspects of its behaviour, display-related options being those the user is most likely to adjust.

Options have a full “dotted-style”, case-insensitive name (e.g. ``display.max_rows``). You can get/set options directly as attributes of the top-level ``options`` attribute:

```python
In [1]: import pandas as pd

In [2]: pd.options.display.max_rows
Out[2]: 15

In [3]: pd.options.display.max_rows = 999

In [4]: pd.options.display.max_rows
Out[4]: 999
```

The API is composed of 5 relevant functions, available directly from the pandas namespace:

- [get_option()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.get_option.html#pandas.get_option) / [set_option()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.set_option.html#pandas.set_option) - get/set the value of a single option.
- [reset_option()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.reset_option.html#pandas.reset_option) - reset one or more options to their default value.
- [describe_option()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.describe_option.html#pandas.describe_option) - print the descriptions of one or more options.
- [option_context()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.option_context.html#pandas.option_context) - execute a codeblock with a set of options that revert to prior settings after execution.

**Note**: Developers can check out [pandas/core/config.py](https://github.com/pandas-dev/pandas/blob/master/pandas/core/config.py) for more information.

All of the functions above accept a regexp pattern (``re.search`` style) as an argument, and so passing in a substring will work - as long as it is unambiguous:

```python
In [5]: pd.get_option("display.max_rows")
Out[5]: 999

In [6]: pd.set_option("display.max_rows",101)

In [7]: pd.get_option("display.max_rows")
Out[7]: 101

In [8]: pd.set_option("max_r",102)

In [9]: pd.get_option("display.max_rows")
Out[9]: 102
```

The following will **not work** because it matches multiple option names, e.g. ``display.max_colwidth``, ``display.max_rows``, ``display.max_columns``:

```python
In [10]: try:
   ....:     pd.get_option("column")
   ....: except KeyError as e:
   ....:     print(e)
   ....: 
'Pattern matched multiple keys'
```

**Note**: Using this form of shorthand may cause your code to break if new options with similar names are added in future versions.

You can get a list of available options and their descriptions with ``describe_option``. When called with no argument ``describe_option`` will print out the descriptions for all available options.