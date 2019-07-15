# 使用.str进行索引

你可以使用 ``[]``方法来直接索引定位。如果你的索引超过了字符串的结尾，将返回``NaN``。

```python
In [76]: s = pd.Series(['A', 'B', 'C', 'Aaba', 'Baca', np.nan,
   ....:                'CABA', 'dog', 'cat'])
   ....: 

In [77]: s.str[0]
Out[77]: 
0      A
1      B
2      C
3      A
4      B
5    NaN
6      C
7      d
8      c
dtype: object

In [78]: s.str[1]
Out[78]: 
0    NaN
1    NaN
2    NaN
3      a
4      a
5    NaN
6      A
7      o
8      a
dtype: object
```
