# 清理/填充缺失数据

pandas objects are equipped with various data manipulation methods for dealing with missing data.

## Filling missing values: fillna

[fillna()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.fillna.html#pandas.DataFrame.fillna) can “fill in” NA values with non-NA data in a couple of ways, which we illustrate:

**Replace NA with a scalar value**

```python
In [41]: df2
Out[41]: 
        one       two     three four   five  timestamp
a       NaN  0.501113 -0.355322  bar  False        NaT
c       NaN  0.580967  0.983801  bar  False        NaT
e  0.057802  0.761948 -0.712964  bar   True 2012-01-01
f -0.443160 -0.974602  1.047704  bar  False 2012-01-01
h       NaN -1.053898 -0.019369  bar  False        NaT

In [42]: df2.fillna(0)
Out[42]: 
        one       two     three four   five            timestamp
a  0.000000  0.501113 -0.355322  bar  False                    0
c  0.000000  0.580967  0.983801  bar  False                    0
e  0.057802  0.761948 -0.712964  bar   True  2012-01-01 00:00:00
f -0.443160 -0.974602  1.047704  bar  False  2012-01-01 00:00:00
h  0.000000 -1.053898 -0.019369  bar  False                    0

In [43]: df2['one'].fillna('missing')
Out[43]: 
a     missing
c     missing
e    0.057802
f    -0.44316
h     missing
Name: one, dtype: object
```

**Fill gaps forward or backward**

Using the same filling arguments as [reindexing](http://pandas.pydata.org/pandas-docs/stable/basics.html#basics-reindexing), we can propagate non-NA values forward or backward:

```python
In [44]: df
Out[44]: 
        one       two     three
a       NaN  0.501113 -0.355322
c       NaN  0.580967  0.983801
e  0.057802  0.761948 -0.712964
f -0.443160 -0.974602  1.047704
h       NaN -1.053898 -0.019369

In [45]: df.fillna(method='pad')
Out[45]: 
        one       two     three
a       NaN  0.501113 -0.355322
c       NaN  0.580967  0.983801
e  0.057802  0.761948 -0.712964
f -0.443160 -0.974602  1.047704
h -0.443160 -1.053898 -0.019369
```

**Limit the amount of filling**

If we only want consecutive gaps filled up to a certain number of data points, we can use the limit keyword:

```python
In [46]: df
Out[46]: 
   one       two     three
a  NaN  0.501113 -0.355322
c  NaN  0.580967  0.983801
e  NaN       NaN       NaN
f  NaN       NaN       NaN
h  NaN -1.053898 -0.019369

In [47]: df.fillna(method='pad', limit=1)
Out[47]: 
   one       two     three
a  NaN  0.501113 -0.355322
c  NaN  0.580967  0.983801
e  NaN  0.580967  0.983801
f  NaN       NaN       NaN
h  NaN -1.053898 -0.019369
```

To remind you, these are the available filling methods:

Method | Action
---|---
pad / ffill | Fill values forward
bfill / backfill | Fill values backward

With time series data, using pad/ffill is extremely common so that the “last known value” is available at every time point.

[ffill()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.ffill.html#pandas.DataFrame.ffill) is equivalent to ``fillna(method='ffill')`` and [bfill()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.bfill.html#pandas.DataFrame.bfill) is equivalent to ``fillna(method='bfill')``

## Filling with a PandasObject

You can also fillna using a dict or Series that is alignable. The labels of the dict or index of the Series must match the columns of the frame you wish to fill. The use case of this is to fill a DataFrame with the mean of that column.

```python
In [48]: dff = pd.DataFrame(np.random.randn(10,3), columns=list('ABC'))

In [49]: dff.iloc[3:5,0] = np.nan

In [50]: dff.iloc[4:6,1] = np.nan

In [51]: dff.iloc[5:8,2] = np.nan

In [52]: dff
Out[52]: 
          A         B         C
0  0.758887  2.340598  0.219039
1 -1.235583  0.031785  0.701683
2 -1.557016 -0.636986 -1.238610
3       NaN -1.002278  0.654052
4       NaN       NaN  1.053999
5  0.651981       NaN       NaN
6  0.109001 -0.533294       NaN
7 -1.037831 -1.150016       NaN
8 -0.687693  1.921056 -0.121113
9 -0.258742 -0.706329  0.402547

In [53]: dff.fillna(dff.mean())
Out[53]: 
          A         B         C
0  0.758887  2.340598  0.219039
1 -1.235583  0.031785  0.701683
2 -1.557016 -0.636986 -1.238610
3 -0.407125 -1.002278  0.654052
4 -0.407125  0.033067  1.053999
5  0.651981  0.033067  0.238800
6  0.109001 -0.533294  0.238800
7 -1.037831 -1.150016  0.238800
8 -0.687693  1.921056 -0.121113
9 -0.258742 -0.706329  0.402547

In [54]: dff.fillna(dff.mean()['B':'C'])
Out[54]: 
          A         B         C
0  0.758887  2.340598  0.219039
1 -1.235583  0.031785  0.701683
2 -1.557016 -0.636986 -1.238610
3       NaN -1.002278  0.654052
4       NaN  0.033067  1.053999
5  0.651981  0.033067  0.238800
6  0.109001 -0.533294  0.238800
7 -1.037831 -1.150016  0.238800
8 -0.687693  1.921056 -0.121113
9 -0.258742 -0.706329  0.402547
```

Same result as above, but is aligning the ‘fill’ value which is a Series in this case.

```python
In [55]: dff.where(pd.notna(dff), dff.mean(), axis='columns')
Out[55]: 
          A         B         C
0  0.758887  2.340598  0.219039
1 -1.235583  0.031785  0.701683
2 -1.557016 -0.636986 -1.238610
3 -0.407125 -1.002278  0.654052
4 -0.407125  0.033067  1.053999
5  0.651981  0.033067  0.238800
6  0.109001 -0.533294  0.238800
7 -1.037831 -1.150016  0.238800
8 -0.687693  1.921056 -0.121113
9 -0.258742 -0.706329  0.402547
```

## Dropping axis labels with missing data: dropna

You may wish to simply exclude labels from a data set which refer to missing data. To do this, use [dropna()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.dropna.html#pandas.DataFrame.dropna):

```python
In [56]: df
Out[56]: 
   one       two     three
a  NaN  0.501113 -0.355322
c  NaN  0.580967  0.983801
e  NaN  0.000000  0.000000
f  NaN  0.000000  0.000000
h  NaN -1.053898 -0.019369

In [57]: df.dropna(axis=0)
Out[57]: 
Empty DataFrame
Columns: [one, two, three]
Index: []

In [58]: df.dropna(axis=1)
Out[58]: 
        two     three
a  0.501113 -0.355322
c  0.580967  0.983801
e  0.000000  0.000000
f  0.000000  0.000000
h -1.053898 -0.019369

In [59]: df['one'].dropna()
Out[59]: Series([], Name: one, dtype: float64)
```

An equivalent [dropna()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.dropna.html#pandas.DataFrame.dropna) is available for Series. DataFrame.dropna has considerably more options than Series.dropna, which can be examined [in the API](http://pandas.pydata.org/pandas-docs/stable/api.html#api-dataframe-missing).

## Interpolation

*New in version 0.21.0*: The ``limit_area`` keyword argument was added.

Both Series and DataFrame objects have [interpolate()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.interpolate.html#pandas.DataFrame.interpolate) that, by default, performs linear interpolation at missing datapoints.

```python
In [60]: ts
Out[60]: 
2000-01-31    0.469112
2000-02-29         NaN
2000-03-31         NaN
2000-04-28         NaN
2000-05-31         NaN
2000-06-30         NaN
2000-07-31         NaN
                ...   
2007-10-31   -3.305259
2007-11-30   -5.485119
2007-12-31   -6.854968
2008-01-31   -7.809176
2008-02-29   -6.346480
2008-03-31   -8.089641
2008-04-30   -8.916232
Freq: BM, Length: 100, dtype: float64

In [61]: ts.count()
Out[61]: 61

In [62]: ts.interpolate().count()
Out[62]: 100

In [63]: ts.interpolate().plot()
Out[63]: <matplotlib.axes._subplots.AxesSubplot at 0x7f20cf59ca58>
```

_images/series_interpolate.png

Index aware interpolation is available via the method keyword:

```python
In [64]: ts2
Out[64]: 
2000-01-31    0.469112
2000-02-29         NaN
2002-07-31   -5.689738
2005-01-31         NaN
2008-04-30   -8.916232
dtype: float64

In [65]: ts2.interpolate()
Out[65]: 
2000-01-31    0.469112
2000-02-29   -2.610313
2002-07-31   -5.689738
2005-01-31   -7.302985
2008-04-30   -8.916232
dtype: float64

In [66]: ts2.interpolate(method='time')
Out[66]: 
2000-01-31    0.469112
2000-02-29    0.273272
2002-07-31   -5.689738
2005-01-31   -7.095568
2008-04-30   -8.916232
dtype: float64
```

For a floating-point index, use ``method='values'``:

```python
In [67]: ser
Out[67]: 
0.0      0.0
1.0      NaN
10.0    10.0
dtype: float64

In [68]: ser.interpolate()
Out[68]: 
0.0      0.0
1.0      5.0
10.0    10.0
dtype: float64

In [69]: ser.interpolate(method='values')
Out[69]: 
0.0      0.0
1.0      1.0
10.0    10.0
dtype: float64
```

You can also interpolate with a DataFrame:

```python
In [70]: df = pd.DataFrame({'A': [1, 2.1, np.nan, 4.7, 5.6, 6.8],
   ....:                    'B': [.25, np.nan, np.nan, 4, 12.2, 14.4]})
   ....: 

In [71]: df
Out[71]: 
     A      B
0  1.0   0.25
1  2.1    NaN
2  NaN    NaN
3  4.7   4.00
4  5.6  12.20
5  6.8  14.40

In [72]: df.interpolate()
Out[72]: 
     A      B
0  1.0   0.25
1  2.1   1.50
2  3.4   2.75
3  4.7   4.00
4  5.6  12.20
5  6.8  14.40
```

The ``method`` argument gives access to fancier interpolation methods. If you have [scipy](http://www.scipy.org/) installed, you can pass the name of a 1-d interpolation routine to ``method``. You’ll want to consult the full scipy interpolation [documentation](http://docs.scipy.org/doc/scipy/reference/interpolate.html#univariate-interpolation) and reference [guide](http://docs.scipy.org/doc/scipy/reference/tutorial/interpolate.html) for details. The appropriate interpolation method will depend on the type of data you are working with.

- If you are dealing with a time series that is growing at an increasing rate, ``method='quadratic'`` may be appropriate.
- If you have values approximating a cumulative distribution function, then ``method='pchip'`` should work well.
- To fill missing values with goal of smooth plotting, consider ``method='akima'``.

<div class="warning-warp">
<b>警告</b><p> These methods require scipy.</p>
</div>

```python
In [73]: df.interpolate(method='barycentric')
Out[73]: 
      A       B
0  1.00   0.250
1  2.10  -7.660
2  3.53  -4.515
3  4.70   4.000
4  5.60  12.200
5  6.80  14.400

In [74]: df.interpolate(method='pchip')
Out[74]: 
         A          B
0  1.00000   0.250000
1  2.10000   0.672808
2  3.43454   1.928950
3  4.70000   4.000000
4  5.60000  12.200000
5  6.80000  14.400000

In [75]: df.interpolate(method='akima')
Out[75]: 
          A          B
0  1.000000   0.250000
1  2.100000  -0.873316
2  3.406667   0.320034
3  4.700000   4.000000
4  5.600000  12.200000
5  6.800000  14.400000
```

When interpolating via a polynomial or spline approximation, you must also specify the degree or order of the approximation:

```python
In [76]: df.interpolate(method='spline', order=2)
Out[76]: 
          A          B
0  1.000000   0.250000
1  2.100000  -0.428598
2  3.404545   1.206900
3  4.700000   4.000000
4  5.600000  12.200000
5  6.800000  14.400000

In [77]: df.interpolate(method='polynomial', order=2)
Out[77]: 
          A          B
0  1.000000   0.250000
1  2.100000  -2.703846
2  3.451351  -1.453846
3  4.700000   4.000000
4  5.600000  12.200000
5  6.800000  14.400000
```

Compare several methods:

```python
In [78]: np.random.seed(2)

In [79]: ser = pd.Series(np.arange(1, 10.1, .25)**2 + np.random.randn(37))

In [80]: bad = np.array([4, 13, 14, 15, 16, 17, 18, 20, 29])

In [81]: ser[bad] = np.nan

In [82]: methods = ['linear', 'quadratic', 'cubic']

In [83]: df = pd.DataFrame({m: ser.interpolate(method=m) for m in methods})

In [84]: df.plot()
Out[84]: <matplotlib.axes._subplots.AxesSubplot at 0x7f20cf573fd0>
```

_images/compare_interpolations.png

Another use case is interpolation at new values. Suppose you have 100 observations from some distribution. And let’s suppose that you’re particularly interested in what’s happening around the middle. You can mix pandas’ ``reindex`` and ``interpolate`` methods to interpolate at the new values.

```python
In [85]: ser = pd.Series(np.sort(np.random.uniform(size=100)))

# interpolate at new_index
In [86]: new_index = ser.index | pd.Index([49.25, 49.5, 49.75, 50.25, 50.5, 50.75])

In [87]: interp_s = ser.reindex(new_index).interpolate(method='pchip')

In [88]: interp_s[49:51]
Out[88]: 
49.00    0.471410
49.25    0.476841
49.50    0.481780
49.75    0.485998
50.00    0.489266
50.25    0.491814
50.50    0.493995
50.75    0.495763
51.00    0.497074
dtype: float64
```

## Interpolation Limits

Like other pandas fill methods, [interpolate()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.interpolate.html#pandas.DataFrame.interpolate) accepts a ``limit`` keyword argument. Use this argument to limit the number of consecutive NaN values filled since the last valid observation:

```python
In [89]: ser = pd.Series([np.nan, np.nan, 5, np.nan, np.nan, np.nan, 13, np.nan, np.nan])

# fill all consecutive values in a forward direction
In [90]: ser.interpolate()
Out[90]: 
0     NaN
1     NaN
2     5.0
3     7.0
4     9.0
5    11.0
6    13.0
7    13.0
8    13.0
dtype: float64

# fill one consecutive value in a forward direction
In [91]: ser.interpolate(limit=1)
Out[91]: 
0     NaN
1     NaN
2     5.0
3     7.0
4     NaN
5     NaN
6    13.0
7    13.0
8     NaN
dtype: float64
```

By default, ``NaN`` values are filled in a ``forward`` direction. Use ``limit_direction`` parameter to fill ``backward`` or from both directions.

```python
# fill one consecutive value backwards
In [92]: ser.interpolate(limit=1, limit_direction='backward')
Out[92]: 
0     NaN
1     5.0
2     5.0
3     NaN
4     NaN
5    11.0
6    13.0
7     NaN
8     NaN
dtype: float64

# fill one consecutive value in both directions
In [93]: ser.interpolate(limit=1, limit_direction='both')
Out[93]: 
0     NaN
1     5.0
2     5.0
3     7.0
4     NaN
5    11.0
6    13.0
7    13.0
8     NaN
dtype: float64

# fill all consecutive values in both directions
In [94]: ser.interpolate(limit_direction='both')
Out[94]: 
0     5.0
1     5.0
2     5.0
3     7.0
4     9.0
5    11.0
6    13.0
7    13.0
8    13.0
dtype: float64
```

By default, ``NaN`` values are filled whether they are inside (surrounded by) existing valid values, or outside existing valid values. Introduced in v0.23 the ``limit_area`` parameter restricts filling to either inside or outside values.

```python
# fill one consecutive inside value in both directions
In [95]: ser.interpolate(limit_direction='both', limit_area='inside', limit=1)
Out[95]: 
0     NaN
1     NaN
2     5.0
3     7.0
4     NaN
5    11.0
6    13.0
7     NaN
8     NaN
dtype: float64

# fill all consecutive outside values backward
In [96]: ser.interpolate(limit_direction='backward', limit_area='outside')
Out[96]: 
0     5.0
1     5.0
2     5.0
3     NaN
4     NaN
5     NaN
6    13.0
7     NaN
8     NaN
dtype: float64

# fill all consecutive outside values in both directions
In [97]: ser.interpolate(limit_direction='both', limit_area='outside')
Out[97]: 
0     5.0
1     5.0
2     5.0
3     NaN
4     NaN
5     NaN
6    13.0
7    13.0
8    13.0
dtype: float64
```

## Replacing Generic Values

Often times we want to replace arbitrary values with other values.

[replace()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.replace.html#pandas.DataFrame.replace) in Series and [replace()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.replace.html#pandas.DataFrame.replace) in DataFrame provides an efficient yet flexible way to perform such replacements.

For a Series, you can replace a single value or a list of values by another value:

```python
In [98]: ser = pd.Series([0., 1., 2., 3., 4.])

In [99]: ser.replace(0, 5)
Out[99]: 
0    5.0
1    1.0
2    2.0
3    3.0
4    4.0
dtype: float64
```

You can replace a list of values by a list of other values:

```python
In [100]: ser.replace([0, 1, 2, 3, 4], [4, 3, 2, 1, 0])
Out[100]: 
0    4.0
1    3.0
2    2.0
3    1.0
4    0.0
dtype: float64
```

You can also specify a mapping dict:

```python
In [101]: ser.replace({0: 10, 1: 100})
Out[101]: 
0     10.0
1    100.0
2      2.0
3      3.0
4      4.0
dtype: float64
```

For a DataFrame, you can specify individual values by column:

```python
In [102]: df = pd.DataFrame({'a': [0, 1, 2, 3, 4], 'b': [5, 6, 7, 8, 9]})

In [103]: df.replace({'a': 0, 'b': 5}, 100)
Out[103]: 
     a    b
0  100  100
1    1    6
2    2    7
3    3    8
4    4    9
```

Instead of replacing with specified values, you can treat all given values as missing and interpolate over them:

```python
In [104]: ser.replace([1, 2, 3], method='pad')
Out[104]: 
0    0.0
1    0.0
2    0.0
3    0.0
4    4.0
dtype: float64
```

## String/Regular Expression Replacement

**Note**: Python strings prefixed with the r character such as r'hello world' are so-called “raw” strings. They have different semantics regarding backslashes than strings without this prefix. Backslashes in raw strings will be interpreted as an escaped backslash, e.g., r'\' == '\\'. You should read about them if this is unclear.

Replace the ‘.’ with ``NaN`` (str -> str):

```python
In [105]: d = {'a': list(range(4)), 'b': list('ab..'), 'c': ['a', 'b', np.nan, 'd']}

In [106]: df = pd.DataFrame(d)

In [107]: df.replace('.', np.nan)
Out[107]: 
   a    b    c
0  0    a    a
1  1    b    b
2  2  NaN  NaN
3  3  NaN    d
```

Now do it with a regular expression that removes surrounding whitespace (regex -> regex):

```python
In [108]: df.replace(r'\s*\.\s*', np.nan, regex=True)
Out[108]: 
   a    b    c
0  0    a    a
1  1    b    b
2  2  NaN  NaN
3  3  NaN    d
```

Replace a few different values (list -> list):

```python
In [109]: df.replace(['a', '.'], ['b', np.nan])
Out[109]: 
   a    b    c
0  0    b    b
1  1    b    b
2  2  NaN  NaN
3  3  NaN    d
```

list of regex -> list of regex:

```python
In [110]: df.replace([r'\.', r'(a)'], ['dot', '\1stuff'], regex=True)
Out[110]: 
   a       b       c
0  0  stuff  stuff
1  1       b       b
2  2     dot     NaN
3  3     dot       d
```

Only search in column ``'b'`` (dict -> dict):

```python
In [111]: df.replace({'b': '.'}, {'b': np.nan})
Out[111]: 
   a    b    c
0  0    a    a
1  1    b    b
2  2  NaN  NaN
3  3  NaN    d
```

Same as the previous example, but use a regular expression for searching instead (dict of regex -> dict):

```python
In [112]: df.replace({'b': r'\s*\.\s*'}, {'b': np.nan}, regex=True)
Out[112]: 
   a    b    c
0  0    a    a
1  1    b    b
2  2  NaN  NaN
3  3  NaN    d
```

You can pass nested dictionaries of regular expressions that use regex=True:

```python
In [113]: df.replace({'b': {'b': r''}}, regex=True)
Out[113]: 
   a  b    c
0  0  a    a
1  1       b
2  2  .  NaN
3  3  .    d
```

Alternatively, you can pass the nested dictionary like so:

```python
In [114]: df.replace(regex={'b': {r'\s*\.\s*': np.nan}})
Out[114]: 
   a    b    c
0  0    a    a
1  1    b    b
2  2  NaN  NaN
3  3  NaN    d
```

You can also use the group of a regular expression match when replacing (dict of regex -> dict of regex), this works for lists as well.

```python
In [115]: df.replace({'b': r'\s*(\.)\s*'}, {'b': r'\1ty'}, regex=True)
Out[115]: 
   a    b    c
0  0    a    a
1  1    b    b
2  2  .ty  NaN
3  3  .ty    d
```

You can pass a list of regular expressions, of which those that match will be replaced with a scalar (list of regex -> regex).

```python
In [116]: df.replace([r'\s*\.\s*', r'a|b'], np.nan, regex=True)
Out[116]: 
   a   b    c
0  0 NaN  NaN
1  1 NaN  NaN
2  2 NaN  NaN
3  3 NaN    d
```

All of the regular expression examples can also be passed with the ``to_replace`` argument as the ``regex`` argument. In this case the ``value`` argument must be passed explicitly by name or ``regex`` must be a nested dictionary. The previous example, in this case, would then be:

```python
In [117]: df.replace(regex=[r'\s*\.\s*', r'a|b'], value=np.nan)
Out[117]: 
   a   b    c
0  0 NaN  NaN
1  1 NaN  NaN
2  2 NaN  NaN
3  3 NaN    d
```

This can be convenient if you do not want to pass ``regex=True`` every time you want to use a regular expression.

**Note**: Anywhere in the above replace examples that you see a regular expression a compiled regular expression is valid as well.

## Numeric Replacement

[replace()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.replace.html#pandas.DataFrame.replace) is similar to [fillna()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.fillna.html#pandas.DataFrame.fillna).

```python
In [118]: df = pd.DataFrame(np.random.randn(10, 2))

In [119]: df[np.random.rand(df.shape[0]) > 0.5] = 1.5

In [120]: df.replace(1.5, np.nan)
Out[120]: 
          0         1
0 -0.844214 -1.021415
1  0.432396 -0.323580
2  0.423825  0.799180
3  1.262614  0.751965
4       NaN       NaN
5       NaN       NaN
6 -0.498174 -1.060799
7  0.591667 -0.183257
8  1.019855 -1.482465
9       NaN       NaN
```

Replacing more than one value is possible by passing a list.

```python
In [121]: df00 = df.values[0, 0]

In [122]: df.replace([1.5, df00], [np.nan, 'a'])
Out[122]: 
          0         1
0         a  -1.02141
1  0.432396  -0.32358
2  0.423825   0.79918
3   1.26261  0.751965
4       NaN       NaN
5       NaN       NaN
6 -0.498174   -1.0608
7  0.591667 -0.183257
8   1.01985  -1.48247
9       NaN       NaN

In [123]: df[1].dtype
Out[123]: dtype('float64')
```

You can also operate on the DataFrame in place:

```python
In [124]: df.replace(1.5, np.nan, inplace=True)
```

<div class="warning-warp">
<b>警告</b><p>When replacing multiple bool or datetime64 objects, the first argument to replace (to_replace) must match the type of the value being replaced. For example,
</p>

<pre class="prettyprint language-python">
<code class="hljs">
s = pd.Series([True, False, True])
s.replace({'a string': 'new value', True: False})  # raises

TypeError: Cannot compare types 'ndarray(dtype=bool)' and 'str'
</code>
</pre>

will raise a ``TypeError`` because one of the ``dict`` keys is not of the correct type for replacement.

However, when replacing a *single* object such as,

```python
In [125]: s = pd.Series([True, False, True])

In [126]: s.replace('a string', 'another string')
Out[126]: 
0     True
1    False
2     True
dtype: bool
```

the original ``NDFrame`` object will be returned untouched. We’re working on unifying this API, but for backwards compatibility reasons we cannot break the latter behavior. See [GH6354](https://github.com/pandas-dev/pandas/issues/6354) for more details.

