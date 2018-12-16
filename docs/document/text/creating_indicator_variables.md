# 建立一个指示变量

你从字符串列可以抽出一个哑变量。例如，是否他们由``|``分割:

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

索引也支持``get_dummies``，它返回一个多重索引：

*New in version 0.18.1*.

```python
In [110]: idx = pd.Index(['a', 'a|b', np.nan, 'a|c'])

In [111]: idx.str.get_dummies(sep='|')
Out[111]: 
MultiIndex(levels=[[0, 1], [0, 1], [0, 1]],
           labels=[[1, 1, 0, 1], [0, 1, 0, 0], [0, 0, 0, 1]],
           names=['a', 'b', 'c'])
```

参见 [get_dummies()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.get_dummies.html#pandas.get_dummies).
