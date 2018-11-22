# 排序

Pandas supports three kinds of sorting: sorting by index labels, sorting by column values, and sorting by a combination of both.

## By Index

The [Series.sort_index()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.sort_index.html#pandas.Series.sort_index) and [DataFrame.sort_index()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.sort_index.html#pandas.DataFrame.sort_index) methods are used to sort a pandas object by its index levels.

```python
In [307]: df = pd.DataFrame({'one' : pd.Series(np.random.randn(3), index=['a', 'b', 'c']),
   .....:                    'two' : pd.Series(np.random.randn(4), index=['a', 'b', 'c', 'd']),
   .....:                    'three' : pd.Series(np.random.randn(3), index=['b', 'c', 'd'])})
   .....: 

In [308]: unsorted_df = df.reindex(index=['a', 'd', 'c', 'b'],
   .....:                          columns=['three', 'two', 'one'])
   .....: 

In [309]: unsorted_df
Out[309]: 
      three       two       one
a       NaN  0.708543  0.036274
d -0.540166  0.586626       NaN
c  0.410238  1.121731  1.044630
b -0.282532 -2.038777 -0.490032

# DataFrame
In [310]: unsorted_df.sort_index()
Out[310]: 
      three       two       one
a       NaN  0.708543  0.036274
b -0.282532 -2.038777 -0.490032
c  0.410238  1.121731  1.044630
d -0.540166  0.586626       NaN

In [311]: unsorted_df.sort_index(ascending=False)
Out[311]: 
      three       two       one
d -0.540166  0.586626       NaN
c  0.410238  1.121731  1.044630
b -0.282532 -2.038777 -0.490032
a       NaN  0.708543  0.036274

In [312]: unsorted_df.sort_index(axis=1)
Out[312]: 
        one     three       two
a  0.036274       NaN  0.708543
d       NaN -0.540166  0.586626
c  1.044630  0.410238  1.121731
b -0.490032 -0.282532 -2.038777

# Series
In [313]: unsorted_df['three'].sort_index()
Out[313]: 
a         NaN
b   -0.282532
c    0.410238
d   -0.540166
Name: three, dtype: float64
```

## By Values

The [Series.sort_values()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.sort_values.html#pandas.Series.sort_values) method is used to sort a Series by its values. The [DataFrame.sort_values()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.sort_values.html#pandas.DataFrame.sort_values) method is used to sort a DataFrame by its column or row values. The optional by parameter to [DataFrame.sort_values()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.sort_values.html#pandas.DataFrame.sort_values) may used to specify one or more columns to use to determine the sorted order.

```python
In [314]: df1 = pd.DataFrame({'one':[2,1,1,1],'two':[1,3,2,4],'three':[5,4,3,2]})

In [315]: df1.sort_values(by='two')
Out[315]: 
   one  two  three
0    2    1      5
2    1    2      3
1    1    3      4
3    1    4      2
```

The by parameter can take a list of column names, e.g.:

```python
In [316]: df1[['one', 'two', 'three']].sort_values(by=['one','two'])
Out[316]: 
   one  two  three
2    1    2      3
1    1    3      4
3    1    4      2
0    2    1      5
```

These methods have special treatment of NA values via the na_position argument:

```python
In [317]: s[2] = np.nan

In [318]: s.sort_values()
Out[318]: 
0       A
3    Aaba
1       B
4    Baca
6    CABA
8     cat
7     dog
2     NaN
5     NaN
dtype: object

In [319]: s.sort_values(na_position='first')
Out[319]: 
2     NaN
5     NaN
0       A
3    Aaba
1       B
4    Baca
6    CABA
8     cat
7     dog
dtype: object
```

## By Indexes and Values

*New in version 0.23.0.*

Strings passed as the ``by`` parameter to [DataFrame.sort_values()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.sort_values.html#pandas.DataFrame.sort_values) may refer to either columns or index level names.

```python
# Build MultiIndex
In [320]: idx = pd.MultiIndex.from_tuples([('a', 1), ('a', 2), ('a', 2),
   .....:                                 ('b', 2), ('b', 1), ('b', 1)])
   .....: 

In [321]: idx.names = ['first', 'second']

# Build DataFrame
In [322]: df_multi = pd.DataFrame({'A': np.arange(6, 0, -1)},
   .....:                         index=idx)
   .....: 

In [323]: df_multi
Out[323]: 
              A
first second   
a     1       6
      2       5
      2       4
b     2       3
      1       2
      1       1
```

Sort by ‘second’ (index) and ‘A’ (column)

```python
In [324]: df_multi.sort_values(by=['second', 'A'])
Out[324]: 
              A
first second   
b     1       1
      1       2
a     1       6
b     2       3
a     2       4
      2       5
```

**Note**: If a string matches both a column name and an index level name then a warning is issued and the column takes precedence. This will result in an ambiguity error in a future version.

## searchsorted 

Series has the [searchsorted()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.searchsorted.html#pandas.Series.searchsorted) method, which works similarly to [numpy.ndarray.searchsorted()](https://docs.scipy.org/doc/numpy/reference/generated/numpy.ndarray.searchsorted.html#numpy.ndarray.searchsorted).

```python
In [325]: ser = pd.Series([1, 2, 3])

In [326]: ser.searchsorted([0, 3])
Out[326]: array([0, 2])

In [327]: ser.searchsorted([0, 4])
Out[327]: array([0, 3])

In [328]: ser.searchsorted([1, 3], side='right')
Out[328]: array([1, 3])

In [329]: ser.searchsorted([1, 3], side='left')
Out[329]: array([0, 2])

In [330]: ser = pd.Series([3, 1, 2])

In [331]: ser.searchsorted([0, 3], sorter=np.argsort(ser))
Out[331]: array([0, 2])
```

## smallest / largest values

Series has the [nsmallest()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.nsmallest.html#pandas.Series.nsmallest) and [nlargest()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.nlargest.html#pandas.Series.nlargest) methods which return the smallest or largest n values. For a large Series this can be much faster than sorting the entire Series and calling head(n) on the result.

```python
In [332]: s = pd.Series(np.random.permutation(10))

In [333]: s
Out[333]: 
0    8
1    2
2    9
3    5
4    6
5    0
6    1
7    7
8    4
9    3
dtype: int64

In [334]: s.sort_values()
Out[334]: 
5    0
6    1
1    2
9    3
8    4
3    5
4    6
7    7
0    8
2    9
dtype: int64

In [335]: s.nsmallest(3)
Out[335]: 
5    0
6    1
1    2
dtype: int64

In [336]: s.nlargest(3)
Out[336]: 
2    9
0    8
7    7
dtype: int64
```

``DataFrame`` also has the ``nlargest`` and ``nsmallest`` methods.

```python
In [337]: df = pd.DataFrame({'a': [-2, -1, 1, 10, 8, 11, -1],
   .....:                    'b': list('abdceff'),
   .....:                    'c': [1.0, 2.0, 4.0, 3.2, np.nan, 3.0, 4.0]})
   .....: 

In [338]: df.nlargest(3, 'a')
Out[338]: 
    a  b    c
5  11  f  3.0
3  10  c  3.2
4   8  e  NaN

In [339]: df.nlargest(5, ['a', 'c'])
Out[339]: 
    a  b    c
6  -1  f  4.0
5  11  f  3.0
3  10  c  3.2
4   8  e  NaN
2   1  d  4.0

In [340]: df.nsmallest(3, 'a')
Out[340]: 
   a  b    c
0 -2  a  1.0
1 -1  b  2.0
6 -1  f  4.0

In [341]: df.nsmallest(5, ['a', 'c'])
Out[341]: 
   a  b    c
0 -2  a  1.0
2  1  d  4.0
4  8  e  NaN
1 -1  b  2.0
6 -1  f  4.0
```

## Sorting by a multi-index column

You must be explicit about sorting when the column is a multi-index, and fully specify all levels to by.

```python
In [342]: df1.columns = pd.MultiIndex.from_tuples([('a','one'),('a','two'),('b','three')])

In [343]: df1.sort_values(by=('a','two'))
Out[343]: 
    a         b
  one two three
0   2   1     5
2   1   2     3
1   1   3     4
3   1   4     2
```