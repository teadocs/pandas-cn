# 矢量化的字符串方法

Series is equipped with a set of string processing methods that make it easy to operate on each element of the array. Perhaps most importantly, these methods exclude missing/NA values automatically. These are accessed via the Series’s str attribute and generally have names matching the equivalent (scalar) built-in string methods. For example:

```python
In [305]: s = pd.Series(['A', 'B', 'C', 'Aaba', 'Baca', np.nan, 'CABA', 'dog', 'cat'])

In [306]: s.str.lower()
Out[306]: 
0       a
1       b
2       c
3    aaba
4    baca
5     NaN
6    caba
7     dog
8     cat
dtype: object
```

Powerful pattern-matching methods are provided as well, but note that pattern-matching generally uses [regular expressions](https://docs.python.org/3/library/re.html) by default (and in some cases always uses them).

Please see [Vectorized String Methods](http://pandas.pydata.org/pandas-docs/stable/text.html#text-string-methods) for a complete description.