# 测试匹配或包含模式的字符串

You can check whether elements contain a pattern:

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

Or whether elements match a pattern:

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

The distinction between ``match`` and ``contains`` is strictness: ``match`` relies on strict ``re.match``, while ``contains`` relies on re.search.

Methods like ``match``, ``contains``, ``startswith``, and ``endswith`` take an extra na argument so missing values can be considered True or False:

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