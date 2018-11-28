# 缺少数据转换规则和索引

While pandas supports storing arrays of integer and boolean type, these types are not capable of storing missing data. Until we can switch to using a native NA type in NumPy, we’ve established some “casting rules”. When a reindexing operation introduces missing data, the Series will be cast according to the rules introduced in the table below.

**data type** | **Cast to**
---|---
integer | float
boolean | object
float | no cast
object | no cast

For example:

```python
In [127]: s = pd.Series(np.random.randn(5), index=[0, 2, 4, 6, 7])

In [128]: s > 0
Out[128]: 
0    True
2    True
4    True
6    True
7    True
dtype: bool

In [129]: (s > 0).dtype
Out[129]: dtype('bool')

In [130]: crit = (s > 0).reindex(list(range(8)))

In [131]: crit
Out[131]: 
0    True
1     NaN
2    True
3     NaN
4    True
5     NaN
6    True
7    True
dtype: object

In [132]: crit.dtype
Out[132]: dtype('O')
```

Ordinarily NumPy will complain if you try to use an object array (even if it contains boolean values) instead of a boolean array to get or set values from an ndarray (e.g. selecting values based on some criteria). If a boolean vector contains NAs, an exception will be generated:

```python
In [133]: reindexed = s.reindex(list(range(8))).fillna(0)

In [134]: reindexed[crit]
---------------------------------------------------------------------------
ValueError                                Traceback (most recent call last)
<ipython-input-134-0dac417a4890> in <module>()
----> 1 reindexed[crit]

/pandas/pandas/core/series.py in __getitem__(self, key)
    805             key = list(key)
    806 
--> 807         if com.is_bool_indexer(key):
    808             key = check_bool_indexer(self.index, key)
    809 

/pandas/pandas/core/common.py in is_bool_indexer(key)
    105             if not lib.is_bool_array(key):
    106                 if isna(key).any():
--> 107                     raise ValueError('cannot index with vector containing '
    108                                      'NA / NaN values')
    109                 return False

ValueError: cannot index with vector containing NA / NaN values
```

However, these can be filled in using fillna() and it will work fine:

```python
In [135]: reindexed[crit.fillna(False)]
Out[135]: 
0    0.126504
2    0.696198
4    0.697416
6    0.601516
7    0.003659
dtype: float64

In [136]: reindexed[crit.fillna(True)]
Out[136]: 
0    0.126504
1    0.000000
2    0.696198
3    0.000000
4    0.697416
5    0.000000
6    0.601516
7    0.003659
dtype: float64
```