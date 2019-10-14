# Essential Basic Functionality

Here we discuss a lot of the essential functionality common to the pandas data structures. Here’s how to create some of the objects used in the examples from the previous section:

``` python
In [1]: index = pd.date_range('1/1/2000', periods=8)

In [2]: s = pd.Series(np.random.randn(5), index=['a', 'b', 'c', 'd', 'e'])

In [3]: df = pd.DataFrame(np.random.randn(8, 3), index=index,
   ...:                   columns=['A', 'B', 'C'])
   ...: 

In [4]: wp = pd.Panel(np.random.randn(2, 5, 4), items=['Item1', 'Item2'],
   ...:               major_axis=pd.date_range('1/1/2000', periods=5),
   ...:               minor_axis=['A', 'B', 'C', 'D'])
   ...: 
```

## Head and Tail

To view a small sample of a Series or DataFrame object, use the [head()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.head.html#pandas.DataFrame.head) and [tail()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.tail.html#pandas.DataFrame.tail) methods. The default number of elements to display is five, but you may pass a custom number.

``` python
In [5]: long_series = pd.Series(np.random.randn(1000))

In [6]: long_series.head()
Out[6]: 
0   -2.211372
1    0.974466
2   -2.006747
3   -0.410001
4   -0.078638
dtype: float64

In [7]: long_series.tail(3)
Out[7]: 
997   -0.196166
998    0.380733
999   -0.275874
dtype: float64
```

## Attributes and Underlying Data

pandas objects have a number of attributes enabling you to access the metadata

  - **shape**: gives the axis dimensions of the object, consistent with ndarray
  - Axis labels
    - **Series**: *index* (only axis)
    - **DataFrame**: *index* (rows) and *columns*
    - **Panel**: *items*, *major_axis*, and *minor_axis*

Note, **these attributes can be safely assigned to**!

``` python
In [8]: df[:2]
Out[8]: 
                   A         B         C
2000-01-01 -0.173215  0.119209 -1.044236
2000-01-02 -0.861849 -2.104569 -0.494929

In [9]: df.columns = [x.lower() for x in df.columns]

In [10]: df
Out[10]: 
                   a         b         c
2000-01-01 -0.173215  0.119209 -1.044236
2000-01-02 -0.861849 -2.104569 -0.494929
2000-01-03  1.071804  0.721555 -0.706771
2000-01-04 -1.039575  0.271860 -0.424972
2000-01-05  0.567020  0.276232 -1.087401
2000-01-06 -0.673690  0.113648 -1.478427
2000-01-07  0.524988  0.404705  0.577046
2000-01-08 -1.715002 -1.039268 -0.370647
```

Pandas objects ([Index](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Index.html#pandas.Index), [Series](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.html#pandas.Series), [DataFrame](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.html#pandas.DataFrame)) can be thought of as containers for arrays, which hold the actual data and do the actual computation. For many types, the underlying array is a [numpy.ndarray](https://docs.scipy.org/doc/numpy/reference/generated/numpy.ndarray.html#numpy.ndarray). However, pandas and 3rd party libraries may extend NumPy’s type system to add support for custom arrays (see [dtypes](https://pandas.pydata.org/pandas-docs/stable/getting_started/basics.html#basics-dtypes)).

To get the actual data inside a [Index](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Index.html#pandas.Index) or [Series](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.html#pandas.Series), use the ``.array`` property

``` python
In [11]: s.array
Out[11]: 
<PandasArray>
[ 0.46911229990718628, -0.28286334432866328,  -1.5090585031735124,
  -1.1356323710171934,   1.2121120250208506]
Length: 5, dtype: float64

In [12]: s.index.array
Out[12]: 
<PandasArray>
['a', 'b', 'c', 'd', 'e']
Length: 5, dtype: object
```

[array](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.array.html#pandas.Series.array) will always be an [ExtensionArray](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.api.extensions.ExtensionArray.html#pandas.api.extensions.ExtensionArray). The exact details of what an ExtensionArray is and why pandas uses them is a bit beyond the scope of this introduction. See [dtypes](https://pandas.pydata.org/pandas-docs/stable/getting_started/basics.html#basics-dtypes) for more.

If you know you need a NumPy array, use [to_numpy()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.to_numpy.html#pandas.Series.to_numpy) or ``numpy.asarray()``.

``` python
In [13]: s.to_numpy()
Out[13]: array([ 0.4691, -0.2829, -1.5091, -1.1356,  1.2121])

In [14]: np.asarray(s)
Out[14]: array([ 0.4691, -0.2829, -1.5091, -1.1356,  1.2121])
```

When the Series or Index is backed by an [ExtensionArray](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.api.extensions.ExtensionArray.html#pandas.api.extensions.ExtensionArray), [to_numpy()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.to_numpy.html#pandas.Series.to_numpy) may involve copying data and coercing values. See [dtypes](https://pandas.pydata.org/pandas-docs/stable/getting_started/basics.html#basics-dtypes) for more.

[to_numpy()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.to_numpy.html#pandas.Series.to_numpy) gives some control over the dtype of the resulting [numpy.ndarray](https://docs.scipy.org/doc/numpy/reference/generated/numpy.ndarray.html#numpy.ndarray). For example, consider datetimes with timezones. NumPy doesn’t have a dtype to represent timezone-aware datetimes, so there are two possibly useful representations:

1. An object-dtype [numpy.ndarray](https://docs.scipy.org/doc/numpy/reference/generated/numpy.ndarray.html#numpy.ndarray) with [Timestamp](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Timestamp.html#pandas.Timestamp) objects, each with the correct tz
1. A ``datetime64[ns]`` -dtype [numpy.ndarray](https://docs.scipy.org/doc/numpy/reference/generated/numpy.ndarray.html#numpy.ndarray), where the values have been converted to UTC and the timezone discarded

Timezones may be preserved with ``dtype=object``

``` python
In [15]: ser = pd.Series(pd.date_range('2000', periods=2, tz="CET"))

In [16]: ser.to_numpy(dtype=object)
Out[16]: 
array([Timestamp('2000-01-01 00:00:00+0100', tz='CET', freq='D'),
       Timestamp('2000-01-02 00:00:00+0100', tz='CET', freq='D')], dtype=object)
```

Or thrown away with ``dtype='datetime64[ns]'``

``` python
In [17]: ser.to_numpy(dtype="datetime64[ns]")
Out[17]: array(['1999-12-31T23:00:00.000000000', '2000-01-01T23:00:00.000000000'], dtype='datetime64[ns]')
```

Getting the “raw data” inside a [DataFrame](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.html#pandas.DataFrame) is possibly a bit more complex. When your ``DataFrame`` only has a single data type for all the columns, [DataFrame.to_numpy()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.to_numpy.html#pandas.DataFrame.to_numpy) will return the underlying data:

``` python
In [18]: df.to_numpy()
Out[18]: 
array([[-0.1732,  0.1192, -1.0442],
       [-0.8618, -2.1046, -0.4949],
       [ 1.0718,  0.7216, -0.7068],
       [-1.0396,  0.2719, -0.425 ],
       [ 0.567 ,  0.2762, -1.0874],
       [-0.6737,  0.1136, -1.4784],
       [ 0.525 ,  0.4047,  0.577 ],
       [-1.715 , -1.0393, -0.3706]])
```

If a DataFrame or Panel contains homogeneously-typed data, the ndarray can actually be modified in-place, and the changes will be reflected in the data structure. For heterogeneous data (e.g. some of the DataFrame’s columns are not all the same dtype), this will not be the case. The values attribute itself, unlike the axis labels, cannot be assigned to.

::: tip Note
When working with heterogeneous data, the dtype of the resulting ndarray will be chosen to accommodate all of the data involved. For example, if strings are involved, the result will be of object dtype. If there are only floats and integers, the resulting array will be of float dtype.
::: 

In the past, pandas recommended [Series.values](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.values.html#pandas.Series.values) or [DataFrame.values](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.values.html#pandas.DataFrame.values) for extracting the data from a Series or DataFrame. You’ll still find references to these in old code bases and online. Going forward, we recommend avoiding ``.values`` and using ``.array`` or ``.to_numpy().`` ``.values`` has the following drawbacks:

  1. When your Series contains an [extension type](https://pandas.pydata.org/pandas-docs/stable/development/extending.html#extending-extension-types), it’s unclear whether [Series.values](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.values.html#pandas.Series.values) returns a NumPy array or the extension array. [Series.array](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.array.html#pandas.Series.array) will always return an [ExtensionArray](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.api.extensions.ExtensionArray.html#pandas.api.extensions.ExtensionArray), and will never copy data. [Series.to_numpy()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.to_numpy.html#pandas.Series.to_numpy) will always return a NumPy array, potentially at the cost of copying / coercing values.
  1. When your DataFrame contains a mixture of data types, [DataFrame.values](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.values.html#pandas.DataFrame.values) may involve copying data and coercing values to a common dtype, a relatively expensive operation. [DataFrame.to_numpy()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.to_numpy.html#pandas.DataFrame.to_numpy), being a method, makes it clearer that the returned NumPy array may not be a view on the same data in the DataFrame.

## Accelerated operations

pandas has support for accelerating certain types of binary numerical and boolean operations using the numexpr library and the ``bottleneck`` libraries.

These libraries are especially useful when dealing with large data sets, and provide large speedups. numexpr uses smart chunking, caching, and multiple cores. ``bottleneck`` is a set of specialized cython routines that are especially fast when dealing with arrays that have ``nans``.

Here is a sample (using 100 column x 100,000 row ``DataFrames``):

Operation | 0.11.0 (ms) | Prior Version (ms) | Ratio to Prior
---|---|---|---
df1 > df2 | 13.32 | 125.35 | 0.1063
df1 * df2 | 21.71 | 36.63 | 0.5928
df1 + df2 | 22.04 | 36.50 | 0.6039

You are highly encouraged to install both libraries. See the section [Recommended Dependencies](https://pandas.pydata.org/pandas-docs/stable/install.html#install-recommended-dependencies) for more installation info.

These are both enabled to be used by default, you can control this by setting the options:

*New in version 0.20.0.*

``` python
pd.set_option('compute.use_bottleneck', False)
pd.set_option('compute.use_numexpr', False)
```

## Flexible binary operations

With binary operations between pandas data structures, there are two key points of interest:

- Broadcasting behavior between higher- (e.g. DataFrame) and lower-dimensional (e.g. Series) objects.
- Missing data in computations.

We will demonstrate how to manage these issues independently, though they can be handled simultaneously.

### Matching / broadcasting behavior

DataFrame has the methods [add()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.add.html#pandas.DataFrame.add), [sub()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.sub.html#pandas.DataFrame.sub), [mul()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.mul.html#pandas.DataFrame.mul), [div()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.div.html#pandas.DataFrame.div) and related functions [radd()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.radd.html#pandas.DataFrame.radd), [rsub()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.rsub.html#pandas.DataFrame.rsub), … for carrying out binary operations. For broadcasting behavior, Series input is of primary interest. Using these functions, you can use to either match on the *index* or *columns* via the **axis** keyword:

``` python
In [19]: df = pd.DataFrame({
   ....:     'one': pd.Series(np.random.randn(3), index=['a', 'b', 'c']),
   ....:     'two': pd.Series(np.random.randn(4), index=['a', 'b', 'c', 'd']),
   ....:     'three': pd.Series(np.random.randn(3), index=['b', 'c', 'd'])})
   ....: 

In [20]: df
Out[20]: 
        one       two     three
a  1.400810 -1.643041       NaN
b -0.356470  1.045911  0.395023
c  0.797268  0.924515 -0.007090
d       NaN  1.553693 -1.670830

In [21]: row = df.iloc[1]

In [22]: column = df['two']

In [23]: df.sub(row, axis='columns')
Out[23]: 
        one       two     three
a  1.757280 -2.688953       NaN
b  0.000000  0.000000  0.000000
c  1.153738 -0.121396 -0.402113
d       NaN  0.507782 -2.065853

In [24]: df.sub(row, axis=1)
Out[24]: 
        one       two     three
a  1.757280 -2.688953       NaN
b  0.000000  0.000000  0.000000
c  1.153738 -0.121396 -0.402113
d       NaN  0.507782 -2.065853

In [25]: df.sub(column, axis='index')
Out[25]: 
        one  two     three
a  3.043851  0.0       NaN
b -1.402381  0.0 -0.650888
c -0.127247  0.0 -0.931605
d       NaN  0.0 -3.224524

In [26]: df.sub(column, axis=0)
Out[26]: 
        one  two     three
a  3.043851  0.0       NaN
b -1.402381  0.0 -0.650888
c -0.127247  0.0 -0.931605
d       NaN  0.0 -3.224524
```

Furthermore you can align a level of a MultiIndexed DataFrame with a Series.

``` python
In [27]: dfmi = df.copy()

In [28]: dfmi.index = pd.MultiIndex.from_tuples([(1, 'a'), (1, 'b'),
   ....:                                         (1, 'c'), (2, 'a')],
   ....:                                        names=['first', 'second'])
   ....: 

In [29]: dfmi.sub(column, axis=0, level='second')
Out[29]: 
                   one       two     three
first second                              
1     a       3.043851  0.000000       NaN
      b      -1.402381  0.000000 -0.650888
      c      -0.127247  0.000000 -0.931605
2     a            NaN  3.196734 -0.027789
```

With Panel, describing the matching behavior is a bit more difficult, so the arithmetic methods instead (and perhaps confusingly?) give you the option to specify the *broadcast axis*. For example, suppose we wished to demean the data over a particular axis. This can be accomplished by taking the mean over an axis and broadcasting over the same axis:

``` python
In [30]: major_mean = wp.mean(axis='major')

In [31]: major_mean
Out[31]: 
      Item1     Item2
A -0.378069  0.675929
B -0.241429 -0.018080
C -0.597702  0.129006
D  0.204005  0.245570

In [32]: wp.sub(major_mean, axis='major')
Out[32]: 
<class 'pandas.core.panel.Panel'>
Dimensions: 2 (items) x 5 (major_axis) x 4 (minor_axis)
Items axis: Item1 to Item2
Major_axis axis: 2000-01-01 00:00:00 to 2000-01-05 00:00:00
Minor_axis axis: A to D
```

And similarly for ``axis="items"`` and ``axis="minor"``.

::: tip Note
I could be convinced to make the **axis** argument in the DataFrame methods match the broadcasting behavior of Panel. Though it would require a transition period so users can change their code…
:::

Series and Index also support the [divmod()](https://docs.python.org/3/library/functions.html#divmod) builtin. This function takes the floor division and modulo operation at the same time returning a two-tuple of the same type as the left hand side. For example:

``` python
In [33]: s = pd.Series(np.arange(10))

In [34]: s
Out[34]: 
0    0
1    1
2    2
3    3
4    4
5    5
6    6
7    7
8    8
9    9
dtype: int64

In [35]: div, rem = divmod(s, 3)

In [36]: div
Out[36]: 
0    0
1    0
2    0
3    1
4    1
5    1
6    2
7    2
8    2
9    3
dtype: int64

In [37]: rem
Out[37]: 
0    0
1    1
2    2
3    0
4    1
5    2
6    0
7    1
8    2
9    0
dtype: int64

In [38]: idx = pd.Index(np.arange(10))

In [39]: idx
Out[39]: Int64Index([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], dtype='int64')

In [40]: div, rem = divmod(idx, 3)

In [41]: div
Out[41]: Int64Index([0, 0, 0, 1, 1, 1, 2, 2, 2, 3], dtype='int64')

In [42]: rem
Out[42]: Int64Index([0, 1, 2, 0, 1, 2, 0, 1, 2, 0], dtype='int64')
We can also do elementwise divmod():

In [43]: div, rem = divmod(s, [2, 2, 3, 3, 4, 4, 5, 5, 6, 6])

In [44]: div
Out[44]: 
0    0
1    0
2    0
3    1
4    1
5    1
6    1
7    1
8    1
9    1
dtype: int64

In [45]: rem
Out[45]: 
0    0
1    1
2    2
3    0
4    0
5    1
6    1
7    2
8    2
9    3
dtype: int64
```

### Missing data / operations with fill values

In Series and DataFrame, the arithmetic functions have the option of inputting a *fill_value*, namely a value to substitute when at most one of the values at a location are missing. For example, when adding two DataFrame objects, you may wish to treat NaN as 0 unless both DataFrames are missing that value, in which case the result will be NaN (you can later replace NaN with some other value using ``fillna`` if you wish).

``` python
In [46]: df
Out[46]: 
        one       two     three
a  1.400810 -1.643041       NaN
b -0.356470  1.045911  0.395023
c  0.797268  0.924515 -0.007090
d       NaN  1.553693 -1.670830

In [47]: df2
Out[47]: 
        one       two     three
a  1.400810 -1.643041  1.000000
b -0.356470  1.045911  0.395023
c  0.797268  0.924515 -0.007090
d       NaN  1.553693 -1.670830

In [48]: df + df2
Out[48]: 
        one       two     three
a  2.801620 -3.286083       NaN
b -0.712940  2.091822  0.790046
c  1.594536  1.849030 -0.014180
d       NaN  3.107386 -3.341661

In [49]: df.add(df2, fill_value=0)
Out[49]: 
        one       two     three
a  2.801620 -3.286083  1.000000
b -0.712940  2.091822  0.790046
c  1.594536  1.849030 -0.014180
d       NaN  3.107386 -3.341661
```

### Flexible Comparisons

Series and DataFrame have the binary comparison methods ``eq``, ``ne``, ``lt``, ``gt``, ``le``, and ``ge`` whose behavior is analogous to the binary arithmetic operations described above:

``` python
In [50]: df.gt(df2)
Out[50]: 
     one    two  three
a  False  False  False
b  False  False  False
c  False  False  False
d  False  False  False

In [51]: df2.ne(df)
Out[51]: 
     one    two  three
a  False  False   True
b  False  False  False
c  False  False  False
d   True  False  False
```

These operations produce a pandas object of the same type as the left-hand-side input that is of dtype ``bool``. These boolean objects can be used in indexing operations, see the section on [Boolean indexing](https://pandas.pydata.org/pandas-docs/stable/user_guide/indexing.html#indexing-boolean).

### Boolean Reductions

You can apply the reductions: [empty](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.empty.html#pandas.DataFrame.empty), [any()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.any.html#pandas.DataFrame.any), [all()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.all.html#pandas.DataFrame.all), and [bool()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.bool.html#pandas.DataFrame.bool) to provide a way to summarize a boolean result.

``` python
In [52]: (df > 0).all()
Out[52]: 
one      False
two      False
three    False
dtype: bool

In [53]: (df > 0).any()
Out[53]: 
one      True
two      True
three    True
dtype: bool
```

You can reduce to a final boolean value.

``` python
In [54]: (df > 0).any().any()
Out[54]: True
```

You can test if a pandas object is empty, via the [empty](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.empty.html#pandas.DataFrame.empty) property.

``` python
In [55]: df.empty
Out[55]: False

In [56]: pd.DataFrame(columns=list('ABC')).empty
Out[56]: True
```

To evaluate single-element pandas objects in a boolean context, use the method bool():

``` python
In [57]: pd.Series([True]).bool()
Out[57]: True

In [58]: pd.Series([False]).bool()
Out[58]: False

In [59]: pd.DataFrame([[True]]).bool()
Out[59]: True

In [60]: pd.DataFrame([[False]]).bool()
Out[60]: False
```

::: Warning Warning

You might be tempted to do the following:

``` python
>>> if df:
...     pass
```

Or

``` python
>>> df and df2
```

These will both raise errors, as you are trying to compare multiple values.:

``` python
ValueError: The truth value of an array is ambiguous. Use a.empty, a.any() or a.all().
```
:::

See [gotchas](https://pandas.pydata.org/pandas-docs/stable/user_guide/gotchas.html#gotchas-truth) for a more detailed discussion.

### Comparing if objects are equivalent

Often you may find that there is more than one way to compute the same result. As a simple example, consider ``df + df`` and ``df * 2``. To test that these two computations produce the same result, given the tools shown above, you might imagine using ``(df + df == df * 2).all()``. But in fact, this expression is False:

``` python
In [61]: df + df == df * 2
Out[61]: 
     one   two  three
a   True  True  False
b   True  True   True
c   True  True   True
d  False  True   True

In [62]: (df + df == df * 2).all()
Out[62]: 
one      False
two       True
three    False
dtype: bool
```

Notice that the boolean DataFrame ``df + df == df * 2`` contains some False values! This is because NaNs do not compare as equals:

``` python
In [63]: np.nan == np.nan
Out[63]: False
```

So, NDFrames (such as Series, DataFrames, and Panels) have an [equals()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.equals.html#pandas.DataFrame.equals) method for testing equality, with NaNs in corresponding locations treated as equal.

``` python
In [64]: (df + df).equals(df * 2)
Out[64]: True
```

Note that the Series or DataFrame index needs to be in the same order for equality to be True:

``` python
In [65]: df1 = pd.DataFrame({'col': ['foo', 0, np.nan]})

In [66]: df2 = pd.DataFrame({'col': [np.nan, 0, 'foo']}, index=[2, 1, 0])

In [67]: df1.equals(df2)
Out[67]: False

In [68]: df1.equals(df2.sort_index())
Out[68]: True
```

### Comparing array-like objects

You can conveniently perform element-wise comparisons when comparing a pandas data structure with a scalar value:

``` python
In [69]: pd.Series(['foo', 'bar', 'baz']) == 'foo'
Out[69]: 
0     True
1    False
2    False
dtype: bool

In [70]: pd.Index(['foo', 'bar', 'baz']) == 'foo'
Out[70]: array([ True, False, False], dtype=bool)
```

Pandas also handles element-wise comparisons between different array-like objects of the same length:

``` python
In [71]: pd.Series(['foo', 'bar', 'baz']) == pd.Index(['foo', 'bar', 'qux'])
Out[71]: 
0     True
1     True
2    False
dtype: bool

In [72]: pd.Series(['foo', 'bar', 'baz']) == np.array(['foo', 'bar', 'qux'])
Out[72]: 
0     True
1     True
2    False
dtype: bool
```

Trying to compare ``Index`` or ``Series`` objects of different lengths will raise a ValueError:

``` python
In [55]: pd.Series(['foo', 'bar', 'baz']) == pd.Series(['foo', 'bar'])
ValueError: Series lengths must match to compare

In [56]: pd.Series(['foo', 'bar', 'baz']) == pd.Series(['foo'])
ValueError: Series lengths must match to compare
```

Note that this is different from the NumPy behavior where a comparison can be broadcast:

``` python
In [73]: np.array([1, 2, 3]) == np.array([2])
Out[73]: array([False,  True, False], dtype=bool)
```

or it can return False if broadcasting can not be done:

``` python
In [74]: np.array([1, 2, 3]) == np.array([1, 2])
Out[74]: False
```

### Combining overlapping data sets

A problem occasionally arising is the combination of two similar data sets where values in one are preferred over the other. An example would be two data series representing a particular economic indicator where one is considered to be of “higher quality”. However, the lower quality series might extend further back in history or have more complete data coverage. As such, we would like to combine two DataFrame objects where missing values in one DataFrame are conditionally filled with like-labeled values from the other DataFrame. The function implementing this operation is [combine_first()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.combine_first.html#pandas.DataFrame.combine_first), which we illustrate:

``` python
In [75]: df1 = pd.DataFrame({'A': [1., np.nan, 3., 5., np.nan],
   ....:                     'B': [np.nan, 2., 3., np.nan, 6.]})
   ....: 

In [76]: df2 = pd.DataFrame({'A': [5., 2., 4., np.nan, 3., 7.],
   ....:                     'B': [np.nan, np.nan, 3., 4., 6., 8.]})
   ....: 

In [77]: df1
Out[77]: 
     A    B
0  1.0  NaN
1  NaN  2.0
2  3.0  3.0
3  5.0  NaN
4  NaN  6.0

In [78]: df2
Out[78]: 
     A    B
0  5.0  NaN
1  2.0  NaN
2  4.0  3.0
3  NaN  4.0
4  3.0  6.0
5  7.0  8.0

In [79]: df1.combine_first(df2)
Out[79]: 
     A    B
0  1.0  NaN
1  2.0  2.0
2  3.0  3.0
3  5.0  4.0
4  3.0  6.0
5  7.0  8.0
```

### General DataFrame Combine

The [combine_first()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.combine_first.html#pandas.DataFrame.combine_first) method above calls the more general [DataFrame.combine()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.combine.html#pandas.DataFrame.combine). This method takes another DataFrame and a combiner function, aligns the input DataFrame and then passes the combiner function pairs of Series (i.e., columns whose names are the same).

So, for instance, to reproduce [combine_first()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.combine_first.html#pandas.DataFrame.combine_first) as above:

``` python
In [80]: def combiner(x, y):
   ....:     return np.where(pd.isna(x), y, x)
   ....: 
```

## Descriptive statistics

There exists a large number of methods for computing descriptive statistics and other related operations on [Series](https://pandas.pydata.org/pandas-docs/stable/reference/series.html#api-series-stats), [DataFrame](https://pandas.pydata.org/pandas-docs/stable/reference/frame.html#api-dataframe-stats), and [Panel](https://pandas.pydata.org/pandas-docs/stable/reference/panel.html#api-panel-stats). Most of these are aggregations (hence producing a lower-dimensional result) like [sum()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.sum.html#pandas.DataFrame.sum), [mean()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.mean.html#pandas.DataFrame.mean), and [quantile()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.quantile.html#pandas.DataFrame.quantile), but some of them, like [cumsum()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.cumsum.html#pandas.DataFrame.cumsum) and [cumprod()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.cumprod.html#pandas.DataFrame.cumprod), produce an object of the same size. Generally speaking, these methods take an **axis** argument, just like ndarray *.{sum, std, …}*, but the axis can be specified by name or integer:

- **Series**: no axis argument needed
- **DataFrame**: “index” (axis=0, default), “columns” (axis=1)
- **Panel**: “items” (axis=0), “major” (axis=1, default), “minor” (axis=2)

For example:

``` python
In [81]: df
Out[81]: 
        one       two     three
a  1.400810 -1.643041       NaN
b -0.356470  1.045911  0.395023
c  0.797268  0.924515 -0.007090
d       NaN  1.553693 -1.670830

In [82]: df.mean(0)
Out[82]: 
one      0.613869
two      0.470270
three   -0.427633
dtype: float64

In [83]: df.mean(1)
Out[83]: 
a   -0.121116
b    0.361488
c    0.571564
d   -0.058569
dtype: float64
```

All such methods have a ``skipna`` option signaling whether to exclude missing data (``True`` by default):

``` python
In [84]: df.sum(0, skipna=False)
Out[84]: 
one           NaN
two      1.881078
three         NaN
dtype: float64

In [85]: df.sum(axis=1, skipna=True)
Out[85]: 
a   -0.242232
b    1.084464
c    1.714693
d   -0.117137
dtype: float64
```

Combined with the broadcasting / arithmetic behavior, one can describe various statistical procedures, like standardization (rendering data zero mean and standard deviation 1), very concisely:

``` python
In [86]: ts_stand = (df - df.mean()) / df.std()

In [87]: ts_stand.std()
Out[87]: 
one      1.0
two      1.0
three    1.0
dtype: float64

In [88]: xs_stand = df.sub(df.mean(1), axis=0).div(df.std(1), axis=0)

In [89]: xs_stand.std(1)
Out[89]: 
a    1.0
b    1.0
c    1.0
d    1.0
dtype: float64
```

Note that methods like [cumsum()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.cumsum.html#pandas.DataFrame.cumsum) and [cumprod()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.cumprod.html#pandas.DataFrame.cumprod) preserve the location of NaN values. This is somewhat different from [expanding()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.expanding.html#pandas.DataFrame.expanding) and [rolling()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.rolling.html#pandas.DataFrame.rolling). For more details please see [this note](https://pandas.pydata.org/pandas-docs/stable/user_guide/computation.html#stats-moments-expanding-note).

``` python
In [90]: df.cumsum()
Out[90]: 
        one       two     three
a  1.400810 -1.643041       NaN
b  1.044340 -0.597130  0.395023
c  1.841608  0.327385  0.387933
d       NaN  1.881078 -1.282898
```

Here is a quick reference summary table of common functions. Each also takes an optional level parameter which applies only if the object has a [hierarchical index](https://pandas.pydata.org/pandas-docs/stable/user_guide/advanced.html#advanced-hierarchical).

Function | Description
---|---
count | Number of non-NA observations
sum | Sum of values
mean | Mean of values
mad | Mean absolute deviation
median | Arithmetic median of values
min | Minimum
max | Maximum
mode | Mode
abs | Absolute Value
prod | Product of values
std | Bessel-corrected sample standard deviation
var | Unbiased variance
sem | Standard error of the mean
skew | Sample skewness (3rd moment)
kurt | Sample kurtosis (4th moment)
quantile | Sample quantile (value at %)
cumsum | Cumulative sum
cumprod | Cumulative product
cummax | Cumulative maximum
cummin | Cumulative minimum

Note that by chance some NumPy methods, like ``mean``, ``std``, and ``sum``, will exclude NAs on Series input by default:

``` python
In [91]: np.mean(df['one'])
Out[91]: 0.6138692844180106

In [92]: np.mean(df['one'].to_numpy())
Out[92]: nan
```

[Series.nunique()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.nunique.html#pandas.Series.nunique) will return the number of unique non-NA values in a Series:

``` python
In [93]: series = pd.Series(np.random.randn(500))

In [94]: series[20:500] = np.nan

In [95]: series[10:20] = 5

In [96]: series.nunique()
Out[96]: 11
```

### Summarizing data: describe

There is a convenient [describe()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.describe.html#pandas.DataFrame.describe) function which computes a variety of summary statistics about a Series or the columns of a DataFrame (excluding NAs of course):

``` python
In [97]: series = pd.Series(np.random.randn(1000))

In [98]: series[::2] = np.nan

In [99]: series.describe()
Out[99]: 
count    500.000000
mean      -0.020695
std        1.011840
min       -2.683763
25%       -0.709297
50%       -0.070211
75%        0.712856
max        3.160915
dtype: float64

In [100]: frame = pd.DataFrame(np.random.randn(1000, 5),
   .....:                      columns=['a', 'b', 'c', 'd', 'e'])
   .....: 

In [101]: frame.iloc[::2] = np.nan

In [102]: frame.describe()
Out[102]: 
                a           b           c           d           e
count  500.000000  500.000000  500.000000  500.000000  500.000000
mean     0.026515    0.022952   -0.047307   -0.052551    0.011210
std      1.016752    0.980046    1.020837    1.008271    1.006726
min     -3.000951   -2.637901   -3.303099   -3.159200   -3.188821
25%     -0.647623   -0.593587   -0.709906   -0.691338   -0.689176
50%      0.047578   -0.026675   -0.029655   -0.032769   -0.015775
75%      0.723946    0.771931    0.603753    0.667044    0.652221
max      2.740139    2.752332    3.004229    2.728702    3.240991
```

You can select specific percentiles to include in the output:

``` python
In [103]: series.describe(percentiles=[.05, .25, .75, .95])
Out[103]: 
count    500.000000
mean      -0.020695
std        1.011840
min       -2.683763
5%        -1.641337
25%       -0.709297
50%       -0.070211
75%        0.712856
95%        1.699176
max        3.160915
dtype: float64
```

By default, the median is always included.

For a non-numerical Series object, [describe()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.describe.html#pandas.Series.describe) will give a simple summary of the number of unique values and most frequently occurring values:

``` python
In [104]: s = pd.Series(['a', 'a', 'b', 'b', 'a', 'a', np.nan, 'c', 'd', 'a'])

In [105]: s.describe()
Out[105]: 
count     9
unique    4
top       a
freq      5
dtype: object
```

Note that on a mixed-type DataFrame object, [describe()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.describe.html#pandas.DataFrame.describe) will restrict the summary to include only numerical columns or, if none are, only categorical columns:

``` python
In [106]: frame = pd.DataFrame({'a': ['Yes', 'Yes', 'No', 'No'], 'b': range(4)})

In [107]: frame.describe()
Out[107]: 
              b
count  4.000000
mean   1.500000
std    1.290994
min    0.000000
25%    0.750000
50%    1.500000
75%    2.250000
max    3.000000
```

This behavior can be controlled by providing a list of types as ``include/exclude`` arguments. The special value ``all`` can also be used:

``` python
In [108]: frame.describe(include=['object'])
Out[108]: 
          a
count     4
unique    2
top     Yes
freq      2

In [109]: frame.describe(include=['number'])
Out[109]: 
              b
count  4.000000
mean   1.500000
std    1.290994
min    0.000000
25%    0.750000
50%    1.500000
75%    2.250000
max    3.000000

In [110]: frame.describe(include='all')
Out[110]: 
          a         b
count     4  4.000000
unique    2       NaN
top     Yes       NaN
freq      2       NaN
mean    NaN  1.500000
std     NaN  1.290994
min     NaN  0.000000
25%     NaN  0.750000
50%     NaN  1.500000
75%     NaN  2.250000
max     NaN  3.000000
```

That feature relies on [select_dtypes](https://pandas.pydata.org/pandas-docs/stable/getting_started/basics.html#basics-selectdtypes). Refer to there for details about accepted inputs.

### Index of Min/Max Values

The [idxmin()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.idxmin.html#pandas.DataFrame.idxmin) and [idxmax()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.idxmax.html#pandas.DataFrame.idxmax) functions on Series and DataFrame compute the index labels with the minimum and maximum corresponding values:

``` python
In [111]: s1 = pd.Series(np.random.randn(5))

In [112]: s1
Out[112]: 
0   -0.068822
1   -1.129788
2   -0.269798
3   -0.375580
4    0.513381
dtype: float64

In [113]: s1.idxmin(), s1.idxmax()
Out[113]: (1, 4)

In [114]: df1 = pd.DataFrame(np.random.randn(5, 3), columns=['A', 'B', 'C'])

In [115]: df1
Out[115]: 
          A         B         C
0  0.333329 -0.910090 -1.321220
1  2.111424  1.701169  0.858336
2 -0.608055 -2.082155 -0.069618
3  1.412817 -0.562658  0.770042
4  0.373294 -0.965381 -1.607840

In [116]: df1.idxmin(axis=0)
Out[116]: 
A    2
B    2
C    4
dtype: int64

In [117]: df1.idxmax(axis=1)
Out[117]: 
0    A
1    A
2    C
3    A
4    A
dtype: object
```

When there are multiple rows (or columns) matching the minimum or maximum value, [idxmin()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.idxmin.html#pandas.DataFrame.idxmin) and [idxmax()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.idxmax.html#pandas.DataFrame.idxmax) return the first matching index:

``` python
In [118]: df3 = pd.DataFrame([2, 1, 1, 3, np.nan], columns=['A'], index=list('edcba'))

In [119]: df3
Out[119]: 
     A
e  2.0
d  1.0
c  1.0
b  3.0
a  NaN

In [120]: df3['A'].idxmin()
Out[120]: 'd'
```

::: tip Note
``idxmin`` and ``idxmax`` are called ``argmin`` and ``argmax`` in NumPy.
:::

### Value counts (histogramming) / Mode

The [value_counts()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.value_counts.html#pandas.Series.value_counts) Series method and top-level function computes a histogram of a 1D array of values. It can also be used as a function on regular arrays:

``` python
In [121]: data = np.random.randint(0, 7, size=50)

In [122]: data
Out[122]: 
array([6, 4, 1, 3, 4, 4, 4, 6, 5, 2, 6, 1, 0, 4, 3, 2, 5, 3, 4, 0, 5, 3, 0,
       1, 5, 0, 1, 5, 3, 4, 1, 2, 3, 2, 4, 6, 1, 4, 3, 5, 2, 1, 2, 4, 1, 6,
       3, 6, 3, 3])

In [123]: s = pd.Series(data)

In [124]: s.value_counts()
Out[124]: 
4    10
3    10
1     8
6     6
5     6
2     6
0     4
dtype: int64

In [125]: pd.value_counts(data)
Out[125]: 
4    10
3    10
1     8
6     6
5     6
2     6
0     4
dtype: int64
```

Similarly, you can get the most frequently occurring value(s) (the mode) of the values in a Series or DataFrame:

``` python
In [126]: s5 = pd.Series([1, 1, 3, 3, 3, 5, 5, 7, 7, 7])

In [127]: s5.mode()
Out[127]: 
0    3
1    7
dtype: int64

In [128]: df5 = pd.DataFrame({"A": np.random.randint(0, 7, size=50),
   .....:                     "B": np.random.randint(-10, 15, size=50)})
   .....: 

In [129]: df5.mode()
Out[129]: 
   A  B
0  0 -9
```

### Discretization and quantiling

Continuous values can be discretized using the [cut()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.cut.html#pandas.cut) (bins based on values) and [qcut()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.qcut.html#pandas.qcut) (bins based on sample quantiles) functions:

``` python
In [130]: arr = np.random.randn(20)

In [131]: factor = pd.cut(arr, 4)

In [132]: factor
Out[132]: 
[(1.27, 2.31], (0.231, 1.27], (-0.809, 0.231], (-1.853, -0.809], (1.27, 2.31], ..., (0.231, 1.27], (-0.809, 0.231], (-1.853, -0.809], (1.27, 2.31], (0.231, 1.27]]
Length: 20
Categories (4, interval[float64]): [(-1.853, -0.809] < (-0.809, 0.231] < (0.231, 1.27] < (1.27, 2.31]]

In [133]: factor = pd.cut(arr, [-5, -1, 0, 1, 5])

In [134]: factor
Out[134]: 
[(1, 5], (0, 1], (-1, 0], (-5, -1], (1, 5], ..., (1, 5], (-1, 0], (-5, -1], (1, 5], (0, 1]]
Length: 20
Categories (4, interval[int64]): [(-5, -1] < (-1, 0] < (0, 1] < (1, 5]]
```

[qcut()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.qcut.html#pandas.qcut) computes sample quantiles. For example, we could slice up some normally distributed data into equal-size quartiles like so:

``` python
In [135]: arr = np.random.randn(30)

In [136]: factor = pd.qcut(arr, [0, .25, .5, .75, 1])

In [137]: factor
Out[137]: 
[(-2.219, -0.669], (-0.669, 0.00453], (0.367, 2.369], (0.00453, 0.367], (0.367, 2.369], ..., (0.00453, 0.367], (0.367, 2.369], (0.00453, 0.367], (-0.669, 0.00453], (0.367, 2.369]]
Length: 30
Categories (4, interval[float64]): [(-2.219, -0.669] < (-0.669, 0.00453] < (0.00453, 0.367] <
                                    (0.367, 2.369]]

In [138]: pd.value_counts(factor)
Out[138]: 
(0.367, 2.369]       8
(-2.219, -0.669]     8
(0.00453, 0.367]     7
(-0.669, 0.00453]    7
dtype: int64
```

We can also pass infinite values to define the bins:

``` python
In [139]: arr = np.random.randn(20)

In [140]: factor = pd.cut(arr, [-np.inf, 0, np.inf])

In [141]: factor
Out[141]: 
[(0.0, inf], (-inf, 0.0], (-inf, 0.0], (-inf, 0.0], (-inf, 0.0], ..., (-inf, 0.0], (-inf, 0.0], (0.0, inf], (-inf, 0.0], (-inf, 0.0]]
Length: 20
Categories (2, interval[float64]): [(-inf, 0.0] < (0.0, inf]]
```

## Function application

To apply your own or another library’s functions to pandas objects, you should be aware of the three methods below. The appropriate method to use depends on whether your function expects to operate on an entire ``DataFrame`` or ``Series``, row- or column-wise, or elementwise.

1. [Tablewise Function Application](https://pandas.pydata.org/pandas-docs/stable/getting_started/basics.html#tablewise-function-application): [pipe()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.pipe.html#pandas.DataFrame.pipe)
1. [Row or Column-wise Function Application](https://pandas.pydata.org/pandas-docs/stable/getting_started/basics.html#row-or-column-wise-function-application): [apply()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.apply.html#pandas.DataFrame.apply)
1. [Aggregation API](https://pandas.pydata.org/pandas-docs/stable/getting_started/basics.html#aggregation-api): [agg()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.agg.html#pandas.DataFrame.agg) and [transform()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.transform.html#pandas.DataFrame.transform)
1. [Applying Elementwise Functions](https://pandas.pydata.org/pandas-docs/stable/getting_started/basics.html#applying-elementwise-functions): [applymap()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.applymap.html#pandas.DataFrame.applymap)

### Tablewise Function Application

``DataFrames`` and ``Series`` can of course just be passed into functions. However, if the function needs to be called in a chain, consider using the [pipe()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.pipe.html#pandas.DataFrame.pipe) method. Compare the following

``` python
# f, g, and h are functions taking and returning ``DataFrames``
>>> f(g(h(df), arg1=1), arg2=2, arg3=3)
```

with the equivalent

``` python
>>> (df.pipe(h)
...    .pipe(g, arg1=1)
...    .pipe(f, arg2=2, arg3=3))
```

Pandas encourages the second style, which is known as method chaining. ``pipe`` makes it easy to use your own or another library’s functions in method chains, alongside pandas’ methods.

In the example above, the functions ``f``, ``g``, and h each expected the ``DataFrame`` as the first positional argument. What if the function you wish to apply takes its data as, say, the second argument? In this case, provide ``pipe`` with a tuple of ``(callable, data_keyword)``. ``.pipe`` will route the ``DataFrame`` to the argument specified in the tuple.

For example, we can fit a regression using statsmodels. Their API expects a formula first and a ``DataFrame`` as the second argument, ``data``. We pass in the function, keyword pair ``(sm.ols, 'data')`` to pipe:

``` python
In [142]: import statsmodels.formula.api as sm

In [143]: bb = pd.read_csv('data/baseball.csv', index_col='id')

In [144]: (bb.query('h > 0')
   .....:    .assign(ln_h=lambda df: np.log(df.h))
   .....:    .pipe((sm.ols, 'data'), 'hr ~ ln_h + year + g + C(lg)')
   .....:    .fit()
   .....:    .summary()
   .....:  )
   .....: 
Out[144]: 
<class 'statsmodels.iolib.summary.Summary'>
"""
                            OLS Regression Results                            
==============================================================================
Dep. Variable:                     hr   R-squared:                       0.685
Model:                            OLS   Adj. R-squared:                  0.665
Method:                 Least Squares   F-statistic:                     34.28
Date:                Tue, 12 Mar 2019   Prob (F-statistic):           3.48e-15
Time:                        22:38:35   Log-Likelihood:                -205.92
No. Observations:                  68   AIC:                             421.8
Df Residuals:                      63   BIC:                             432.9
Df Model:                           4                                         
Covariance Type:            nonrobust                                         
===============================================================================
                  coef    std err          t      P>|t|      [0.025      0.975]
-------------------------------------------------------------------------------
Intercept   -8484.7720   4664.146     -1.819      0.074   -1.78e+04     835.780
C(lg)[T.NL]    -2.2736      1.325     -1.716      0.091      -4.922       0.375
ln_h           -1.3542      0.875     -1.547      0.127      -3.103       0.395
year            4.2277      2.324      1.819      0.074      -0.417       8.872
g               0.1841      0.029      6.258      0.000       0.125       0.243
==============================================================================
Omnibus:                       10.875   Durbin-Watson:                   1.999
Prob(Omnibus):                  0.004   Jarque-Bera (JB):               17.298
Skew:                           0.537   Prob(JB):                     0.000175
Kurtosis:                       5.225   Cond. No.                     1.49e+07
==============================================================================

Warnings:
[1] Standard Errors assume that the covariance matrix of the errors is correctly specified.
[2] The condition number is large, 1.49e+07. This might indicate that there are
strong multicollinearity or other numerical problems.
"""
```

The pipe method is inspired by unix pipes and more recently [dplyr](https://github.com/hadley/dplyr) and [magrittr](https://github.com/smbache/magrittr), which have introduced the popular (%>%) (read pipe) operator for [R](https://www.r-project.org/). The implementation of pipe here is quite clean and feels right at home in python. We encourage you to view the source code of [pipe()](https://www.r-project.org/).

### Row or Column-wise Function Application

Arbitrary functions can be applied along the axes of a DataFrame using the [apply()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.apply.html#pandas.DataFrame.apply) method, which, like the descriptive statistics methods, takes an optional ``axis`` argument:

``` python
In [145]: df.apply(np.mean)
Out[145]: 
one      0.613869
two      0.470270
three   -0.427633
dtype: float64

In [146]: df.apply(np.mean, axis=1)
Out[146]: 
a   -0.121116
b    0.361488
c    0.571564
d   -0.058569
dtype: float64

In [147]: df.apply(lambda x: x.max() - x.min())
Out[147]: 
one      1.757280
two      3.196734
three    2.065853
dtype: float64

In [148]: df.apply(np.cumsum)
Out[148]: 
        one       two     three
a  1.400810 -1.643041       NaN
b  1.044340 -0.597130  0.395023
c  1.841608  0.327385  0.387933
d       NaN  1.881078 -1.282898

In [149]: df.apply(np.exp)
Out[149]: 
        one       two     three
a  4.058485  0.193391       NaN
b  0.700143  2.845991  1.484418
c  2.219469  2.520646  0.992935
d       NaN  4.728902  0.188091
```

The [apply()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.apply.html#pandas.DataFrame.apply) method will also dispatch on a string method name.

``` python
In [150]: df.apply('mean')
Out[150]: 
one      0.613869
two      0.470270
three   -0.427633
dtype: float64

In [151]: df.apply('mean', axis=1)
Out[151]: 
a   -0.121116
b    0.361488
c    0.571564
d   -0.058569
dtype: float64
```

The return type of the function passed to [apply()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.apply.html#pandas.DataFrame.apply) affects the type of the final output from ``DataFrame.apply`` for the default behaviour:

- If the applied function returns a ``Series``, the final output is a ``DataFrame``. The columns match the index of the ``Series`` returned by the applied function.
- If the applied function returns any other type, the final output is a ``Series``.

This default behaviour can be overridden using the ``result_type``, which accepts three options: ``reduce``, ``broadcast``, and ``expand``. These will determine how list-likes return values expand (or not) to a ``DataFrame``.

[apply()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.apply.html#pandas.DataFrame.apply) combined with some cleverness can be used to answer many questions about a data set. For example, suppose we wanted to extract the date where the maximum value for each column occurred:

``` python
In [152]: tsdf = pd.DataFrame(np.random.randn(1000, 3), columns=['A', 'B', 'C'],
   .....:                     index=pd.date_range('1/1/2000', periods=1000))
   .....: 

In [153]: tsdf.apply(lambda x: x.idxmax())
Out[153]: 
A   2000-06-10
B   2001-07-04
C   2002-08-09
dtype: datetime64[ns]
```

You may also pass additional arguments and keyword arguments to the [apply()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.apply.html#pandas.DataFrame.apply) method. For instance, consider the following function you would like to apply:

``` python
def subtract_and_divide(x, sub, divide=1):
    return (x - sub) / divide
```

You may then apply this function as follows:

``` python
df.apply(subtract_and_divide, args=(5,), divide=3)
```

Another useful feature is the ability to pass Series methods to carry out some Series operation on each column or row:

``` python
In [154]: tsdf
Out[154]: 
                   A         B         C
2000-01-01 -0.652077 -0.239118  0.841272
2000-01-02  0.130224  0.347505 -0.385666
2000-01-03 -1.700237 -0.925899  0.199564
2000-01-04       NaN       NaN       NaN
2000-01-05       NaN       NaN       NaN
2000-01-06       NaN       NaN       NaN
2000-01-07       NaN       NaN       NaN
2000-01-08  0.339319 -0.978307  0.689492
2000-01-09  0.601495 -0.630417 -1.040079
2000-01-10  1.511723 -0.427952 -0.400154

In [155]: tsdf.apply(pd.Series.interpolate)
Out[155]: 
                   A         B         C
2000-01-01 -0.652077 -0.239118  0.841272
2000-01-02  0.130224  0.347505 -0.385666
2000-01-03 -1.700237 -0.925899  0.199564
2000-01-04 -1.292326 -0.936380  0.297550
2000-01-05 -0.884415 -0.946862  0.395535
2000-01-06 -0.476503 -0.957344  0.493521
2000-01-07 -0.068592 -0.967825  0.591507
2000-01-08  0.339319 -0.978307  0.689492
2000-01-09  0.601495 -0.630417 -1.040079
2000-01-10  1.511723 -0.427952 -0.400154
```

Finally, [apply()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.apply.html#pandas.DataFrame.apply) takes an argument raw which is False by default, which converts each row or column into a Series before applying the function. When set to True, the passed function will instead receive an ndarray object, which has positive performance implications if you do not need the indexing functionality.

### Aggregation API

*New in version 0.20.0.*

The aggregation API allows one to express possibly multiple aggregation operations in a single concise way. This API is similar across pandas objects, see [groupby API](https://pandas.pydata.org/pandas-docs/stable/user_guide/groupby.html#groupby-aggregate), the [window functions API](https://pandas.pydata.org/pandas-docs/stable/user_guide/computation.html#stats-aggregate), and the [resample API](https://pandas.pydata.org/pandas-docs/stable/user_guide/timeseries.html#timeseries-aggregate). The entry point for aggregation is [DataFrame.aggregate()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.aggregate.html#pandas.DataFrame.aggregate), or the alias [DataFrame.agg()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.agg.html#pandas.DataFrame.agg).

We will use a similar starting frame from above:

``` python
In [156]: tsdf = pd.DataFrame(np.random.randn(10, 3), columns=['A', 'B', 'C'],
   .....:                     index=pd.date_range('1/1/2000', periods=10))
   .....: 

In [157]: tsdf.iloc[3:7] = np.nan

In [158]: tsdf
Out[158]: 
                   A         B         C
2000-01-01  0.396575 -0.364907  0.051290
2000-01-02 -0.310517 -0.369093 -0.353151
2000-01-03 -0.522441  1.659115 -0.272364
2000-01-04       NaN       NaN       NaN
2000-01-05       NaN       NaN       NaN
2000-01-06       NaN       NaN       NaN
2000-01-07       NaN       NaN       NaN
2000-01-08 -0.057890  1.148901  0.011528
2000-01-09 -0.155578  0.742150  0.107324
2000-01-10  0.531797  0.080254  0.833297
```

Using a single function is equivalent to [papply()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.apply.html#pandas.DataFrame.apply). You can also pass named methods as strings. These will return a Series of the aggregated output:

``` python
In [159]: tsdf.agg(np.sum)
Out[159]: 
A   -0.118055
B    2.896420
C    0.377923
dtype: float64

In [160]: tsdf.agg('sum')
Out[160]: 
A   -0.118055
B    2.896420
C    0.377923
dtype: float64

# these are equivalent to a ``.sum()`` because we are aggregating
# on a single function
In [161]: tsdf.sum()
Out[161]: 
A   -0.118055
B    2.896420
C    0.377923
dtype: float64
```

Single aggregations on a ``Series`` this will return a scalar value:

``` python
In [162]: tsdf.A.agg('sum')
Out[162]: -0.11805495013260869
```

#### Aggregating with multiple functions

You can pass multiple aggregation arguments as a list. The results of each of the passed functions will be a row in the resulting ``DataFrame``. These are naturally named from the aggregation function.

``` python
In [163]: tsdf.agg(['sum'])
Out[163]: 
            A        B         C
sum -0.118055  2.89642  0.377923
```

Multiple functions yield multiple rows:

``` python
In [164]: tsdf.agg(['sum', 'mean'])
Out[164]: 
             A         B         C
sum  -0.118055  2.896420  0.377923
mean -0.019676  0.482737  0.062987
```

On a ``Series``, multiple functions return a ``Series``, indexed by the function names:

``` python
In [165]: tsdf.A.agg(['sum', 'mean'])
Out[165]: 
sum    -0.118055
mean   -0.019676
Name: A, dtype: float64
```

Passing a ``lambda`` function will yield a ``<lambda>`` named row:

``` python
In [166]: tsdf.A.agg(['sum', lambda x: x.mean()])
Out[166]: 
sum        -0.118055
<lambda>   -0.019676
Name: A, dtype: float64
```

Passing a named function will yield that name for the row:

``` python
In [167]: def mymean(x):
   .....:     return x.mean()
   .....: 

In [168]: tsdf.A.agg(['sum', mymean])
Out[168]: 
sum      -0.118055
mymean   -0.019676
Name: A, dtype: float64
```

#### Aggregating with a dict

Passing a dictionary of column names to a scalar or a list of scalars, to DataFrame.agg allows you to customize which functions are applied to which columns. Note that the results are not in any particular order, you can use an ``OrderedDict`` instead to guarantee ordering.

``` python
In [169]: tsdf.agg({'A': 'mean', 'B': 'sum'})
Out[169]: 
A   -0.019676
B    2.896420
dtype: float64
```

Passing a list-like will generate a ``DataFrame`` output. You will get a matrix-like output of all of the aggregators. The output will consist of all unique functions. Those that are not noted for a particular column will be ``NaN``:

``` python
In [170]: tsdf.agg({'A': ['mean', 'min'], 'B': 'sum'})
Out[170]: 
             A        B
mean -0.019676      NaN
min  -0.522441      NaN
sum        NaN  2.89642
```

#### Mixed Dtypes

When presented with mixed dtypes that cannot aggregate, ``.agg`` will only take the valid aggregations. This is similar to how groupby ``.agg`` works.

``` python
In [171]: mdf = pd.DataFrame({'A': [1, 2, 3],
   .....:                     'B': [1., 2., 3.],
   .....:                     'C': ['foo', 'bar', 'baz'],
   .....:                     'D': pd.date_range('20130101', periods=3)})
   .....: 

In [172]: mdf.dtypes
Out[172]: 
A             int64
B           float64
C            object
D    datetime64[ns]
dtype: object
```

``` python
In [173]: mdf.agg(['min', 'sum'])
Out[173]: 
     A    B          C          D
min  1  1.0        bar 2013-01-01
sum  6  6.0  foobarbaz        NaT
```

#### Custom describe

With ``.agg()`` is it possible to easily create a custom describe function, similar to the built in [describe function](https://pandas.pydata.org/pandas-docs/stable/getting_started/basics.html#basics-describe).

``` python
In [174]: from functools import partial

In [175]: q_25 = partial(pd.Series.quantile, q=0.25)

In [176]: q_25.__name__ = '25%'

In [177]: q_75 = partial(pd.Series.quantile, q=0.75)

In [178]: q_75.__name__ = '75%'

In [179]: tsdf.agg(['count', 'mean', 'std', 'min', q_25, 'median', q_75, 'max'])
Out[179]: 
               A         B         C
count   6.000000  6.000000  6.000000
mean   -0.019676  0.482737  0.062987
std     0.408577  0.836785  0.420419
min    -0.522441 -0.369093 -0.353151
25%    -0.271782 -0.253617 -0.201391
median -0.106734  0.411202  0.031409
75%     0.282958  1.047213  0.093315
max     0.531797  1.659115  0.833297
```

### Transform API

*New in version 0.20.0.*

The [transform()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.transform.html#pandas.DataFrame.transform) method returns an object that is indexed the same (same size) as the original. This API allows you to provide multiple operations at the same time rather than one-by-one. Its API is quite similar to the ``.agg`` API.

We create a frame similar to the one used in the above sections.

``` python
In [180]: tsdf = pd.DataFrame(np.random.randn(10, 3), columns=['A', 'B', 'C'],
   .....:                     index=pd.date_range('1/1/2000', periods=10))
   .....: 

In [181]: tsdf.iloc[3:7] = np.nan

In [182]: tsdf
Out[182]: 
                   A         B         C
2000-01-01 -1.219234 -1.652700 -0.698277
2000-01-02  1.858653 -0.738520  0.630364
2000-01-03 -0.112596  1.525897  1.364225
2000-01-04       NaN       NaN       NaN
2000-01-05       NaN       NaN       NaN
2000-01-06       NaN       NaN       NaN
2000-01-07       NaN       NaN       NaN
2000-01-08 -0.527790 -1.715506  0.387274
2000-01-09 -0.569341  0.569386  0.134136
2000-01-10 -0.413993 -0.862280  0.662690
```

Transform the entire frame. ``.transform()`` allows input functions as: a NumPy function, a string function name or a user defined function.

``` python
In [183]: tsdf.transform(np.abs)
Out[183]: 
                   A         B         C
2000-01-01  1.219234  1.652700  0.698277
2000-01-02  1.858653  0.738520  0.630364
2000-01-03  0.112596  1.525897  1.364225
2000-01-04       NaN       NaN       NaN
2000-01-05       NaN       NaN       NaN
2000-01-06       NaN       NaN       NaN
2000-01-07       NaN       NaN       NaN
2000-01-08  0.527790  1.715506  0.387274
2000-01-09  0.569341  0.569386  0.134136
2000-01-10  0.413993  0.862280  0.662690

In [184]: tsdf.transform('abs')
Out[184]: 
                   A         B         C
2000-01-01  1.219234  1.652700  0.698277
2000-01-02  1.858653  0.738520  0.630364
2000-01-03  0.112596  1.525897  1.364225
2000-01-04       NaN       NaN       NaN
2000-01-05       NaN       NaN       NaN
2000-01-06       NaN       NaN       NaN
2000-01-07       NaN       NaN       NaN
2000-01-08  0.527790  1.715506  0.387274
2000-01-09  0.569341  0.569386  0.134136
2000-01-10  0.413993  0.862280  0.662690

In [185]: tsdf.transform(lambda x: x.abs())
Out[185]: 
                   A         B         C
2000-01-01  1.219234  1.652700  0.698277
2000-01-02  1.858653  0.738520  0.630364
2000-01-03  0.112596  1.525897  1.364225
2000-01-04       NaN       NaN       NaN
2000-01-05       NaN       NaN       NaN
2000-01-06       NaN       NaN       NaN
2000-01-07       NaN       NaN       NaN
2000-01-08  0.527790  1.715506  0.387274
2000-01-09  0.569341  0.569386  0.134136
2000-01-10  0.413993  0.862280  0.662690
```

Here [transform()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.transform.html#pandas.DataFrame.transform) received a single function; this is equivalent to a ufunc application.

``` python
In [186]: np.abs(tsdf)
Out[186]: 
                   A         B         C
2000-01-01  1.219234  1.652700  0.698277
2000-01-02  1.858653  0.738520  0.630364
2000-01-03  0.112596  1.525897  1.364225
2000-01-04       NaN       NaN       NaN
2000-01-05       NaN       NaN       NaN
2000-01-06       NaN       NaN       NaN
2000-01-07       NaN       NaN       NaN
2000-01-08  0.527790  1.715506  0.387274
2000-01-09  0.569341  0.569386  0.134136
2000-01-10  0.413993  0.862280  0.662690
```

Passing a single function to ``.transform()`` with a ``Series`` will yield a single ``Series`` in return.

``` python
In [187]: tsdf.A.transform(np.abs)
Out[187]: 
2000-01-01    1.219234
2000-01-02    1.858653
2000-01-03    0.112596
2000-01-04         NaN
2000-01-05         NaN
2000-01-06         NaN
2000-01-07         NaN
2000-01-08    0.527790
2000-01-09    0.569341
2000-01-10    0.413993
Freq: D, Name: A, dtype: float64
```

#### Transform with multiple functions

Passing multiple functions will yield a column MultiIndexed DataFrame. The first level will be the original frame column names; the second level will be the names of the transforming functions.

``` python
In [188]: tsdf.transform([np.abs, lambda x: x + 1])
Out[188]: 
                   A                   B                   C          
            absolute  <lambda>  absolute  <lambda>  absolute  <lambda>
2000-01-01  1.219234 -0.219234  1.652700 -0.652700  0.698277  0.301723
2000-01-02  1.858653  2.858653  0.738520  0.261480  0.630364  1.630364
2000-01-03  0.112596  0.887404  1.525897  2.525897  1.364225  2.364225
2000-01-04       NaN       NaN       NaN       NaN       NaN       NaN
2000-01-05       NaN       NaN       NaN       NaN       NaN       NaN
2000-01-06       NaN       NaN       NaN       NaN       NaN       NaN
2000-01-07       NaN       NaN       NaN       NaN       NaN       NaN
2000-01-08  0.527790  0.472210  1.715506 -0.715506  0.387274  1.387274
2000-01-09  0.569341  0.430659  0.569386  1.569386  0.134136  1.134136
2000-01-10  0.413993  0.586007  0.862280  0.137720  0.662690  1.662690
```

Passing multiple functions to a Series will yield a DataFrame. The resulting column names will be the transforming functions.

``` python
In [189]: tsdf.A.transform([np.abs, lambda x: x + 1])
Out[189]: 
            absolute  <lambda>
2000-01-01  1.219234 -0.219234
2000-01-02  1.858653  2.858653
2000-01-03  0.112596  0.887404
2000-01-04       NaN       NaN
2000-01-05       NaN       NaN
2000-01-06       NaN       NaN
2000-01-07       NaN       NaN
2000-01-08  0.527790  0.472210
2000-01-09  0.569341  0.430659
2000-01-10  0.413993  0.586007
```

#### Transforming with a dict

Passing a dict of functions will allow selective transforming per column.

``` python
In [190]: tsdf.transform({'A': np.abs, 'B': lambda x: x + 1})
Out[190]: 
                   A         B
2000-01-01  1.219234 -0.652700
2000-01-02  1.858653  0.261480
2000-01-03  0.112596  2.525897
2000-01-04       NaN       NaN
2000-01-05       NaN       NaN
2000-01-06       NaN       NaN
2000-01-07       NaN       NaN
2000-01-08  0.527790 -0.715506
2000-01-09  0.569341  1.569386
2000-01-10  0.413993  0.137720
```

Passing a dict of lists will generate a MultiIndexed DataFrame with these selective transforms.

``` python
In [191]: tsdf.transform({'A': np.abs, 'B': [lambda x: x + 1, 'sqrt']})
Out[191]: 
                   A         B          
            absolute  <lambda>      sqrt
2000-01-01  1.219234 -0.652700       NaN
2000-01-02  1.858653  0.261480       NaN
2000-01-03  0.112596  2.525897  1.235272
2000-01-04       NaN       NaN       NaN
2000-01-05       NaN       NaN       NaN
2000-01-06       NaN       NaN       NaN
2000-01-07       NaN       NaN       NaN
2000-01-08  0.527790 -0.715506       NaN
2000-01-09  0.569341  1.569386  0.754577
2000-01-10  0.413993  0.137720       NaN
```

#### Applying Elementwise Functions

Since not all functions can be vectorized (accept NumPy arrays and return another array or value), the methods [applymap()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.applymap.html#pandas.DataFrame.applymap) on DataFrame and analogously [map()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.map.html#pandas.Series.map) on Series accept any Python function taking a single value and returning a single value. For example:

``` python
In [192]: df4
Out[192]: 
        one       two     three
a  1.400810 -1.643041       NaN
b -0.356470  1.045911  0.395023
c  0.797268  0.924515 -0.007090
d       NaN  1.553693 -1.670830

In [193]: def f(x):
   .....:     return len(str(x))
   .....: 

In [194]: df4['one'].map(f)
Out[194]: 
a    18
b    19
c    18
d     3
Name: one, dtype: int64

In [195]: df4.applymap(f)
Out[195]: 
   one  two  three
a   18   19      3
b   19   18     19
c   18   18     21
d    3   18     19
```

[Series.map()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.map.html#pandas.Series.map) has an additional feature; it can be used to easily “link” or “map” values defined by a secondary series. This is closely related to [merging/joining functionality](https://pandas.pydata.org/pandas-docs/stable/user_guide/merging.html#merging):

``` python
In [196]: s = pd.Series(['six', 'seven', 'six', 'seven', 'six'],
   .....:               index=['a', 'b', 'c', 'd', 'e'])
   .....: 

In [197]: t = pd.Series({'six': 6., 'seven': 7.})

In [198]: s
Out[198]: 
a      six
b    seven
c      six
d    seven
e      six
dtype: object

In [199]: s.map(t)
Out[199]: 
a    6.0
b    7.0
c    6.0
d    7.0
e    6.0
dtype: float64
```

## Reindexing and altering labels

[reindex()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.reindex.html#pandas.Series.reindex) is the fundamental data alignment method in pandas. It is used to implement nearly all other features relying on label-alignment functionality. To reindex means to conform the data to match a given set of labels along a particular axis. This accomplishes several things:

- Reorders the existing data to match a new set of labels
- Inserts missing value (NA) markers in label locations where no data for that label existed
- If specified, **fill** data for missing labels using logic (highly relevant to working with time series data)

Here is a simple example:

``` python
In [200]: s = pd.Series(np.random.randn(5), index=['a', 'b', 'c', 'd', 'e'])

In [201]: s
Out[201]: 
a   -0.368437
b   -0.036473
c    0.774830
d   -0.310545
e    0.709717
dtype: float64

In [202]: s.reindex(['e', 'b', 'f', 'd'])
Out[202]: 
e    0.709717
b   -0.036473
f         NaN
d   -0.310545
dtype: float64
```

Here, the f label was not contained in the Series and hence appears as ``NaN`` in the result.

With a DataFrame, you can simultaneously reindex the index and columns:

``` python
In [203]: df
Out[203]: 
        one       two     three
a  1.400810 -1.643041       NaN
b -0.356470  1.045911  0.395023
c  0.797268  0.924515 -0.007090
d       NaN  1.553693 -1.670830

In [204]: df.reindex(index=['c', 'f', 'b'], columns=['three', 'two', 'one'])
Out[204]: 
      three       two       one
c -0.007090  0.924515  0.797268
f       NaN       NaN       NaN
b  0.395023  1.045911 -0.356470
```

You may also use ``reindex`` with an ``axis`` keyword:

``` python
In [205]: df.reindex(['c', 'f', 'b'], axis='index')
Out[205]: 
        one       two     three
c  0.797268  0.924515 -0.007090
f       NaN       NaN       NaN
b -0.356470  1.045911  0.395023
```

Note that the ``Index`` objects containing the actual axis labels can be **shared** between objects. So if we have a Series and a DataFrame, the following can be done:

``` python
In [206]: rs = s.reindex(df.index)

In [207]: rs
Out[207]: 
a   -0.368437
b   -0.036473
c    0.774830
d   -0.310545
dtype: float64

In [208]: rs.index is df.index
Out[208]: True
```

This means that the reindexed Series’s index is the same Python object as the DataFrame’s index.

*New in version 0.21.0.*

[DataFrame.reindex()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.reindex.html#pandas.DataFrame.reindex) also supports an “axis-style” calling convention, where you specify a single ``labels`` argument and the ``axis`` it applies to.

``` python
In [209]: df.reindex(['c', 'f', 'b'], axis='index')
Out[209]: 
        one       two     three
c  0.797268  0.924515 -0.007090
f       NaN       NaN       NaN
b -0.356470  1.045911  0.395023

In [210]: df.reindex(['three', 'two', 'one'], axis='columns')
Out[210]: 
      three       two       one
a       NaN -1.643041  1.400810
b  0.395023  1.045911 -0.356470
c -0.007090  0.924515  0.797268
d -1.670830  1.553693       NaN
```

::: tip See also
[MultiIndex / Advanced Indexing](https://pandas.pydata.org/pandas-docs/stable/user_guide/advanced.html#advanced) is an even more concise way of doing reindexing.
:::

::: tip Note
When writing performance-sensitive code, there is a good reason to spend some time becoming a reindexing ninja: **many operations are faster on pre-aligned data**. Adding two unaligned DataFrames internally triggers a reindexing step. For exploratory analysis you will hardly notice the difference (because reindex has been heavily optimized), but when CPU cycles matter sprinkling a few explicit reindex calls here and there can have an impact.
:::

### Reindexing to align with another object

You may wish to take an object and reindex its axes to be labeled the same as another object. While the syntax for this is straightforward albeit verbose, it is a common enough operation that the [reindex_like()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.reindex_like.html#pandas.DataFrame.reindex_like) method is available to make this simpler:

``` python
In [211]: df2
Out[211]: 
        one       two
a  1.400810 -1.643041
b -0.356470  1.045911
c  0.797268  0.924515

In [212]: df3
Out[212]: 
        one       two
a  0.786941 -1.752170
b -0.970339  0.936783
c  0.183399  0.815387

In [213]: df.reindex_like(df2)
Out[213]: 
        one       two
a  1.400810 -1.643041
b -0.356470  1.045911
c  0.797268  0.924515
```

### Aligning objects with each other with ``align``

The [align()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.align.html#pandas.Series.align) method is the fastest way to simultaneously align two objects. It supports a ``join`` argument (related to [joining and merging](https://pandas.pydata.org/pandas-docs/stable/user_guide/merging.html#merging)):

- ``join='outer'``: take the union of the indexes (default)
- ``join='left'``: use the calling object’s index
- ``join='right'``: use the passed object’s index
- ``join='inner'``: intersect the indexes

It returns a tuple with both of the reindexed Series:

``` python
In [214]: s = pd.Series(np.random.randn(5), index=['a', 'b', 'c', 'd', 'e'])

In [215]: s1 = s[:4]

In [216]: s2 = s[1:]

In [217]: s1.align(s2)
Out[217]: 
(a   -0.610263
 b   -0.170883
 c    0.367255
 d    0.273860
 e         NaN
 dtype: float64, a         NaN
 b   -0.170883
 c    0.367255
 d    0.273860
 e    0.314782
 dtype: float64)

In [218]: s1.align(s2, join='inner')
Out[218]: 
(b   -0.170883
 c    0.367255
 d    0.273860
 dtype: float64, b   -0.170883
 c    0.367255
 d    0.273860
 dtype: float64)

In [219]: s1.align(s2, join='left')
Out[219]: 
(a   -0.610263
 b   -0.170883
 c    0.367255
 d    0.273860
 dtype: float64, a         NaN
 b   -0.170883
 c    0.367255
 d    0.273860
 dtype: float64)
```

For DataFrames, the join method will be applied to both the index and the columns by default:

``` python
In [220]: df.align(df2, join='inner')
Out[220]: 
(        one       two
 a  1.400810 -1.643041
 b -0.356470  1.045911
 c  0.797268  0.924515,         one       two
 a  1.400810 -1.643041
 b -0.356470  1.045911
 c  0.797268  0.924515)
```

You can also pass an ``axis`` option to only align on the specified axis:

``` python
In [221]: df.align(df2, join='inner', axis=0)
Out[221]: 
(        one       two     three
 a  1.400810 -1.643041       NaN
 b -0.356470  1.045911  0.395023
 c  0.797268  0.924515 -0.007090,         one       two
 a  1.400810 -1.643041
 b -0.356470  1.045911
 c  0.797268  0.924515)
```

If you pass a Series to [DataFrame.align()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.align.html#pandas.DataFrame.align), you can choose to align both objects either on the DataFrame’s index or columns using the ``axis`` argument:

``` python
In [222]: df.align(df2.iloc[0], axis=1)
Out[222]: 
(        one     three       two
 a  1.400810       NaN -1.643041
 b -0.356470  0.395023  1.045911
 c  0.797268 -0.007090  0.924515
 d       NaN -1.670830  1.553693, one      1.400810
 three         NaN
 two     -1.643041
 Name: a, dtype: float64)
```

### Filling while reindexing

[reindex()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.reindex.html#pandas.Series.reindex) takes an optional parameter ``method`` which is a filling method chosen from the following table:

Method | Action
---|---
pad / ffill | Fill values forward
bfill / backfill | Fill values backward
nearest | Fill from the nearest index value

We illustrate these fill methods on a simple Series:

``` python
In [223]: rng = pd.date_range('1/3/2000', periods=8)

In [224]: ts = pd.Series(np.random.randn(8), index=rng)

In [225]: ts2 = ts[[0, 3, 6]]

In [226]: ts
Out[226]: 
2000-01-03   -0.082578
2000-01-04    0.768554
2000-01-05    0.398842
2000-01-06   -0.357956
2000-01-07    0.156403
2000-01-08   -1.347564
2000-01-09    0.253506
2000-01-10    1.228964
Freq: D, dtype: float64

In [227]: ts2
Out[227]: 
2000-01-03   -0.082578
2000-01-06   -0.357956
2000-01-09    0.253506
dtype: float64

In [228]: ts2.reindex(ts.index)
Out[228]: 
2000-01-03   -0.082578
2000-01-04         NaN
2000-01-05         NaN
2000-01-06   -0.357956
2000-01-07         NaN
2000-01-08         NaN
2000-01-09    0.253506
2000-01-10         NaN
Freq: D, dtype: float64

In [229]: ts2.reindex(ts.index, method='ffill')
Out[229]: 
2000-01-03   -0.082578
2000-01-04   -0.082578
2000-01-05   -0.082578
2000-01-06   -0.357956
2000-01-07   -0.357956
2000-01-08   -0.357956
2000-01-09    0.253506
2000-01-10    0.253506
Freq: D, dtype: float64

In [230]: ts2.reindex(ts.index, method='bfill')
Out[230]: 
2000-01-03   -0.082578
2000-01-04   -0.357956
2000-01-05   -0.357956
2000-01-06   -0.357956
2000-01-07    0.253506
2000-01-08    0.253506
2000-01-09    0.253506
2000-01-10         NaN
Freq: D, dtype: float64

In [231]: ts2.reindex(ts.index, method='nearest')
Out[231]: 
2000-01-03   -0.082578
2000-01-04   -0.082578
2000-01-05   -0.357956
2000-01-06   -0.357956
2000-01-07   -0.357956
2000-01-08    0.253506
2000-01-09    0.253506
2000-01-10    0.253506
Freq: D, dtype: float64
```

These methods require that the indexes are **ordered** increasing or decreasing.

Note that the same result could have been achieved using [fillna](https://pandas.pydata.org/pandas-docs/stable/user_guide/missing_data.html#missing-data-fillna) (except for ``method='nearest'``) or [interpolate](https://pandas.pydata.org/pandas-docs/stable/user_guide/missing_data.html#missing-data-interpolate):

``` python
In [232]: ts2.reindex(ts.index).fillna(method='ffill')
Out[232]: 
2000-01-03   -0.082578
2000-01-04   -0.082578
2000-01-05   -0.082578
2000-01-06   -0.357956
2000-01-07   -0.357956
2000-01-08   -0.357956
2000-01-09    0.253506
2000-01-10    0.253506
Freq: D, dtype: float64
```

[reindex()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.reindex.html#pandas.Series.reindex) will raise a ValueError if the index is not monotonically increasing or decreasing. [fillna()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.fillna.html#pandas.Series.fillna) and [interpolate()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.interpolate.html#pandas.Series.interpolate) will not perform any checks on the order of the index.

### Limits on filling while reindexing

The ``limit`` and ``tolerance`` arguments provide additional control over filling while reindexing. Limit specifies the maximum count of consecutive matches:

``` python
In [233]: ts2.reindex(ts.index, method='ffill', limit=1)
Out[233]: 
2000-01-03   -0.082578
2000-01-04   -0.082578
2000-01-05         NaN
2000-01-06   -0.357956
2000-01-07   -0.357956
2000-01-08         NaN
2000-01-09    0.253506
2000-01-10    0.253506
Freq: D, dtype: float64
```

In contrast, tolerance specifies the maximum distance between the index and indexer values:

``` python
In [234]: ts2.reindex(ts.index, method='ffill', tolerance='1 day')
Out[234]: 
2000-01-03   -0.082578
2000-01-04   -0.082578
2000-01-05         NaN
2000-01-06   -0.357956
2000-01-07   -0.357956
2000-01-08         NaN
2000-01-09    0.253506
2000-01-10    0.253506
Freq: D, dtype: float64
```

Notice that when used on a ``DatetimeIndex``, ``TimedeltaIndex`` or ``PeriodIndex``, ``tolerance`` will coerced into a ``Timedelta`` if possible. This allows you to specify tolerance with appropriate strings.

### Dropping labels from an axis

A method closely related to ``reindex`` is the [drop()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.drop.html#pandas.DataFrame.drop) function. It removes a set of labels from an axis:

``` python
In [235]: df
Out[235]: 
        one       two     three
a  1.400810 -1.643041       NaN
b -0.356470  1.045911  0.395023
c  0.797268  0.924515 -0.007090
d       NaN  1.553693 -1.670830

In [236]: df.drop(['a', 'd'], axis=0)
Out[236]: 
        one       two     three
b -0.356470  1.045911  0.395023
c  0.797268  0.924515 -0.007090

In [237]: df.drop(['one'], axis=1)
Out[237]: 
        two     three
a -1.643041       NaN
b  1.045911  0.395023
c  0.924515 -0.007090
d  1.553693 -1.670830
```

Note that the following also works, but is a bit less obvious / clean:

``` python
In [238]: df.reindex(df.index.difference(['a', 'd']))
Out[238]: 
        one       two     three
b -0.356470  1.045911  0.395023
c  0.797268  0.924515 -0.007090
```

### Renaming / mapping labels

The [rename()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.rename.html#pandas.DataFrame.rename) method allows you to relabel an axis based on some mapping (a dict or Series) or an arbitrary function.

``` python
In [239]: s
Out[239]: 
a   -0.610263
b   -0.170883
c    0.367255
d    0.273860
e    0.314782
dtype: float64

In [240]: s.rename(str.upper)
Out[240]: 
A   -0.610263
B   -0.170883
C    0.367255
D    0.273860
E    0.314782
dtype: float64
```

If you pass a function, it must return a value when called with any of the labels (and must produce a set of unique values). A dict or Series can also be used:

``` python
In [241]: df.rename(columns={'one': 'foo', 'two': 'bar'},
   .....:           index={'a': 'apple', 'b': 'banana', 'd': 'durian'})
   .....: 
Out[241]: 
             foo       bar     three
apple   1.400810 -1.643041       NaN
banana -0.356470  1.045911  0.395023
c       0.797268  0.924515 -0.007090
durian       NaN  1.553693 -1.670830
```

If the mapping doesn’t include a column/index label, it isn’t renamed. Note that extra labels in the mapping don’t throw an error.

*New in version 0.21.0.*

[DataFrame.rename()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.rename.html#pandas.DataFrame.rename) also supports an “axis-style” calling convention, where you specify a single mapper and the axis to apply that mapping to.

``` python
In [242]: df.rename({'one': 'foo', 'two': 'bar'}, axis='columns')
Out[242]: 
        foo       bar     three
a  1.400810 -1.643041       NaN
b -0.356470  1.045911  0.395023
c  0.797268  0.924515 -0.007090
d       NaN  1.553693 -1.670830

In [243]: df.rename({'a': 'apple', 'b': 'banana', 'd': 'durian'}, axis='index')
Out[243]: 
             one       two     three
apple   1.400810 -1.643041       NaN
banana -0.356470  1.045911  0.395023
c       0.797268  0.924515 -0.007090
durian       NaN  1.553693 -1.670830
```

The [rename()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.rename.html#pandas.DataFrame.rename) method also provides an ``inplace`` named parameter that is by default False and copies the underlying data. Pass ``inplace=True`` to rename the data in place.

*New in version 0.18.0.*

Finally, [rename()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.rename.html#pandas.Series.rename) also accepts a scalar or list-like for altering the ``Series.name`` attribute.

``` python
In [244]: s.rename("scalar-name")
Out[244]: 
a   -0.610263
b   -0.170883
c    0.367255
d    0.273860
e    0.314782
Name: scalar-name, dtype: float64
```

*New in version 0.24.0.*

The methods [rename_axis()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.rename_axis.html#pandas.DataFrame.rename_axis) and [rename_axis()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.rename_axis.html#pandas.Series.rename_axis) allow specific names of a MultiIndex to be changed (as opposed to the labels).

```python
In [245]: df = pd.DataFrame({'x': [1, 2, 3, 4, 5, 6],
   .....:                    'y': [10, 20, 30, 40, 50, 60]},
   .....:                   index=pd.MultiIndex.from_product([['a', 'b', 'c'], [1, 2]],
   .....:                   names=['let', 'num']))
   .....: 

In [246]: df
Out[246]: 
         x   y
let num       
a   1    1  10
    2    2  20
b   1    3  30
    2    4  40
c   1    5  50
    2    6  60

In [247]: df.rename_axis(index={'let': 'abc'})
Out[247]: 
         x   y
abc num       
a   1    1  10
    2    2  20
b   1    3  30
    2    4  40
c   1    5  50
    2    6  60

In [248]: df.rename_axis(index=str.upper)
Out[248]: 
         x   y
LET NUM       
a   1    1  10
    2    2  20
b   1    3  30
    2    4  40
c   1    5  50
    2    6  60
```

## Iteration

The behavior of basic iteration over pandas objects depends on the type. When iterating over a Series, it is regarded as array-like, and basic iteration produces the values. Other data structures, like DataFrame and Panel, follow the dict-like convention of iterating over the “keys” of the objects.

In short, basic iteration (``for i in object``) produces:

- **Series**: values
- **DataFrame**: column labels
- **Panel**: item labels

Thus, for example, iterating over a DataFrame gives you the column names:

``` python
In [249]: df = pd.DataFrame({'col1': np.random.randn(3),
   .....:                    'col2': np.random.randn(3)}, index=['a', 'b', 'c'])
   .....: 

In [250]: for col in df:
   .....:     print(col)
   .....: 
col1
col2
```

Pandas objects also have the dict-like [iteritems()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.iteritems.html#pandas.DataFrame.iteritems) method to iterate over the (key, value) pairs.

To iterate over the rows of a DataFrame, you can use the following methods:

- [iterrows()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.iterrows.html#pandas.DataFrame.iterrows): Iterate over the rows of a DataFrame as (index, Series) pairs. This converts the rows to Series objects, which can change the dtypes and has some performance implications.
- [itertuples()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.itertuples.html#pandas.DataFrame.itertuples): Iterate over the rows of a DataFrame as namedtuples of the values. This is a lot faster than [iterrows()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.iterrows.html#pandas.DataFrame.iterrows), and is in most cases preferable to use to iterate over the values of a DataFrame.

::: Warning Warning
Iterating through pandas objects is generally slow. In many cases, iterating manually over the rows is not needed and can be avoided with one of the following approaches:
- Look for a vectorized solution: many operations can be performed using built-in methods or NumPy functions, (boolean) indexing, …
- When you have a function that cannot work on the full DataFrame/Series at once, it is better to use [apply()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.apply.html#pandas.DataFrame.apply) instead of iterating over the values. See the docs on [function application](https://pandas.pydata.org/pandas-docs/stable/getting_started/basics.html#basics-apply).
- If you need to do iterative manipulations on the values but performance is important, consider writing the inner loop with cython or numba. See the [enhancing performance](https://pandas.pydata.org/pandas-docs/stable/user_guide/enhancingperf.html#enhancingperf) section for some examples of this approach.
:::

::: warning Warning
Warning You should **never modify** something you are iterating over. This is not guaranteed to work in all cases. Depending on the data types, the iterator returns a copy and not a view, and writing to it will have no effect!

For example, in the following case setting the value has no effect:

``` python
In [251]: df = pd.DataFrame({'a': [1, 2, 3], 'b': ['a', 'b', 'c']})

In [252]: for index, row in df.iterrows():
   .....:     row['a'] = 10
   .....: 

In [253]: df
Out[253]: 
   a  b
0  1  a
1  2  b
2  3  c
```
:::

### iteritems

Consistent with the dict-like interface, [iteritems()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.iteritems.html#pandas.DataFrame.iteritems) iterates through key-value pairs:

- **Series**: (index, scalar value) pairs
- **DataFrame**: (column, Series) pairs
- **Panel**: (item, DataFrame) pairs

For example:

``` python
In [254]: for item, frame in wp.iteritems():
   .....:     print(item)
   .....:     print(frame)
   .....: 
Item1
                   A         B         C         D
2000-01-01 -1.157892 -1.344312  0.844885  1.075770
2000-01-02 -0.109050  1.643563 -1.469388  0.357021
2000-01-03 -0.674600 -1.776904 -0.968914 -1.294524
2000-01-04  0.413738  0.276662 -0.472035 -0.013960
2000-01-05 -0.362543 -0.006154 -0.923061  0.895717
Item2
                   A         B         C         D
2000-01-01  0.805244 -1.206412  2.565646  1.431256
2000-01-02  1.340309 -1.170299 -0.226169  0.410835
2000-01-03  0.813850  0.132003 -0.827317 -0.076467
2000-01-04 -1.187678  1.130127 -1.436737 -1.413681
2000-01-05  1.607920  1.024180  0.569605  0.875906
```

### iterrows

[iterrows()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.iterrows.html#pandas.DataFrame.iterrows) allows you to iterate through the rows of a DataFrame as Series objects. It returns an iterator yielding each index value along with a Series containing the data in each row:

``` python
In [255]: for row_index, row in df.iterrows():
   .....:     print(row_index, row, sep='\n')
   .....: 
0
a    1
b    a
Name: 0, dtype: object
1
a    2
b    b
Name: 1, dtype: object
2
a    3
b    c
Name: 2, dtype: object
```

::: tip Note
Because [iterrows()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.iterrows.html#pandas.DataFrame.iterrows) returns a Series for each row, it does **not** preserve dtypes across the rows (dtypes are preserved across columns for DataFrames). For example,

``` python
In [256]: df_orig = pd.DataFrame([[1, 1.5]], columns=['int', 'float'])

In [257]: df_orig.dtypes
Out[257]: 
int        int64
float    float64
dtype: object

In [258]: row = next(df_orig.iterrows())[1]

In [259]: row
Out[259]: 
int      1.0
float    1.5
Name: 0, dtype: float64
```

All values in ``row``, returned as a Series, are now upcasted to floats, also the original integer value in column x:

``` python
In [260]: row['int'].dtype
Out[260]: dtype('float64')

In [261]: df_orig['int'].dtype
Out[261]: dtype('int64')
```

To preserve dtypes while iterating over the rows, it is better to use [itertuples()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.itertuples.html#pandas.DataFrame.itertuples) which returns namedtuples of the values and which is generally much faster than [iterrows()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.iterrows.html#pandas.DataFrame.iterrows).
:::

For instance, a contrived way to transpose the DataFrame would be:

``` python
In [262]: df2 = pd.DataFrame({'x': [1, 2, 3], 'y': [4, 5, 6]})

In [263]: print(df2)
   x  y
0  1  4
1  2  5
2  3  6

In [264]: print(df2.T)
   0  1  2
x  1  2  3
y  4  5  6

In [265]: df2_t = pd.DataFrame({idx: values for idx, values in df2.iterrows()})

In [266]: print(df2_t)
   0  1  2
x  1  2  3
y  4  5  6
```

### itertuples

The [itertuples()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.itertuples.html#pandas.DataFrame.itertuples) method will return an iterator yielding a namedtuple for each row in the DataFrame. The first element of the tuple will be the row’s corresponding index value, while the remaining values are the row values.

For instance:

``` python
In [267]: for row in df.itertuples():
   .....:     print(row)
   .....: 
Pandas(Index=0, a=1, b='a')
Pandas(Index=1, a=2, b='b')
Pandas(Index=2, a=3, b='c')
```

This method does not convert the row to a Series object; it merely returns the values inside a namedtuple. Therefore, [itertuples()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.itertuples.html#pandas.DataFrame.itertuples) preserves the data type of the values and is generally faster as [iterrows()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.iterrows.html#pandas.DataFrame.iterrows).

::: tip Note
The column names will be renamed to positional names if they are invalid Python identifiers, repeated, or start with an underscore. With a large number of columns (>255), regular tuples are returned.
:::

## .dt accessor

Series has an accessor to succinctly return datetime like properties for the values of the Series, if it is a datetime/period like Series. This will return a Series, indexed like the existing Series.

``` python
# datetime
In [268]: s = pd.Series(pd.date_range('20130101 09:10:12', periods=4))

In [269]: s
Out[269]: 
0   2013-01-01 09:10:12
1   2013-01-02 09:10:12
2   2013-01-03 09:10:12
3   2013-01-04 09:10:12
dtype: datetime64[ns]

In [270]: s.dt.hour
Out[270]: 
0    9
1    9
2    9
3    9
dtype: int64

In [271]: s.dt.second
Out[271]: 
0    12
1    12
2    12
3    12
dtype: int64

In [272]: s.dt.day
Out[272]: 
0    1
1    2
2    3
3    4
dtype: int64
```

This enables nice expressions like this:

``` python
In [273]: s[s.dt.day == 2]
Out[273]: 
1   2013-01-02 09:10:12
dtype: datetime64[ns]
```

You can easily produces tz aware transformations:

``` python
In [274]: stz = s.dt.tz_localize('US/Eastern')

In [275]: stz
Out[275]: 
0   2013-01-01 09:10:12-05:00
1   2013-01-02 09:10:12-05:00
2   2013-01-03 09:10:12-05:00
3   2013-01-04 09:10:12-05:00
dtype: datetime64[ns, US/Eastern]

In [276]: stz.dt.tz
Out[276]: <DstTzInfo 'US/Eastern' LMT-1 day, 19:04:00 STD>
```

You can also chain these types of operations:

``` python
In [277]: s.dt.tz_localize('UTC').dt.tz_convert('US/Eastern')
Out[277]: 
0   2013-01-01 04:10:12-05:00
1   2013-01-02 04:10:12-05:00
2   2013-01-03 04:10:12-05:00
3   2013-01-04 04:10:12-05:00
dtype: datetime64[ns, US/Eastern]
```

You can also format datetime values as strings with [Series.dt.strftime()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.dt.strftime.html#pandas.Series.dt.strftime) which supports the same format as the standard [strftime()](https://docs.python.org/3/library/datetime.html#datetime.datetime.strftime).

``` python
# DatetimeIndex
In [278]: s = pd.Series(pd.date_range('20130101', periods=4))

In [279]: s
Out[279]: 
0   2013-01-01
1   2013-01-02
2   2013-01-03
3   2013-01-04
dtype: datetime64[ns]

In [280]: s.dt.strftime('%Y/%m/%d')
Out[280]: 
0    2013/01/01
1    2013/01/02
2    2013/01/03
3    2013/01/04
dtype: object
```

``` python
# PeriodIndex
In [281]: s = pd.Series(pd.period_range('20130101', periods=4))

In [282]: s
Out[282]: 
0    2013-01-01
1    2013-01-02
2    2013-01-03
3    2013-01-04
dtype: period[D]

In [283]: s.dt.strftime('%Y/%m/%d')
Out[283]: 
0    2013/01/01
1    2013/01/02
2    2013/01/03
3    2013/01/04
dtype: object
```

The ``.dt`` accessor works for period and timedelta dtypes.

``` python
# period
In [284]: s = pd.Series(pd.period_range('20130101', periods=4, freq='D'))

In [285]: s
Out[285]: 
0    2013-01-01
1    2013-01-02
2    2013-01-03
3    2013-01-04
dtype: period[D]

In [286]: s.dt.year
Out[286]: 
0    2013
1    2013
2    2013
3    2013
dtype: int64

In [287]: s.dt.day
Out[287]: 
0    1
1    2
2    3
3    4
dtype: int64
```

``` python
# timedelta
In [288]: s = pd.Series(pd.timedelta_range('1 day 00:00:05', periods=4, freq='s'))

In [289]: s
Out[289]: 
0   1 days 00:00:05
1   1 days 00:00:06
2   1 days 00:00:07
3   1 days 00:00:08
dtype: timedelta64[ns]

In [290]: s.dt.days
Out[290]: 
0    1
1    1
2    1
3    1
dtype: int64

In [291]: s.dt.seconds
Out[291]: 
0    5
1    6
2    7
3    8
dtype: int64

In [292]: s.dt.components
Out[292]: 
   days  hours  minutes  seconds  milliseconds  microseconds  nanoseconds
0     1      0        0        5             0             0            0
1     1      0        0        6             0             0            0
2     1      0        0        7             0             0            0
3     1      0        0        8             0             0            0
```

::: tip Note
``Series.dt`` will raise a ``TypeError`` if you access with a non-datetime-like values.
:::

## Vectorized string methods

Series is equipped with a set of string processing methods that make it easy to operate on each element of the array. Perhaps most importantly, these methods exclude missing/NA values automatically. These are accessed via the Series’s str attribute and generally have names matching the equivalent (scalar) built-in string methods. For example:

``` python
In [293]: s = pd.Series(['A', 'B', 'C', 'Aaba', 'Baca', np.nan, 'CABA', 'dog', 'cat'])

In [294]: s.str.lower()
Out[294]: 
0       a
1       b
2       c
3    aaba
4    baca
5     NaN
6    caba
7     dog
8     cat
dtype: object
```

Powerful pattern-matching methods are provided as well, but note that pattern-matching generally uses [regular expressions](https://docs.python.org/3/library/re.html) by default (and in some cases always uses them).

Please see [Vectorized String Methods](https://pandas.pydata.org/pandas-docs/stable/user_guide/text.html#text-string-methods) for a complete description.

## Sorting

Pandas supports three kinds of sorting: sorting by index labels, sorting by column values, and sorting by a combination of both.

### By Index

The [Series.sort_index()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.sort_index.html#pandas.Series.sort_index) and [DataFrame.sort_index()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.sort_index.html#pandas.DataFrame.sort_index) methods are used to sort a pandas object by its index levels.

``` python
In [295]: df = pd.DataFrame({
   .....:     'one': pd.Series(np.random.randn(3), index=['a', 'b', 'c']),
   .....:     'two': pd.Series(np.random.randn(4), index=['a', 'b', 'c', 'd']),
   .....:     'three': pd.Series(np.random.randn(3), index=['b', 'c', 'd'])})
   .....: 

In [296]: unsorted_df = df.reindex(index=['a', 'd', 'c', 'b'],
   .....:                          columns=['three', 'two', 'one'])
   .....: 

In [297]: unsorted_df
Out[297]: 
      three       two       one
a       NaN -0.867293  0.050162
d  1.215473 -0.051744       NaN
c -0.421091 -0.712097  0.953102
b  1.205223  0.632624 -1.534113

# DataFrame
In [298]: unsorted_df.sort_index()
Out[298]: 
      three       two       one
a       NaN -0.867293  0.050162
b  1.205223  0.632624 -1.534113
c -0.421091 -0.712097  0.953102
d  1.215473 -0.051744       NaN

In [299]: unsorted_df.sort_index(ascending=False)
Out[299]: 
      three       two       one
d  1.215473 -0.051744       NaN
c -0.421091 -0.712097  0.953102
b  1.205223  0.632624 -1.534113
a       NaN -0.867293  0.050162

In [300]: unsorted_df.sort_index(axis=1)
Out[300]: 
        one     three       two
a  0.050162       NaN -0.867293
d       NaN  1.215473 -0.051744
c  0.953102 -0.421091 -0.712097
b -1.534113  1.205223  0.632624

# Series
In [301]: unsorted_df['three'].sort_index()
Out[301]: 
a         NaN
b    1.205223
c   -0.421091
d    1.215473
Name: three, dtype: float64
```

### By Values

The [Series.sort_values()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.sort_values.html#pandas.Series.sort_values) method is used to sort a Series by its values. The [DataFrame.sort_values()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.sort_values.html#pandas.DataFrame.sort_values) method is used to sort a *DataFrame* by its column or row values. The optional by parameter to [DataFrame.sort_values()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.sort_values.html#pandas.DataFrame.sort_values) may used to specify one or more columns to use to determine the sorted order.

``` python
In [302]: df1 = pd.DataFrame({'one': [2, 1, 1, 1],
   .....:                     'two': [1, 3, 2, 4],
   .....:                     'three': [5, 4, 3, 2]})
   .....: 

In [303]: df1.sort_values(by='two')
Out[303]: 
   one  two  three
0    2    1      5
2    1    2      3
1    1    3      4
3    1    4      2
```

The by parameter can take a list of column names, e.g.:

``` python
In [304]: df1[['one', 'two', 'three']].sort_values(by=['one', 'two'])
Out[304]: 
   one  two  three
2    1    2      3
1    1    3      4
3    1    4      2
0    2    1      5
```

These methods have special treatment of NA values via the ``na_position`` argument:

``` python
In [305]: s[2] = np.nan

In [306]: s.sort_values()
Out[306]: 
0       A
3    Aaba
1       B
4    Baca
6    CABA
8     cat
7     dog
2     NaN
5     NaN
dtype: object

In [307]: s.sort_values(na_position='first')
Out[307]: 
2     NaN
5     NaN
0       A
3    Aaba
1       B
4    Baca
6    CABA
8     cat
7     dog
dtype: object
```

### By Indexes and Values

*New in version 0.23.0*.

Strings passed as the ``by`` parameter to [DataFrame.sort_values()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.sort_values.html#pandas.DataFrame.sort_values) may refer to either columns or index level names.

``` python
# Build MultiIndex
In [308]: idx = pd.MultiIndex.from_tuples([('a', 1), ('a', 2), ('a', 2),
   .....:                                 ('b', 2), ('b', 1), ('b', 1)])
   .....: 

In [309]: idx.names = ['first', 'second']

# Build DataFrame
In [310]: df_multi = pd.DataFrame({'A': np.arange(6, 0, -1)},
   .....:                         index=idx)
   .....: 

In [311]: df_multi
Out[311]: 
              A
first second   
a     1       6
      2       5
      2       4
b     2       3
      1       2
      1       1
```

Sort by ‘second’ (index) and ‘A’ (column)

``` python
In [312]: df_multi.sort_values(by=['second', 'A'])
Out[312]: 
              A
first second   
b     1       1
      1       2
a     1       6
b     2       3
a     2       4
      2       5
```

::: tip Note
Note If a string matches both a column name and an index level name then a warning is issued and the column takes precedence. This will result in an ambiguity error in a future version.
:::

### searchsorted

Series has the [searchsorted()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.searchsorted.html#pandas.Series.searchsorted) method, which works similarly to [numpy.ndarray.searchsorted()](https://docs.scipy.org/doc/numpy/reference/generated/numpy.ndarray.searchsorted.html#numpy.ndarray.searchsorted).

``` python
In [313]: ser = pd.Series([1, 2, 3])

In [314]: ser.searchsorted([0, 3])
Out[314]: array([0, 2])

In [315]: ser.searchsorted([0, 4])
Out[315]: array([0, 3])

In [316]: ser.searchsorted([1, 3], side='right')
Out[316]: array([1, 3])

In [317]: ser.searchsorted([1, 3], side='left')
Out[317]: array([0, 2])

In [318]: ser = pd.Series([3, 1, 2])

In [319]: ser.searchsorted([0, 3], sorter=np.argsort(ser))
Out[319]: array([0, 2])
```

### smallest / largest values

``Series`` has the [nsmallest()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.nsmallest.html#pandas.Series.nsmallest) and [nlargest()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.nlargest.html#pandas.Series.nlargest) methods which return the smallest or largest 𝑛 values. For a large Series this can be much faster than sorting the entire Series and calling ``head(n)`` on the result.

``` python
In [320]: s = pd.Series(np.random.permutation(10))

In [321]: s
Out[321]: 
0    5
1    3
2    2
3    0
4    7
5    6
6    9
7    1
8    4
9    8
dtype: int64

In [322]: s.sort_values()
Out[322]: 
3    0
7    1
2    2
1    3
8    4
0    5
5    6
4    7
9    8
6    9
dtype: int64

In [323]: s.nsmallest(3)
Out[323]: 
3    0
7    1
2    2
dtype: int64

In [324]: s.nlargest(3)
Out[324]: 
6    9
9    8
4    7
dtype: int64
```

``DataFrame`` also has the ``nlargest`` and ``nsmallest`` methods.

``` python
In [325]: df = pd.DataFrame({'a': [-2, -1, 1, 10, 8, 11, -1],
   .....:                    'b': list('abdceff'),
   .....:                    'c': [1.0, 2.0, 4.0, 3.2, np.nan, 3.0, 4.0]})
   .....: 

In [326]: df.nlargest(3, 'a')
Out[326]: 
    a  b    c
5  11  f  3.0
3  10  c  3.2
4   8  e  NaN

In [327]: df.nlargest(5, ['a', 'c'])
Out[327]: 
    a  b    c
5  11  f  3.0
3  10  c  3.2
4   8  e  NaN
2   1  d  4.0
6  -1  f  4.0

In [328]: df.nsmallest(3, 'a')
Out[328]: 
   a  b    c
0 -2  a  1.0
1 -1  b  2.0
6 -1  f  4.0

In [329]: df.nsmallest(5, ['a', 'c'])
Out[329]: 
   a  b    c
0 -2  a  1.0
1 -1  b  2.0
6 -1  f  4.0
2  1  d  4.0
4  8  e  NaN
```

### Sorting by a MultiIndex column

You must be explicit about sorting when the column is a MultiIndex, and fully specify all levels to by.

``` python
In [330]: df1.columns = pd.MultiIndex.from_tuples([('a', 'one'),
   .....:                                          ('a', 'two'),
   .....:                                          ('b', 'three')])
   .....: 

In [331]: df1.sort_values(by=('a', 'two'))
Out[331]: 
    a         b
  one two three
0   2   1     5
2   1   2     3
1   1   3     4
3   1   4     2
```

## Copying

The [copy()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.copy.html#pandas.DataFrame.copy) method on pandas objects copies the underlying data (though not the axis indexes, since they are immutable) and returns a new object. Note that **it is seldom necessary to copy objects**. For example, there are only a handful of ways to alter a DataFrame *in-place*:

- Inserting, deleting, or modifying a column.
- Assigning to the ``index`` or ``columns`` attributes.
- For homogeneous data, directly modifying the values via the ``values`` attribute or advanced indexing.

To be clear, no pandas method has the side effect of modifying your data; almost every method returns a new object, leaving the original object untouched. If the data is modified, it is because you did so explicitly.

## dtypes

For the most part, pandas uses NumPy arrays and dtypes for Series or individual columns of a DataFrame. NumPy provides support for ``float``, ``int``, ``bool``, ``timedelta64[ns]`` and ``datetime64[ns]`` (note that NumPy does not support timezone-aware datetimes).

Pandas and third-party libraries *extend* NumPy’s type system in a few places. This section describes the extensions pandas has made internally. See [Extension Types](https://pandas.pydata.org/pandas-docs/stable/development/extending.html#extending-extension-types) for how to write your own extension that works with pandas. See [Extension Data Types](https://pandas.pydata.org/pandas-docs/stable/ecosystem.html#ecosystem-extensions) for a list of third-party libraries that have implemented an extension.

The following table lists all of pandas extension types. See the respective documentation sections for more on each type.

Kind of Data | Data Type | Scalar | Array | Documentation
---|---|---|---|---
tz-aware datetime | [DatetimeTZDtype](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DatetimeTZDtype.html#pandas.DatetimeTZDtype) | [Timestamp](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Timestamp.html#pandas.Timestamp) | [arrays.DatetimeArray](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.arrays.DatetimeArray.html#pandas.arrays.DatetimeArray) | [Time Zone Handling](https://pandas.pydata.org/pandas-docs/stable/user_guide/timeseries.html#timeseries-timezone)
Categorical | [CategoricalDtype](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.CategoricalDtype.html#pandas.CategoricalDtype) | (none) | [Categorical](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Categorical.html#pandas.Categorical) | [Categorical Data](https://pandas.pydata.org/pandas-docs/stable/user_guide/categorical.html#categorical)
period (time spans) | [PeriodDtype](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.PeriodDtype.html#pandas.PeriodDtype) | [Period](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Period.html#pandas.Period) | arrays.PeriodArray | [Time Span Representation](https://pandas.pydata.org/pandas-docs/stable/user_guide/timeseries.html#timeseries-periods)
sparse | [SparseDtype](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.SparseDtype.html#pandas.SparseDtype) | (none) | arrays.SparseArray | [Sparse data structures](https://pandas.pydata.org/pandas-docs/stable/user_guide/sparse.html#sparse)
intervals | [IntervalDtype](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.IntervalDtype.html#pandas.IntervalDtype) | [Interval](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Interval.html#pandas.Interval) | [arrays.IntervalArray](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.arrays.IntervalArray.html#pandas.arrays.IntervalArray) | [IntervalIndex](https://pandas.pydata.org/pandas-docs/stable/user_guide/advanced.html#advanced-intervalindex)
nullable integer | [Int64Dtype](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Int64Dtype.html#pandas.Int64Dtype), … | (none) | [arrays.IntegerArray](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.arrays.IntegerArray.html#pandas.arrays.IntegerArray) | [Nullable Integer Data Type](https://pandas.pydata.org/pandas-docs/stable/user_guide/integer_na.html#integer-na)

Pandas uses the ``object`` dtype for storing strings.

Finally, arbitrary objects may be stored using the ``object`` dtype, but should be avoided to the extent possible (for performance and interoperability with other libraries and methods. See [object conversion](https://pandas.pydata.org/pandas-docs/stable/getting_started/basics.html#basics-object-conversion)).

A convenient [dtypes](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.dtypes.html#pandas.DataFrame.dtypes) attribute for DataFrame returns a Series with the data type of each column.

``` python
In [332]: dft = pd.DataFrame({'A': np.random.rand(3),
   .....:                     'B': 1,
   .....:                     'C': 'foo',
   .....:                     'D': pd.Timestamp('20010102'),
   .....:                     'E': pd.Series([1.0] * 3).astype('float32'),
   .....:                     'F': False,
   .....:                     'G': pd.Series([1] * 3, dtype='int8')})
   .....: 

In [333]: dft
Out[333]: 
          A  B    C          D    E      F  G
0  0.278831  1  foo 2001-01-02  1.0  False  1
1  0.242124  1  foo 2001-01-02  1.0  False  1
2  0.078031  1  foo 2001-01-02  1.0  False  1

In [334]: dft.dtypes
Out[334]: 
A           float64
B             int64
C            object
D    datetime64[ns]
E           float32
F              bool
G              int8
dtype: object
```

On a ``Series`` object, use the [dtype](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.dtype.html#pandas.Series.dtype) attribute.

``` python
In [335]: dft['A'].dtype
Out[335]: dtype('float64')
```

If a pandas object contains data with multiple dtypes in a single column, the dtype of the column will be chosen to accommodate all of the data types (``object`` is the most general).

``` python
# these ints are coerced to floats
In [336]: pd.Series([1, 2, 3, 4, 5, 6.])
Out[336]: 
0    1.0
1    2.0
2    3.0
3    4.0
4    5.0
5    6.0
dtype: float64

# string data forces an ``object`` dtype
In [337]: pd.Series([1, 2, 3, 6., 'foo'])
Out[337]: 
0      1
1      2
2      3
3      6
4    foo
dtype: object
```

The number of columns of each type in a ``DataFrame`` can be found by calling [get_dtype_counts()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.get_dtype_counts.html#pandas.DataFrame.get_dtype_counts).

``` python
In [338]: dft.get_dtype_counts()
Out[338]: 
float64           1
float32           1
int64             1
int8              1
datetime64[ns]    1
bool              1
object            1
dtype: int64
```

Numeric dtypes will propagate and can coexist in DataFrames. If a dtype is passed (either directly via the ``dtype`` keyword, a passed ``ndarray``, or a passed ``Series``, then it will be preserved in DataFrame operations. Furthermore, different numeric dtypes will **NOT** be combined. The following example will give you a taste.

``` python
Frame(np.random.randn(8, 1), columns=['A'], dtype='float32')

In [340]: df1
Out[340]: 
          A
0 -1.641339
1 -0.314062
2 -0.679206
3  1.178243
4  0.181790
5 -2.044248
6  1.151282
7 -1.641398

In [341]: df1.dtypes
Out[341]: 
A    float32
dtype: object

In [342]: df2 = pd.DataFrame({'A': pd.Series(np.random.randn(8), dtype='float16'),
   .....:                     'B': pd.Series(np.random.randn(8)),
   .....:                     'C': pd.Series(np.array(np.random.randn(8),
   .....:                                             dtype='uint8'))})
   .....: 

In [343]: df2
Out[343]: 
          A         B    C
0  0.130737 -1.143729    1
1  0.289551  2.787500    0
2  0.590820 -0.708143  254
3 -0.020142 -1.512388    0
4 -1.048828 -0.243145    1
5 -0.808105 -0.650992    0
6  1.373047  2.090108    0
7 -0.254395  0.433098    0

In [344]: df2.dtypes
Out[344]: 
A    float16
B    float64
C      uint8
dtype: object
```

### defaults

By default integer types are ``int64`` and float types are ``float64``, regardless of platform (32-bit or 64-bit). The following will all result in ``int64`` dtypes.

``` python
In [345]: pd.DataFrame([1, 2], columns=['a']).dtypes
Out[345]: 
a    int64
dtype: object

In [346]: pd.DataFrame({'a': [1, 2]}).dtypes
Out[346]: 
a    int64
dtype: object

In [347]: pd.DataFrame({'a': 1}, index=list(range(2))).dtypes
Out[347]: 
a    int64
dtype: object
```

Note that Numpy will choose *platform-dependent* types when creating arrays. The following **WILL** result in ``int32`` on 32-bit platform.

``` python
In [348]: frame = pd.DataFrame(np.array([1, 2]))
```

### upcasting

Types can potentially be upcasted when combined with other types, meaning they are promoted from the current type (e.g. ``int`` to ``float``).

``` python
In [349]: df3 = df1.reindex_like(df2).fillna(value=0.0) + df2

In [350]: df3
Out[350]: 
          A         B      C
0 -1.510602 -1.143729    1.0
1 -0.024511  2.787500    0.0
2 -0.088385 -0.708143  254.0
3  1.158101 -1.512388    0.0
4 -0.867039 -0.243145    1.0
5 -2.852354 -0.650992    0.0
6  2.524329  2.090108    0.0
7 -1.895793  0.433098    0.0

In [351]: df3.dtypes
Out[351]: 
A    float32
B    float64
C    float64
dtype: object
```

[DataFrame.to_numpy()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.to_numpy.html#pandas.DataFrame.to_numpy) will return the *lower-common-denominator* of the dtypes, meaning the dtype that can accommodate **ALL** of the types in the resulting homogeneous dtyped NumPy array. This can force some upcasting.

``` python
In [352]: df3.to_numpy().dtype
Out[352]: dtype('float64')
```

### astype

You can use the [astype()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.astype.html#pandas.DataFrame.astype) method to explicitly convert dtypes from one to another. These will by default return a copy, even if the dtype was unchanged (pass ``copy=False`` to change this behavior). In addition, they will raise an exception if the astype operation is invalid.

Upcasting is always according to the **numpy** rules. If two different dtypes are involved in an operation, then the more general one will be used as the result of the operation.

``` python
In [353]: df3
Out[353]: 
          A         B      C
0 -1.510602 -1.143729    1.0
1 -0.024511  2.787500    0.0
2 -0.088385 -0.708143  254.0
3  1.158101 -1.512388    0.0
4 -0.867039 -0.243145    1.0
5 -2.852354 -0.650992    0.0
6  2.524329  2.090108    0.0
7 -1.895793  0.433098    0.0

In [354]: df3.dtypes
Out[354]: 
A    float32
B    float64
C    float64
dtype: object

# conversion of dtypes
In [355]: df3.astype('float32').dtypes
Out[355]: 
A    float32
B    float32
C    float32
dtype: object
```

Convert a subset of columns to a specified type using [astype()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.astype.html#pandas.DataFrame.astype).

``` python
In [356]: dft = pd.DataFrame({'a': [1, 2, 3], 'b': [4, 5, 6], 'c': [7, 8, 9]})

In [357]: dft[['a', 'b']] = dft[['a', 'b']].astype(np.uint8)

In [358]: dft
Out[358]: 
   a  b  c
0  1  4  7
1  2  5  8
2  3  6  9

In [359]: dft.dtypes
Out[359]: 
a    uint8
b    uint8
c    int64
dtype: object
```

*New in version 0.19.0*.

Convert certain columns to a specific dtype by passing a dict to [astype()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.astype.html#pandas.DataFrame.astype).

``` python
In [360]: dft1 = pd.DataFrame({'a': [1, 0, 1], 'b': [4, 5, 6], 'c': [7, 8, 9]})

In [361]: dft1 = dft1.astype({'a': np.bool, 'c': np.float64})

In [362]: dft1
Out[362]: 
       a  b    c
0   True  4  7.0
1  False  5  8.0
2   True  6  9.0

In [363]: dft1.dtypes
Out[363]: 
a       bool
b      int64
c    float64
dtype: object
```

::: tip Note

When trying to convert a subset of columns to a specified type using [astype()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.astype.html#pandas.DataFrame.astype) and [loc()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.loc.html#pandas.DataFrame.loc), upcasting occurs.

[loc()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.loc.html#pandas.DataFrame.loc) tries to fit in what we are assigning to the current dtypes, while ``[]`` will overwrite them taking the dtype from the right hand side. Therefore the following piece of code produces the unintended result.

``` python
In [364]: dft = pd.DataFrame({'a': [1, 2, 3], 'b': [4, 5, 6], 'c': [7, 8, 9]})

In [365]: dft.loc[:, ['a', 'b']].astype(np.uint8).dtypes
Out[365]: 
a    uint8
b    uint8
dtype: object

In [366]: dft.loc[:, ['a', 'b']] = dft.loc[:, ['a', 'b']].astype(np.uint8)

In [367]: dft.dtypes
Out[367]: 
a    int64
b    int64
c    int64
dtype: object
```
:::

### object conversion

pandas offers various functions to try to force conversion of types from the ``object`` dtype to other types. In cases where the data is already of the correct type, but stored in an object array, the [DataFrame.infer_objects()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.infer_objects.html#pandas.DataFrame.infer_objects) and [Series.infer_objects()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.infer_objects.html#pandas.Series.infer_objects) methods can be used to soft convert to the correct type.

``` python
In [368]: import datetime

In [369]: df = pd.DataFrame([[1, 2],
   .....:                    ['a', 'b'],
   .....:                    [datetime.datetime(2016, 3, 2),
   .....:                     datetime.datetime(2016, 3, 2)]])
   .....: 

In [370]: df = df.T

In [371]: df
Out[371]: 
   0  1                    2
0  1  a  2016-03-02 00:00:00
1  2  b  2016-03-02 00:00:00

In [372]: df.dtypes
Out[372]: 
0    object
1    object
2    object
dtype: object
```

Because the data was transposed the original inference stored all columns as object, which ``infer_objects`` will correct.

``` python
In [373]: df.infer_objects().dtypes
Out[373]: 
0             int64
1            object
2    datetime64[ns]
dtype: object
```

The following functions are available for one dimensional object arrays or scalars to perform hard conversion of objects to a specified type:

- [to_numeric()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.to_numeric.html#pandas.to_numeric) (conversion to numeric dtypes)
  ``` python
  In [374]: m = ['1.1', 2, 3]

  In [375]: pd.to_numeric(m)
  Out[375]: array([ 1.1,  2. ,  3. ])
  ```

- [to_datetime()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.to_datetime.html#pandas.to_datetime) (conversion to datetime objects)
  ``` python
  In [376]: import datetime

  In [377]: m = ['2016-07-09', datetime.datetime(2016, 3, 2)]

  In [378]: pd.to_datetime(m)
  Out[378]: DatetimeIndex(['2016-07-09', '2016-03-02'], dtype='datetime64[ns]', freq=None)
  ```

- [to_timedelta()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.to_timedelta.html#pandas.to_timedelta) (conversion to timedelta objects)
  ``` python
  In [379]: m = ['5us', pd.Timedelta('1day')]

  In [380]: pd.to_timedelta(m)
  Out[380]: TimedeltaIndex(['0 days 00:00:00.000005', '1 days 00:00:00'], dtype='timedelta64[ns]', freq=None)
  ```

To force a conversion, we can pass in an ``errors`` argument, which specifies how pandas should deal with elements that cannot be converted to desired dtype or object. By default, ``errors='raise'``, meaning that any errors encountered will be raised during the conversion process. However, if ``errors='coerce'``, these errors will be ignored and pandas will convert problematic elements to ``pd.NaT`` (for datetime and timedelta) or ``np.nan`` (for numeric). This might be useful if you are reading in data which is mostly of the desired dtype (e.g. numeric, datetime), but occasionally has non-conforming elements intermixed that you want to represent as missing:

``` python
In [381]: import datetime

In [382]: m = ['apple', datetime.datetime(2016, 3, 2)]

In [383]: pd.to_datetime(m, errors='coerce')
Out[383]: DatetimeIndex(['NaT', '2016-03-02'], dtype='datetime64[ns]', freq=None)

In [384]: m = ['apple', 2, 3]

In [385]: pd.to_numeric(m, errors='coerce')
Out[385]: array([ nan,   2.,   3.])

In [386]: m = ['apple', pd.Timedelta('1day')]

In [387]: pd.to_timedelta(m, errors='coerce')
Out[387]: TimedeltaIndex([NaT, '1 days'], dtype='timedelta64[ns]', freq=None)
```

The ``errors`` parameter has a third option of ``errors='ignore'``, which will simply return the passed in data if it encounters any errors with the conversion to a desired data type:

``` python
In [388]: import datetime

In [389]: m = ['apple', datetime.datetime(2016, 3, 2)]

In [390]: pd.to_datetime(m, errors='ignore')
Out[390]: Index(['apple', 2016-03-02 00:00:00], dtype='object')

In [391]: m = ['apple', 2, 3]

In [392]: pd.to_numeric(m, errors='ignore')
Out[392]: array(['apple', 2, 3], dtype=object)

In [393]: m = ['apple', pd.Timedelta('1day')]

In [394]: pd.to_timedelta(m, errors='ignore')
Out[394]: array(['apple', Timedelta('1 days 00:00:00')], dtype=object)
```

In addition to object conversion, [to_numeric()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.to_numeric.html#pandas.to_numeric) provides another argument ``downcast``, which gives the option of downcasting the newly (or already) numeric data to a smaller dtype, which can conserve memory:

``` python
In [395]: m = ['1', 2, 3]

In [396]: pd.to_numeric(m, downcast='integer')   # smallest signed int dtype
Out[396]: array([1, 2, 3], dtype=int8)

In [397]: pd.to_numeric(m, downcast='signed')    # same as 'integer'
Out[397]: array([1, 2, 3], dtype=int8)

In [398]: pd.to_numeric(m, downcast='unsigned')  # smallest unsigned int dtype
Out[398]: array([1, 2, 3], dtype=uint8)

In [399]: pd.to_numeric(m, downcast='float')     # smallest float dtype
Out[399]: array([ 1.,  2.,  3.], dtype=float32)
```

As these methods apply only to one-dimensional arrays, lists or scalars; they cannot be used directly on multi-dimensional objects such as DataFrames. However, with [apply()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.apply.html#pandas.DataFrame.apply), we can “apply” the function over each column efficiently:

``` python
In [400]: import datetime

In [401]: df = pd.DataFrame([
   .....:     ['2016-07-09', datetime.datetime(2016, 3, 2)]] * 2, dtype='O')
   .....: 

In [402]: df
Out[402]: 
            0                    1
0  2016-07-09  2016-03-02 00:00:00
1  2016-07-09  2016-03-02 00:00:00

In [403]: df.apply(pd.to_datetime)
Out[403]: 
           0          1
0 2016-07-09 2016-03-02
1 2016-07-09 2016-03-02

In [404]: df = pd.DataFrame([['1.1', 2, 3]] * 2, dtype='O')

In [405]: df
Out[405]: 
     0  1  2
0  1.1  2  3
1  1.1  2  3

In [406]: df.apply(pd.to_numeric)
Out[406]: 
     0  1  2
0  1.1  2  3
1  1.1  2  3

In [407]: df = pd.DataFrame([['5us', pd.Timedelta('1day')]] * 2, dtype='O')

In [408]: df
Out[408]: 
     0                1
0  5us  1 days 00:00:00
1  5us  1 days 00:00:00

In [409]: df.apply(pd.to_timedelta)
Out[409]: 
                0      1
0 00:00:00.000005 1 days
1 00:00:00.000005 1 days
```

### gotchas

Performing selection operations on ``integer`` type data can easily upcast the data to ``floating``. The dtype of the input data will be preserved in cases where ``nans`` are not introduced. See also [Support for integer NA](https://pandas.pydata.org/pandas-docs/stable/user_guide/gotchas.html#gotchas-intna).

``` python
In [410]: dfi = df3.astype('int32')

In [411]: dfi['E'] = 1

In [412]: dfi
Out[412]: 
   A  B    C  E
0 -1 -1    1  1
1  0  2    0  1
2  0  0  254  1
3  1 -1    0  1
4  0  0    1  1
5 -2  0    0  1
6  2  2    0  1
7 -1  0    0  1

In [413]: dfi.dtypes
Out[413]: 
A    int32
B    int32
C    int32
E    int64
dtype: object

In [414]: casted = dfi[dfi > 0]

In [415]: casted
Out[415]: 
     A    B      C  E
0  NaN  NaN    1.0  1
1  NaN  2.0    NaN  1
2  NaN  NaN  254.0  1
3  1.0  NaN    NaN  1
4  NaN  NaN    1.0  1
5  NaN  NaN    NaN  1
6  2.0  2.0    NaN  1
7  NaN  NaN    NaN  1

In [416]: casted.dtypes
Out[416]: 
A    float64
B    float64
C    float64
E      int64
dtype: object
```

While float dtypes are unchanged.

``` python
In [417]: dfa = df3.copy()

In [418]: dfa['A'] = dfa['A'].astype('float32')

In [419]: dfa.dtypes
Out[419]: 
A    float32
B    float64
C    float64
dtype: object

In [420]: casted = dfa[df2 > 0]

In [421]: casted
Out[421]: 
          A         B      C
0 -1.510602       NaN    1.0
1 -0.024511  2.787500    NaN
2 -0.088385       NaN  254.0
3       NaN       NaN    NaN
4       NaN       NaN    1.0
5       NaN       NaN    NaN
6  2.524329  2.090108    NaN
7       NaN  0.433098    NaN

In [422]: casted.dtypes
Out[422]: 
A    float32
B    float64
C    float64
dtype: object
```

## Selecting columns based on ``dtype``

The [select_dtypes()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.select_dtypes.html#pandas.DataFrame.select_dtypes) method implements subsetting of columns based on their dtype.

First, let’s create a [DataFrame](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.html#pandas.DataFrame) with a slew of different dtypes:

``` python
In [423]: df = pd.DataFrame({'string': list('abc'),
   .....:                    'int64': list(range(1, 4)),
   .....:                    'uint8': np.arange(3, 6).astype('u1'),
   .....:                    'float64': np.arange(4.0, 7.0),
   .....:                    'bool1': [True, False, True],
   .....:                    'bool2': [False, True, False],
   .....:                    'dates': pd.date_range('now', periods=3),
   .....:                    'category': pd.Series(list("ABC")).astype('category')})
   .....: 

In [424]: df['tdeltas'] = df.dates.diff()

In [425]: df['uint64'] = np.arange(3, 6).astype('u8')

In [426]: df['other_dates'] = pd.date_range('20130101', periods=3)

In [427]: df['tz_aware_dates'] = pd.date_range('20130101', periods=3, tz='US/Eastern')

In [428]: df
Out[428]: 
  string  int64  uint8  float64  bool1  bool2                      dates category tdeltas  uint64 other_dates            tz_aware_dates
0      a      1      3      4.0   True  False 2019-03-12 22:38:38.692567        A     NaT       3  2013-01-01 2013-01-01 00:00:00-05:00
1      b      2      4      5.0  False   True 2019-03-13 22:38:38.692567        B  1 days       4  2013-01-02 2013-01-02 00:00:00-05:00
2      c      3      5      6.0   True  False 2019-03-14 22:38:38.692567        C  1 days       5  2013-01-03 2013-01-03 00:00:00-05:00
```

And the dtypes:

``` python
In [429]: df.dtypes
Out[429]: 
string                                object
int64                                  int64
uint8                                  uint8
float64                              float64
bool1                                   bool
bool2                                   bool
dates                         datetime64[ns]
category                            category
tdeltas                      timedelta64[ns]
uint64                                uint64
other_dates                   datetime64[ns]
tz_aware_dates    datetime64[ns, US/Eastern]
dtype: object
```

[select_dtypes()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.select_dtypes.html#pandas.DataFrame.select_dtypes) has two parameters ``include`` and ``exclude`` that allow you to say “give me the columns with these dtypes” (``include``) and/or “give the columns without these dtypes” (``exclude``).

For example, to select bool columns:

``` python
In [430]: df.select_dtypes(include=[bool])
Out[430]: 
   bool1  bool2
0   True  False
1  False   True
2   True  False
```

You can also pass the name of a dtype in the [NumPy dtype hierarchy](https://docs.scipy.org/doc/numpy/reference/arrays.scalars.html):

``` python
In [431]: df.select_dtypes(include=['bool'])
Out[431]: 
   bool1  bool2
0   True  False
1  False   True
2   True  False
```

[select_dtypes()](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.select_dtypes.html#pandas.DataFrame.select_dtypes) also works with generic dtypes as well.

For example, to select all numeric and boolean columns while excluding unsigned integers:

``` python
In [432]: df.select_dtypes(include=['number', 'bool'], exclude=['unsignedinteger'])
Out[432]: 
   int64  float64  bool1  bool2 tdeltas
0      1      4.0   True  False     NaT
1      2      5.0  False   True  1 days
2      3      6.0   True  False  1 days
```

To select string columns you must use the object dtype:

``` python
In [433]: df.select_dtypes(include=['object'])
Out[433]: 
  string
0      a
1      b
2      c
```

To see all the child dtypes of a generic ``dtype`` like ``numpy.number`` you can define a function that returns a tree of child dtypes:

``` python
In [434]: def subdtypes(dtype):
   .....:     subs = dtype.__subclasses__()
   .....:     if not subs:
   .....:         return dtype
   .....:     return [dtype, [subdtypes(dt) for dt in subs]]
   .....: 
```

All NumPy dtypes are subclasses of ``numpy.generic``:

``` python
In [435]: subdtypes(np.generic)
Out[435]: 
[numpy.generic,
 [[numpy.number,
   [[numpy.integer,
     [[numpy.signedinteger,
       [numpy.int8,
        numpy.int16,
        numpy.int32,
        numpy.int64,
        numpy.int64,
        numpy.timedelta64]],
      [numpy.unsignedinteger,
       [numpy.uint8,
        numpy.uint16,
        numpy.uint32,
        numpy.uint64,
        numpy.uint64]]]],
    [numpy.inexact,
     [[numpy.floating,
       [numpy.float16, numpy.float32, numpy.float64, numpy.float128]],
      [numpy.complexfloating,
       [numpy.complex64, numpy.complex128, numpy.complex256]]]]]],
  [numpy.flexible,
   [[numpy.character, [numpy.bytes_, numpy.str_]],
    [numpy.void, [numpy.record]]]],
  numpy.bool_,
  numpy.datetime64,
  numpy.object_]]
```

::: tip Note
Pandas also defines the types ``category``, and ``datetime64[ns, tz]``, which are not integrated into the normal NumPy hierarchy and won’t show up with the above function.
:::
