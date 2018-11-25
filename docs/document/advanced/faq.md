# 其他索引常见问题

## Integer indexing

Label-based indexing with integer axis labels is a thorny topic. It has been discussed heavily on mailing lists and among various members of the scientific Python community. In pandas, our general viewpoint is that labels matter more than integer locations. Therefore, with an integer axis index only label-based indexing is possible with the standard tools like ``.loc``. The following code will generate exceptions:

```python
s = pd.Series(range(5))
s[-1]
df = pd.DataFrame(np.random.randn(5, 4))
df
df.loc[-2:]
```

This deliberate decision was made to prevent ambiguities and subtle bugs (many users reported finding bugs when the API change was made to stop “falling back” on position-based indexing).

## Non-monotonic indexes require exact matches

If the index of a ``Series`` or ``DataFrame`` is monotonically increasing or decreasing, then the bounds of a label-based slice can be outside the range of the index, much like slice indexing a normal Python ``list``. Monotonicity of an index can be tested with the ``is_monotonic_increasing`` and ``is_monotonic_decreasing`` attributes.

```python
In [183]: df = pd.DataFrame(index=[2,3,3,4,5], columns=['data'], data=list(range(5)))

In [184]: df.index.is_monotonic_increasing
Out[184]: True

# no rows 0 or 1, but still returns rows 2, 3 (both of them), and 4:
In [185]: df.loc[0:4, :]
Out[185]: 
   data
2     0
3     1
3     2
4     3

# slice is are outside the index, so empty DataFrame is returned
In [186]: df.loc[13:15, :]
Out[186]: 
Empty DataFrame
Columns: [data]
Index: []
```

On the other hand, if the index is not monotonic, then both slice bounds must be unique members of the index.

```python
In [187]: df = pd.DataFrame(index=[2,3,1,4,3,5], columns=['data'], data=list(range(6)))

In [188]: df.index.is_monotonic_increasing
Out[188]: False

# OK because 2 and 4 are in the index
In [189]: df.loc[2:4, :]
Out[189]: 
   data
2     0
3     1
1     2
4     3
```

```python
# 0 is not in the index
In [9]: df.loc[0:4, :]
KeyError: 0

# 3 is not a unique label
In [11]: df.loc[2:3, :]
KeyError: 'Cannot get right slice bound for non-unique label: 3'
```

[Index.is_monotonic_increasing()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Index.is_monotonic_increasing.html#pandas.Index.is_monotonic_increasing) and [Index.is_monotonic_decreasing()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Index.is_monotonic_decreasing.html#pandas.Index.is_monotonic_decreasing) only check that an index is weakly monotonic. To check for strict montonicity, you can combine one of those with [Index.is_unique()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Index.is_unique.html#pandas.Index.is_unique)

```python
In [190]: weakly_monotonic = pd.Index(['a', 'b', 'c', 'c'])

In [191]: weakly_monotonic
Out[191]: Index(['a', 'b', 'c', 'c'], dtype='object')

In [192]: weakly_monotonic.is_monotonic_increasing
Out[192]: True

In [193]: weakly_monotonic.is_monotonic_increasing & weakly_monotonic.is_unique
Out[193]: False
```

## Endpoints are inclusive

Compared with standard Python sequence slicing in which the slice endpoint is not inclusive, label-based slicing in pandas **is inclusive**. The primary reason for this is that it is often not possible to easily determine the “successor” or next element after a particular label in an index. For example, consider the following Series:

```python
In [194]: s = pd.Series(np.random.randn(6), index=list('abcdef'))

In [195]: s
Out[195]: 
a    0.112246
b    0.871721
c   -0.816064
d   -0.784880
e    1.030659
f    0.187483
dtype: float64
```

Suppose we wished to slice from c to e, using integers this would be accomplished as such:

```python
In [196]: s[2:5]
Out[196]: 
c   -0.816064
d   -0.784880
e    1.030659
dtype: float64
```

However, if you only had c and e, determining the next element in the index can be somewhat complicated. For example, the following does not work:

```python
s.loc['c':'e'+1]
```

A very common use case is to limit a time series to start and end at two specific dates. To enable this, we made the design to make label-based slicing include both endpoints:

```python
In [197]: s.loc['c':'e']
Out[197]: 
c   -0.816064
d   -0.784880
e    1.030659
dtype: float64
```

This is most definitely a “practicality beats purity” sort of thing, but it is something to watch out for if you expect label-based slicing to behave exactly in the way that standard Python integer slicing works.

## Indexing potentially changes underlying Series dtype

The different indexing operation can potentially change the dtype of a ``Series``.

```python
In [198]: series1 = pd.Series([1, 2, 3])

In [199]: series1.dtype
Out[199]: dtype('int64')

In [200]: res = series1.reindex([0, 4])

In [201]: res.dtype
Out[201]: dtype('float64')

In [202]: res
Out[202]: 
0    1.0
4    NaN
dtype: float64
```

```python
In [203]: series2 = pd.Series([True])

In [204]: series2.dtype
Out[204]: dtype('bool')

In [205]: res = series2.reindex_like(series1)

In [206]: res.dtype
Out[206]: dtype('O')

In [207]: res
Out[207]: 
0    True
1     NaN
2     NaN
dtype: object
```

This is because the (re)indexing operations above silently inserts NaNs and the ``dtype`` changes accordingly. This can cause some issues when using ``numpy ufuncs`` such as ``numpy.logical_and``.

See the [this old issue](https://github.com/pydata/pandas/issues/2388) for a more detailed discussion.