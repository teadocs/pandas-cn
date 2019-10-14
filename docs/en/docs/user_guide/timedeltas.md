# Time deltas

Timedeltas are differences in times, expressed in difference units, e.g. days, hours, minutes,
seconds. They can be both positive and negative.

``Timedelta`` is a subclass of ``datetime.timedelta``, and behaves in a similar manner,
but allows compatibility with ``np.timedelta64`` types as well as a host of custom representation,
parsing, and attributes.

## Parsing

You can construct a ``Timedelta`` scalar through various arguments:

``` python
In [1]: import datetime

# strings
In [2]: pd.Timedelta('1 days')
Out[2]: Timedelta('1 days 00:00:00')

In [3]: pd.Timedelta('1 days 00:00:00')
Out[3]: Timedelta('1 days 00:00:00')

In [4]: pd.Timedelta('1 days 2 hours')
Out[4]: Timedelta('1 days 02:00:00')

In [5]: pd.Timedelta('-1 days 2 min 3us')
Out[5]: Timedelta('-2 days +23:57:59.999997')

# like datetime.timedelta
# note: these MUST be specified as keyword arguments
In [6]: pd.Timedelta(days=1, seconds=1)
Out[6]: Timedelta('1 days 00:00:01')

# integers with a unit
In [7]: pd.Timedelta(1, unit='d')
Out[7]: Timedelta('1 days 00:00:00')

# from a datetime.timedelta/np.timedelta64
In [8]: pd.Timedelta(datetime.timedelta(days=1, seconds=1))
Out[8]: Timedelta('1 days 00:00:01')

In [9]: pd.Timedelta(np.timedelta64(1, 'ms'))
Out[9]: Timedelta('0 days 00:00:00.001000')

# negative Timedeltas have this string repr
# to be more consistent with datetime.timedelta conventions
In [10]: pd.Timedelta('-1us')
Out[10]: Timedelta('-1 days +23:59:59.999999')

# a NaT
In [11]: pd.Timedelta('nan')
Out[11]: NaT

In [12]: pd.Timedelta('nat')
Out[12]: NaT

# ISO 8601 Duration strings
In [13]: pd.Timedelta('P0DT0H1M0S')
Out[13]: Timedelta('0 days 00:01:00')

In [14]: pd.Timedelta('P0DT0H0M0.000000123S')
Out[14]: Timedelta('0 days 00:00:00.000000')
```

