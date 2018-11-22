# 重新索引和更改标签

``reindex()`` is the fundamental data alignment method in pandas. It is used to implement nearly all other features relying on label-alignment functionality. To reindex means to conform the data to match a given set of labels along a particular axis. This accomplishes several things:

- Reorders the existing data to match a new set of labels
- Inserts missing value (NA) markers in label locations where no data for that label existed
- If specified, **fill** data for missing labels using logic (highly relevant to working with time series data)

Here is a simple example:

```python
In [216]: s = pd.Series(np.random.randn(5), index=['a', 'b', 'c', 'd', 'e'])

In [217]: s
Out[217]: 
a   -0.454087
b   -0.360309
c   -0.951631
d   -0.535459
e    0.835231
dtype: float64

In [218]: s.reindex(['e', 'b', 'f', 'd'])
Out[218]: 
e    0.835231
b   -0.360309
f         NaN
d   -0.535459
dtype: float64
```

Here, the ``f`` label was not contained in the Series and hence appears as NaN in the result.

With a DataFrame, you can simultaneously reindex the index and columns:

```python
In [219]: df
Out[219]: 
        one       two     three
a -1.101558  1.124472       NaN
b -0.177289  2.487104 -0.634293
c  0.462215 -0.486066  1.931194
d       NaN -0.456288 -1.222918

In [220]: df.reindex(index=['c', 'f', 'b'], columns=['three', 'two', 'one'])
Out[220]: 
      three       two       one
c  1.931194 -0.486066  0.462215
f       NaN       NaN       NaN
b -0.634293  2.487104 -0.177289
```

You may also use ``reindex`` with an ``axis`` keyword:

```python
In [221]: df.reindex(['c', 'f', 'b'], axis='index')
Out[221]: 
        one       two     three
c  0.462215 -0.486066  1.931194
f       NaN       NaN       NaN
b -0.177289  2.487104 -0.634293
```

Note that the Index objects containing the actual axis labels can be ``shared`` between objects. So if we have a Series and a DataFrame, the following can be done:

```python
In [222]: rs = s.reindex(df.index)

In [223]: rs
Out[223]: 
a   -0.454087
b   -0.360309
c   -0.951631
d   -0.535459
dtype: float64

In [224]: rs.index is df.index
Out[224]: True
```

This means that the reindexed Series’s index is the same Python object as the DataFrame’s index.

*New in version 0.21.0*.

