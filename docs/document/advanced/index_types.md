# 索引类型

We have discussed ``MultiIndex`` in the previous sections pretty extensively. ``DatetimeIndex`` and ``PeriodIndex`` are shown [here](http://pandas.pydata.org/pandas-docs/stable/timeseries.html#timeseries-overview), and information about *TimedeltaIndex*` is found [here](http://pandas.pydata.org/pandas-docs/stable/timedeltas.html#timedeltas-timedeltas).

In the following sub-sections we will highlight some other index types.

## ategoricalIndex

``CategoricalIndex`` is a type of index that is useful for supporting indexing with duplicates. This is a container around a ``Categorical`` and allows efficient indexing and storage of an index with a large number of duplicated elements.

```python
In [125]: from pandas.api.types import CategoricalDtype

In [126]: df = pd.DataFrame({'A': np.arange(6),
   .....:                    'B': list('aabbca')})
   .....: 

In [127]: df['B'] = df['B'].astype(CategoricalDtype(list('cab')))

In [128]: df
Out[128]: 
   A  B
0  0  a
1  1  a
2  2  b
3  3  b
4  4  c
5  5  a

In [129]: df.dtypes
Out[129]: 
A       int64
B    category
dtype: object

In [130]: df.B.cat.categories
Out[130]: Index(['c', 'a', 'b'], dtype='object')
```

Setting the index will create a ``CategoricalIndex``.

```python
In [131]: df2 = df.set_index('B')

In [132]: df2.index
Out[132]: CategoricalIndex(['a', 'a', 'b', 'b', 'c', 'a'], categories=['c', 'a', 'b'], ordered=False, name='B', dtype='category')
```

Indexing with ``__getitem__/.iloc/.loc`` works similarly to an Index with duplicates. The indexers **must** be in the category or the operation will raise a ``KeyError``.

```python
In [133]: df2.loc['a']
Out[133]: 
   A
B   
a  0
a  1
a  5
```

The ``CategoricalIndex`` is **preserved** after indexing:

```python
In [134]: df2.loc['a'].index
Out[134]: CategoricalIndex(['a', 'a', 'a'], categories=['c', 'a', 'b'], ordered=False, name='B', dtype='category')
```

Sorting the index will sort by the order of the categories (recall that we created the index with ``CategoricalDtype(list('cab'))``, so the sorted order is cab).

```python
In [135]: df2.sort_index()
Out[135]: 
   A
B   
c  4
a  0
a  1
a  5
b  2
b  3
```

Groupby operations on the index will preserve the index nature as well.

```python
In [136]: df2.groupby(level=0).sum()
Out[136]: 
   A
B   
c  4
a  6
b  5

In [137]: df2.groupby(level=0).sum().index
Out[137]: CategoricalIndex(['c', 'a', 'b'], categories=['c', 'a', 'b'], ordered=False, name='B', dtype='category')
```

Reindexing operations will return a resulting index based on the type of the passed indexer. Passing a list will return a plain-old ``Index``; indexing with a Categorical will return a ``CategoricalIndex``, indexed according to the categories of the **passed** ``Categorical`` dtype. This allows one to arbitrarily index these even with values **not** in the categories, similarly to how you can reindex **any** pandas index.

```python
In [138]: df2.reindex(['a','e'])
Out[138]: 
     A
B     
a  0.0
a  1.0
a  5.0
e  NaN

In [139]: df2.reindex(['a','e']).index
Out[139]: Index(['a', 'a', 'a', 'e'], dtype='object', name='B')

In [140]: df2.reindex(pd.Categorical(['a','e'],categories=list('abcde')))
Out[140]: 
     A
B     
a  0.0
a  1.0
a  5.0
e  NaN

In [141]: df2.reindex(pd.Categorical(['a','e'],categories=list('abcde'))).index
Out[141]: CategoricalIndex(['a', 'a', 'a', 'e'], categories=['a', 'b', 'c', 'd', 'e'], ordered=False, name='B', dtype='category')
```

<div class="warning-warp">
<b>警告</b><p>Reshaping and Comparison operations on a CategoricalIndex must have the same categories or a TypeError will be raised.
</p>

<pre class="prettyprint language-python">
<code class="hljs">
In [9]: df3 = pd.DataFrame({'A' : np.arange(6),
                            'B' : pd.Series(list('aabbca')).astype('category')})

In [11]: df3 = df3.set_index('B')

In [11]: df3.index
Out[11]: CategoricalIndex([u'a', u'a', u'b', u'b', u'c', u'a'], categories=[u'a', u'b', u'c'], ordered=False, name=u'B', dtype='category')

In [12]: pd.concat([df2, df3]
TypeError: categories must match existing categories when appending
</code>
</pre>
</div>

## Int64Index and RangeIndex

<div class="warning-warp">
<b>警告</b><p>Indexing on an integer-based Index with floats has been clarified in 0.18.0, for a summary of the changes, see <a href="http://pandas.pydata.org/pandas-docs/stable/whatsnew.html#whatsnew-0180-float-indexers">here</a>.</p>

<code>Int64Index</code> is a fundamental basic index in pandas. This is an Immutable array implementing an ordered, sliceable set. Prior to 0.18.0, the Int64Index would provide the default index for all NDFrame objects.

<code>RangeIndex</code> is a sub-class of Int64Index added in version 0.18.0, now providing the default index for all NDFrame objects. RangeIndex is an optimized version of Int64Index that can represent a monotonic ordered set. These are analogous to Python <a href="https://docs.python.org/3/library/stdtypes.html#typesseq-range">range types</a>.
</div>

## Float64Index

By default a ``Float64Index`` will be automatically created when passing floating, or mixed-integer-floating values in index creation. This enables a pure label-based slicing paradigm that makes ``[],ix,loc`` for scalar indexing and slicing work exactly the same.

```python
In [142]: indexf = pd.Index([1.5, 2, 3, 4.5, 5])

In [143]: indexf
Out[143]: Float64Index([1.5, 2.0, 3.0, 4.5, 5.0], dtype='float64')

In [144]: sf = pd.Series(range(5), index=indexf)

In [145]: sf
Out[145]: 
1.5    0
2.0    1
3.0    2
4.5    3
5.0    4
dtype: int64
```

Scalar selection for ``[],.loc`` will always be label based. An integer will match an equal float index (e.g. 3 is equivalent to 3.0).

```python
In [146]: sf[3]
Out[146]: 2

In [147]: sf[3.0]
Out[147]: 2

In [148]: sf.loc[3]
Out[148]: 2

In [149]: sf.loc[3.0]
Out[149]: 2
```

The only positional indexing is via ``iloc``.

```python
In [150]: sf.iloc[3]
Out[150]: 3
```

A scalar index that is not found will raise a ``KeyError``. Slicing is primarily on the values of the index when using ``[],ix,loc``, and **always** positional when using ``iloc``. The exception is when the slice is boolean, in which case it will always be positional.

```python
In [151]: sf[2:4]
Out[151]: 
2.0    1
3.0    2
dtype: int64

In [152]: sf.loc[2:4]
Out[152]: 
2.0    1
3.0    2
dtype: int64

In [153]: sf.iloc[2:4]
Out[153]: 
3.0    2
4.5    3
dtype: int64
```

In float indexes, slicing using floats is allowed.

```python
In [154]: sf[2.1:4.6]
Out[154]: 
3.0    2
4.5    3
dtype: int64

In [155]: sf.loc[2.1:4.6]
Out[155]: 
3.0    2
4.5    3
dtype: int64
```

In non-float indexes, slicing using floats will raise a ``TypeError``.

```python
In [1]: pd.Series(range(5))[3.5]
TypeError: the label [3.5] is not a proper indexer for this index type (Int64Index)

In [1]: pd.Series(range(5))[3.5:4.5]
TypeError: the slice start [3.5] is not a proper indexer for this index type (Int64Index)
```

<div class="warning-warp">
<b>警告</b><p>Using a scalar float indexer for .iloc has been removed in 0.18.0, so the following will raise a TypeError:</p>
<pre class="prettyprint language-python">
<code class="hljs">
In [3]: pd.Series(range(5)).iloc[3.0]
TypeError: cannot do positional indexing on &lt; class &#39;pandas.indexes.range.RangeIndex&#39;&gt; with these indexers [3.0] of &lt; type &#39;float&#39;&gt;
</code>
</pre>
</div>

Here is a typical use-case for using this type of indexing. Imagine that you have a somewhat irregular timedelta-like indexing scheme, but the data is recorded as floats. This could for example be millisecond offsets.

```python
In [156]: dfir = pd.concat([pd.DataFrame(np.random.randn(5,2),
   .....:                                index=np.arange(5) * 250.0,
   .....:                                columns=list('AB')),
   .....:                   pd.DataFrame(np.random.randn(6,2),
   .....:                                index=np.arange(4,10) * 250.1,
   .....:                                columns=list('AB'))])
   .....: 

In [157]: dfir
Out[157]: 
               A         B
0.0     0.997289 -1.693316
250.0  -0.179129 -1.598062
500.0   0.936914  0.912560
750.0  -1.003401  1.632781
1000.0 -0.724626  0.178219
1000.4  0.310610 -0.108002
1250.5 -0.974226 -1.147708
1500.6 -2.281374  0.760010
1750.7 -0.742532  1.533318
2000.8  2.495362 -0.432771
2250.9 -0.068954  0.043520
```

Selection operations then will always work on a value basis, for all selection operators.

```python
In [158]: dfir[0:1000.4]
Out[158]: 
               A         B
0.0     0.997289 -1.693316
250.0  -0.179129 -1.598062
500.0   0.936914  0.912560
750.0  -1.003401  1.632781
1000.0 -0.724626  0.178219
1000.4  0.310610 -0.108002

In [159]: dfir.loc[0:1001,'A']
Out[159]: 
0.0       0.997289
250.0    -0.179129
500.0     0.936914
750.0    -1.003401
1000.0   -0.724626
1000.4    0.310610
Name: A, dtype: float64

In [160]: dfir.loc[1000.4]
Out[160]: 
A    0.310610
B   -0.108002
Name: 1000.4, dtype: float64
```

You could retrieve the first 1 second (1000 ms) of data as such:

```python
In [161]: dfir[0:1000]
Out[161]: 
               A         B
0.0     0.997289 -1.693316
250.0  -0.179129 -1.598062
500.0   0.936914  0.912560
750.0  -1.003401  1.632781
1000.0 -0.724626  0.178219
```

If you need integer based selection, you should use iloc:

```python
In [162]: dfir.iloc[0:5]
Out[162]: 
               A         B
0.0     0.997289 -1.693316
250.0  -0.179129 -1.598062
500.0   0.936914  0.912560
750.0  -1.003401  1.632781
1000.0 -0.724626  0.178219
```

## IntervalIndex

*New in version 0.20.0*.

[IntervalIndex](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.IntervalIndex.html#pandas.IntervalIndex) together with its own dtype, ``interval`` as well as the [Interval](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Interval.html#pandas.Interval) scalar type, allow first-class support in pandas for interval notation.

The ``IntervalIndex`` allows some unique indexing and is also used as a return type for the categories in [cut()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.cut.html#pandas.cut) and [qcut()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.qcut.html#pandas.qcut).

<div class="warning-warp">
<b>警告</b><p>These indexing behaviors are provisional and may change in a future version of pandas.</p>
</div>

An ``IntervalIndex`` can be used in ``Series`` and in ``DataFrame`` as the index.

```python
In [163]: df = pd.DataFrame({'A': [1, 2, 3, 4]},
   .....:                    index=pd.IntervalIndex.from_breaks([0, 1, 2, 3, 4]))
   .....: 

In [164]: df
Out[164]: 
        A
(0, 1]  1
(1, 2]  2
(2, 3]  3
(3, 4]  4
```

Label based indexing via ``.loc`` along the edges of an interval works as you would expect, selecting that particular interval.

```python
In [165]: df.loc[2]
Out[165]: 
A    2
Name: (1, 2], dtype: int64

In [166]: df.loc[[2, 3]]
Out[166]: 
        A
(1, 2]  2
(2, 3]  3
```

If you select a label contained within an interval, this will also select the interval.

```python
In [167]: df.loc[2.5]
Out[167]: 
A    3
Name: (2, 3], dtype: int64

In [168]: df.loc[[2.5, 3.5]]
Out[168]: 
        A
(2, 3]  3
(3, 4]  4
```

``Interval`` and ``IntervalIndex`` are used by cut and qcut:

```python
In [169]: c = pd.cut(range(4), bins=2)

In [170]: c
Out[170]: 
[(-0.003, 1.5], (-0.003, 1.5], (1.5, 3.0], (1.5, 3.0]]
Categories (2, interval[float64]): [(-0.003, 1.5] < (1.5, 3.0]]

In [171]: c.categories
Out[171]: 
IntervalIndex([(-0.003, 1.5], (1.5, 3.0]]
              closed='right',
              dtype='interval[float64]')
```

Furthermore, ``IntervalIndex`` allows one to bin other data with these same bins, with ``NaN`` representing a missing value similar to other dtypes.

```python
In [172]: pd.cut([0, 3, 5, 1], bins=c.categories)
Out[172]: 
[(-0.003, 1.5], (1.5, 3.0], NaN, (-0.003, 1.5]]
Categories (2, interval[float64]): [(-0.003, 1.5] < (1.5, 3.0]]
```

## Generating Ranges of Intervals

If we need intervals on a regular frequency, we can use the [interval_range()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.interval_range.html#pandas.interval_range) function to create an IntervalIndex using various combinations of ``start``, ``end``, and ``periods``. The default frequency for ``interval_range`` is a 1 for numeric intervals, and calendar day for datetime-like intervals:

```python
In [173]: pd.interval_range(start=0, end=5)
Out[173]: 
IntervalIndex([(0, 1], (1, 2], (2, 3], (3, 4], (4, 5]]
              closed='right',
              dtype='interval[int64]')

In [174]: pd.interval_range(start=pd.Timestamp('2017-01-01'), periods=4)
Out[174]: 
IntervalIndex([(2017-01-01, 2017-01-02], (2017-01-02, 2017-01-03], (2017-01-03, 2017-01-04], (2017-01-04, 2017-01-05]]
              closed='right',
              dtype='interval[datetime64[ns]]')

In [175]: pd.interval_range(end=pd.Timedelta('3 days'), periods=3)
Out[175]: 
IntervalIndex([(0 days 00:00:00, 1 days 00:00:00], (1 days 00:00:00, 2 days 00:00:00], (2 days 00:00:00, 3 days 00:00:00]]
              closed='right',
              dtype='interval[timedelta64[ns]]')
```

The ``freq`` parameter can used to specify non-default frequencies, and can utilize a variety of [frequency aliases](http://pandas.pydata.org/pandas-docs/stable/timeseries.html#timeseries-offset-aliases) with datetime-like intervals:

```python
In [176]: pd.interval_range(start=0, periods=5, freq=1.5)
Out[176]: 
IntervalIndex([(0.0, 1.5], (1.5, 3.0], (3.0, 4.5], (4.5, 6.0], (6.0, 7.5]]
              closed='right',
              dtype='interval[float64]')

In [177]: pd.interval_range(start=pd.Timestamp('2017-01-01'), periods=4, freq='W')
Out[177]: 
IntervalIndex([(2017-01-01, 2017-01-08], (2017-01-08, 2017-01-15], (2017-01-15, 2017-01-22], (2017-01-22, 2017-01-29]]
              closed='right',
              dtype='interval[datetime64[ns]]')

In [178]: pd.interval_range(start=pd.Timedelta('0 days'), periods=3, freq='9H')
Out[178]: 
IntervalIndex([(0 days 00:00:00, 0 days 09:00:00], (0 days 09:00:00, 0 days 18:00:00], (0 days 18:00:00, 1 days 03:00:00]]
              closed='right',
              dtype='interval[timedelta64[ns]]')
```

Additionally, the ``closed`` parameter can be used to specify which side(s) the intervals are closed on. Intervals are closed on the right side by default.

```python
In [179]: pd.interval_range(start=0, end=4, closed='both')
Out[179]: 
IntervalIndex([[0, 1], [1, 2], [2, 3], [3, 4]]
              closed='both',
              dtype='interval[int64]')

In [180]: pd.interval_range(start=0, end=4, closed='neither')
Out[180]: 
IntervalIndex([(0, 1), (1, 2), (2, 3), (3, 4)]
              closed='neither',
              dtype='interval[int64]')
```

*New in version 0.23.0*.

Specifying ``start``, ``end``, and ``periods`` will generate a range of evenly spaced intervals from ``start`` to ``end`` inclusively, with ``periods`` number of elements in the resulting ``IntervalIndex``:

```python
In [181]: pd.interval_range(start=0, end=6, periods=4)
Out[181]: 
IntervalIndex([(0.0, 1.5], (1.5, 3.0], (3.0, 4.5], (4.5, 6.0]]
              closed='right',
              dtype='interval[float64]')

In [182]: pd.interval_range(pd.Timestamp('2018-01-01'), pd.Timestamp('2018-02-28'), periods=3)
Out[182]: 
IntervalIndex([(2018-01-01, 2018-01-20 08:00:00], (2018-01-20 08:00:00, 2018-02-08 16:00:00], (2018-02-08 16:00:00, 2018-02-28]]
              closed='right',
              dtype='interval[datetime64[ns]]')
```