*New in version 0.23.0:* Added constructor for [ISO 8601 Duration](https://en.wikipedia.org/wiki/ISO_8601#Durations) strings

[DateOffsets](timeseries.html#timeseries-offsets) (``Day, Hour, Minute, Second, Milli, Micro, Nano``) can also be used in construction.

``` python
In [15]: pd.Timedelta(pd.offsets.Second(2))
Out[15]: Timedelta('0 days 00:00:02')
```

Further, operations among the scalars yield another scalar ``Timedelta``.

``` python
In [16]: pd.Timedelta(pd.offsets.Day(2)) + pd.Timedelta(pd.offsets.Second(2)) +\
   ....:     pd.Timedelta('00:00:00.000123')
   ....: 
Out[16]: Timedelta('2 days 00:00:02.000123')
```

### to_timedelta

Using the top-level ``pd.to_timedelta``, you can convert a scalar, array, list,
or Series from a recognized timedelta format / value into a ``Timedelta`` type.
It will construct Series if the input is a Series, a scalar if the input is
scalar-like, otherwise it will output a ``TimedeltaIndex``.

You can parse a single string to a Timedelta:

``` python
In [17]: pd.to_timedelta('1 days 06:05:01.00003')
Out[17]: Timedelta('1 days 06:05:01.000030')

In [18]: pd.to_timedelta('15.5us')
Out[18]: Timedelta('0 days 00:00:00.000015')
```

or a list/array of strings:

``` python
In [19]: pd.to_timedelta(['1 days 06:05:01.00003', '15.5us', 'nan'])
Out[19]: TimedeltaIndex(['1 days 06:05:01.000030', '0 days 00:00:00.000015', NaT], dtype='timedelta64[ns]', freq=None)
```

The ``unit`` keyword argument specifies the unit of the Timedelta:

``` python
In [20]: pd.to_timedelta(np.arange(5), unit='s')
Out[20]: TimedeltaIndex(['00:00:00', '00:00:01', '00:00:02', '00:00:03', '00:00:04'], dtype='timedelta64[ns]', freq=None)

In [21]: pd.to_timedelta(np.arange(5), unit='d')
Out[21]: TimedeltaIndex(['0 days', '1 days', '2 days', '3 days', '4 days'], dtype='timedelta64[ns]', freq=None)
```

### Timedelta limitations

Pandas represents ``Timedeltas`` in nanosecond resolution using
64 bit integers. As such, the 64 bit integer limits determine
the ``Timedelta`` limits.

``` python
In [22]: pd.Timedelta.min
Out[22]: Timedelta('-106752 days +00:12:43.145224')

In [23]: pd.Timedelta.max
Out[23]: Timedelta('106751 days 23:47:16.854775')
```

## Operations

You can operate on Series/DataFrames and construct ``timedelta64[ns]`` Series through
subtraction operations on ``datetime64[ns]`` Series, or ``Timestamps``.

``` python
In [24]: s = pd.Series(pd.date_range('2012-1-1', periods=3, freq='D'))

In [25]: td = pd.Series([pd.Timedelta(days=i) for i in range(3)])

In [26]: df = pd.DataFrame({'A': s, 'B': td})

In [27]: df
Out[27]: 
           A      B
0 2012-01-01 0 days
1 2012-01-02 1 days
2 2012-01-03 2 days

In [28]: df['C'] = df['A'] + df['B']

In [29]: df
Out[29]: 
           A      B          C
0 2012-01-01 0 days 2012-01-01
1 2012-01-02 1 days 2012-01-03
2 2012-01-03 2 days 2012-01-05

In [30]: df.dtypes
Out[30]: 
A     datetime64[ns]
B    timedelta64[ns]
C     datetime64[ns]
dtype: object

In [31]: s - s.max()
Out[31]: 
0   -2 days
1   -1 days
2    0 days
dtype: timedelta64[ns]

In [32]: s - datetime.datetime(2011, 1, 1, 3, 5)
Out[32]: 
0   364 days 20:55:00
1   365 days 20:55:00
2   366 days 20:55:00
dtype: timedelta64[ns]

In [33]: s + datetime.timedelta(minutes=5)
Out[33]: 
0   2012-01-01 00:05:00
1   2012-01-02 00:05:00
2   2012-01-03 00:05:00
dtype: datetime64[ns]

In [34]: s + pd.offsets.Minute(5)
Out[34]: 
0   2012-01-01 00:05:00
1   2012-01-02 00:05:00
2   2012-01-03 00:05:00
dtype: datetime64[ns]

In [35]: s + pd.offsets.Minute(5) + pd.offsets.Milli(5)
Out[35]: 
0   2012-01-01 00:05:00.005
1   2012-01-02 00:05:00.005
2   2012-01-03 00:05:00.005
dtype: datetime64[ns]
```

Operations with scalars from a ``timedelta64[ns]`` series:

``` python
In [36]: y = s - s[0]

In [37]: y
Out[37]: 
0   0 days
1   1 days
2   2 days
dtype: timedelta64[ns]
```

Series of timedeltas with ``NaT`` values are supported:

``` python
In [38]: y = s - s.shift()

In [39]: y
Out[39]: 
0      NaT
1   1 days
2   1 days
dtype: timedelta64[ns]
```

Elements can be set to ``NaT`` using ``np.nan`` analogously to datetimes:

``` python
In [40]: y[1] = np.nan

In [41]: y
Out[41]: 
0      NaT
1      NaT
2   1 days
dtype: timedelta64[ns]
```

Operands can also appear in a reversed order (a singular object operated with a Series):

``` python
In [42]: s.max() - s
Out[42]: 
0   2 days
1   1 days
2   0 days
dtype: timedelta64[ns]

In [43]: datetime.datetime(2011, 1, 1, 3, 5) - s
Out[43]: 
0   -365 days +03:05:00
1   -366 days +03:05:00
2   -367 days +03:05:00
dtype: timedelta64[ns]

In [44]: datetime.timedelta(minutes=5) + s
Out[44]: 
0   2012-01-01 00:05:00
1   2012-01-02 00:05:00
2   2012-01-03 00:05:00
dtype: datetime64[ns]
```

``min, max`` and the corresponding ``idxmin, idxmax`` operations are supported on frames:

``` python
In [45]: A = s - pd.Timestamp('20120101') - pd.Timedelta('00:05:05')

In [46]: B = s - pd.Series(pd.date_range('2012-1-2', periods=3, freq='D'))

In [47]: df = pd.DataFrame({'A': A, 'B': B})

In [48]: df
Out[48]: 
                  A       B
0 -1 days +23:54:55 -1 days
1   0 days 23:54:55 -1 days
2   1 days 23:54:55 -1 days

In [49]: df.min()
Out[49]: 
A   -1 days +23:54:55
B   -1 days +00:00:00
dtype: timedelta64[ns]

In [50]: df.min(axis=1)
Out[50]: 
0   -1 days
1   -1 days
2   -1 days
dtype: timedelta64[ns]

In [51]: df.idxmin()
Out[51]: 
A    0
B    0
dtype: int64

In [52]: df.idxmax()
Out[52]: 
A    2
B    0
dtype: int64
```

``min, max, idxmin, idxmax`` operations are supported on Series as well. A scalar result will be a ``Timedelta``.

``` python
In [53]: df.min().max()
Out[53]: Timedelta('-1 days +23:54:55')

In [54]: df.min(axis=1).min()
Out[54]: Timedelta('-1 days +00:00:00')

In [55]: df.min().idxmax()
Out[55]: 'A'

In [56]: df.min(axis=1).idxmin()
Out[56]: 0
```

You can fillna on timedeltas, passing a timedelta to get a particular value.

``` python
In [57]: y.fillna(pd.Timedelta(0))
Out[57]: 
0   0 days
1   0 days
2   1 days
dtype: timedelta64[ns]

In [58]: y.fillna(pd.Timedelta(10, unit='s'))
Out[58]: 
0   0 days 00:00:10
1   0 days 00:00:10
2   1 days 00:00:00
dtype: timedelta64[ns]

In [59]: y.fillna(pd.Timedelta('-1 days, 00:00:05'))
Out[59]: 
0   -1 days +00:00:05
1   -1 days +00:00:05
2     1 days 00:00:00
dtype: timedelta64[ns]
```

You can also negate, multiply and use ``abs`` on ``Timedeltas``:

``` python
In [60]: td1 = pd.Timedelta('-1 days 2 hours 3 seconds')

In [61]: td1
Out[61]: Timedelta('-2 days +21:59:57')

In [62]: -1 * td1
Out[62]: Timedelta('1 days 02:00:03')

In [63]: - td1
Out[63]: Timedelta('1 days 02:00:03')

In [64]: abs(td1)
Out[64]: Timedelta('1 days 02:00:03')
```

## Reductions

Numeric reduction operation for ``timedelta64[ns]`` will return ``Timedelta`` objects. As usual
``NaT`` are skipped during evaluation.

``` python
In [65]: y2 = pd.Series(pd.to_timedelta(['-1 days +00:00:05', 'nat',
   ....:                                 '-1 days +00:00:05', '1 days']))
   ....: 

In [66]: y2
Out[66]: 
0   -1 days +00:00:05
1                 NaT
2   -1 days +00:00:05
3     1 days 00:00:00
dtype: timedelta64[ns]

In [67]: y2.mean()
Out[67]: Timedelta('-1 days +16:00:03.333333')

In [68]: y2.median()
Out[68]: Timedelta('-1 days +00:00:05')

In [69]: y2.quantile(.1)
Out[69]: Timedelta('-1 days +00:00:05')

In [70]: y2.sum()
Out[70]: Timedelta('-1 days +00:00:10')
```

## Frequency conversion

Timedelta Series, ``TimedeltaIndex``, and ``Timedelta`` scalars can be converted to other ‘frequencies’ by dividing by another timedelta,
or by astyping to a specific timedelta type. These operations yield Series and propagate ``NaT`` -> ``nan``.
Note that division by the NumPy scalar is true division, while astyping is equivalent of floor division.

``` python
In [71]: december = pd.Series(pd.date_range('20121201', periods=4))

In [72]: january = pd.Series(pd.date_range('20130101', periods=4))

In [73]: td = january - december

In [74]: td[2] += datetime.timedelta(minutes=5, seconds=3)

In [75]: td[3] = np.nan

In [76]: td
Out[76]: 
0   31 days 00:00:00
1   31 days 00:00:00
2   31 days 00:05:03
3                NaT
dtype: timedelta64[ns]

# to days
In [77]: td / np.timedelta64(1, 'D')
Out[77]: 
0    31.000000
1    31.000000
2    31.003507
3          NaN
dtype: float64

In [78]: td.astype('timedelta64[D]')
Out[78]: 
0    31.0
1    31.0
2    31.0
3     NaN
dtype: float64

# to seconds
In [79]: td / np.timedelta64(1, 's')
Out[79]: 
0    2678400.0
1    2678400.0
2    2678703.0
3          NaN
dtype: float64

In [80]: td.astype('timedelta64[s]')
Out[80]: 
0    2678400.0
1    2678400.0
2    2678703.0
3          NaN
dtype: float64

# to months (these are constant months)
In [81]: td / np.timedelta64(1, 'M')
Out[81]: 
0    1.018501
1    1.018501
2    1.018617
3         NaN
dtype: float64
```

Dividing or multiplying a ``timedelta64[ns]`` Series by an integer or integer Series
yields another ``timedelta64[ns]`` dtypes Series.

``` python
In [82]: td * -1
Out[82]: 
0   -31 days +00:00:00
1   -31 days +00:00:00
2   -32 days +23:54:57
3                  NaT
dtype: timedelta64[ns]

In [83]: td * pd.Series([1, 2, 3, 4])
Out[83]: 
0   31 days 00:00:00
1   62 days 00:00:00
2   93 days 00:15:09
3                NaT
dtype: timedelta64[ns]
```

Rounded division (floor-division) of a ``timedelta64[ns]`` Series by a scalar
``Timedelta`` gives a series of integers.

``` python
In [84]: td // pd.Timedelta(days=3, hours=4)
Out[84]: 
0    9.0
1    9.0
2    9.0
3    NaN
dtype: float64

In [85]: pd.Timedelta(days=3, hours=4) // td
Out[85]: 
0    0.0
1    0.0
2    0.0
3    NaN
dtype: float64
```

The mod (%) and divmod operations are defined for ``Timedelta`` when operating with another timedelta-like or with a numeric argument.

``` python
In [86]: pd.Timedelta(hours=37) % datetime.timedelta(hours=2)
Out[86]: Timedelta('0 days 01:00:00')

# divmod against a timedelta-like returns a pair (int, Timedelta)
In [87]: divmod(datetime.timedelta(hours=2), pd.Timedelta(minutes=11))
Out[87]: (10, Timedelta('0 days 00:10:00'))

# divmod against a numeric returns a pair (Timedelta, Timedelta)
In [88]: divmod(pd.Timedelta(hours=25), 86400000000000)
Out[88]: (Timedelta('0 days 00:00:00.000000'), Timedelta('0 days 01:00:00'))
```

## Attributes

You can access various components of the ``Timedelta`` or ``TimedeltaIndex`` directly using the attributes ``days,seconds,microseconds,nanoseconds``. These are identical to the values returned by ``datetime.timedelta``, in that, for example, the ``.seconds`` attribute represents the number of seconds >= 0 and < 1 day. These are signed according to whether the ``Timedelta`` is signed.

These operations can also be directly accessed via the ``.dt`` property of the ``Series`` as well.

::: tip Note

Note that the attributes are NOT the displayed values of the ``Timedelta``. Use ``.components`` to retrieve the displayed values.

:::

For a ``Series``:

``` python
In [89]: td.dt.days
Out[89]: 
0    31.0
1    31.0
2    31.0
3     NaN
dtype: float64

In [90]: td.dt.seconds
Out[90]: 
0      0.0
1      0.0
2    303.0
3      NaN
dtype: float64
```

You can access the value of the fields for a scalar ``Timedelta`` directly.

``` python
In [91]: tds = pd.Timedelta('31 days 5 min 3 sec')

In [92]: tds.days
Out[92]: 31

In [93]: tds.seconds
Out[93]: 303

In [94]: (-tds).seconds
Out[94]: 86097
```

You can use the ``.components`` property to access a reduced form of the timedelta. This returns a ``DataFrame`` indexed
similarly to the ``Series``. These are the *displayed* values of the ``Timedelta``.

``` python
In [95]: td.dt.components
Out[95]: 
   days  hours  minutes  seconds  milliseconds  microseconds  nanoseconds
0  31.0    0.0      0.0      0.0           0.0           0.0          0.0
1  31.0    0.0      0.0      0.0           0.0           0.0          0.0
2  31.0    0.0      5.0      3.0           0.0           0.0          0.0
3   NaN    NaN      NaN      NaN           NaN           NaN          NaN

In [96]: td.dt.components.seconds
Out[96]: 
0    0.0
1    0.0
2    3.0
3    NaN
Name: seconds, dtype: float64
```

You can convert a ``Timedelta`` to an [ISO 8601 Duration](https://en.wikipedia.org/wiki/ISO_8601#Durations) string with the
``.isoformat`` method

*New in version 0.20.0.* 

``` python
In [97]: pd.Timedelta(days=6, minutes=50, seconds=3,
   ....:              milliseconds=10, microseconds=10,
   ....:              nanoseconds=12).isoformat()
   ....: 
Out[97]: 'P6DT0H50M3.010010012S'
```

## TimedeltaIndex

To generate an index with time delta, you can use either the [``TimedeltaIndex``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.TimedeltaIndex.html#pandas.TimedeltaIndex) or
the [``timedelta_range()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.timedelta_range.html#pandas.timedelta_range) constructor.

Using ``TimedeltaIndex`` you can pass string-like, ``Timedelta``, ``timedelta``,
or ``np.timedelta64`` objects. Passing ``np.nan/pd.NaT/nat`` will represent missing values.

``` python
In [98]: pd.TimedeltaIndex(['1 days', '1 days, 00:00:05', np.timedelta64(2, 'D'),
   ....:                    datetime.timedelta(days=2, seconds=2)])
   ....: 
Out[98]: 
TimedeltaIndex(['1 days 00:00:00', '1 days 00:00:05', '2 days 00:00:00',
                '2 days 00:00:02'],
               dtype='timedelta64[ns]', freq=None)
```

The string ‘infer’ can be passed in order to set the frequency of the index as the
inferred frequency upon creation:

``` python
In [99]: pd.TimedeltaIndex(['0 days', '10 days', '20 days'], freq='infer')
Out[99]: TimedeltaIndex(['0 days', '10 days', '20 days'], dtype='timedelta64[ns]', freq='10D')
```

### Generating ranges of time deltas

Similar to [``date_range()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.date_range.html#pandas.date_range), you can construct regular ranges of a ``TimedeltaIndex``
using [``timedelta_range()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.timedelta_range.html#pandas.timedelta_range).  The default frequency for ``timedelta_range`` is
calendar day:

``` python
In [100]: pd.timedelta_range(start='1 days', periods=5)
Out[100]: TimedeltaIndex(['1 days', '2 days', '3 days', '4 days', '5 days'], dtype='timedelta64[ns]', freq='D')
```

Various combinations of ``start``, ``end``, and ``periods`` can be used with
``timedelta_range``:

``` python
In [101]: pd.timedelta_range(start='1 days', end='5 days')
Out[101]: TimedeltaIndex(['1 days', '2 days', '3 days', '4 days', '5 days'], dtype='timedelta64[ns]', freq='D')

In [102]: pd.timedelta_range(end='10 days', periods=4)
Out[102]: TimedeltaIndex(['7 days', '8 days', '9 days', '10 days'], dtype='timedelta64[ns]', freq='D')
```

The ``freq`` parameter can passed a variety of [frequency aliases](timeseries.html#timeseries-offset-aliases):

``` python
In [103]: pd.timedelta_range(start='1 days', end='2 days', freq='30T')
Out[103]: 
TimedeltaIndex(['1 days 00:00:00', '1 days 00:30:00', '1 days 01:00:00',
                '1 days 01:30:00', '1 days 02:00:00', '1 days 02:30:00',
                '1 days 03:00:00', '1 days 03:30:00', '1 days 04:00:00',
                '1 days 04:30:00', '1 days 05:00:00', '1 days 05:30:00',
                '1 days 06:00:00', '1 days 06:30:00', '1 days 07:00:00',
                '1 days 07:30:00', '1 days 08:00:00', '1 days 08:30:00',
                '1 days 09:00:00', '1 days 09:30:00', '1 days 10:00:00',
                '1 days 10:30:00', '1 days 11:00:00', '1 days 11:30:00',
                '1 days 12:00:00', '1 days 12:30:00', '1 days 13:00:00',
                '1 days 13:30:00', '1 days 14:00:00', '1 days 14:30:00',
                '1 days 15:00:00', '1 days 15:30:00', '1 days 16:00:00',
                '1 days 16:30:00', '1 days 17:00:00', '1 days 17:30:00',
                '1 days 18:00:00', '1 days 18:30:00', '1 days 19:00:00',
                '1 days 19:30:00', '1 days 20:00:00', '1 days 20:30:00',
                '1 days 21:00:00', '1 days 21:30:00', '1 days 22:00:00',
                '1 days 22:30:00', '1 days 23:00:00', '1 days 23:30:00',
                '2 days 00:00:00'],
               dtype='timedelta64[ns]', freq='30T')

In [104]: pd.timedelta_range(start='1 days', periods=5, freq='2D5H')
Out[104]: 
TimedeltaIndex(['1 days 00:00:00', '3 days 05:00:00', '5 days 10:00:00',
                '7 days 15:00:00', '9 days 20:00:00'],
               dtype='timedelta64[ns]', freq='53H')
```

*New in version 0.23.0.* 

Specifying ``start``, ``end``, and ``periods`` will generate a range of evenly spaced
timedeltas from ``start`` to ``end`` inclusively, with ``periods`` number of elements
in the resulting ``TimedeltaIndex``:

``` python
In [105]: pd.timedelta_range('0 days', '4 days', periods=5)
Out[105]: TimedeltaIndex(['0 days', '1 days', '2 days', '3 days', '4 days'], dtype='timedelta64[ns]', freq=None)

In [106]: pd.timedelta_range('0 days', '4 days', periods=10)
Out[106]: 
TimedeltaIndex(['0 days 00:00:00', '0 days 10:40:00', '0 days 21:20:00',
                '1 days 08:00:00', '1 days 18:40:00', '2 days 05:20:00',
                '2 days 16:00:00', '3 days 02:40:00', '3 days 13:20:00',
                '4 days 00:00:00'],
               dtype='timedelta64[ns]', freq=None)
```

### Using the TimedeltaIndex

Similarly to other of the datetime-like indices, ``DatetimeIndex`` and ``PeriodIndex``, you can use
``TimedeltaIndex`` as the index of pandas objects.

``` python
In [107]: s = pd.Series(np.arange(100),
   .....:               index=pd.timedelta_range('1 days', periods=100, freq='h'))
   .....: 

In [108]: s
Out[108]: 
1 days 00:00:00     0
1 days 01:00:00     1
1 days 02:00:00     2
1 days 03:00:00     3
1 days 04:00:00     4
                   ..
4 days 23:00:00    95
5 days 00:00:00    96
5 days 01:00:00    97
5 days 02:00:00    98
5 days 03:00:00    99
Freq: H, Length: 100, dtype: int64
```

Selections work similarly, with coercion on string-likes and slices:

``` python
In [109]: s['1 day':'2 day']
Out[109]: 
1 days 00:00:00     0
1 days 01:00:00     1
1 days 02:00:00     2
1 days 03:00:00     3
1 days 04:00:00     4
                   ..
2 days 19:00:00    43
2 days 20:00:00    44
2 days 21:00:00    45
2 days 22:00:00    46
2 days 23:00:00    47
Freq: H, Length: 48, dtype: int64

In [110]: s['1 day 01:00:00']
Out[110]: 1

In [111]: s[pd.Timedelta('1 day 1h')]
Out[111]: 1
```

Furthermore you can use partial string selection and the range will be inferred:

``` python
In [112]: s['1 day':'1 day 5 hours']
Out[112]: 
1 days 00:00:00    0
1 days 01:00:00    1
1 days 02:00:00    2
1 days 03:00:00    3
1 days 04:00:00    4
1 days 05:00:00    5
Freq: H, dtype: int64
```

### Operations

Finally, the combination of ``TimedeltaIndex`` with ``DatetimeIndex`` allow certain combination operations that are NaT preserving:

``` python
In [113]: tdi = pd.TimedeltaIndex(['1 days', pd.NaT, '2 days'])

In [114]: tdi.to_list()
Out[114]: [Timedelta('1 days 00:00:00'), NaT, Timedelta('2 days 00:00:00')]

In [115]: dti = pd.date_range('20130101', periods=3)

In [116]: dti.to_list()
Out[116]: 
[Timestamp('2013-01-01 00:00:00', freq='D'),
 Timestamp('2013-01-02 00:00:00', freq='D'),
 Timestamp('2013-01-03 00:00:00', freq='D')]

In [117]: (dti + tdi).to_list()
Out[117]: [Timestamp('2013-01-02 00:00:00'), NaT, Timestamp('2013-01-05 00:00:00')]

In [118]: (dti - tdi).to_list()
Out[118]: [Timestamp('2012-12-31 00:00:00'), NaT, Timestamp('2013-01-01 00:00:00')]
```

### Conversions

Similarly to frequency conversion on a ``Series`` above, you can convert these indices to yield another Index.

``` python
In [119]: tdi / np.timedelta64(1, 's')
Out[119]: Float64Index([86400.0, nan, 172800.0], dtype='float64')

In [120]: tdi.astype('timedelta64[s]')
Out[120]: Float64Index([86400.0, nan, 172800.0], dtype='float64')
```

Scalars type ops work as well. These can potentially return a *different* type of index.

``` python
# adding or timedelta and date -> datelike
In [121]: tdi + pd.Timestamp('20130101')
Out[121]: DatetimeIndex(['2013-01-02', 'NaT', '2013-01-03'], dtype='datetime64[ns]', freq=None)

# subtraction of a date and a timedelta -> datelike
# note that trying to subtract a date from a Timedelta will raise an exception
In [122]: (pd.Timestamp('20130101') - tdi).to_list()
Out[122]: [Timestamp('2012-12-31 00:00:00'), NaT, Timestamp('2012-12-30 00:00:00')]

# timedelta + timedelta -> timedelta
In [123]: tdi + pd.Timedelta('10 days')
Out[123]: TimedeltaIndex(['11 days', NaT, '12 days'], dtype='timedelta64[ns]', freq=None)

# division can result in a Timedelta if the divisor is an integer
In [124]: tdi / 2
Out[124]: TimedeltaIndex(['0 days 12:00:00', NaT, '1 days 00:00:00'], dtype='timedelta64[ns]', freq=None)

# or a Float64Index if the divisor is a Timedelta
In [125]: tdi / tdi[0]
Out[125]: Float64Index([1.0, nan, 2.0], dtype='float64')
```

## Resampling

Similar to [timeseries resampling](timeseries.html#timeseries-resampling), we can resample with a ``TimedeltaIndex``.

``` python
In [126]: s.resample('D').mean()
Out[126]: 
1 days    11.5
2 days    35.5
3 days    59.5
4 days    83.5
5 days    97.5
Freq: D, dtype: float64
```
