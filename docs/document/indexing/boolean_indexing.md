# 布尔索引

Another common operation is the use of boolean vectors to filter the data. The operators are: | for or, & for and, and ~ for not. These **must** be grouped by using parentheses, since by default Python will evaluate an expression such as ``df.A > 2 & df.B < 3 as df.A > (2 & df.B) < 3``, while the desired evaluation order is ``(df.A > 2) & (df.B < 3)``.

Using a boolean vector to index a Series works exactly as in a NumPy ndarray:

```python
In [147]: s = pd.Series(range(-3, 4))

In [148]: s
Out[148]: 
0   -3
1   -2
2   -1
3    0
4    1
5    2
6    3
dtype: int64

In [149]: s[s > 0]
Out[149]: 
4    1
5    2
6    3
dtype: int64

In [150]: s[(s < -1) | (s > 0.5)]
Out[150]: 
0   -3
1   -2
4    1
5    2
6    3
dtype: int64

In [151]: s[~(s < 0)]
Out[151]: 
3    0
4    1
5    2
6    3
dtype: int64
```

You may select rows from a DataFrame using a boolean vector the same length as the DataFrame’s index (for example, something derived from one of the columns of the DataFrame):

```python
In [152]: df[df['A'] > 0]
Out[152]: 
                   A         B         C         D   E   0
2000-01-01  0.469112 -0.282863 -1.509059 -1.135632 NaN NaN
2000-01-02  1.212112 -0.173215  0.119209 -1.044236 NaN NaN
2000-01-04  7.000000 -0.706771 -1.039575  0.271860 NaN NaN
2000-01-07  0.404705  0.577046 -1.715002 -1.039268 NaN NaN
```

List comprehensions and ``map`` method of Series can also be used to produce more complex criteria:

```python
In [153]: df2 = pd.DataFrame({'a' : ['one', 'one', 'two', 'three', 'two', 'one', 'six'],
   .....:                     'b' : ['x', 'y', 'y', 'x', 'y', 'x', 'x'],
   .....:                     'c' : np.random.randn(7)})
   .....: 

# only want 'two' or 'three'
In [154]: criterion = df2['a'].map(lambda x: x.startswith('t'))

In [155]: df2[criterion]
Out[155]: 
       a  b         c
2    two  y  0.041290
3  three  x  0.361719
4    two  y -0.238075

# equivalent but slower
In [156]: df2[[x.startswith('t') for x in df2['a']]]
Out[156]: 
       a  b         c
2    two  y  0.041290
3  three  x  0.361719
4    two  y -0.238075

# Multiple criteria
In [157]: df2[criterion & (df2['b'] == 'x')]
Out[157]: 
       a  b         c
3  three  x  0.361719
```

With the choice methods [Selection by Label](http://pandas.pydata.org/pandas-docs/stable/indexing.html#indexing-label), [Selection by Position](http://pandas.pydata.org/pandas-docs/stable/indexing.html#indexing-integer), and [Advanced Indexing](http://pandas.pydata.org/pandas-docs/stable/advanced.html#advanced) you may select along more than one axis using boolean vectors combined with other indexing expressions.

```python
In [158]: df2.loc[criterion & (df2['b'] == 'x'),'b':'c']
Out[158]: 
   b         c
3  x  0.361719
```