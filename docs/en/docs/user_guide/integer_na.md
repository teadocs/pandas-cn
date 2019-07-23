# Nullable integer data type

*New in version 0.24.0.* 

::: tip Note

IntegerArray is currently experimental. Its API or implementation may
change without warning.

:::

In [Working with missing data](missing_data.html#missing-data), we saw that pandas primarily uses ``NaN`` to represent
missing data. Because ``NaN`` is a float, this forces an array of integers with
any missing values to become floating point. In some cases, this may not matter
much. But if your integer column is, say, an identifier, casting to float can
be problematic. Some integers cannot even be represented as floating point
numbers.

Pandas can represent integer data with possibly missing values using
[``arrays.IntegerArray``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.arrays.IntegerArray.html#pandas.arrays.IntegerArray). This is an [extension types](https://pandas.pydata.org/pandas-docs/stable/development/extending.html#extending-extension-types)
implemented within pandas. It is not the default dtype for integers, and will not be inferred;
you must explicitly pass the dtype into [``array()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.array.html#pandas.array) or [``Series``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.html#pandas.Series):

``` python
In [1]: arr = pd.array([1, 2, np.nan], dtype=pd.Int64Dtype())

In [2]: arr
Out[2]: 
<IntegerArray>
[1, 2, NaN]
Length: 3, dtype: Int64
```

Or the string alias ``"Int64"`` (note the capital ``"I"``, to differentiate from
NumPy’s ``'int64'`` dtype:

``` python
In [3]: pd.array([1, 2, np.nan], dtype="Int64")
Out[3]: 
<IntegerArray>
[1, 2, NaN]
Length: 3, dtype: Int64
```

This array can be stored in a [``DataFrame``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.html#pandas.DataFrame) or [``Series``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.html#pandas.Series) like any
NumPy array.

``` python
In [4]: pd.Series(arr)
Out[4]: 
0      1
1      2
2    NaN
dtype: Int64
```

You can also pass the list-like object to the [``Series``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.html#pandas.Series) constructor
with the dtype.

``` python
In [5]: s = pd.Series([1, 2, np.nan], dtype="Int64")

In [6]: s
Out[6]: 
0      1
1      2
2    NaN
dtype: Int64
```

By default (if you don’t specify ``dtype``), NumPy is used, and you’ll end
up with a ``float64`` dtype Series:

``` python
In [7]: pd.Series([1, 2, np.nan])
Out[7]: 
0    1.0
1    2.0
2    NaN
dtype: float64
```

Operations involving an integer array will behave similar to NumPy arrays.
Missing values will be propagated, and and the data will be coerced to another
dtype if needed.

``` python
# arithmetic
In [8]: s + 1
Out[8]: 
0      2
1      3
2    NaN
dtype: Int64

# comparison
In [9]: s == 1
Out[9]: 
0     True
1    False
2    False
dtype: bool

# indexing
In [10]: s.iloc[1:3]
Out[10]: 
1      2
2    NaN
dtype: Int64

# operate with other dtypes
In [11]: s + s.iloc[1:3].astype('Int8')
Out[11]: 
0    NaN
1      4
2    NaN
dtype: Int64

# coerce when needed
In [12]: s + 0.01
Out[12]: 
0    1.01
1    2.01
2     NaN
dtype: float64
```

These dtypes can operate as part of of ``DataFrame``.

``` python
In [13]: df = pd.DataFrame({'A': s, 'B': [1, 1, 3], 'C': list('aab')})

In [14]: df
Out[14]: 
     A  B  C
0    1  1  a
1    2  1  a
2  NaN  3  b

In [15]: df.dtypes
Out[15]: 
A     Int64
B     int64
C    object
dtype: object
```

These dtypes can be merged & reshaped & casted.

``` python
In [16]: pd.concat([df[['A']], df[['B', 'C']]], axis=1).dtypes
Out[16]: 
A     Int64
B     int64
C    object
dtype: object

In [17]: df['A'].astype(float)
Out[17]: 
0    1.0
1    2.0
2    NaN
Name: A, dtype: float64
```

Reduction and groupby operations such as ‘sum’ work as well.

``` python
In [18]: df.sum()
Out[18]: 
A      3
B      5
C    aab
dtype: object

In [19]: df.groupby('B').A.sum()
Out[19]: 
B
1    3
3    0
Name: A, dtype: Int64
```
