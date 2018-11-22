# 数据类型

The main types stored in pandas objects are ``float``, ``int``, ``bool``, ``datetime64[ns]`` and ``datetime64[ns, tz]``, ``timedelta[ns]``, ``category`` and ``object``. In addition these dtypes have item sizes, e.g. ``int64`` and ``int32``. See [Series with TZ](http://pandas.pydata.org/pandas-docs/stable/timeseries.html#timeseries-timezone-series) for more detail on ``datetime64[ns, tz]`` dtypes.

A convenient [dtypes](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.dtypes.html#pandas.DataFrame.dtypes) attribute for DataFrame returns a Series with the data type of each column.

```python
In [344]: dft = pd.DataFrame(dict(A = np.random.rand(3),
   .....:                         B = 1,
   .....:                         C = 'foo',
   .....:                         D = pd.Timestamp('20010102'),
   .....:                         E = pd.Series([1.0]*3).astype('float32'),
   .....:                                     F = False,
   .....:                                     G = pd.Series([1]*3,dtype='int8')))
   .....: 

In [345]: dft
Out[345]: 
          A  B    C          D    E      F  G
0  0.809585  1  foo 2001-01-02  1.0  False  1
1  0.128238  1  foo 2001-01-02  1.0  False  1
2  0.775752  1  foo 2001-01-02  1.0  False  1

In [346]: dft.dtypes
Out[346]: 
A           float64
B             int64
C            object
D    datetime64[ns]
E           float32
F              bool
G              int8
dtype: object
```

On a ``Series`` object, use the [dtype](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.dtype.html#pandas.Series.dtype) attribute.

```python
In [347]: dft['A'].dtype
Out[347]: dtype('float64')
```

If a pandas object contains data with multiple dtypes *in a single column*, the dtype of the column will be chosen to accommodate all of the data types (``object`` is the most general).

```python
# these ints are coerced to floats
In [348]: pd.Series([1, 2, 3, 4, 5, 6.])
Out[348]: 
0    1.0
1    2.0
2    3.0
3    4.0
4    5.0
5    6.0
dtype: float64

# string data forces an ``object`` dtype
In [349]: pd.Series([1, 2, 3, 6., 'foo'])
Out[349]: 
0      1
1      2
2      3
3      6
4    foo
dtype: object
```

The number of columns of each type in a DataFrame can be found by calling [get_dtype_counts()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.get_dtype_counts.html#pandas.DataFrame.get_dtype_counts).

```python
In [350]: dft.get_dtype_counts()
Out[350]: 
float64           1
float32           1
int64             1
int8              1
datetime64[ns]    1
bool              1
object            1
dtype: int64
```

Numeric dtypes will propagate and can coexist in DataFrames. If a dtype is passed (either directly via the ``dtype`` keyword, a passed ``ndarray``, or a passed ``Series``, then it will be preserved in DataFrame operations. Furthermore, different numeric dtypes will **NOT** be combined. The following example will give you a taste.

```python
In [351]: df1 = pd.DataFrame(np.random.randn(8, 1), columns=['A'], dtype='float32')

In [352]: df1
Out[352]: 
          A
0  0.890400
1  0.283331
2 -0.303613
3 -1.192210
4  0.065420
5  0.455918
6  2.008328
7  0.188942

In [353]: df1.dtypes
Out[353]: 
A    float32
dtype: object

In [354]: df2 = pd.DataFrame(dict( A = pd.Series(np.random.randn(8), dtype='float16'),
   .....:                         B = pd.Series(np.random.randn(8)),
   .....:                         C = pd.Series(np.array(np.random.randn(8), dtype='uint8')) ))
   .....: 

In [355]: df2
Out[355]: 
          A         B    C
0 -0.454346  0.200071  255
1 -0.916504 -0.557756  255
2  0.640625 -0.141988    0
3  2.675781 -0.174060    0
4 -0.007866  0.258626    0
5 -0.204224  0.941688    0
6 -0.100098 -1.849045    0
7 -0.402100 -0.949458    0

In [356]: df2.dtypes
Out[356]: 
A    float16
B    float64
C      uint8
dtype: object
```

## defaults

By default integer types are ``int64`` and float types are ``float64``, *regardless* of platform (32-bit or 64-bit). The following will all result in ``int64`` dtypes.

```python
In [357]: pd.DataFrame([1, 2], columns=['a']).dtypes
Out[357]: 
a    int64
dtype: object

In [358]: pd.DataFrame({'a': [1, 2]}).dtypes
Out[358]: 
a    int64
dtype: object

In [359]: pd.DataFrame({'a': 1 }, index=list(range(2))).dtypes
Out[359]: 
a    int64
dtype: object
```

Note that Numpy will choose platform-dependent types when creating arrays. The following **WILL** result in int32 on 32-bit platform.

```python
In [360]: frame = pd.DataFrame(np.array([1, 2]))
```

## upcasting

Types can potentially be upcasted when combined with other types, meaning they are promoted from the current type (e.g. ``int`` to ``float``).

```python
In [361]: df3 = df1.reindex_like(df2).fillna(value=0.0) + df2

In [362]: df3
Out[362]: 
          A         B      C
0  0.436054  0.200071  255.0
1 -0.633173 -0.557756  255.0
2  0.337012 -0.141988    0.0
3  1.483571 -0.174060    0.0
4  0.057555  0.258626    0.0
5  0.251695  0.941688    0.0
6  1.908231 -1.849045    0.0
7 -0.213158 -0.949458    0.0

In [363]: df3.dtypes
Out[363]: 
A    float32
B    float64
C    float64
dtype: object
```

The ``values`` attribute on a DataFrame return the lower-common-denominator of the dtypes, meaning the dtype that can accommodate **ALL** of the types in the resulting homogeneous dtyped NumPy array. This can force some *upcasting*.

```python
In [364]: df3.values.dtype
Out[364]: dtype('float64')
```

## astype

You can use the [astype()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.astype.html#pandas.DataFrame.astype) method to explicitly convert dtypes from one to another. These will by default return a copy, even if the dtype was unchanged (pass ``copy=False`` to change this behavior). In addition, they will raise an exception if the astype operation is invalid.

Upcasting is always according to the **numpy** rules. If two different dtypes are involved in an operation, then the more general one will be used as the result of the operation.

```python
In [365]: df3
Out[365]: 
          A         B      C
0  0.436054  0.200071  255.0
1 -0.633173 -0.557756  255.0
2  0.337012 -0.141988    0.0
3  1.483571 -0.174060    0.0
4  0.057555  0.258626    0.0
5  0.251695  0.941688    0.0
6  1.908231 -1.849045    0.0
7 -0.213158 -0.949458    0.0

In [366]: df3.dtypes
Out[366]: 
A    float32
B    float64
C    float64
dtype: object

# conversion of dtypes
In [367]: df3.astype('float32').dtypes
Out[367]: 
A    float32
B    float32
C    float32
dtype: object
```

Convert a subset of columns to a specified type using [astype()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.astype.html#pandas.DataFrame.astype).

```python
In [368]: dft = pd.DataFrame({'a': [1,2,3], 'b': [4,5,6], 'c': [7, 8, 9]})

In [369]: dft[['a','b']] = dft[['a','b']].astype(np.uint8)

In [370]: dft
Out[370]: 
   a  b  c
0  1  4  7
1  2  5  8
2  3  6  9

In [371]: dft.dtypes
Out[371]: 
a    uint8
b    uint8
c    int64
dtype: object
```

*New in version 0.19.0.*

Convert certain columns to a specific dtype by passing a dict to [astype()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.astype.html#pandas.DataFrame.astype).

```python
In [372]: dft1 = pd.DataFrame({'a': [1,0,1], 'b': [4,5,6], 'c': [7, 8, 9]})

In [373]: dft1 = dft1.astype({'a': np.bool, 'c': np.float64})

In [374]: dft1
Out[374]: 
       a  b    c
0   True  4  7.0
1  False  5  8.0
2   True  6  9.0

In [375]: dft1.dtypes
Out[375]: 
a       bool
b      int64
c    float64
dtype: object
```

**Note**: When trying to convert a subset of columns to a specified type using astype() and loc(), upcasting occurs.

[loc()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.loc.html#pandas.DataFrame.loc) tries to fit in what we are assigning to the current dtypes, while [] will overwrite them taking the dtype from the right hand side. Therefore the following piece of code produces the unintended result.

```python
In [376]: dft = pd.DataFrame({'a': [1,2,3], 'b': [4,5,6], 'c': [7, 8, 9]})

In [377]: dft.loc[:, ['a', 'b']].astype(np.uint8).dtypes
Out[377]: 
a    uint8
b    uint8
dtype: object

In [378]: dft.loc[:, ['a', 'b']] = dft.loc[:, ['a', 'b']].astype(np.uint8)

In [379]: dft.dtypes
Out[379]: 
a    int64
b    int64
c    int64
dtype: object
```

## object conversion

pandas offers various functions to try to force conversion of types from the object dtype to other types. In cases where the data is already of the correct type, but stored in an object array, the [DataFrame.infer_objects()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.infer_objects.html#pandas.DataFrame.infer_objects) and [Series.infer_objects()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.infer_objects.html#pandas.Series.infer_objects) methods can be used to soft convert to the correct type.

```python
In [380]: import datetime

In [381]: df = pd.DataFrame([[1, 2],
   .....:                    ['a', 'b'],
   .....:                    [datetime.datetime(2016, 3, 2), datetime.datetime(2016, 3, 2)]])
   .....: 

In [382]: df = df.T

In [383]: df
Out[383]: 
   0  1                    2
0  1  a  2016-03-02 00:00:00
1  2  b  2016-03-02 00:00:00

In [384]: df.dtypes
Out[384]: 
0    object
1    object
2    object
dtype: object
```

Because the data was transposed the original inference stored all columns as object, which infer_objects will correct.

```python
In [385]: df.infer_objects().dtypes
Out[385]: 
0             int64
1            object
2    datetime64[ns]
dtype: object
```

The following functions are available for one dimensional object arrays or scalars to perform hard conversion of objects to a specified type:

- [to_numeric()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.to_numeric.html#pandas.to_numeric) (conversion to numeric dtypes)
    ```python
    In [386]: m = ['1.1', 2, 3]

    In [387]: pd.to_numeric(m)
    Out[387]: array([ 1.1,  2. ,  3. ])
    ```
- [to_datetime()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.to_datetime.html#pandas.to_datetime) (conversion to datetime objects)
    ```python
    In [388]: import datetime

    In [389]: m = ['2016-07-09', datetime.datetime(2016, 3, 2)]

    In [390]: pd.to_datetime(m)
    Out[390]: DatetimeIndex(['2016-07-09', '2016-03-02'], dtype='datetime64[ns]', freq=None)
    ```
- [to_timedelta()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.to_timedelta.html#pandas.to_timedelta) (conversion to timedelta objects)
    ```python
    In [391]: m = ['5us', pd.Timedelta('1day')]

    In [392]: pd.to_timedelta(m)
    Out[392]: TimedeltaIndex(['0 days 00:00:00.000005', '1 days 00:00:00'], dtype='timedelta64[ns]', freq=None)
    ```

To force a conversion, we can pass in an ``errors`` argument, which specifies how pandas should deal with elements that cannot be converted to desired dtype or object. By default, ``errors='raise'``, meaning that any errors encountered will be raised during the conversion process. However, if ``errors='coerce'``, these errors will be ignored and pandas will convert problematic elements to pd.NaT (for datetime and timedelta) or ``np.nan`` (for numeric). This might be useful if you are reading in data which is mostly of the desired dtype (e.g. numeric, datetime), but occasionally has non-conforming elements intermixed that you want to represent as missing:

```python
In [393]: import datetime

In [394]: m = ['apple', datetime.datetime(2016, 3, 2)]

In [395]: pd.to_datetime(m, errors='coerce')
Out[395]: DatetimeIndex(['NaT', '2016-03-02'], dtype='datetime64[ns]', freq=None)

In [396]: m = ['apple', 2, 3]

In [397]: pd.to_numeric(m, errors='coerce')
Out[397]: array([ nan,   2.,   3.])

In [398]: m = ['apple', pd.Timedelta('1day')]

In [399]: pd.to_timedelta(m, errors='coerce')
Out[399]: TimedeltaIndex([NaT, '1 days'], dtype='timedelta64[ns]', freq=None)
```

The ``errors`` parameter has a third option of ``errors='ignore'``, which will simply return the passed in data if it encounters any errors with the conversion to a desired data type:

```python
In [400]: import datetime

In [401]: m = ['apple', datetime.datetime(2016, 3, 2)]

In [402]: pd.to_datetime(m, errors='ignore')
Out[402]: array(['apple', datetime.datetime(2016, 3, 2, 0, 0)], dtype=object)

In [403]: m = ['apple', 2, 3]

In [404]: pd.to_numeric(m, errors='ignore')
Out[404]: array(['apple', 2, 3], dtype=object)

In [405]: m = ['apple', pd.Timedelta('1day')]

In [406]: pd.to_timedelta(m, errors='ignore')
Out[406]: array(['apple', Timedelta('1 days 00:00:00')], dtype=object)
```

In addition to object conversion, [to_numeric()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.to_numeric.html#pandas.to_numeric) provides another argument ``downcast``, which gives the option of downcasting the newly (or already) numeric data to a smaller dtype, which can conserve memory:

```python
In [407]: m = ['1', 2, 3]

In [408]: pd.to_numeric(m, downcast='integer')   # smallest signed int dtype
Out[408]: array([1, 2, 3], dtype=int8)

In [409]: pd.to_numeric(m, downcast='signed')    # same as 'integer'
Out[409]: array([1, 2, 3], dtype=int8)

In [410]: pd.to_numeric(m, downcast='unsigned')  # smallest unsigned int dtype
Out[410]: array([1, 2, 3], dtype=uint8)

In [411]: pd.to_numeric(m, downcast='float')     # smallest float dtype
Out[411]: array([ 1.,  2.,  3.], dtype=float32)
```

As these methods apply only to one-dimensional arrays, lists or scalars; they cannot be used directly on multi-dimensional objects such as DataFrames. However, with [apply()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.apply.html#pandas.DataFrame.apply), we can “apply” the function over each column efficiently:

```python
In [412]: import datetime

In [413]: df = pd.DataFrame([['2016-07-09', datetime.datetime(2016, 3, 2)]] * 2, dtype='O')

In [414]: df
Out[414]: 
            0                    1
0  2016-07-09  2016-03-02 00:00:00
1  2016-07-09  2016-03-02 00:00:00

In [415]: df.apply(pd.to_datetime)
Out[415]: 
           0          1
0 2016-07-09 2016-03-02
1 2016-07-09 2016-03-02

In [416]: df = pd.DataFrame([['1.1', 2, 3]] * 2, dtype='O')

In [417]: df
Out[417]: 
     0  1  2
0  1.1  2  3
1  1.1  2  3

In [418]: df.apply(pd.to_numeric)
Out[418]: 
     0  1  2
0  1.1  2  3
1  1.1  2  3

In [419]: df = pd.DataFrame([['5us', pd.Timedelta('1day')]] * 2, dtype='O')

In [420]: df
Out[420]: 
     0                1
0  5us  1 days 00:00:00
1  5us  1 days 00:00:00

In [421]: df.apply(pd.to_timedelta)
Out[421]: 
                0      1
0 00:00:00.000005 1 days
1 00:00:00.000005 1 days
```

## gotchas

Performing selection operations on ``integer`` type data can easily upcast the data to ``floating``. The dtype of the input data will be preserved in cases where ``nans`` are not introduced. See also [Support for integer NA](http://pandas.pydata.org/pandas-docs/stable/gotchas.html#gotchas-intna).

```python
In [422]: dfi = df3.astype('int32')

In [423]: dfi['E'] = 1

In [424]: dfi
Out[424]: 
   A  B    C  E
0  0  0  255  1
1  0  0  255  1
2  0  0    0  1
3  1  0    0  1
4  0  0    0  1
5  0  0    0  1
6  1 -1    0  1
7  0  0    0  1

In [425]: dfi.dtypes
Out[425]: 
A    int32
B    int32
C    int32
E    int64
dtype: object

In [426]: casted = dfi[dfi>0]

In [427]: casted
Out[427]: 
     A   B      C  E
0  NaN NaN  255.0  1
1  NaN NaN  255.0  1
2  NaN NaN    NaN  1
3  1.0 NaN    NaN  1
4  NaN NaN    NaN  1
5  NaN NaN    NaN  1
6  1.0 NaN    NaN  1
7  NaN NaN    NaN  1

In [428]: casted.dtypes
Out[428]: 
A    float64
B    float64
C    float64
E      int64
dtype: object
```

While float dtypes are unchanged.

```python
In [429]: dfa = df3.copy()

In [430]: dfa['A'] = dfa['A'].astype('float32')

In [431]: dfa.dtypes
Out[431]: 
A    float32
B    float64
C    float64
dtype: object

In [432]: casted = dfa[df2>0]

In [433]: casted
Out[433]: 
          A         B      C
0       NaN  0.200071  255.0
1       NaN       NaN  255.0
2  0.337012       NaN    NaN
3  1.483571       NaN    NaN
4       NaN  0.258626    NaN
5       NaN  0.941688    NaN
6       NaN       NaN    NaN
7       NaN       NaN    NaN

In [434]: casted.dtypes
Out[434]: 
A    float32
B    float64
C    float64
dtype: object
```