[DataFrame.reindex()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.reindex.html#pandas.DataFrame.reindex) also supports an “axis-style” calling convention, where you specify a single labels argument and the axis it applies to.

```python
In [225]: df.reindex(['c', 'f', 'b'], axis='index')
Out[225]: 
        one       two     three
c  0.462215 -0.486066  1.931194
f       NaN       NaN       NaN
b -0.177289  2.487104 -0.634293

In [226]: df.reindex(['three', 'two', 'one'], axis='columns')
Out[226]: 
      three       two       one
a       NaN  1.124472 -1.101558
b -0.634293  2.487104 -0.177289
c  1.931194 -0.486066  0.462215
d -1.222918 -0.456288       NaN
```

See also [MultiIndex / Advanced Indexing](http://pandas.pydata.org/pandas-docs/stable/advanced.html#advanced) is an even more concise way of doing reindexing.

**Note**: When writing performance-sensitive code, there is a good reason to spend some time becoming a reindexing ninja: **many operations are faster on pre-aligned data**. Adding two unaligned DataFrames internally triggers a reindexing step. For exploratory analysis you will hardly notice the difference (because reindex has been heavily optimized), but when CPU cycles matter sprinkling a few explicit reindex calls here and there can have an impact.

## Reindexing to align with another object

You may wish to take an object and reindex its axes to be labeled the same as another object. While the syntax for this is straightforward albeit verbose, it is a common enough operation that the [reindex_like()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.reindex_like.html#pandas.DataFrame.reindex_like) method is available to make this simpler:

```python
In [227]: df2
Out[227]: 
        one       two
a -1.101558  1.124472
b -0.177289  2.487104
c  0.462215 -0.486066

In [228]: df3
Out[228]: 
        one       two
a -0.829347  0.082635
b  0.094922  1.445267
c  0.734426 -1.527903

In [229]: df.reindex_like(df2)
Out[229]: 
        one       two
a -1.101558  1.124472
b -0.177289  2.487104
c  0.462215 -0.486066
```

## Aligning objects with each other with align

The [align()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.align.html#pandas.Series.align) method is the fastest way to simultaneously align two objects. It supports a join argument (related to [joining and merging](http://pandas.pydata.org/pandas-docs/stable/merging.html#merging)):

- ``join='outer'``: take the union of the indexes (default)
- ``join='left'``: use the calling object’s index
- ``join='right'``: use the passed object’s index
- ``join='inner'``: intersect the indexes

It returns a tuple with both of the reindexed Series:

```python
In [230]: s = pd.Series(np.random.randn(5), index=['a', 'b', 'c', 'd', 'e'])

In [231]: s1 = s[:4]

In [232]: s2 = s[1:]

In [233]: s1.align(s2)
Out[233]: 
(a    0.505453
 b    1.788110
 c   -0.405908
 d   -0.801912
 e         NaN
 dtype: float64, a         NaN
 b    1.788110
 c   -0.405908
 d   -0.801912
 e    0.768460
 dtype: float64)

In [234]: s1.align(s2, join='inner')
Out[234]: 
(b    1.788110
 c   -0.405908
 d   -0.801912
 dtype: float64, b    1.788110
 c   -0.405908
 d   -0.801912
 dtype: float64)

In [235]: s1.align(s2, join='left')
Out[235]: 
(a    0.505453
 b    1.788110
 c   -0.405908
 d   -0.801912
 dtype: float64, a         NaN
 b    1.788110
 c   -0.405908
 d   -0.801912
 dtype: float64)
```

For DataFrames, the join method will be applied to both the index and the columns by default:

```python
In [236]: df.align(df2, join='inner')
Out[236]: 
(        one       two
 a -1.101558  1.124472
 b -0.177289  2.487104
 c  0.462215 -0.486066,         one       two
 a -1.101558  1.124472
 b -0.177289  2.487104
 c  0.462215 -0.486066)
```

You can also pass an ``axis`` option to only align on the specified axis:

```python
In [237]: df.align(df2, join='inner', axis=0)
Out[237]: 
(        one       two     three
 a -1.101558  1.124472       NaN
 b -0.177289  2.487104 -0.634293
 c  0.462215 -0.486066  1.931194,         one       two
 a -1.101558  1.124472
 b -0.177289  2.487104
 c  0.462215 -0.486066)
```

If you pass a Series to [DataFrame.align()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.align.html#pandas.DataFrame.align), you can choose to align both objects either on the DataFrame’s index or columns using the axis argument:

```python
In [238]: df.align(df2.iloc[0], axis=1)
Out[238]: 
(        one     three       two
 a -1.101558       NaN  1.124472
 b -0.177289 -0.634293  2.487104
 c  0.462215  1.931194 -0.486066
 d       NaN -1.222918 -0.456288, one     -1.101558
 three         NaN
 two      1.124472
 Name: a, dtype: float64)
```

## Filling while reindexing

[reindex()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.reindex.html#pandas.Series.reindex) takes an optional parameter method which is a filling method chosen from the following table:

Method | Action
---|---
pad / ffill | Fill values forward
bfill / backfill | Fill values backward
nearest | Fill from the nearest index value

We illustrate these fill methods on a simple Series:

```python
In [239]: rng = pd.date_range('1/3/2000', periods=8)

In [240]: ts = pd.Series(np.random.randn(8), index=rng)

In [241]: ts2 = ts[[0, 3, 6]]

In [242]: ts
Out[242]: 
2000-01-03    0.466284
2000-01-04   -0.457411
2000-01-05   -0.364060
2000-01-06    0.785367
2000-01-07   -1.463093
2000-01-08    1.187315
2000-01-09   -0.493153
2000-01-10   -1.323445
Freq: D, dtype: float64

In [243]: ts2
Out[243]: 
2000-01-03    0.466284
2000-01-06    0.785367
2000-01-09   -0.493153
dtype: float64

In [244]: ts2.reindex(ts.index)
Out[244]: 
2000-01-03    0.466284
2000-01-04         NaN
2000-01-05         NaN
2000-01-06    0.785367
2000-01-07         NaN
2000-01-08         NaN
2000-01-09   -0.493153
2000-01-10         NaN
Freq: D, dtype: float64

In [245]: ts2.reindex(ts.index, method='ffill')
Out[245]: 
2000-01-03    0.466284
2000-01-04    0.466284
2000-01-05    0.466284
2000-01-06    0.785367
2000-01-07    0.785367
2000-01-08    0.785367
2000-01-09   -0.493153
2000-01-10   -0.493153
Freq: D, dtype: float64

In [246]: ts2.reindex(ts.index, method='bfill')
Out[246]: 
2000-01-03    0.466284
2000-01-04    0.785367
2000-01-05    0.785367
2000-01-06    0.785367
2000-01-07   -0.493153
2000-01-08   -0.493153
2000-01-09   -0.493153
2000-01-10         NaN
Freq: D, dtype: float64

In [247]: ts2.reindex(ts.index, method='nearest')
Out[247]: 
2000-01-03    0.466284
2000-01-04    0.466284
2000-01-05    0.785367
2000-01-06    0.785367
2000-01-07    0.785367
2000-01-08   -0.493153
2000-01-09   -0.493153
2000-01-10   -0.493153
Freq: D, dtype: float64
```

These methods require that the indexes are **ordered** increasing or decreasing.

Note that the same result could have been achieved using [fillna](http://pandas.pydata.org/pandas-docs/stable/missing_data.html#missing-data-fillna) (except for ``method='nearest'``) or [interpolate](http://pandas.pydata.org/pandas-docs/stable/missing_data.html#missing-data-interpolate):

```python
In [248]: ts2.reindex(ts.index).fillna(method='ffill')
Out[248]: 
2000-01-03    0.466284
2000-01-04    0.466284
2000-01-05    0.466284
2000-01-06    0.785367
2000-01-07    0.785367
2000-01-08    0.785367
2000-01-09   -0.493153
2000-01-10   -0.493153
Freq: D, dtype: float64
```

[reindex()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.reindex.html#pandas.Series.reindex) will raise a ValueError if the index is not monotonically increasing or decreasing. fillna() and [interpolate()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.interpolate.html#pandas.Series.interpolate) will not perform any checks on the order of the index.

## Limits on filling while reindexing

The ``limit`` and ``tolerance`` arguments provide additional control over filling while reindexing. Limit specifies the maximum count of consecutive matches:

```python
In [249]: ts2.reindex(ts.index, method='ffill', limit=1)
Out[249]: 
2000-01-03    0.466284
2000-01-04    0.466284
2000-01-05         NaN
2000-01-06    0.785367
2000-01-07    0.785367
2000-01-08         NaN
2000-01-09   -0.493153
2000-01-10   -0.493153
Freq: D, dtype: float64
```

In contrast, tolerance specifies the maximum distance between the index and indexer values:

```python
In [250]: ts2.reindex(ts.index, method='ffill', tolerance='1 day')
Out[250]: 
2000-01-03    0.466284
2000-01-04    0.466284
2000-01-05         NaN
2000-01-06    0.785367
2000-01-07    0.785367
2000-01-08         NaN
2000-01-09   -0.493153
2000-01-10   -0.493153
Freq: D, dtype: float64
```

Notice that when used on a ``DatetimeIndex``, ``TimedeltaIndex`` or ``PeriodIndex``, ``tolerance`` will coerced into a ``Timedelta`` if possible. This allows you to specify tolerance with appropriate strings.

## Dropping labels from an axis

A method closely related to ``reindex`` is the [drop()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.drop.html#pandas.DataFrame.drop) function. It removes a set of labels from an axis:

```python
In [251]: df
Out[251]: 
        one       two     three
a -1.101558  1.124472       NaN
b -0.177289  2.487104 -0.634293
c  0.462215 -0.486066  1.931194
d       NaN -0.456288 -1.222918

In [252]: df.drop(['a', 'd'], axis=0)
Out[252]: 
        one       two     three
b -0.177289  2.487104 -0.634293
c  0.462215 -0.486066  1.931194

In [253]: df.drop(['one'], axis=1)
Out[253]: 
        two     three
a  1.124472       NaN
b  2.487104 -0.634293
c -0.486066  1.931194
d -0.456288 -1.222918
```

Note that the following also works, but is a bit less obvious / clean:

```python
In [254]: df.reindex(df.index.difference(['a', 'd']))
Out[254]: 
        one       two     three
b -0.177289  2.487104 -0.634293
c  0.462215 -0.486066  1.931194
```

## Renaming / mapping labels

The [rename()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.rename.html#pandas.DataFrame.rename) method allows you to relabel an axis based on some mapping (a dict or Series) or an arbitrary function.

```python
In [255]: s
Out[255]: 
a    0.505453
b    1.788110
c   -0.405908
d   -0.801912
e    0.768460
dtype: float64

In [256]: s.rename(str.upper)
Out[256]: 
A    0.505453
B    1.788110
C   -0.405908
D   -0.801912
E    0.768460
dtype: float64
```

If you pass a function, it must return a value when called with any of the labels (and must produce a set of unique values). A dict or Series can also be used:

```python
In [257]: df.rename(columns={'one': 'foo', 'two': 'bar'},
   .....:           index={'a': 'apple', 'b': 'banana', 'd': 'durian'})
   .....: 
Out[257]: 
             foo       bar     three
apple  -1.101558  1.124472       NaN
banana -0.177289  2.487104 -0.634293
c       0.462215 -0.486066  1.931194
durian       NaN -0.456288 -1.222918
```

If the mapping doesn’t include a column/index label, it isn’t renamed. Note that extra labels in the mapping don’t throw an error.

*New in version 0.21.0*.

[DataFrame.rename()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.rename.html#pandas.DataFrame.rename) also supports an “axis-style” calling convention, where you specify a single mapper and the axis to apply that mapping to.

```python
In [258]: df.rename({'one': 'foo', 'two': 'bar'}, axis='columns')
Out[258]: 
        foo       bar     three
a -1.101558  1.124472       NaN
b -0.177289  2.487104 -0.634293
c  0.462215 -0.486066  1.931194
d       NaN -0.456288 -1.222918

In [259]: df.rename({'a': 'apple', 'b': 'banana', 'd': 'durian'}, axis='index')
Out[259]: 
             one       two     three
apple  -1.101558  1.124472       NaN
banana -0.177289  2.487104 -0.634293
c       0.462215 -0.486066  1.931194
durian       NaN -0.456288 -1.222918
```

The [rename()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.rename.html#pandas.DataFrame.rename) method also provides an ``inplace`` named parameter that is by default False and copies the underlying data. Pass ``inplace=True`` to rename the data in place.

*New in version 0.18.0*.

Finally, [rename()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.rename.html#pandas.Series.rename) also accepts a scalar or list-like for altering the Series.name attribute.

```python
In [260]: s.rename("scalar-name")
Out[260]: 
a    0.505453
b    1.788110
c   -0.405908
d   -0.801912
e    0.768460
Name: scalar-name, dtype: float64
```

The Panel class has a related [rename_axis()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Panel.rename_axis.html#pandas.Panel.rename_axis) class which can rename any of its three axes.