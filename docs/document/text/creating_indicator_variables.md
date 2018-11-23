# 创建指标变量

You can extract dummy variables from string columns. For example if they are separated by a '|':

```python
In [108]: s = pd.Series(['a', 'a|b', np.nan, 'a|c'])

In [109]: s.str.get_dummies(sep='|')
Out[109]: 
   a  b  c
0  1  0  0
1  1  1  0
2  0  0  0
3  1  0  1
```

String ``Index`` also supports ``get_dummies`` which returns a MultiIndex.

*New in version 0.18.1*.

```python
In [110]: idx = pd.Index(['a', 'a|b', np.nan, 'a|c'])

In [111]: idx.str.get_dummies(sep='|')
Out[111]: 
MultiIndex(levels=[[0, 1], [0, 1], [0, 1]],
           labels=[[1, 1, 0, 1], [0, 1, 0, 0], [0, 0, 0, 1]],
           names=['a', 'b', 'c'])
```

See also [get_dummies()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.get_dummies.html#pandas.get_dummies).