# 根据dtype选择列

The [select_dtypes()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.select_dtypes.html#pandas.DataFrame.select_dtypes) method implements subsetting of columns based on their dtype.

First, let’s create a [DataFrame](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.html#pandas.DataFrame) with a slew of different dtypes:

```python
In [435]: df = pd.DataFrame({'string': list('abc'),
   .....:                    'int64': list(range(1, 4)),
   .....:                    'uint8': np.arange(3, 6).astype('u1'),
   .....:                    'float64': np.arange(4.0, 7.0),
   .....:                    'bool1': [True, False, True],
   .....:                    'bool2': [False, True, False],
   .....:                    'dates': pd.date_range('now', periods=3).values,
   .....:                    'category': pd.Series(list("ABC")).astype('category')})
   .....: 

In [436]: df['tdeltas'] = df.dates.diff()

In [437]: df['uint64'] = np.arange(3, 6).astype('u8')

In [438]: df['other_dates'] = pd.date_range('20130101', periods=3).values

In [439]: df['tz_aware_dates'] = pd.date_range('20130101', periods=3, tz='US/Eastern')

In [440]: df
Out[440]: 
  string  int64  uint8  float64  bool1  bool2                      dates category tdeltas  uint64 other_dates            tz_aware_dates
0      a      1      3      4.0   True  False 2018-08-05 11:57:39.507525        A     NaT       3  2013-01-01 2013-01-01 00:00:00-05:00
1      b      2      4      5.0  False   True 2018-08-06 11:57:39.507525        B  1 days       4  2013-01-02 2013-01-02 00:00:00-05:00
2      c      3      5      6.0   True  False 2018-08-07 11:57:39.507525        C  1 days       5  2013-01-03 2013-01-03 00:00:00-05:00
```

And the dtypes:

```python
In [441]: df.dtypes
Out[441]: 
string                                object
int64                                  int64
uint8                                  uint8
float64                              float64
bool1                                   bool
bool2                                   bool
dates                         datetime64[ns]
category                            category
tdeltas                      timedelta64[ns]
uint64                                uint64
other_dates                   datetime64[ns]
tz_aware_dates    datetime64[ns, US/Eastern]
dtype: object
```

[select_dtypes()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.select_dtypes.html#pandas.DataFrame.select_dtypes) has two parameters ``include`` and ``exclude`` that allow you to say “give me the columns with these dtypes” (``include``) and/or “give the columns without these dtypes” (``exclude``).

For example, to select ``bool`` columns:

```python
In [442]: df.select_dtypes(include=[bool])
Out[442]: 
   bool1  bool2
0   True  False
1  False   True
2   True  False
```

You can also pass the name of a dtype in the NumPy dtype hierarchy:

```python
In [443]: df.select_dtypes(include=['bool'])
Out[443]: 
   bool1  bool2
0   True  False
1  False   True
2   True  False
```

[select_dtypes()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.select_dtypes.html#pandas.DataFrame.select_dtypes) also works with generic dtypes as well.

For example, to select all numeric and boolean columns while excluding unsigned integers:

```python
In [444]: df.select_dtypes(include=['number', 'bool'], exclude=['unsignedinteger'])
Out[444]: 
   int64  float64  bool1  bool2 tdeltas
0      1      4.0   True  False     NaT
1      2      5.0  False   True  1 days
2      3      6.0   True  False  1 days
```

To select string columns you must use the object dtype:

```python
In [445]: df.select_dtypes(include=['object'])
Out[445]: 
  string
0      a
1      b
2      c
```

To see all the child dtypes of a generic dtype like numpy.number you can define a function that returns a tree of child dtypes:

```python
In [446]: def subdtypes(dtype):
   .....:     subs = dtype.__subclasses__()
   .....:     if not subs:
   .....:         return dtype
   .....:     return [dtype, [subdtypes(dt) for dt in subs]]
   .....: 
```

All NumPy dtypes are subclasses of numpy.generic:

```python
In [447]: subdtypes(np.generic)
Out[447]: 
[numpy.generic,
 [[numpy.number,
   [[numpy.integer,
     [[numpy.signedinteger,
       [numpy.int8,
        numpy.int16,
        numpy.int32,
        numpy.int64,
        numpy.int64,
        numpy.timedelta64]],
      [numpy.unsignedinteger,
       [numpy.uint8,
        numpy.uint16,
        numpy.uint32,
        numpy.uint64,
        numpy.uint64]]]],
    [numpy.inexact,
     [[numpy.floating,
       [numpy.float16, numpy.float32, numpy.float64, numpy.float128]],
      [numpy.complexfloating,
       [numpy.complex64, numpy.complex128, numpy.complex256]]]]]],
  [numpy.flexible,
   [[numpy.character, [numpy.bytes_, numpy.str_]],
    [numpy.void, [numpy.record]]]],
  numpy.bool_,
  numpy.datetime64,
  numpy.object_]]
```

**Note:** Pandas also defines the types ``category``, and ``datetime64[ns, tz]``, which are not integrated into the normal NumPy hierarchy and won’t show up with the above function.