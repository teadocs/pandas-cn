# 按位置选择

<div class="warning-warp">  
<b>Warning</b><p>Whether a copy or a reference is returned for a setting operation, may depend on the context. This is sometimes called chained assignment and should be avoided. See <a href="http://Pandas.pydata.org/Pandas-docs/stable/indexing.html#indexing-view-versus-copy"> Returning a View versus Copy.</a></p>
</div>

Pandas provides a suite of methods in order to get **purely integer based indexing**. The semantics follow closely Python and NumPy slicing. These are 0-based indexing. When slicing, the start bounds is included, while the upper bound is *excluded*. Trying to use a non-integer, even a *valid* label will raise an IndexError.

The ``.iloc`` attribute is the primary access method. The following are valid inputs:

- An integer e.g. 5.
- A list or array of integers [4, 3, 0].
- A slice object with ints 1:7.
- A boolean array.
- A ``callable``, see [Selection By Callable](http://Pandas.pydata.org/Pandas-docs/stable/indexing.html#indexing-callable).

```python
In [60]: s1 = pd.Series(np.random.randn(5), index=list(range(0,10,2)))

In [61]: s1
Out[61]: 
0    0.695775
2    0.341734
4    0.959726
6   -1.110336
8   -0.619976
dtype: float64

In [62]: s1.iloc[:3]
Out[62]: 
0    0.695775
2    0.341734
4    0.959726
dtype: float64

In [63]: s1.iloc[3]
Out[63]: -1.1103361028911669
```

Note that setting works as well:

```python
In [64]: s1.iloc[:3] = 0

In [65]: s1
Out[65]: 
0    0.000000
2    0.000000
4    0.000000
6   -1.110336
8   -0.619976
dtype: float64
```

With a DataFrame:

```python
In [66]: df1 = pd.DataFrame(np.random.randn(6,4),
   ....:                    index=list(range(0,12,2)),
   ....:                    columns=list(range(0,8,2)))
   ....: 

In [67]: df1
Out[67]: 
           0         2         4         6
0   0.149748 -0.732339  0.687738  0.176444
2   0.403310 -0.154951  0.301624 -2.179861
4  -1.369849 -0.954208  1.462696 -1.743161
6  -0.826591 -0.345352  1.314232  0.690579
8   0.995761  2.396780  0.014871  3.357427
10 -0.317441 -1.236269  0.896171 -0.487602
```

Select via integer slicing:

```python
In [68]: df1.iloc[:3]
Out[68]: 
          0         2         4         6
0  0.149748 -0.732339  0.687738  0.176444
2  0.403310 -0.154951  0.301624 -2.179861
4 -1.369849 -0.954208  1.462696 -1.743161

In [69]: df1.iloc[1:5, 2:4]
Out[69]: 
          4         6
2  0.301624 -2.179861
4  1.462696 -1.743161
6  1.314232  0.690579
8  0.014871  3.357427
```

Select via integer list:

```python
In [70]: df1.iloc[[1, 3, 5], [1, 3]]
Out[70]: 
           2         6
2  -0.154951 -2.179861
6  -0.345352  0.690579
10 -1.236269 -0.487602
```

```python
In [71]: df1.iloc[1:3, :]
Out[71]: 
          0         2         4         6
2  0.403310 -0.154951  0.301624 -2.179861
4 -1.369849 -0.954208  1.462696 -1.743161
```

```python
In [72]: df1.iloc[:, 1:3]
Out[72]: 
           2         4
0  -0.732339  0.687738
2  -0.154951  0.301624
4  -0.954208  1.462696
6  -0.345352  1.314232
8   2.396780  0.014871
10 -1.236269  0.896171
```

```python
# this is also equivalent to ``df1.iat[1,1]``
In [73]: df1.iloc[1, 1]
Out[73]: -0.15495077442490321
```

For getting a cross section using an integer position (equiv to ``df.xs(1)``):

```python
In [74]: df1.iloc[1]
Out[74]: 
0    0.403310
2   -0.154951
4    0.301624
6   -2.179861
Name: 2, dtype: float64
```

Out of range slice indexes are handled gracefully just as in Python/Numpy.

```python
# these are allowed in python/numpy.
In [75]: x = list('abcdef')

In [76]: x
Out[76]: ['a', 'b', 'c', 'd', 'e', 'f']

In [77]: x[4:10]
Out[77]: ['e', 'f']

In [78]: x[8:10]
Out[78]: []

In [79]: s = pd.Series(x)

In [80]: s
Out[80]: 
0    a
1    b
2    c
3    d
4    e
5    f
dtype: object

In [81]: s.iloc[4:10]
Out[81]: 
4    e
5    f
dtype: object

In [82]: s.iloc[8:10]
Out[82]: Series([], dtype: object)
```

Note that using slices that go out of bounds can result in an empty axis (e.g. an empty DataFrame being returned).

```python
In [83]: dfl = pd.DataFrame(np.random.randn(5,2), columns=list('AB'))

In [84]: dfl
Out[84]: 
          A         B
0 -0.082240 -2.182937
1  0.380396  0.084844
2  0.432390  1.519970
3 -0.493662  0.600178
4  0.274230  0.132885

In [85]: dfl.iloc[:, 2:3]
Out[85]: 
Empty DataFrame
Columns: []
Index: [0, 1, 2, 3, 4]

In [86]: dfl.iloc[:, 1:3]
Out[86]: 
          B
0 -2.182937
1  0.084844
2  1.519970
3  0.600178
4  0.132885

In [87]: dfl.iloc[4:6]
Out[87]: 
         A         B
4  0.27423  0.132885
```

A single indexer that is out of bounds will raise an ``IndexError``. A list of indexers where any element is out of bounds will raise an ``IndexError``.

```python
dfl.iloc[[4, 5, 6]]
IndexError: positional indexers are out-of-bounds

dfl.iloc[:, 4]
IndexError: single positional indexer is out-of-bounds
```