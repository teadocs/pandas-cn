# 数据帧(DataFrame)

**DataFrame** is a 2-dimensional labeled data structure with columns of potentially different types. You can think of it like a spreadsheet or SQL table, or a dict of Series objects. It is generally the most commonly used pandas object. Like Series, DataFrame accepts many different kinds of input:

- Dict of 1D ndarrays, lists, dicts, or Series
- 2-D numpy.ndarray
- [Structured or record](http://docs.scipy.org/doc/numpy/user/basics.rec.html) ndarray
- A ``Series``
- Another ``DataFrame``

Along with the data, you can optionally pass index (row labels) and columns (column labels) arguments. If you pass an index and / or columns, you are guaranteeing the index and / or columns of the resulting DataFrame. Thus, a dict of Series plus a specific index will discard all data not matching up to the passed index.

If axis labels are not passed, they will be constructed from the input data based on common sense rules.

**Note：** When the data is a dict, and columns is not specified, the DataFrame columns will be ordered by the dict’s insertion order, if you are using Python version >= 3.6 and Pandas >= 0.23.
If you are using Python < 3.6 or Pandas < 0.23, and columns is not specified, the DataFrame columns will be the lexically ordered list of dict keys.

## From dict of Series or dicts

The resulting **index** will be the **union** of the indexes of the various Series. If there are any nested dicts, these will first be converted to Series. If no columns are passed, the columns will be the ordered list of dict keys.

```python
In [34]: d = {'one' : pd.Series([1., 2., 3.], index=['a', 'b', 'c']),
   ....:      'two' : pd.Series([1., 2., 3., 4.], index=['a', 'b', 'c', 'd'])}
   ....: 

In [35]: df = pd.DataFrame(d)

In [36]: df
Out[36]: 
   one  two
a  1.0  1.0
b  2.0  2.0
c  3.0  3.0
d  NaN  4.0

In [37]: pd.DataFrame(d, index=['d', 'b', 'a'])
Out[37]: 
   one  two
d  NaN  4.0
b  2.0  2.0
a  1.0  1.0

In [38]: pd.DataFrame(d, index=['d', 'b', 'a'], columns=['two', 'three'])
Out[38]: 
   two three
d  4.0   NaN
b  2.0   NaN
a  1.0   NaN
```

The row and column labels can be accessed respectively by accessing the index and columns attributes:

**Note**： When a particular set of columns is passed along with a dict of data, the passed columns override the keys in the dict.

```python
In [39]: df.index
Out[39]: Index(['a', 'b', 'c', 'd'], dtype='object')

In [40]: df.columns
Out[40]: Index(['one', 'two'], dtype='object')
```

## From dict of ndarrays / lists

The ndarrays must all be the same length. If an index is passed, it must clearly also be the same length as the arrays. If no index is passed, the result will be ``range(n)``, where n is the array length.

```python
In [41]: d = {'one' : [1., 2., 3., 4.],
   ....:      'two' : [4., 3., 2., 1.]}
   ....: 

In [42]: pd.DataFrame(d)
Out[42]: 
   one  two
0  1.0  4.0
1  2.0  3.0
2  3.0  2.0
3  4.0  1.0

In [43]: pd.DataFrame(d, index=['a', 'b', 'c', 'd'])
Out[43]: 
   one  two
a  1.0  4.0
b  2.0  3.0
c  3.0  2.0
d  4.0  1.0
```

## From structured or record array

This case is handled identically to a dict of arrays.

```python
In [44]: data = np.zeros((2,), dtype=[('A', 'i4'),('B', 'f4'),('C', 'a10')])

In [45]: data[:] = [(1,2.,'Hello'), (2,3.,"World")]

In [46]: pd.DataFrame(data)
Out[46]: 
   A    B         C
0  1  2.0  b'Hello'
1  2  3.0  b'World'

In [47]: pd.DataFrame(data, index=['first', 'second'])
Out[47]: 
        A    B         C
first   1  2.0  b'Hello'
second  2  3.0  b'World'

In [48]: pd.DataFrame(data, columns=['C', 'A', 'B'])
Out[48]: 
          C  A    B
0  b'Hello'  1  2.0
1  b'World'  2  3.0
```

**Note**：DataFrame is not intended to work exactly like a 2-dimensional NumPy ndarray.

## From a list of dicts

```python
In [49]: data2 = [{'a': 1, 'b': 2}, {'a': 5, 'b': 10, 'c': 20}]

In [50]: pd.DataFrame(data2)
Out[50]: 
   a   b     c
0  1   2   NaN
1  5  10  20.0

In [51]: pd.DataFrame(data2, index=['first', 'second'])
Out[51]: 
        a   b     c
first   1   2   NaN
second  5  10  20.0

In [52]: pd.DataFrame(data2, columns=['a', 'b'])
Out[52]: 
   a   b
0  1   2
1  5  10
```

## From a dict of tuples

You can automatically create a multi-indexed frame by passing a tuples dictionary.

```python
In [53]: pd.DataFrame({('a', 'b'): {('A', 'B'): 1, ('A', 'C'): 2},
   ....:               ('a', 'a'): {('A', 'C'): 3, ('A', 'B'): 4},
   ....:               ('a', 'c'): {('A', 'B'): 5, ('A', 'C'): 6},
   ....:               ('b', 'a'): {('A', 'C'): 7, ('A', 'B'): 8},
   ....:               ('b', 'b'): {('A', 'D'): 9, ('A', 'B'): 10}})
   ....: 
Out[53]: 
       a              b      
       b    a    c    a     b
A B  1.0  4.0  5.0  8.0  10.0
  C  2.0  3.0  6.0  7.0   NaN
  D  NaN  NaN  NaN  NaN   9.0
```

## From a Series

The result will be a DataFrame with the same index as the input Series, and with one column whose name is the original name of the Series (only if no other column name provided).

**Missing Data**

Much more will be said on this topic in the [Missing data](http://pandas.pydata.org/pandas-docs/stable/missing_data.html#missing-data) section. To construct a DataFrame with missing data, we use ``np.nan`` to represent missing values. Alternatively, you may pass a ``numpy.MaskedArray`` as the data argument to the DataFrame constructor, and its masked entries will be considered missing.

## Alternate Constructors

**DataFrame.from_dict**

``DataFrame.from_dict`` takes a dict of dicts or a dict of array-like sequences and returns a DataFrame. It operates like the ``DataFrame`` constructor except for the ``orient`` parameter which is ``'columns'`` by default, but which can be set to ``'index'`` in order to use the dict keys as row labels.

```python
In [54]: pd.DataFrame.from_dict(dict([('A', [1, 2, 3]), ('B', [4, 5, 6])]))
Out[54]: 
   A  B
0  1  4
1  2  5
2  3  6
```

If you pass ``orient='index'``, the keys will be the row labels. In this case, you can also pass the desired column names:

```python
In [55]: pd.DataFrame.from_dict(dict([('A', [1, 2, 3]), ('B', [4, 5, 6])]),
   ....:                        orient='index', columns=['one', 'two', 'three'])
   ....: 
Out[55]: 
   one  two  three
A    1    2      3
B    4    5      6
```

**DataFrame.from_records**

``DataFrame.from_records`` takes a list of tuples or an ndarray with structured dtype. It works analogously to the normal ``DataFrame`` constructor, except that the resulting DataFrame index may be a specific field of the structured dtype. For example:

```python
In [56]: data
Out[56]: 
array([(1,  2., b'Hello'), (2,  3., b'World')],
      dtype=[('A', '<i4'), ('B', '<f4'), ('C', 'S10')])

In [57]: pd.DataFrame.from_records(data, index='C')
Out[57]: 
          A    B
C               
b'Hello'  1  2.0
b'World'  2  3.0
```

## Column selection, addition, deletion

You can treat a DataFrame semantically like a dict of like-indexed Series objects. Getting, setting, and deleting columns works with the same syntax as the analogous dict operations:

```python
In [58]: df['one']
Out[58]: 
a    1.0
b    2.0
c    3.0
d    NaN
Name: one, dtype: float64

In [59]: df['three'] = df['one'] * df['two']

In [60]: df['flag'] = df['one'] > 2

In [61]: df
Out[61]: 
   one  two  three   flag
a  1.0  1.0    1.0  False
b  2.0  2.0    4.0  False
c  3.0  3.0    9.0   True
d  NaN  4.0    NaN  False
```

Columns can be deleted or popped like with a dict:

```python
In [62]: del df['two']

In [63]: three = df.pop('three')

In [64]: df
Out[64]: 
   one   flag
a  1.0  False
b  2.0  False
c  3.0   True
d  NaN  False
```

When inserting a scalar value, it will naturally be propagated to fill the column:

```python
In [65]: df['foo'] = 'bar'

In [66]: df
Out[66]: 
   one   flag  foo
a  1.0  False  bar
b  2.0  False  bar
c  3.0   True  bar
d  NaN  False  bar
```

When inserting a Series that does not have the same index as the DataFrame, it will be conformed to the DataFrame’s index:

```python
In [67]: df['one_trunc'] = df['one'][:2]

In [68]: df
Out[68]: 
   one   flag  foo  one_trunc
a  1.0  False  bar        1.0
b  2.0  False  bar        2.0
c  3.0   True  bar        NaN
d  NaN  False  bar        NaN
```

You can insert raw ndarrays but their length must match the length of the DataFrame’s index.

By default, columns get inserted at the end. The ``insert`` function is available to insert at a particular location in the columns:

```python
In [69]: df.insert(1, 'bar', df['one'])

In [70]: df
Out[70]: 
   one  bar   flag  foo  one_trunc
a  1.0  1.0  False  bar        1.0
b  2.0  2.0  False  bar        2.0
c  3.0  3.0   True  bar        NaN
d  NaN  NaN  False  bar        NaN
```

## Assigning New Columns in Method Chains

Inspired by dplyr’s mutate verb, DataFrame has an assign() method that allows you to easily create new columns that are potentially derived from existing columns.

In [71]: iris = pd.read_csv('data/iris.data')

In [72]: iris.head()
Out[72]: 
   SepalLength  SepalWidth  PetalLength  PetalWidth         Name
0          5.1         3.5          1.4         0.2  Iris-setosa
1          4.9         3.0          1.4         0.2  Iris-setosa
2          4.7         3.2          1.3         0.2  Iris-setosa
3          4.6         3.1          1.5         0.2  Iris-setosa
4          5.0         3.6          1.4         0.2  Iris-setosa

In [73]: (iris.assign(sepal_ratio = iris['SepalWidth'] / iris['SepalLength'])
   ....:      .head())
   ....: 
Out[73]: 
   SepalLength  SepalWidth  PetalLength  PetalWidth         Name  sepal_ratio
0          5.1         3.5          1.4         0.2  Iris-setosa       0.6863
1          4.9         3.0          1.4         0.2  Iris-setosa       0.6122
2          4.7         3.2          1.3         0.2  Iris-setosa       0.6809
3          4.6         3.1          1.5         0.2  Iris-setosa       0.6739
4          5.0         3.6          1.4         0.2  Iris-setosa       0.7200
In the example above, we inserted a precomputed value. We can also pass in a function of one argument to be evaluated on the DataFrame being assigned to.

In [74]: iris.assign(sepal_ratio = lambda x: (x['SepalWidth'] /
   ....:                                      x['SepalLength'])).head()
   ....: 
Out[74]: 
   SepalLength  SepalWidth  PetalLength  PetalWidth         Name  sepal_ratio
0          5.1         3.5          1.4         0.2  Iris-setosa       0.6863
1          4.9         3.0          1.4         0.2  Iris-setosa       0.6122
2          4.7         3.2          1.3         0.2  Iris-setosa       0.6809
3          4.6         3.1          1.5         0.2  Iris-setosa       0.6739
4          5.0         3.6          1.4         0.2  Iris-setosa       0.7200
assign always returns a copy of the data, leaving the original DataFrame untouched.

Passing a callable, as opposed to an actual value to be inserted, is useful when you don’t have a reference to the DataFrame at hand. This is common when using assign in a chain of operations. For example, we can limit the DataFrame to just those observations with a Sepal Length greater than 5, calculate the ratio, and plot:

In [75]: (iris.query('SepalLength > 5')
   ....:      .assign(SepalRatio = lambda x: x.SepalWidth / x.SepalLength,
   ....:              PetalRatio = lambda x: x.PetalWidth / x.PetalLength)
   ....:      .plot(kind='scatter', x='SepalRatio', y='PetalRatio'))
   ....: 
Out[75]: <matplotlib.axes._subplots.AxesSubplot at 0x7f210fb001d0>
_images/basics_assign.png
Since a function is passed in, the function is computed on the DataFrame being assigned to. Importantly, this is the DataFrame that’s been filtered to those rows with sepal length greater than 5. The filtering happens first, and then the ratio calculations. This is an example where we didn’t have a reference to the filtered DataFrame available.

The function signature for assign is simply **kwargs. The keys are the column names for the new fields, and the values are either a value to be inserted (for example, a Series or NumPy array), or a function of one argument to be called on the DataFrame. A copy of the original DataFrame is returned, with the new values inserted.

Changed in version 0.23.0.

Starting with Python 3.6 the order of **kwargs is preserved. This allows for dependent assignment, where an expression later in **kwargs can refer to a column created earlier in the same assign().

In [76]: dfa = pd.DataFrame({"A": [1, 2, 3],
   ....:                     "B": [4, 5, 6]})
   ....: 

In [77]: dfa.assign(C=lambda x: x['A'] + x['B'],
   ....:            D=lambda x: x['A'] + x['C'])
   ....: 
Out[77]: 
   A  B  C   D
0  1  4  5   6
1  2  5  7   9
2  3  6  9  12
In the second expression, x['C'] will refer to the newly created column, that’s equal to dfa['A'] + dfa['B'].

To write code compatible with all versions of Python, split the assignment in two.

In [78]: dependent = pd.DataFrame({"A": [1, 1, 1]})

In [79]: (dependent.assign(A=lambda x: x['A'] + 1)
   ....:           .assign(B=lambda x: x['A'] + 2))
   ....: 
Out[79]: 
   A  B
0  2  4
1  2  4
2  2  4
Warning Dependent assignment maybe subtly change the behavior of your code between Python 3.6 and older versions of Python.
If you wish write code that supports versions of python before and after 3.6, you’ll need to take care when passing assign expressions that

Updating an existing column
Referring to the newly updated column in the same assign
For example, we’ll update column “A” and then refer to it when creating “B”.

>>> dependent = pd.DataFrame({"A": [1, 1, 1]})
>>> dependent.assign(A=lambda x: x["A"] + 1,
                     B=lambda x: x["A"] + 2)
For Python 3.5 and earlier the expression creating B refers to the “old” value of A, [1, 1, 1]. The output is then

   A  B
0  2  3
1  2  3
2  2  3
For Python 3.6 and later, the expression creating A refers to the “new” value of A, [2, 2, 2], which results in

   A  B
0  2  4
1  2  4
2  2  4
Indexing / Selection
The basics of indexing are as follows:

Operation	Syntax	Result
Select column	df[col]	Series
Select row by label	df.loc[label]	Series
Select row by integer location	df.iloc[loc]	Series
Slice rows	df[5:10]	DataFrame
Select rows by boolean vector	df[bool_vec]	DataFrame
Row selection, for example, returns a Series whose index is the columns of the DataFrame:

In [80]: df.loc['b']
Out[80]: 
one              2
bar              2
flag         False
foo            bar
one_trunc        2
Name: b, dtype: object

In [81]: df.iloc[2]
Out[81]: 
one             3
bar             3
flag         True
foo           bar
one_trunc     NaN
Name: c, dtype: object
For a more exhaustive treatment of sophisticated label-based indexing and slicing, see the section on indexing. We will address the fundamentals of reindexing / conforming to new sets of labels in the section on reindexing.

Data alignment and arithmetic
Data alignment between DataFrame objects automatically align on both the columns and the index (row labels). Again, the resulting object will have the union of the column and row labels.

In [82]: df = pd.DataFrame(np.random.randn(10, 4), columns=['A', 'B', 'C', 'D'])

In [83]: df2 = pd.DataFrame(np.random.randn(7, 3), columns=['A', 'B', 'C'])

In [84]: df + df2
Out[84]: 
        A       B       C   D
0  0.0457 -0.0141  1.3809 NaN
1 -0.9554 -1.5010  0.0372 NaN
2 -0.6627  1.5348 -0.8597 NaN
3 -2.4529  1.2373 -0.1337 NaN
4  1.4145  1.9517 -2.3204 NaN
5 -0.4949 -1.6497 -1.0846 NaN
6 -1.0476 -0.7486 -0.8055 NaN
7     NaN     NaN     NaN NaN
8     NaN     NaN     NaN NaN
9     NaN     NaN     NaN NaN
When doing an operation between DataFrame and Series, the default behavior is to align the Series index on the DataFrame columns, thus broadcasting row-wise. For example:

In [85]: df - df.iloc[0]
Out[85]: 
        A       B       C       D
0  0.0000  0.0000  0.0000  0.0000
1 -1.3593 -0.2487 -0.4534 -1.7547
2  0.2531  0.8297  0.0100 -1.9912
3 -1.3111  0.0543 -1.7249 -1.6205
4  0.5730  1.5007 -0.6761  1.3673
5 -1.7412  0.7820 -1.2416 -2.0531
6 -1.2408 -0.8696 -0.1533  0.0004
7 -0.7439  0.4110 -0.9296 -0.2824
8 -1.1949  1.3207  0.2382 -1.4826
9  2.2938  1.8562  0.7733 -1.4465
In the special case of working with time series data, and the DataFrame index also contains dates, the broadcasting will be column-wise:

In [86]: index = pd.date_range('1/1/2000', periods=8)

In [87]: df = pd.DataFrame(np.random.randn(8, 3), index=index, columns=list('ABC'))

In [88]: df
Out[88]: 
                 A       B       C
2000-01-01 -1.2268  0.7698 -1.2812
2000-01-02 -0.7277 -0.1213 -0.0979
2000-01-03  0.6958  0.3417  0.9597
2000-01-04 -1.1103 -0.6200  0.1497
2000-01-05 -0.7323  0.6877  0.1764
2000-01-06  0.4033 -0.1550  0.3016
2000-01-07 -2.1799 -1.3698 -0.9542
2000-01-08  1.4627 -1.7432 -0.8266

In [89]: type(df['A'])
Out[89]: pandas.core.series.Series

In [90]: df - df['A']
Out[90]: 
            2000-01-01 00:00:00  2000-01-02 00:00:00  2000-01-03 00:00:00  \
2000-01-01                  NaN                  NaN                  NaN   
2000-01-02                  NaN                  NaN                  NaN   
2000-01-03                  NaN                  NaN                  NaN   
2000-01-04                  NaN                  NaN                  NaN   
2000-01-05                  NaN                  NaN                  NaN   
2000-01-06                  NaN                  NaN                  NaN   
2000-01-07                  NaN                  NaN                  NaN   
2000-01-08                  NaN                  NaN                  NaN   

            2000-01-04 00:00:00 ...  2000-01-08 00:00:00   A   B   C  
2000-01-01                  NaN ...                  NaN NaN NaN NaN  
2000-01-02                  NaN ...                  NaN NaN NaN NaN  
2000-01-03                  NaN ...                  NaN NaN NaN NaN  
2000-01-04                  NaN ...                  NaN NaN NaN NaN  
2000-01-05                  NaN ...                  NaN NaN NaN NaN  
2000-01-06                  NaN ...                  NaN NaN NaN NaN  
2000-01-07                  NaN ...                  NaN NaN NaN NaN  
2000-01-08                  NaN ...                  NaN NaN NaN NaN  

[8 rows x 11 columns]
Warning
df - df['A']
is now deprecated and will be removed in a future release. The preferred way to replicate this behavior is

df.sub(df['A'], axis=0)
For explicit control over the matching and broadcasting behavior, see the section on flexible binary operations.

Operations with scalars are just as you would expect:

In [91]: df * 5 + 2
Out[91]: 
                 A       B       C
2000-01-01 -4.1341  5.8490 -4.4062
2000-01-02 -1.6385  1.3935  1.5106
2000-01-03  5.4789  3.7087  6.7986
2000-01-04 -3.5517 -1.0999  2.7487
2000-01-05 -1.6617  5.4387  2.8822
2000-01-06  4.0165  1.2252  3.5081
2000-01-07 -8.8993 -4.8492 -2.7710
2000-01-08  9.3135 -6.7158 -2.1330

In [92]: 1 / df
Out[92]: 
                 A       B        C
2000-01-01 -0.8151  1.2990  -0.7805
2000-01-02 -1.3742 -8.2436 -10.2163
2000-01-03  1.4372  2.9262   1.0420
2000-01-04 -0.9006 -1.6130   6.6779
2000-01-05 -1.3655  1.4540   5.6675
2000-01-06  2.4795 -6.4537   3.3154
2000-01-07 -0.4587 -0.7300  -1.0480
2000-01-08  0.6837 -0.5737  -1.2098

In [93]: df ** 4
Out[93]: 
                  A       B           C
2000-01-01   2.2653  0.3512  2.6948e+00
2000-01-02   0.2804  0.0002  9.1796e-05
2000-01-03   0.2344  0.0136  8.4838e-01
2000-01-04   1.5199  0.1477  5.0286e-04
2000-01-05   0.2876  0.2237  9.6924e-04
2000-01-06   0.0265  0.0006  8.2769e-03
2000-01-07  22.5795  3.5212  8.2903e-01
2000-01-08   4.5774  9.2332  4.6683e-01
Boolean operators work as well:

In [94]: df1 = pd.DataFrame({'a' : [1, 0, 1], 'b' : [0, 1, 1] }, dtype=bool)

In [95]: df2 = pd.DataFrame({'a' : [0, 1, 1], 'b' : [1, 1, 0] }, dtype=bool)

In [96]: df1 & df2
Out[96]: 
       a      b
0  False  False
1  False   True
2   True  False

In [97]: df1 | df2
Out[97]: 
      a     b
0  True  True
1  True  True
2  True  True

In [98]: df1 ^ df2
Out[98]: 
       a      b
0   True   True
1   True  False
2  False   True

In [99]: -df1
Out[99]: 
       a      b
0  False   True
1   True  False
2  False  False
Transposing
To transpose, access the T attribute (also the transpose function), similar to an ndarray:

# only show the first 5 rows
In [100]: df[:5].T
Out[100]: 
   2000-01-01  2000-01-02  2000-01-03  2000-01-04  2000-01-05
A     -1.2268     -0.7277      0.6958     -1.1103     -0.7323
B      0.7698     -0.1213      0.3417     -0.6200      0.6877
C     -1.2812     -0.0979      0.9597      0.1497      0.1764
DataFrame interoperability with NumPy functions
Elementwise NumPy ufuncs (log, exp, sqrt, …) and various other NumPy functions can be used with no issues on DataFrame, assuming the data within are numeric:

In [101]: np.exp(df)
Out[101]: 
                 A       B       C
2000-01-01  0.2932  2.1593  0.2777
2000-01-02  0.4830  0.8858  0.9068
2000-01-03  2.0053  1.4074  2.6110
2000-01-04  0.3294  0.5380  1.1615
2000-01-05  0.4808  1.9892  1.1930
2000-01-06  1.4968  0.8565  1.3521
2000-01-07  0.1131  0.2541  0.3851
2000-01-08  4.3176  0.1750  0.4375

In [102]: np.asarray(df)
Out[102]: 
array([[-1.2268,  0.7698, -1.2812],
       [-0.7277, -0.1213, -0.0979],
       [ 0.6958,  0.3417,  0.9597],
       [-1.1103, -0.62  ,  0.1497],
       [-0.7323,  0.6877,  0.1764],
       [ 0.4033, -0.155 ,  0.3016],
       [-2.1799, -1.3698, -0.9542],
       [ 1.4627, -1.7432, -0.8266]])
The dot method on DataFrame implements matrix multiplication:

In [103]: df.T.dot(df)
Out[103]: 
         A       B       C
A  11.3419 -0.0598  3.0080
B  -0.0598  6.5206  2.0833
C   3.0080  2.0833  4.3105
Similarly, the dot method on Series implements dot product:

In [104]: s1 = pd.Series(np.arange(5,10))

In [105]: s1.dot(s1)
Out[105]: 255
DataFrame is not intended to be a drop-in replacement for ndarray as its indexing semantics are quite different in places from a matrix.

Console display
Very large DataFrames will be truncated to display them in the console. You can also get a summary using info(). (Here I am reading a CSV version of the baseball dataset from the plyr R package):

In [106]: baseball = pd.read_csv('data/baseball.csv')

In [107]: print(baseball)
       id     player  year  stint  ...   hbp   sh   sf  gidp
0   88641  womacto01  2006      2  ...   0.0  3.0  0.0   0.0
1   88643  schilcu01  2006      1  ...   0.0  0.0  0.0   0.0
..    ...        ...   ...    ...  ...   ...  ...  ...   ...
98  89533   aloumo01  2007      1  ...   2.0  0.0  3.0  13.0
99  89534  alomasa02  2007      1  ...   0.0  0.0  0.0   0.0

[100 rows x 23 columns]

In [108]: baseball.info()
<class 'pandas.core.frame.DataFrame'>
RangeIndex: 100 entries, 0 to 99
Data columns (total 23 columns):
id        100 non-null int64
player    100 non-null object
year      100 non-null int64
stint     100 non-null int64
team      100 non-null object
lg        100 non-null object
g         100 non-null int64
ab        100 non-null int64
r         100 non-null int64
h         100 non-null int64
X2b       100 non-null int64
X3b       100 non-null int64
hr        100 non-null int64
rbi       100 non-null float64
sb        100 non-null float64
cs        100 non-null float64
bb        100 non-null int64
so        100 non-null float64
ibb       100 non-null float64
hbp       100 non-null float64
sh        100 non-null float64
sf        100 non-null float64
gidp      100 non-null float64
dtypes: float64(9), int64(11), object(3)
memory usage: 18.0+ KB
However, using to_string will return a string representation of the DataFrame in tabular form, though it won’t always fit the console width:

In [109]: print(baseball.iloc[-20:, :12].to_string())
       id     player  year  stint team  lg    g   ab   r    h  X2b  X3b
80  89474  finlest01  2007      1  COL  NL   43   94   9   17    3    0
81  89480  embreal01  2007      1  OAK  AL    4    0   0    0    0    0
82  89481  edmonji01  2007      1  SLN  NL  117  365  39   92   15    2
83  89482  easleda01  2007      1  NYN  NL   76  193  24   54    6    0
84  89489  delgaca01  2007      1  NYN  NL  139  538  71  139   30    0
85  89493  cormirh01  2007      1  CIN  NL    6    0   0    0    0    0
86  89494  coninje01  2007      2  NYN  NL   21   41   2    8    2    0
87  89495  coninje01  2007      1  CIN  NL   80  215  23   57   11    1
88  89497  clemero02  2007      1  NYA  AL    2    2   0    1    0    0
89  89498  claytro01  2007      2  BOS  AL    8    6   1    0    0    0
90  89499  claytro01  2007      1  TOR  AL   69  189  23   48   14    0
91  89501  cirilje01  2007      2  ARI  NL   28   40   6    8    4    0
92  89502  cirilje01  2007      1  MIN  AL   50  153  18   40    9    2
93  89521  bondsba01  2007      1  SFN  NL  126  340  75   94   14    0
94  89523  biggicr01  2007      1  HOU  NL  141  517  68  130   31    3
95  89525  benitar01  2007      2  FLO  NL   34    0   0    0    0    0
96  89526  benitar01  2007      1  SFN  NL   19    0   0    0    0    0
97  89530  ausmubr01  2007      1  HOU  NL  117  349  38   82   16    3
98  89533   aloumo01  2007      1  NYN  NL   87  328  51  112   19    1
99  89534  alomasa02  2007      1  NYN  NL    8   22   1    3    1    0
Wide DataFrames will be printed across multiple rows by default:

In [110]: pd.DataFrame(np.random.randn(3, 12))
Out[110]: 
         0         1         2         3         4         5         6         7         8         9         10        11
0 -0.345352  1.314232  0.690579  0.995761  2.396780  0.014871  3.357427 -0.317441 -1.236269  0.896171 -0.487602 -0.082240
1 -2.182937  0.380396  0.084844  0.432390  1.519970 -0.493662  0.600178  0.274230  0.132885 -0.023688  2.410179  1.450520
2  0.206053 -0.251905 -2.213588  1.063327  1.266143  0.299368 -0.863838  0.408204 -1.048089 -0.025747 -0.988387  0.094055
You can change how much to print on a single row by setting the display.width option:

In [111]: pd.set_option('display.width', 40) # default is 80

In [112]: pd.DataFrame(np.random.randn(3, 12))
Out[112]: 
         0         1         2         3         4         5         6         7         8         9         10        11
0  1.262731  1.289997  0.082423 -0.055758  0.536580 -0.489682  0.369374 -0.034571 -2.484478 -0.281461  0.030711  0.109121
1  1.126203 -0.977349  1.474071 -0.064034 -1.282782  0.781836 -1.071357  0.441153  2.353925  0.583787  0.221471 -0.744471
2  0.758527  1.729689 -0.964980 -0.845696 -1.340896  1.846883 -1.328865  1.682706 -1.717693  0.888782  0.228440  0.901805
You can adjust the max width of the individual columns by setting display.max_colwidth

In [113]: datafile={'filename': ['filename_01','filename_02'],
   .....:           'path': ["media/user_name/storage/folder_01/filename_01",
   .....:                    "media/user_name/storage/folder_02/filename_02"]}
   .....: 

In [114]: pd.set_option('display.max_colwidth',30)

In [115]: pd.DataFrame(datafile)
Out[115]: 
      filename                           path
0  filename_01  media/user_name/storage/fo...
1  filename_02  media/user_name/storage/fo...

In [116]: pd.set_option('display.max_colwidth',100)

In [117]: pd.DataFrame(datafile)
Out[117]: 
      filename                                           path
0  filename_01  media/user_name/storage/folder_01/filename_01
1  filename_02  media/user_name/storage/folder_02/filename_02
You can also disable this feature via the expand_frame_repr option. This will print the table in one block.

DataFrame column attribute access and IPython completion
If a DataFrame column label is a valid Python variable name, the column can be accessed like an attribute:

In [118]: df = pd.DataFrame({'foo1' : np.random.randn(5),
   .....:                    'foo2' : np.random.randn(5)})
   .....: 

In [119]: df
Out[119]: 
       foo1      foo2
0  1.171216 -0.858447
1  0.520260  0.306996
2 -1.197071 -0.028665
3 -1.066969  0.384316
4 -0.303421  1.574159

In [120]: df.foo1
Out[120]: 
0    1.171216
1    0.520260
2   -1.197071
3   -1.066969
4   -0.303421
Name: foo1, dtype: float64
The columns are also connected to the IPython completion mechanism so they can be tab-completed:

In [5]: df.fo<TAB>
df.foo1  df.foo2
