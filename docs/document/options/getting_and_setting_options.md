# 获取和设置选项

As described above, [get_option()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.get_option.html#pandas.get_option) and [set_option()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.set_option.html#pandas.set_option) are available from the pandas namespace. To change an option, call ``set_option('option regex', new_value)``.

```python
In [11]: pd.get_option('mode.sim_interactive')
Out[11]: False

In [12]: pd.set_option('mode.sim_interactive', True)

In [13]: pd.get_option('mode.sim_interactive')
Out[13]: True
```

**Note**: The option ‘mode.sim_interactive’ is mostly used for debugging purposes.

All options also have a default value, and you can use ``reset_option`` to do just that:

```python
In [14]: pd.get_option("display.max_rows")
Out[14]: 60

In [15]: pd.set_option("display.max_rows",999)

In [16]: pd.get_option("display.max_rows")
Out[16]: 999

In [17]: pd.reset_option("display.max_rows")

In [18]: pd.get_option("display.max_rows")
Out[18]: 60
```

It’s also possible to reset multiple options at once (using a regex):

```python
In [19]: pd.reset_option("^display")
```

``option_context`` context manager has been exposed through the top-level API, allowing you to execute code with given option values. Option values are restored automatically when you exit the with block:

```python
In [20]: with pd.option_context("display.max_rows",10,"display.max_columns", 5):
   ....:      print(pd.get_option("display.max_rows"))
   ....:      print(pd.get_option("display.max_columns"))
   ....: 
10
5

In [21]: print(pd.get_option("display.max_rows"))
60

In [22]: print(pd.get_option("display.max_columns"))
0
```