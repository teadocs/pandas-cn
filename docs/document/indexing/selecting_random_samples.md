# 选择随机样本

A random selection of rows or columns from a Series, DataFrame, or Panel with the [sample()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.sample.html#pandas.DataFrame.sample) method. The method will sample rows by default, and accepts a specific number of rows/columns to return, or a fraction of rows.

```python
In [111]: s = pd.Series([0,1,2,3,4,5])

# When no arguments are passed, returns 1 row.
In [112]: s.sample()
Out[112]: 
4    4
dtype: int64

# One may specify either a number of rows:
In [113]: s.sample(n=3)
Out[113]: 
0    0
4    4
1    1
dtype: int64

# Or a fraction of the rows:
In [114]: s.sample(frac=0.5)
Out[114]: 
5    5
3    3
1    1
dtype: int64
```

By default, ``sample`` will return each row at most once, but one can also sample with replacement using the ``replace option``:

```python
In [115]: s = pd.Series([0,1,2,3,4,5])

 # Without replacement (default):
In [116]: s.sample(n=6, replace=False)
Out[116]: 
0    0
1    1
5    5
3    3
2    2
4    4
dtype: int64

 # With replacement:
In [117]: s.sample(n=6, replace=True)
Out[117]: 
0    0
4    4
3    3
2    2
4    4
4    4
dtype: int64
```

By default, each row has an equal probability of being selected, but if you want rows to have different probabilities, you can pass the ``sample`` function sampling weights as ``weights``. These weights can be a list, a NumPy array, or a Series, but they must be of the same length as the object you are sampling. Missing values will be treated as a weight of zero, and inf values are not allowed. If weights do not sum to 1, they will be re-normalized by dividing all weights by the sum of the weights. For example:

```python
In [118]: s = pd.Series([0,1,2,3,4,5])

In [119]: example_weights = [0, 0, 0.2, 0.2, 0.2, 0.4]

In [120]: s.sample(n=3, weights=example_weights)
Out[120]: 
5    5
4    4
3    3
dtype: int64

# Weights will be re-normalized automatically
In [121]: example_weights2 = [0.5, 0, 0, 0, 0, 0]

In [122]: s.sample(n=1, weights=example_weights2)
Out[122]: 
0    0
dtype: int64
```

When applied to a DataFrame, you can use a column of the DataFrame as sampling weights (provided you are sampling rows and not columns) by simply passing the name of the column as a string.

```python
In [123]: df2 = pd.DataFrame({'col1':[9,8,7,6], 'weight_column':[0.5, 0.4, 0.1, 0]})

In [124]: df2.sample(n = 3, weights = 'weight_column')
Out[124]: 
   col1  weight_column
1     8            0.4
0     9            0.5
2     7            0.1
```

``sample`` also allows users to sample columns instead of rows using the axis argument.

```python
In [125]: df3 = pd.DataFrame({'col1':[1,2,3], 'col2':[2,3,4]})

In [126]: df3.sample(n=1, axis=1)
Out[126]: 
   col1
0     1
1     2
2     3
```

Finally, one can also set a seed for ``sample``’s random number generator using the ``random_state`` argument, which will accept either an integer (as a seed) or a NumPy RandomState object.

```python
In [127]: df4 = pd.DataFrame({'col1':[1,2,3], 'col2':[2,3,4]})

# With a given seed, the sample will always draw the same rows.
In [128]: df4.sample(n=2, random_state=2)
Out[128]: 
   col1  col2
2     3     4
1     2     3

In [129]: df4.sample(n=2, random_state=2)
Out[129]: 
   col1  col2
2     3     4
1     2     3
```