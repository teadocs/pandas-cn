# 使用缺少标签的列表进行索引已弃用

<div class="warning-warp">
<b>警告</b><p>Starting in 0.21.0, using <code>.loc</code> or <code>[]</code> with a list with one or more missing labels, is deprecated, in favor of <code>.reindex</code>.</p>
</div>

In prior versions, using ``.loc[list-of-labels]`` would work as long as at least 1 of the keys was found (otherwise it would raise a ``KeyError``). This behavior is deprecated and will show a warning message pointing to this section. The recommended alternative is to use ``.reindex()``.

For example.

```python
In [102]: s = pd.Series([1, 2, 3])

In [103]: s
Out[103]: 
0    1
1    2
2    3
dtype: int64
```

Selection with all keys found is unchanged.

```python
In [104]: s.loc[[1, 2]]
Out[104]: 
1    2
2    3
dtype: int64
```

Previous Behavior

```python
In [4]: s.loc[[1, 2, 3]]
Out[4]:
1    2.0
2    3.0
3    NaN
dtype: float64
```

Current Behavior

```python
In [4]: s.loc[[1, 2, 3]]
Passing list-likes to .loc with any non-matching elements will raise
KeyError in the future, you can use .reindex() as an alternative.

See the documentation here:
http://pandas.pydata.org/pandas-docs/stable/indexing.html#deprecate-loc-reindex-listlike

Out[4]:
1    2.0
2    3.0
3    NaN
dtype: float64
```

## Reindexing

The idiomatic way to achieve selecting potentially not-found elmenents is via ``.reindex()``. See also the section on [reindexing](http://pandas.pydata.org/pandas-docs/stable/basics.html#basics-reindexing).

```python
In [105]: s.reindex([1, 2, 3])
Out[105]: 
1    2.0
2    3.0
3    NaN
dtype: float64
```

Alternatively, if you want to select only valid keys, the following is idiomatic and efficient; it is guaranteed to preserve the dtype of the selection.

```python
In [106]: labels = [1, 2, 3]

In [107]: s.loc[s.index.intersection(labels)]
Out[107]: 
1    2
2    3
dtype: int64
```

Having a duplicated index will raise for a .reindex():

```python
In [108]: s = pd.Series(np.arange(4), index=['a', 'a', 'b', 'c'])

In [109]: labels = ['c', 'd']
```

```python
In [17]: s.reindex(labels)
ValueError: cannot reindex from a duplicate axis
```

Generally, you can intersect the desired labels with the current axis, and then reindex.

```python
In [110]: s.loc[s.index.intersection(labels)].reindex(labels)
Out[110]: 
c    3.0
d    NaN
dtype: float64
```

However, this would still raise if your resulting index is duplicated.

```python
In [41]: labels = ['a', 'd']

In [42]: s.loc[s.index.intersection(labels)].reindex(labels)
ValueError: cannot reindex from a duplicate axis
```