# Take的方法

Similar to NumPy ndarrays, Pandas Index, Series, and DataFrame also provides the ``take`` method that retrieves elements along a given axis at the given indices. The given indices must be either a list or an ndarray of integer index positions. ``take`` will also accept negative integers as relative positions to the end of the object.

```python
In [108]: index = pd.Index(np.random.randint(0, 1000, 10))

In [109]: index
Out[109]: Int64Index([214, 502, 712, 567, 786, 175, 993, 133, 758, 329], dtype='int64')

In [110]: positions = [0, 9, 3]

In [111]: index[positions]
Out[111]: Int64Index([214, 329, 567], dtype='int64')

In [112]: index.take(positions)
Out[112]: Int64Index([214, 329, 567], dtype='int64')

In [113]: ser = pd.Series(np.random.randn(10))

In [114]: ser.iloc[positions]
Out[114]: 
0   -0.179666
9    1.824375
3    0.392149
dtype: float64

In [115]: ser.take(positions)
Out[115]: 
0   -0.179666
9    1.824375
3    0.392149
dtype: float64
```

For DataFrames, the given indices should be a 1d list or ndarray that specifies row or column positions.

```python
In [116]: frm = pd.DataFrame(np.random.randn(5, 3))

In [117]: frm.take([1, 4, 3])
Out[117]: 
          0         1         2
1 -1.237881  0.106854 -1.276829
4  0.629675 -1.425966  1.857704
3  0.979542 -1.633678  0.615855

In [118]: frm.take([0, 2], axis=1)
Out[118]: 
          0         2
0  0.595974  0.601544
1 -1.237881 -1.276829
2 -0.767101  1.499591
3  0.979542  0.615855
4  0.629675  1.857704
```

It is important to note that the take method on Pandas objects are not intended to work on 
boolean indices and may return unexpected results.

```python
In [119]: arr = np.random.randn(10)

In [120]: arr.take([False, False, True, True])
Out[120]: array([-1.1935, -1.1935,  0.6775,  0.6775])

In [121]: arr[[0, 1]]
Out[121]: array([-1.1935,  0.6775])

In [122]: ser = pd.Series(np.random.randn(10))

In [123]: ser.take([False, False, True, True])
Out[123]: 
0    0.233141
0    0.233141
1   -0.223540
1   -0.223540
dtype: float64

In [124]: ser.iloc[[0, 1]]
Out[124]: 
0    0.233141
1   -0.223540
dtype: float64
```

Finally, as a small note on performance, because the ``take`` method handles a narrower range of inputs, it can offer performance that is a good deal faster than fancy indexing.