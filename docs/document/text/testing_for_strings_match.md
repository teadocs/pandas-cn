# 测试匹配或包含模式的字符串

你可以检查是否一个元素包含一个可以匹配到的正则表达式：

```python
In [103]: pattern = r'[0-9][a-z]'

In [104]: pd.Series(['1', '2', '3a', '3b', '03c']).str.contains(pattern)
Out[104]: 
0    False
1    False
2     True
3     True
4     True
dtype: bool
```

或者是否元素完整匹配一个正则表达式

```python
In [105]: pd.Series(['1', '2', '3a', '3b', '03c']).str.match(pattern)
Out[105]: 
0    False
1    False
2     True
3     True
4    False
dtype: bool
```

``match``和``contains``的区别是是否严格匹配。``match``严格基于``re.match``，而``contains``基于``re.search``。
类似``match``, ``contains``, ``startswith`` 和 ``endswith`` 可以传入一个额外的``na``参数，因此，因此缺失值在匹配时可以被认为是``True``或者``False``：

```python
In [106]: s4 = pd.Series(['A', 'B', 'C', 'Aaba', 'Baca', np.nan, 'CABA', 'dog', 'cat'])

In [107]: s4.str.contains('A', na=False)
Out[107]: 
0     True
1    False
2    False
3     True
4    False
5    False
6     True
7    False
8    False
dtype: bool
```
