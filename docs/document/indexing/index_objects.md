# 索引对象

The pandas [Index](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Index.html#pandas.Index) class and its subclasses can be viewed as implementing an ordered multiset. Duplicates are allowed. However, if you try to convert an [Index](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Index.html#pandas.Index) object with duplicate entries into a ``set``, an exception will be raised.

[Index](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Index.html#pandas.Index) also provides the infrastructure necessary for lookups, data alignment, and reindexing. The easiest way to create an [Index](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Index.html#pandas.Index) directly is to pass a ``list`` or other sequence to [Index](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Index.html#pandas.Index):

```python
In [289]: index = pd.Index(['e', 'd', 'a', 'b'])

In [290]: index
Out[290]: Index(['e', 'd', 'a', 'b'], dtype='object')

In [291]: 'd' in index
Out[291]: True
```

You can also pass a name to be stored in the index:

```python
In [292]: index = pd.Index(['e', 'd', 'a', 'b'], name='something')

In [293]: index.name
Out[293]: 'something'
```

The name, if set, will be shown in the console display:

```python
In [294]: index = pd.Index(list(range(5)), name='rows')

In [295]: columns = pd.Index(['A', 'B', 'C'], name='cols')

In [296]: df = pd.DataFrame(np.random.randn(5, 3), index=index, columns=columns)

In [297]: df
Out[297]: 
cols         A         B         C
rows                              
0     1.295989  0.185778  0.436259
1     0.678101  0.311369 -0.528378
2    -0.674808 -1.103529 -0.656157
3     1.889957  2.076651 -1.102192
4    -1.211795 -0.791746  0.634724

In [298]: df['A']
Out[298]: 
rows
0    1.295989
1    0.678101
2   -0.674808
3    1.889957
4   -1.211795
Name: A, dtype: float64
```

## Setting metadata

Indexes are “mostly immutable”, but it is possible to set and change their metadata, like the index ``name`` (or, for ``MultiIndex``, ``levels`` and ``labels``).

You can use the ``rename``, ``set_names``, ``set_levels``, and ``set_labels`` to set these attributes directly. They default to returning a copy; however, you can specify ``inplace=True`` to have the data change in place.

See [Advanced Indexing](http://pandas.pydata.org/pandas-docs/stable/advanced.html#advanced) for usage of MultiIndexes.

```python
In [299]: ind = pd.Index([1, 2, 3])

In [300]: ind.rename("apple")
Out[300]: Int64Index([1, 2, 3], dtype='int64', name='apple')

In [301]: ind
Out[301]: Int64Index([1, 2, 3], dtype='int64')

In [302]: ind.set_names(["apple"], inplace=True)

In [303]: ind.name = "bob"

In [304]: ind
Out[304]: Int64Index([1, 2, 3], dtype='int64', name='bob')
```

``set_names``, ``set_levels``, and ``set_labels`` also take an optional *level`* argument

```python
In [305]: index = pd.MultiIndex.from_product([range(3), ['one', 'two']], names=['first', 'second'])

In [306]: index
Out[306]: 
MultiIndex(levels=[[0, 1, 2], ['one', 'two']],
           labels=[[0, 0, 1, 1, 2, 2], [0, 1, 0, 1, 0, 1]],
           names=['first', 'second'])

In [307]: index.levels[1]
Out[307]: Index(['one', 'two'], dtype='object', name='second')

In [308]: index.set_levels(["a", "b"], level=1)
Out[308]: 
MultiIndex(levels=[[0, 1, 2], ['a', 'b']],
           labels=[[0, 0, 1, 1, 2, 2], [0, 1, 0, 1, 0, 1]],
           names=['first', 'second'])
```

## Set operations on Index objects

The two main operations are ``union (|)`` and ``intersection (&)``. These can be directly called as instance methods or used via overloaded operators. Difference is provided via the .``difference()`` method.

```python
In [309]: a = pd.Index(['c', 'b', 'a'])

In [310]: b = pd.Index(['c', 'e', 'd'])

In [311]: a | b
Out[311]: Index(['a', 'b', 'c', 'd', 'e'], dtype='object')

In [312]: a & b
Out[312]: Index(['c'], dtype='object')

In [313]: a.difference(b)
Out[313]: Index(['a', 'b'], dtype='object')
```

Also available is the ``symmetric_difference (^)`` operation, which returns elements that appear in either idx1 or idx2, but not in both. This is equivalent to the Index created by ``idx1.difference(idx2).union(idx2.difference(idx1))``, with duplicates dropped.

```python
In [314]: idx1 = pd.Index([1, 2, 3, 4])

In [315]: idx2 = pd.Index([2, 3, 4, 5])

In [316]: idx1.symmetric_difference(idx2)
Out[316]: Int64Index([1, 5], dtype='int64')

In [317]: idx1 ^ idx2
Out[317]: Int64Index([1, 5], dtype='int64')
```

**Note**: The resulting index from a set operation will be sorted in ascending order.

## Missing values

**Important**: Even though ``Index`` can hold missing values ``(NaN)``, it should be avoided if you do not want any unexpected results. For example, some operations exclude missing values implicitly.

``Index.fillna`` fills missing values with specified scalar value.

```python
In [318]: idx1 = pd.Index([1, np.nan, 3, 4])

In [319]: idx1
Out[319]: Float64Index([1.0, nan, 3.0, 4.0], dtype='float64')

In [320]: idx1.fillna(2)
Out[320]: Float64Index([1.0, 2.0, 3.0, 4.0], dtype='float64')

In [321]: idx2 = pd.DatetimeIndex([pd.Timestamp('2011-01-01'), pd.NaT, pd.Timestamp('2011-01-03')])

In [322]: idx2
Out[322]: DatetimeIndex(['2011-01-01', 'NaT', '2011-01-03'], dtype='datetime64[ns]', freq=None)

In [323]: idx2.fillna(pd.Timestamp('2011-01-02'))
Out[323]: DatetimeIndex(['2011-01-01', '2011-01-02', '2011-01-03'], dtype='datetime64[ns]', freq=None)
```