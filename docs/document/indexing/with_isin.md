# 使用isin进行索引

Consider the [isin()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.isin.html#pandas.Series.isin) method of ``Series``, which returns a boolean vector that is true wherever the Series ``elements`` exist in the passed list. This allows you to select rows where one or more columns have values you want:

```python
In [159]: s = pd.Series(np.arange(5), index=np.arange(5)[::-1], dtype='int64')

In [160]: s
Out[160]: 
4    0
3    1
2    2
1    3
0    4
dtype: int64

In [161]: s.isin([2, 4, 6])
Out[161]: 
4    False
3    False
2     True
1    False
0     True
dtype: bool

In [162]: s[s.isin([2, 4, 6])]
Out[162]: 
2    2
0    4
dtype: int64
```

The same method is available for ``Index`` objects and is useful for the cases when you don’t know which of the sought labels are in fact present:

```python
In [163]: s[s.index.isin([2, 4, 6])]
Out[163]: 
4    0
2    2
dtype: int64

# compare it to the following
In [164]: s.reindex([2, 4, 6])
Out[164]: 
2    2.0
4    0.0
6    NaN
dtype: float64
```

In addition to that, ``MultiIndex`` allows selecting a separate level to use in the membership check:

```python
In [165]: s_mi = pd.Series(np.arange(6),
   .....:                  index=pd.MultiIndex.from_product([[0, 1], ['a', 'b', 'c']]))
   .....: 

In [166]: s_mi
Out[166]: 
0  a    0
   b    1
   c    2
1  a    3
   b    4
   c    5
dtype: int64

In [167]: s_mi.iloc[s_mi.index.isin([(1, 'a'), (2, 'b'), (0, 'c')])]
Out[167]: 
0  c    2
1  a    3
dtype: int64

In [168]: s_mi.iloc[s_mi.index.isin(['a', 'c', 'e'], level=1)]
Out[168]: 
0  a    0
   c    2
1  a    3
   c    5
dtype: int64
```

DataFrame also has an [isin()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.isin.html#pandas.DataFrame.isin) method. When calling ``isin``, pass a set of values as either an array or dict. If values is an array, isin returns a DataFrame of booleans that is the same shape as the original DataFrame, with True wherever the element is in the sequence of values.

```python
In [169]: df = pd.DataFrame({'vals': [1, 2, 3, 4], 'ids': ['a', 'b', 'f', 'n'],
   .....:                    'ids2': ['a', 'n', 'c', 'n']})
   .....: 

In [170]: values = ['a', 'b', 1, 3]

In [171]: df.isin(values)
Out[171]: 
    vals    ids   ids2
0   True   True   True
1  False   True  False
2   True  False  False
3  False  False  False
```

Oftentimes you’ll want to match certain values with certain columns. Just make values a ``dict`` where the key is the column, and the value is a list of items you want to check 
for.

```python
In [172]: values = {'ids': ['a', 'b'], 'vals': [1, 3]}

In [173]: df.isin(values)
Out[173]: 
    vals    ids   ids2
0   True   True  False
1  False   True  False
2   True  False  False
3  False  False  False
```

Combine DataFrame’s ``isin`` with the ``any()`` and ``all()`` methods to quickly select subsets of your data that meet a given criteria. To select a row where each column meets its own criterion:

```python
In [174]: values = {'ids': ['a', 'b'], 'ids2': ['a', 'c'], 'vals': [1, 3]}

In [175]: row_mask = df.isin(values).all(1)

In [176]: df[row_mask]
Out[176]: 
   vals ids ids2
0     1   a    a
```