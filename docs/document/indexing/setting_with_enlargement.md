# 放大设置

The ``.loc/[]`` operations can perform enlargement when setting a non-existent key for that axis.

In the ``Series`` case this is effectively an appending operation.

```python
In [130]: se = pd.Series([1,2,3])

In [131]: se
Out[131]: 
0    1
1    2
2    3
dtype: int64

In [132]: se[5] = 5.

In [133]: se
Out[133]: 
0    1.0
1    2.0
2    3.0
5    5.0
dtype: float64
```

A ``DataFrame`` can be enlarged on either axis via ``.loc``.

```python
In [134]: dfi = pd.DataFrame(np.arange(6).reshape(3,2),
   .....:                 columns=['A','B'])
   .....: 

In [135]: dfi
Out[135]: 
   A  B
0  0  1
1  2  3
2  4  5

In [136]: dfi.loc[:,'C'] = dfi.loc[:,'A']

In [137]: dfi
Out[137]: 
   A  B  C
0  0  1  0
1  2  3  2
2  4  5  4
```

This is like an ``append`` operation on the ``DataFrame``.

```python
In [138]: dfi.loc[3] = 5

In [139]: dfi
Out[139]: 
   A  B  C
0  0  1  0
1  2  3  2
2  4  5  4
3  5  5  5
```