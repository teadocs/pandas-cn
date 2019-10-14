# Time series / date functionality

pandas contains extensive capabilities and features for working with time series data for all domains.
Using the NumPy ``datetime64`` and ``timedelta64`` dtypes, pandas has consolidated a large number of
features from other Python libraries like ``scikits.timeseries`` as well as created
a tremendous amount of new functionality for manipulating time series data.

For example, pandas supports:

Parsing time series information from various sources and formats

``` python
In [1]: import datetime

In [2]: dti = pd.to_datetime(['1/1/2018', np.datetime64('2018-01-01'),
   ...:                       datetime.datetime(2018, 1, 1)])
   ...: 

In [3]: dti
Out[3]: DatetimeIndex(['2018-01-01', '2018-01-01', '2018-01-01'], dtype='datetime64[ns]', freq=None)
```

Generate sequences of fixed-frequency dates and time spans

``` python
In [4]: dti = pd.date_range('2018-01-01', periods=3, freq='H')

In [5]: dti
Out[5]: 
DatetimeIndex(['2018-01-01 00:00:00', '2018-01-01 01:00:00',
               '2018-01-01 02:00:00'],
              dtype='datetime64[ns]', freq='H')
```

Manipulating and converting date times with timezone information

``` python
In [6]: dti = dti.tz_localize('UTC')

In [7]: dti
Out[7]: 
DatetimeIndex(['2018-01-01 00:00:00+00:00', '2018-01-01 01:00:00+00:00',
               '2018-01-01 02:00:00+00:00'],
              dtype='datetime64[ns, UTC]', freq='H')

In [8]: dti.tz_convert('US/Pacific')
Out[8]: 
DatetimeIndex(['2017-12-31 16:00:00-08:00', '2017-12-31 17:00:00-08:00',
               '2017-12-31 18:00:00-08:00'],
              dtype='datetime64[ns, US/Pacific]', freq='H')
```

Resampling or converting a time series to a particular frequency

``` python
In [9]: idx = pd.date_range('2018-01-01', periods=5, freq='H')

In [10]: ts = pd.Series(range(len(idx)), index=idx)

In [11]: ts
Out[11]: 
2018-01-01 00:00:00    0
2018-01-01 01:00:00    1
2018-01-01 02:00:00    2
2018-01-01 03:00:00    3
2018-01-01 04:00:00    4
Freq: H, dtype: int64

In [12]: ts.resample('2H').mean()
Out[12]: 
2018-01-01 00:00:00    0.5
2018-01-01 02:00:00    2.5
2018-01-01 04:00:00    4.0
Freq: 2H, dtype: float64
```

Performing date and time arithmetic with absolute or relative time increments

``` python
In [13]: friday = pd.Timestamp('2018-01-05')

In [14]: friday.day_name()
Out[14]: 'Friday'

# Add 1 day
In [15]: saturday = friday + pd.Timedelta('1 day')

In [16]: saturday.day_name()
Out[16]: 'Saturday'

# Add 1 business day (Friday --> Monday)
In [17]: monday = friday + pd.offsets.BDay()

In [18]: monday.day_name()
Out[18]: 'Monday'
```

pandas provides a relatively compact and self-contained set of tools for
performing the above tasks and more.

## Overview

pandas captures 4 general time related concepts:

1. Date times: A specific date and time with timezone support. Similar to ``datetime.datetime`` from the standard library.
1. Time deltas: An absolute time duration. Similar to ``datetime.timedelta`` from the standard library.
1. Time spans: A span of time defined by a point in time and its associated frequency.
1. Date offsets: A relative time duration that respects calendar arithmetic. Similar to ``dateutil.relativedelta.relativedelta`` from the ``dateutil`` package.

Concept | Scalar Class | Array Class | pandas Data Type | Primary Creation Method
---|---|---|---|---
Date times | Timestamp | DatetimeIndex | datetime64[ns] or datetime64[ns, tz] | to_datetime or date_range
Time deltas | Timedelta | TimedeltaIndex | timedelta64[ns] | to_timedelta or timedelta_range
Time spans | Period | PeriodIndex | period[freq] | Period or period_range
Date offsets | DateOffset | None | None | DateOffset

For time series data, it’s conventional to represent the time component in the index of a [``Series``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.html#pandas.Series) or [``DataFrame``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.html#pandas.DataFrame)
so manipulations can be performed with respect to the time element.

``` python
In [19]: pd.Series(range(3), index=pd.date_range('2000', freq='D', periods=3))
Out[19]: 
2000-01-01    0
2000-01-02    1
2000-01-03    2
Freq: D, dtype: int64
```

However, [``Series``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.html#pandas.Series) and [``DataFrame``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.html#pandas.DataFrame) can directly also support the time component as data itself.

``` python
In [20]: pd.Series(pd.date_range('2000', freq='D', periods=3))
Out[20]: 
0   2000-01-01
1   2000-01-02
2   2000-01-03
dtype: datetime64[ns]
```

[``Series``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.html#pandas.Series) and [``DataFrame``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.html#pandas.DataFrame) have extended data type support and functionality for ``datetime``, ``timedelta``
and ``Period`` data when passed into those constructors. ``DateOffset``
data however will be stored as ``object`` data.

``` python
In [21]: pd.Series(pd.period_range('1/1/2011', freq='M', periods=3))
Out[21]: 
0    2011-01
1    2011-02
2    2011-03
dtype: period[M]

In [22]: pd.Series([pd.DateOffset(1), pd.DateOffset(2)])
Out[22]: 
0         <DateOffset>
1    <2 * DateOffsets>
dtype: object

In [23]: pd.Series(pd.date_range('1/1/2011', freq='M', periods=3))
Out[23]: 
0   2011-01-31
1   2011-02-28
2   2011-03-31
dtype: datetime64[ns]
```

Lastly, pandas represents null date times, time deltas, and time spans as ``NaT`` which
is useful for representing missing or null date like values and behaves similar
as ``np.nan`` does for float data.

``` python
In [24]: pd.Timestamp(pd.NaT)
Out[24]: NaT

In [25]: pd.Timedelta(pd.NaT)
Out[25]: NaT

In [26]: pd.Period(pd.NaT)
Out[26]: NaT

# Equality acts as np.nan would
In [27]: pd.NaT == pd.NaT
Out[27]: False
```

## Timestamps vs. Time Spans

Timestamped data is the most basic type of time series data that associates
values with points in time. For pandas objects it means using the points in
time.

``` python
In [28]: pd.Timestamp(datetime.datetime(2012, 5, 1))
Out[28]: Timestamp('2012-05-01 00:00:00')

In [29]: pd.Timestamp('2012-05-01')
Out[29]: Timestamp('2012-05-01 00:00:00')

In [30]: pd.Timestamp(2012, 5, 1)
Out[30]: Timestamp('2012-05-01 00:00:00')
```

However, in many cases it is more natural to associate things like change
variables with a time span instead. The span represented by ``Period`` can be
specified explicitly, or inferred from datetime string format.

For example:

``` python
In [31]: pd.Period('2011-01')
Out[31]: Period('2011-01', 'M')

In [32]: pd.Period('2012-05', freq='D')
Out[32]: Period('2012-05-01', 'D')
```

[``Timestamp``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Timestamp.html#pandas.Timestamp) and [``Period``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Period.html#pandas.Period) can serve as an index. Lists of
``Timestamp`` and ``Period`` are automatically coerced to [``DatetimeIndex``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DatetimeIndex.html#pandas.DatetimeIndex)
and [``PeriodIndex``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.PeriodIndex.html#pandas.PeriodIndex) respectively.

``` python
In [33]: dates = [pd.Timestamp('2012-05-01'),
   ....:          pd.Timestamp('2012-05-02'),
   ....:          pd.Timestamp('2012-05-03')]
   ....: 

In [34]: ts = pd.Series(np.random.randn(3), dates)

In [35]: type(ts.index)
Out[35]: pandas.core.indexes.datetimes.DatetimeIndex

In [36]: ts.index
Out[36]: DatetimeIndex(['2012-05-01', '2012-05-02', '2012-05-03'], dtype='datetime64[ns]', freq=None)

In [37]: ts
Out[37]: 
2012-05-01    0.469112
2012-05-02   -0.282863
2012-05-03   -1.509059
dtype: float64

In [38]: periods = [pd.Period('2012-01'), pd.Period('2012-02'), pd.Period('2012-03')]

In [39]: ts = pd.Series(np.random.randn(3), periods)

In [40]: type(ts.index)
Out[40]: pandas.core.indexes.period.PeriodIndex

In [41]: ts.index
Out[41]: PeriodIndex(['2012-01', '2012-02', '2012-03'], dtype='period[M]', freq='M')

In [42]: ts
Out[42]: 
2012-01   -1.135632
2012-02    1.212112
2012-03   -0.173215
Freq: M, dtype: float64
```

pandas allows you to capture both representations and
convert between them. Under the hood, pandas represents timestamps using
instances of ``Timestamp`` and sequences of timestamps using instances of
``DatetimeIndex``. For regular time spans, pandas uses ``Period`` objects for
scalar values and ``PeriodIndex`` for sequences of spans. Better support for
irregular intervals with arbitrary start and end points are forth-coming in
future releases.

## Converting to timestamps

To convert a [``Series``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.html#pandas.Series) or list-like object of date-like objects e.g. strings,
epochs, or a mixture, you can use the ``to_datetime`` function. When passed
a ``Series``, this returns a ``Series`` (with the same index), while a list-like
is converted to a ``DatetimeIndex``:

``` python
In [43]: pd.to_datetime(pd.Series(['Jul 31, 2009', '2010-01-10', None]))
Out[43]: 
0   2009-07-31
1   2010-01-10
2          NaT
dtype: datetime64[ns]

In [44]: pd.to_datetime(['2005/11/23', '2010.12.31'])
Out[44]: DatetimeIndex(['2005-11-23', '2010-12-31'], dtype='datetime64[ns]', freq=None)
```

If you use dates which start with the day first (i.e. European style),
you can pass the ``dayfirst`` flag:

``` python
In [45]: pd.to_datetime(['04-01-2012 10:00'], dayfirst=True)
Out[45]: DatetimeIndex(['2012-01-04 10:00:00'], dtype='datetime64[ns]', freq=None)

In [46]: pd.to_datetime(['14-01-2012', '01-14-2012'], dayfirst=True)
Out[46]: DatetimeIndex(['2012-01-14', '2012-01-14'], dtype='datetime64[ns]', freq=None)
```

::: danger Warning

You see in the above example that ``dayfirst`` isn’t strict, so if a date
can’t be parsed with the day being first it will be parsed as if
``dayfirst`` were False.

:::

If you pass a single string to ``to_datetime``, it returns a single ``Timestamp``.
``Timestamp`` can also accept string input, but it doesn’t accept string parsing
options like ``dayfirst`` or ``format``, so use ``to_datetime`` if these are required.

``` python
In [47]: pd.to_datetime('2010/11/12')
Out[47]: Timestamp('2010-11-12 00:00:00')

In [48]: pd.Timestamp('2010/11/12')
Out[48]: Timestamp('2010-11-12 00:00:00')
```

You can also use the ``DatetimeIndex`` constructor directly:

``` python
In [49]: pd.DatetimeIndex(['2018-01-01', '2018-01-03', '2018-01-05'])
Out[49]: DatetimeIndex(['2018-01-01', '2018-01-03', '2018-01-05'], dtype='datetime64[ns]', freq=None)
```

The string ‘infer’ can be passed in order to set the frequency of the index as the
inferred frequency upon creation:

``` python
In [50]: pd.DatetimeIndex(['2018-01-01', '2018-01-03', '2018-01-05'], freq='infer')
Out[50]: DatetimeIndex(['2018-01-01', '2018-01-03', '2018-01-05'], dtype='datetime64[ns]', freq='2D')
```

### Providing a format argument

In addition to the required datetime string, a ``format`` argument can be passed to ensure specific parsing.
This could also potentially speed up the conversion considerably.

``` python
In [51]: pd.to_datetime('2010/11/12', format='%Y/%m/%d')
Out[51]: Timestamp('2010-11-12 00:00:00')

In [52]: pd.to_datetime('12-11-2010 00:00', format='%d-%m-%Y %H:%M')
Out[52]: Timestamp('2010-11-12 00:00:00')
```

For more information on the choices available when specifying the ``format``
option, see the Python [datetime documentation](https://docs.python.org/3/library/datetime.html#strftime-and-strptime-behavior).

### Assembling datetime from multiple DataFrame columns

*New in version 0.18.1.* 

You can also pass a ``DataFrame`` of integer or string columns to assemble into a ``Series`` of ``Timestamps``.

``` python
In [53]: df = pd.DataFrame({'year': [2015, 2016],
   ....:                    'month': [2, 3],
   ....:                    'day': [4, 5],
   ....:                    'hour': [2, 3]})
   ....: 

In [54]: pd.to_datetime(df)
Out[54]: 
0   2015-02-04 02:00:00
1   2016-03-05 03:00:00
dtype: datetime64[ns]
```

You can pass only the columns that you need to assemble.

``` python
In [55]: pd.to_datetime(df[['year', 'month', 'day']])
Out[55]: 
0   2015-02-04
1   2016-03-05
dtype: datetime64[ns]
```

``pd.to_datetime`` looks for standard designations of the datetime component in the column names, including:

- required: ``year``, ``month``, ``day``
- optional: ``hour``, ``minute``, ``second``, ``millisecond``, ``microsecond``, ``nanosecond``

### Invalid data

The default behavior, ``errors='raise'``, is to raise when unparseable:

``` python
In [2]: pd.to_datetime(['2009/07/31', 'asd'], errors='raise')
ValueError: Unknown string format
```

Pass ``errors='ignore'`` to return the original input when unparseable:

``` python
In [56]: pd.to_datetime(['2009/07/31', 'asd'], errors='ignore')
Out[56]: Index(['2009/07/31', 'asd'], dtype='object')
```

Pass ``errors='coerce'`` to convert unparseable data to ``NaT`` (not a time):

``` python
In [57]: pd.to_datetime(['2009/07/31', 'asd'], errors='coerce')
Out[57]: DatetimeIndex(['2009-07-31', 'NaT'], dtype='datetime64[ns]', freq=None)
```

### Epoch timestamps

pandas supports converting integer or float epoch times to ``Timestamp`` and
``DatetimeIndex``. The default unit is nanoseconds, since that is how ``Timestamp``
objects are stored internally. However, epochs are often stored in another ``unit``
which can be specified. These are computed from the starting point specified by the
``origin`` parameter.

``` python
In [58]: pd.to_datetime([1349720105, 1349806505, 1349892905,
   ....:                 1349979305, 1350065705], unit='s')
   ....: 
Out[58]: 
DatetimeIndex(['2012-10-08 18:15:05', '2012-10-09 18:15:05',
               '2012-10-10 18:15:05', '2012-10-11 18:15:05',
               '2012-10-12 18:15:05'],
              dtype='datetime64[ns]', freq=None)

In [59]: pd.to_datetime([1349720105100, 1349720105200, 1349720105300,
   ....:                 1349720105400, 1349720105500], unit='ms')
   ....: 
Out[59]: 
DatetimeIndex(['2012-10-08 18:15:05.100000', '2012-10-08 18:15:05.200000',
               '2012-10-08 18:15:05.300000', '2012-10-08 18:15:05.400000',
               '2012-10-08 18:15:05.500000'],
              dtype='datetime64[ns]', freq=None)
```

Constructing a [``Timestamp``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Timestamp.html#pandas.Timestamp) or [``DatetimeIndex``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DatetimeIndex.html#pandas.DatetimeIndex) with an epoch timestamp
with the ``tz`` argument specified will currently localize the epoch timestamps to UTC
first then convert the result to the specified time zone. However, this behavior
is [deprecated](https://pandas.pydata.org/pandas-docs/stable/whatsnew/v0.24.0.html#whatsnew-0240-deprecations-integer-tz), and if you have
epochs in wall time in another timezone, it is recommended to read the epochs
as timezone-naive timestamps and then localize to the appropriate timezone:

``` python
In [60]: pd.Timestamp(1262347200000000000).tz_localize('US/Pacific')
Out[60]: Timestamp('2010-01-01 12:00:00-0800', tz='US/Pacific')

In [61]: pd.DatetimeIndex([1262347200000000000]).tz_localize('US/Pacific')
Out[61]: DatetimeIndex(['2010-01-01 12:00:00-08:00'], dtype='datetime64[ns, US/Pacific]', freq=None)
```

::: tip Note

Epoch times will be rounded to the nearest nanosecond.

:::

::: danger Warning

Conversion of float epoch times can lead to inaccurate and unexpected results.
[Python floats](https://docs.python.org/3/tutorial/floatingpoint.html#tut-fp-issues) have about 15 digits precision in
decimal. Rounding during conversion from float to high precision ``Timestamp`` is
unavoidable. The only way to achieve exact precision is to use a fixed-width
types (e.g. an int64).

``` python
In [62]: pd.to_datetime([1490195805.433, 1490195805.433502912], unit='s')
Out[62]: DatetimeIndex(['2017-03-22 15:16:45.433000088', '2017-03-22 15:16:45.433502913'], dtype='datetime64[ns]', freq=None)

In [63]: pd.to_datetime(1490195805433502912, unit='ns')
Out[63]: Timestamp('2017-03-22 15:16:45.433502912')
```

:::

[Using the origin Parameter](#timeseries-origin)

### From timestamps to epoch

To invert the operation from above, namely, to convert from a ``Timestamp`` to a ‘unix’ epoch:

``` python
In [64]: stamps = pd.date_range('2012-10-08 18:15:05', periods=4, freq='D')

In [65]: stamps
Out[65]: 
DatetimeIndex(['2012-10-08 18:15:05', '2012-10-09 18:15:05',
               '2012-10-10 18:15:05', '2012-10-11 18:15:05'],
              dtype='datetime64[ns]', freq='D')
```

We subtract the epoch (midnight at January 1, 1970 UTC) and then floor divide by the
“unit” (1 second).

``` python
In [66]: (stamps - pd.Timestamp("1970-01-01")) // pd.Timedelta('1s')
Out[66]: Int64Index([1349720105, 1349806505, 1349892905, 1349979305], dtype='int64')
```

### Using the ``origin`` Parameter

*New in version 0.20.0.* 

Using the ``origin`` parameter, one can specify an alternative starting point for creation
of a ``DatetimeIndex``. For example, to use 1960-01-01 as the starting date:

``` python
In [67]: pd.to_datetime([1, 2, 3], unit='D', origin=pd.Timestamp('1960-01-01'))
Out[67]: DatetimeIndex(['1960-01-02', '1960-01-03', '1960-01-04'], dtype='datetime64[ns]', freq=None)
```

The default is set at ``origin='unix'``, which defaults to ``1970-01-01 00:00:00``.
Commonly called ‘unix epoch’ or POSIX time.

``` python
In [68]: pd.to_datetime([1, 2, 3], unit='D')
Out[68]: DatetimeIndex(['1970-01-02', '1970-01-03', '1970-01-04'], dtype='datetime64[ns]', freq=None)
```

## Generating ranges of timestamps

To generate an index with timestamps, you can use either the ``DatetimeIndex`` or
``Index`` constructor and pass in a list of datetime objects:

``` python
In [69]: dates = [datetime.datetime(2012, 5, 1),
   ....:          datetime.datetime(2012, 5, 2),
   ....:          datetime.datetime(2012, 5, 3)]
   ....: 

# Note the frequency information
In [70]: index = pd.DatetimeIndex(dates)

In [71]: index
Out[71]: DatetimeIndex(['2012-05-01', '2012-05-02', '2012-05-03'], dtype='datetime64[ns]', freq=None)

# Automatically converted to DatetimeIndex
In [72]: index = pd.Index(dates)

In [73]: index
Out[73]: DatetimeIndex(['2012-05-01', '2012-05-02', '2012-05-03'], dtype='datetime64[ns]', freq=None)
```

In practice this becomes very cumbersome because we often need a very long
index with a large number of timestamps. If we need timestamps on a regular
frequency, we can use the [``date_range()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.date_range.html#pandas.date_range) and [``bdate_range()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.bdate_range.html#pandas.bdate_range) functions
to create a ``DatetimeIndex``. The default frequency for ``date_range`` is a
**calendar day** while the default for ``bdate_range`` is a **business day**:

``` python
In [74]: start = datetime.datetime(2011, 1, 1)

In [75]: end = datetime.datetime(2012, 1, 1)

In [76]: index = pd.date_range(start, end)

In [77]: index
Out[77]: 
DatetimeIndex(['2011-01-01', '2011-01-02', '2011-01-03', '2011-01-04',
               '2011-01-05', '2011-01-06', '2011-01-07', '2011-01-08',
               '2011-01-09', '2011-01-10',
               ...
               '2011-12-23', '2011-12-24', '2011-12-25', '2011-12-26',
               '2011-12-27', '2011-12-28', '2011-12-29', '2011-12-30',
               '2011-12-31', '2012-01-01'],
              dtype='datetime64[ns]', length=366, freq='D')

In [78]: index = pd.bdate_range(start, end)

In [79]: index
Out[79]: 
DatetimeIndex(['2011-01-03', '2011-01-04', '2011-01-05', '2011-01-06',
               '2011-01-07', '2011-01-10', '2011-01-11', '2011-01-12',
               '2011-01-13', '2011-01-14',
               ...
               '2011-12-19', '2011-12-20', '2011-12-21', '2011-12-22',
               '2011-12-23', '2011-12-26', '2011-12-27', '2011-12-28',
               '2011-12-29', '2011-12-30'],
              dtype='datetime64[ns]', length=260, freq='B')
```

Convenience functions like ``date_range`` and ``bdate_range`` can utilize a
variety of [frequency aliases](#timeseries-offset-aliases):

``` python
In [80]: pd.date_range(start, periods=1000, freq='M')
Out[80]: 
DatetimeIndex(['2011-01-31', '2011-02-28', '2011-03-31', '2011-04-30',
               '2011-05-31', '2011-06-30', '2011-07-31', '2011-08-31',
               '2011-09-30', '2011-10-31',
               ...
               '2093-07-31', '2093-08-31', '2093-09-30', '2093-10-31',
               '2093-11-30', '2093-12-31', '2094-01-31', '2094-02-28',
               '2094-03-31', '2094-04-30'],
              dtype='datetime64[ns]', length=1000, freq='M')

In [81]: pd.bdate_range(start, periods=250, freq='BQS')
Out[81]: 
DatetimeIndex(['2011-01-03', '2011-04-01', '2011-07-01', '2011-10-03',
               '2012-01-02', '2012-04-02', '2012-07-02', '2012-10-01',
               '2013-01-01', '2013-04-01',
               ...
               '2071-01-01', '2071-04-01', '2071-07-01', '2071-10-01',
               '2072-01-01', '2072-04-01', '2072-07-01', '2072-10-03',
               '2073-01-02', '2073-04-03'],
              dtype='datetime64[ns]', length=250, freq='BQS-JAN')
```

``date_range`` and ``bdate_range`` make it easy to generate a range of dates
using various combinations of parameters like ``start``, ``end``, ``periods``,
and ``freq``. The start and end dates are strictly inclusive, so dates outside
of those specified will not be generated:

``` python
In [82]: pd.date_range(start, end, freq='BM')
Out[82]: 
DatetimeIndex(['2011-01-31', '2011-02-28', '2011-03-31', '2011-04-29',
               '2011-05-31', '2011-06-30', '2011-07-29', '2011-08-31',
               '2011-09-30', '2011-10-31', '2011-11-30', '2011-12-30'],
              dtype='datetime64[ns]', freq='BM')

In [83]: pd.date_range(start, end, freq='W')
Out[83]: 
DatetimeIndex(['2011-01-02', '2011-01-09', '2011-01-16', '2011-01-23',
               '2011-01-30', '2011-02-06', '2011-02-13', '2011-02-20',
               '2011-02-27', '2011-03-06', '2011-03-13', '2011-03-20',
               '2011-03-27', '2011-04-03', '2011-04-10', '2011-04-17',
               '2011-04-24', '2011-05-01', '2011-05-08', '2011-05-15',
               '2011-05-22', '2011-05-29', '2011-06-05', '2011-06-12',
               '2011-06-19', '2011-06-26', '2011-07-03', '2011-07-10',
               '2011-07-17', '2011-07-24', '2011-07-31', '2011-08-07',
               '2011-08-14', '2011-08-21', '2011-08-28', '2011-09-04',
               '2011-09-11', '2011-09-18', '2011-09-25', '2011-10-02',
               '2011-10-09', '2011-10-16', '2011-10-23', '2011-10-30',
               '2011-11-06', '2011-11-13', '2011-11-20', '2011-11-27',
               '2011-12-04', '2011-12-11', '2011-12-18', '2011-12-25',
               '2012-01-01'],
              dtype='datetime64[ns]', freq='W-SUN')

In [84]: pd.bdate_range(end=end, periods=20)
Out[84]: 
DatetimeIndex(['2011-12-05', '2011-12-06', '2011-12-07', '2011-12-08',
               '2011-12-09', '2011-12-12', '2011-12-13', '2011-12-14',
               '2011-12-15', '2011-12-16', '2011-12-19', '2011-12-20',
               '2011-12-21', '2011-12-22', '2011-12-23', '2011-12-26',
               '2011-12-27', '2011-12-28', '2011-12-29', '2011-12-30'],
              dtype='datetime64[ns]', freq='B')

In [85]: pd.bdate_range(start=start, periods=20)
Out[85]: 
DatetimeIndex(['2011-01-03', '2011-01-04', '2011-01-05', '2011-01-06',
               '2011-01-07', '2011-01-10', '2011-01-11', '2011-01-12',
               '2011-01-13', '2011-01-14', '2011-01-17', '2011-01-18',
               '2011-01-19', '2011-01-20', '2011-01-21', '2011-01-24',
               '2011-01-25', '2011-01-26', '2011-01-27', '2011-01-28'],
              dtype='datetime64[ns]', freq='B')
```

*New in version 0.23.0.* 

Specifying ``start``, ``end``, and ``periods`` will generate a range of evenly spaced
dates from ``start`` to ``end`` inclusively, with ``periods`` number of elements in the
resulting ``DatetimeIndex``:

``` python
In [86]: pd.date_range('2018-01-01', '2018-01-05', periods=5)
Out[86]: 
DatetimeIndex(['2018-01-01', '2018-01-02', '2018-01-03', '2018-01-04',
               '2018-01-05'],
              dtype='datetime64[ns]', freq=None)

In [87]: pd.date_range('2018-01-01', '2018-01-05', periods=10)
Out[87]: 
DatetimeIndex(['2018-01-01 00:00:00', '2018-01-01 10:40:00',
               '2018-01-01 21:20:00', '2018-01-02 08:00:00',
               '2018-01-02 18:40:00', '2018-01-03 05:20:00',
               '2018-01-03 16:00:00', '2018-01-04 02:40:00',
               '2018-01-04 13:20:00', '2018-01-05 00:00:00'],
              dtype='datetime64[ns]', freq=None)
```

### Custom frequency ranges

``bdate_range`` can also generate a range of custom frequency dates by using
the ``weekmask`` and ``holidays`` parameters.  These parameters will only be
used if a custom frequency string is passed.

``` python
In [88]: weekmask = 'Mon Wed Fri'

In [89]: holidays = [datetime.datetime(2011, 1, 5), datetime.datetime(2011, 3, 14)]

In [90]: pd.bdate_range(start, end, freq='C', weekmask=weekmask, holidays=holidays)
Out[90]: 
DatetimeIndex(['2011-01-03', '2011-01-07', '2011-01-10', '2011-01-12',
               '2011-01-14', '2011-01-17', '2011-01-19', '2011-01-21',
               '2011-01-24', '2011-01-26',
               ...
               '2011-12-09', '2011-12-12', '2011-12-14', '2011-12-16',
               '2011-12-19', '2011-12-21', '2011-12-23', '2011-12-26',
               '2011-12-28', '2011-12-30'],
              dtype='datetime64[ns]', length=154, freq='C')

In [91]: pd.bdate_range(start, end, freq='CBMS', weekmask=weekmask)
Out[91]: 
DatetimeIndex(['2011-01-03', '2011-02-02', '2011-03-02', '2011-04-01',
               '2011-05-02', '2011-06-01', '2011-07-01', '2011-08-01',
               '2011-09-02', '2011-10-03', '2011-11-02', '2011-12-02'],
              dtype='datetime64[ns]', freq='CBMS')
```

[Custom business days](#timeseries-custombusinessdays)

## Timestamp limitations

Since pandas represents timestamps in nanosecond resolution, the time span that
can be represented using a 64-bit integer is limited to approximately 584 years:

``` python
In [92]: pd.Timestamp.min
Out[92]: Timestamp('1677-09-21 00:12:43.145225')

In [93]: pd.Timestamp.max
Out[93]: Timestamp('2262-04-11 23:47:16.854775807')
```

[Representing out-of-bounds spans](#timeseries-oob)

## Indexing

One of the main uses for ``DatetimeIndex`` is as an index for pandas objects.
The ``DatetimeIndex`` class contains many time series related optimizations:

- A large range of dates for various offsets are pre-computed and cached
under the hood in order to make generating subsequent date ranges very fast
(just have to grab a slice).
- Fast shifting using the ``shift`` and ``tshift`` method on pandas objects.
- Unioning of overlapping ``DatetimeIndex`` objects with the same frequency is
very fast (important for fast data alignment).
- Quick access to date fields via properties such as ``year``, ``month``, etc.
- Regularization functions like ``snap`` and very fast ``asof`` logic.

``DatetimeIndex`` objects have all the basic functionality of regular ``Index``
objects, and a smorgasbord of advanced time series specific methods for easy
frequency processing.

[Reindexing methods](https://pandas.pydata.org/pandas-docs/stable/getting_started/basics.html#basics-reindexing)

::: tip Note

While pandas does not force you to have a sorted date index, some of these
methods may have unexpected or incorrect behavior if the dates are unsorted.

:::

``DatetimeIndex`` can be used like a regular index and offers all of its
intelligent functionality like selection, slicing, etc.

``` python
In [94]: rng = pd.date_range(start, end, freq='BM')

In [95]: ts = pd.Series(np.random.randn(len(rng)), index=rng)

In [96]: ts.index
Out[96]: 
DatetimeIndex(['2011-01-31', '2011-02-28', '2011-03-31', '2011-04-29',
               '2011-05-31', '2011-06-30', '2011-07-29', '2011-08-31',
               '2011-09-30', '2011-10-31', '2011-11-30', '2011-12-30'],
              dtype='datetime64[ns]', freq='BM')

In [97]: ts[:5].index
Out[97]: 
DatetimeIndex(['2011-01-31', '2011-02-28', '2011-03-31', '2011-04-29',
               '2011-05-31'],
              dtype='datetime64[ns]', freq='BM')

In [98]: ts[::2].index
Out[98]: 
DatetimeIndex(['2011-01-31', '2011-03-31', '2011-05-31', '2011-07-29',
               '2011-09-30', '2011-11-30'],
              dtype='datetime64[ns]', freq='2BM')
```

### Partial string indexing

Dates and strings that parse to timestamps can be passed as indexing parameters:

``` python
In [99]: ts['1/31/2011']
Out[99]: 0.11920871129693428

In [100]: ts[datetime.datetime(2011, 12, 25):]
Out[100]: 
2011-12-30    0.56702
Freq: BM, dtype: float64

In [101]: ts['10/31/2011':'12/31/2011']
Out[101]: 
2011-10-31    0.271860
2011-11-30   -0.424972
2011-12-30    0.567020
Freq: BM, dtype: float64
```

To provide convenience for accessing longer time series, you can also pass in
the year or year and month as strings:

``` python
In [102]: ts['2011']
Out[102]: 
2011-01-31    0.119209
2011-02-28   -1.044236
2011-03-31   -0.861849
2011-04-29   -2.104569
2011-05-31   -0.494929
2011-06-30    1.071804
2011-07-29    0.721555
2011-08-31   -0.706771
2011-09-30   -1.039575
2011-10-31    0.271860
2011-11-30   -0.424972
2011-12-30    0.567020
Freq: BM, dtype: float64

In [103]: ts['2011-6']
Out[103]: 
2011-06-30    1.071804
Freq: BM, dtype: float64
```

This type of slicing will work on a ``DataFrame`` with a ``DatetimeIndex`` as well. Since the
partial string selection is a form of label slicing, the endpoints **will be** included. This
would include matching times on an included date:

``` python
In [104]: dft = pd.DataFrame(np.random.randn(100000, 1), columns=['A'],
   .....:                    index=pd.date_range('20130101', periods=100000, freq='T'))
   .....: 

In [105]: dft
Out[105]: 
                            A
2013-01-01 00:00:00  0.276232
2013-01-01 00:01:00 -1.087401
2013-01-01 00:02:00 -0.673690
2013-01-01 00:03:00  0.113648
2013-01-01 00:04:00 -1.478427
...                       ...
2013-03-11 10:35:00 -0.747967
2013-03-11 10:36:00 -0.034523
2013-03-11 10:37:00 -0.201754
2013-03-11 10:38:00 -1.509067
2013-03-11 10:39:00 -1.693043

[100000 rows x 1 columns]

In [106]: dft['2013']
Out[106]: 
                            A
2013-01-01 00:00:00  0.276232
2013-01-01 00:01:00 -1.087401
2013-01-01 00:02:00 -0.673690
2013-01-01 00:03:00  0.113648
2013-01-01 00:04:00 -1.478427
...                       ...
2013-03-11 10:35:00 -0.747967
2013-03-11 10:36:00 -0.034523
2013-03-11 10:37:00 -0.201754
2013-03-11 10:38:00 -1.509067
2013-03-11 10:39:00 -1.693043

[100000 rows x 1 columns]
```

This starts on the very first time in the month, and includes the last date and
time for the month:

``` python
In [107]: dft['2013-1':'2013-2']
Out[107]: 
                            A
2013-01-01 00:00:00  0.276232
2013-01-01 00:01:00 -1.087401
2013-01-01 00:02:00 -0.673690
2013-01-01 00:03:00  0.113648
2013-01-01 00:04:00 -1.478427
...                       ...
2013-02-28 23:55:00  0.850929
2013-02-28 23:56:00  0.976712
2013-02-28 23:57:00 -2.693884
2013-02-28 23:58:00 -1.575535
2013-02-28 23:59:00 -1.573517

[84960 rows x 1 columns]
```

This specifies a stop time **that includes all of the times on the last day**:

``` python
In [108]: dft['2013-1':'2013-2-28']
Out[108]: 
                            A
2013-01-01 00:00:00  0.276232
2013-01-01 00:01:00 -1.087401
2013-01-01 00:02:00 -0.673690
2013-01-01 00:03:00  0.113648
2013-01-01 00:04:00 -1.478427
...                       ...
2013-02-28 23:55:00  0.850929
2013-02-28 23:56:00  0.976712
2013-02-28 23:57:00 -2.693884
2013-02-28 23:58:00 -1.575535
2013-02-28 23:59:00 -1.573517

[84960 rows x 1 columns]
```

This specifies an **exact** stop time (and is not the same as the above):

``` python
In [109]: dft['2013-1':'2013-2-28 00:00:00']
Out[109]: 
                            A
2013-01-01 00:00:00  0.276232
2013-01-01 00:01:00 -1.087401
2013-01-01 00:02:00 -0.673690
2013-01-01 00:03:00  0.113648
2013-01-01 00:04:00 -1.478427
...                       ...
2013-02-27 23:56:00  1.197749
2013-02-27 23:57:00  0.720521
2013-02-27 23:58:00 -0.072718
2013-02-27 23:59:00 -0.681192
2013-02-28 00:00:00 -0.557501

[83521 rows x 1 columns]
```

We are stopping on the included end-point as it is part of the index:

``` python
In [110]: dft['2013-1-15':'2013-1-15 12:30:00']
Out[110]: 
                            A
2013-01-15 00:00:00 -0.984810
2013-01-15 00:01:00  0.941451
2013-01-15 00:02:00  1.559365
2013-01-15 00:03:00  1.034374
2013-01-15 00:04:00 -1.480656
...                       ...
2013-01-15 12:26:00  0.371454
2013-01-15 12:27:00 -0.930806
2013-01-15 12:28:00 -0.069177
2013-01-15 12:29:00  0.066510
2013-01-15 12:30:00 -0.003945

[751 rows x 1 columns]
```

*New in version 0.18.0.* 

``DatetimeIndex`` partial string indexing also works on a ``DataFrame`` with a ``MultiIndex``:

``` python
In [111]: dft2 = pd.DataFrame(np.random.randn(20, 1),
   .....:                     columns=['A'],
   .....:                     index=pd.MultiIndex.from_product(
   .....:                         [pd.date_range('20130101', periods=10, freq='12H'),
   .....:                          ['a', 'b']]))
   .....: 

In [112]: dft2
Out[112]: 
                              A
2013-01-01 00:00:00 a -0.298694
                    b  0.823553
2013-01-01 12:00:00 a  0.943285
                    b -1.479399
2013-01-02 00:00:00 a -1.643342
...                         ...
2013-01-04 12:00:00 b  0.069036
2013-01-05 00:00:00 a  0.122297
                    b  1.422060
2013-01-05 12:00:00 a  0.370079
                    b  1.016331

[20 rows x 1 columns]

In [113]: dft2.loc['2013-01-05']
Out[113]: 
                              A
2013-01-05 00:00:00 a  0.122297
                    b  1.422060
2013-01-05 12:00:00 a  0.370079
                    b  1.016331

In [114]: idx = pd.IndexSlice

In [115]: dft2 = dft2.swaplevel(0, 1).sort_index()

In [116]: dft2.loc[idx[:, '2013-01-05'], :]
Out[116]: 
                              A
a 2013-01-05 00:00:00  0.122297
  2013-01-05 12:00:00  0.370079
b 2013-01-05 00:00:00  1.422060
  2013-01-05 12:00:00  1.016331
```

*New in version 0.25.0.* 

Slicing with string indexing also honors UTC offset.

``` python
In [117]: df = pd.DataFrame([0], index=pd.DatetimeIndex(['2019-01-01'], tz='US/Pacific'))

In [118]: df
Out[118]: 
                           0
2019-01-01 00:00:00-08:00  0

In [119]: df['2019-01-01 12:00:00+04:00':'2019-01-01 13:00:00+04:00']
Out[119]: 
                           0
2019-01-01 00:00:00-08:00  0
```

### Slice vs. exact match

*Changed in version 0.20.0.* 

The same string used as an indexing parameter can be treated either as a slice or as an exact match depending on the resolution of the index. If the string is less accurate than the index, it will be treated as a slice, otherwise as an exact match.

Consider a ``Series`` object with a minute resolution index:

``` python
In [120]: series_minute = pd.Series([1, 2, 3],
   .....:                           pd.DatetimeIndex(['2011-12-31 23:59:00',
   .....:                                             '2012-01-01 00:00:00',
   .....:                                             '2012-01-01 00:02:00']))
   .....: 

In [121]: series_minute.index.resolution
Out[121]: 'minute'
```

A timestamp string less accurate than a minute gives a ``Series`` object.

``` python
In [122]: series_minute['2011-12-31 23']
Out[122]: 
2011-12-31 23:59:00    1
dtype: int64
```

A timestamp string with minute resolution (or more accurate), gives a scalar instead, i.e. it is not casted to a slice.

``` python
In [123]: series_minute['2011-12-31 23:59']
Out[123]: 1

In [124]: series_minute['2011-12-31 23:59:00']
Out[124]: 1
```

If index resolution is second, then the minute-accurate timestamp gives a
``Series``.

``` python
In [125]: series_second = pd.Series([1, 2, 3],
   .....:                           pd.DatetimeIndex(['2011-12-31 23:59:59',
   .....:                                             '2012-01-01 00:00:00',
   .....:                                             '2012-01-01 00:00:01']))
   .....: 

In [126]: series_second.index.resolution
Out[126]: 'second'

In [127]: series_second['2011-12-31 23:59']
Out[127]: 
2011-12-31 23:59:59    1
dtype: int64
```

If the timestamp string is treated as a slice, it can be used to index ``DataFrame`` with ``[]`` as well.

``` python
In [128]: dft_minute = pd.DataFrame({'a': [1, 2, 3], 'b': [4, 5, 6]},
   .....:                           index=series_minute.index)
   .....: 

In [129]: dft_minute['2011-12-31 23']
Out[129]: 
                     a  b
2011-12-31 23:59:00  1  4
```

::: danger Warning

However, if the string is treated as an exact match, the selection in ``DataFrame``’s ``[]`` will be column-wise and not row-wise, see [Indexing Basics](indexing.html#indexing-basics). For example ``dft_minute['2011-12-31 23:59']`` will raise ``KeyError`` as ``'2012-12-31 23:59'`` has the same resolution as the index and there is no column with such name:

To *always* have unambiguous selection, whether the row is treated as a slice or a single selection, use ``.loc``.

``` python
In [130]: dft_minute.loc['2011-12-31 23:59']
Out[130]: 
a    1
b    4
Name: 2011-12-31 23:59:00, dtype: int64
```

:::

Note also that ``DatetimeIndex`` resolution cannot be less precise than day.

``` python
In [131]: series_monthly = pd.Series([1, 2, 3],
   .....:                            pd.DatetimeIndex(['2011-12', '2012-01', '2012-02']))
   .....: 

In [132]: series_monthly.index.resolution
Out[132]: 'day'

In [133]: series_monthly['2011-12']  # returns Series
Out[133]: 
2011-12-01    1
dtype: int64
```

### Exact indexing

As discussed in previous section, indexing a ``DatetimeIndex`` with a partial string depends on the “accuracy” of the period, in other words how specific the interval is in relation to the resolution of the index. In contrast, indexing with ``Timestamp`` or ``datetime`` objects is exact, because the objects have exact meaning. These also follow the semantics of *including both endpoints*.

These ``Timestamp`` and ``datetime`` objects have exact ``hours, minutes,`` and ``seconds``, even though they were not explicitly specified (they are ``0``).

``` python
In [134]: dft[datetime.datetime(2013, 1, 1):datetime.datetime(2013, 2, 28)]
Out[134]: 
                            A
2013-01-01 00:00:00  0.276232
2013-01-01 00:01:00 -1.087401
2013-01-01 00:02:00 -0.673690
2013-01-01 00:03:00  0.113648
2013-01-01 00:04:00 -1.478427
...                       ...
2013-02-27 23:56:00  1.197749
2013-02-27 23:57:00  0.720521
2013-02-27 23:58:00 -0.072718
2013-02-27 23:59:00 -0.681192
2013-02-28 00:00:00 -0.557501

[83521 rows x 1 columns]
```

With no defaults.

``` python
In [135]: dft[datetime.datetime(2013, 1, 1, 10, 12, 0):
   .....:     datetime.datetime(2013, 2, 28, 10, 12, 0)]
   .....: 
Out[135]: 
                            A
2013-01-01 10:12:00  0.565375
2013-01-01 10:13:00  0.068184
2013-01-01 10:14:00  0.788871
2013-01-01 10:15:00 -0.280343
2013-01-01 10:16:00  0.931536
...                       ...
2013-02-28 10:08:00  0.148098
2013-02-28 10:09:00 -0.388138
2013-02-28 10:10:00  0.139348
2013-02-28 10:11:00  0.085288
2013-02-28 10:12:00  0.950146

[83521 rows x 1 columns]
```

### Truncating & fancy indexing

A [``truncate()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.truncate.html#pandas.DataFrame.truncate) convenience function is provided that is similar
to slicing. Note that ``truncate`` assumes a 0 value for any unspecified date
component in a ``DatetimeIndex`` in contrast to slicing which returns any
partially matching dates:

``` python
In [136]: rng2 = pd.date_range('2011-01-01', '2012-01-01', freq='W')

In [137]: ts2 = pd.Series(np.random.randn(len(rng2)), index=rng2)

In [138]: ts2.truncate(before='2011-11', after='2011-12')
Out[138]: 
2011-11-06    0.437823
2011-11-13   -0.293083
2011-11-20   -0.059881
2011-11-27    1.252450
Freq: W-SUN, dtype: float64

In [139]: ts2['2011-11':'2011-12']
Out[139]: 
2011-11-06    0.437823
2011-11-13   -0.293083
2011-11-20   -0.059881
2011-11-27    1.252450
2011-12-04    0.046611
2011-12-11    0.059478
2011-12-18   -0.286539
2011-12-25    0.841669
Freq: W-SUN, dtype: float64
```

Even complicated fancy indexing that breaks the ``DatetimeIndex`` frequency
regularity will result in a ``DatetimeIndex``, although frequency is lost:

``` python
In [140]: ts2[[0, 2, 6]].index
Out[140]: DatetimeIndex(['2011-01-02', '2011-01-16', '2011-02-13'], dtype='datetime64[ns]', freq=None)
```

## Time/date components

There are several time/date properties that one can access from ``Timestamp`` or a collection of timestamps like a ``DatetimeIndex``.

Property | Description
---|---
year | The year of the datetime
month | The month of the datetime
day | The days of the datetime
hour | The hour of the datetime
minute | The minutes of the datetime
second | The seconds of the datetime
microsecond | The microseconds of the datetime
nanosecond | The nanoseconds of the datetime
date | Returns datetime.date (does not contain timezone information)
time | Returns datetime.time (does not contain timezone information)
timetz | Returns datetime.time as local time with timezone information
dayofyear | The ordinal day of year
weekofyear | The week ordinal of the year
week | The week ordinal of the year
dayofweek | The number of the day of the week with Monday=0, Sunday=6
weekday | The number of the day of the week with Monday=0, Sunday=6
weekday_name | The name of the day in a week (ex: Friday)
quarter | Quarter of the date: Jan-Mar = 1, Apr-Jun = 2, etc.
days_in_month | The number of days in the month of the datetime
is_month_start | Logical indicating if first day of month (defined by frequency)
is_month_end | Logical indicating if last day of month (defined by frequency)
is_quarter_start | Logical indicating if first day of quarter (defined by frequency)
is_quarter_end | Logical indicating if last day of quarter (defined by frequency)
is_year_start | Logical indicating if first day of year (defined by frequency)
is_year_end | Logical indicating if last day of year (defined by frequency)
is_leap_year | Logical indicating if the date belongs to a leap year

Furthermore, if you have a ``Series`` with datetimelike values, then you can
access these properties via the ``.dt`` accessor, as detailed in the section
on [.dt accessors](https://pandas.pydata.org/pandas-docs/stable/getting_started/basics.html#basics-dt-accessors).

## DateOffset objects

In the preceding examples, frequency strings (e.g. ``'D'``) were used to specify
a frequency that defined:

- how the date times in [``DatetimeIndex``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DatetimeIndex.html#pandas.DatetimeIndex) were spaced when using [``date_range()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.date_range.html#pandas.date_range)
- the frequency of a [``Period``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Period.html#pandas.Period) or [``PeriodIndex``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.PeriodIndex.html#pandas.PeriodIndex)

These frequency strings map to a ``DateOffset`` object and its subclasses. A ``DateOffset``
is similar to a [``Timedelta``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Timedelta.html#pandas.Timedelta) that represents a duration of time but follows specific calendar duration rules.
For example, a [``Timedelta``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Timedelta.html#pandas.Timedelta) day will always increment ``datetimes`` by 24 hours, while a ``DateOffset`` day
will increment ``datetimes`` to the same time the next day whether a day represents 23, 24 or 25 hours due to daylight
savings time. However, all ``DateOffset`` subclasses that are an hour or smaller
(``Hour``, ``Minute``, ``Second``, ``Milli``, ``Micro``, ``Nano``) behave like
[``Timedelta``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Timedelta.html#pandas.Timedelta) and respect absolute time.

The basic ``DateOffset`` acts similar to ``dateutil.relativedelta`` ([relativedelta documentation](https://dateutil.readthedocs.io/en/stable/relativedelta.html))
that shifts a date time by the corresponding calendar duration specified. The
arithmetic operator (``+``) or the ``apply`` method can be used to perform the shift.

``` python
# This particular day contains a day light savings time transition
In [141]: ts = pd.Timestamp('2016-10-30 00:00:00', tz='Europe/Helsinki')

# Respects absolute time
In [142]: ts + pd.Timedelta(days=1)
Out[142]: Timestamp('2016-10-30 23:00:00+0200', tz='Europe/Helsinki')

# Respects calendar time
In [143]: ts + pd.DateOffset(days=1)
Out[143]: Timestamp('2016-10-31 00:00:00+0200', tz='Europe/Helsinki')

In [144]: friday = pd.Timestamp('2018-01-05')

In [145]: friday.day_name()
Out[145]: 'Friday'

# Add 2 business days (Friday --> Tuesday)
In [146]: two_business_days = 2 * pd.offsets.BDay()

In [147]: two_business_days.apply(friday)
Out[147]: Timestamp('2018-01-09 00:00:00')

In [148]: friday + two_business_days
Out[148]: Timestamp('2018-01-09 00:00:00')

In [149]: (friday + two_business_days).day_name()
Out[149]: 'Tuesday'
```

Most ``DateOffsets`` have associated frequencies strings, or offset aliases, that can be passed
into ``freq`` keyword arguments. The available date offsets and associated frequency strings can be found below:

Date Offset | Frequency String | Description
---|---|---
[DateOffset](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.tseries.offsets.DateOffset.html#pandas.tseries.offsets.DateOffset) | None | Generic offset class, defaults to 1 calendar day
[BDay](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.tseries.offsets.BDay.html#pandas.tseries.offsets.BDay) or [BusinessDay](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.tseries.offsets.BusinessDay.html#pandas.tseries.offsets.BusinessDay) | 'B' | business day (weekday)
[CDay](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.tseries.offsets.CDay.html#pandas.tseries.offsets.CDay) or [CustomBusinessDay](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.tseries.offsets.CustomBusinessDay.html#pandas.tseries.offsets.CustomBusinessDay) | 'C' | custom business day
[Week](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.tseries.offsets.Week.html#pandas.tseries.offsets.Week) | 'W' | one week, optionally anchored on a day of the week
[WeekOfMonth](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.tseries.offsets.WeekOfMonth.html#pandas.tseries.offsets.WeekOfMonth) | 'WOM' | the x-th day of the y-th week of each month
[LastWeekOfMonth](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.tseries.offsets.LastWeekOfMonth.html#pandas.tseries.offsets.LastWeekOfMonth) | 'LWOM' | the x-th day of the last week of each month
[MonthEnd](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.tseries.offsets.MonthEnd.html#pandas.tseries.offsets.MonthEnd) | 'M' | calendar month end
[MonthBegin](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.tseries.offsets.MonthBegin.html#pandas.tseries.offsets.MonthBegin) | 'MS' | calendar month begin
[BMonthEnd](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.tseries.offsets.BMonthEnd.html#pandas.tseries.offsets.BMonthEnd) or [BusinessMonthEnd](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.tseries.offsets.BusinessMonthEnd.html#pandas.tseries.offsets.BusinessMonthEnd) | 'BM' | business month end
[BMonthBegin](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.tseries.offsets.BMonthBegin.html#pandas.tseries.offsets.BMonthBegin) or [BusinessMonthBegin](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.tseries.offsets.BusinessMonthBegin.html#pandas.tseries.offsets.BusinessMonthBegin) | 'BMS' | business month begin
[CBMonthEnd](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.tseries.offsets.CBMonthEnd.html#pandas.tseries.offsets.CBMonthEnd) or [CustomBusinessMonthEnd](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.tseries.offsets.CustomBusinessMonthEnd.html#pandas.tseries.offsets.CustomBusinessMonthEnd) | 'CBM' | custom business month end
[CBMonthBegin](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.tseries.offsets.CBMonthBegin.html#pandas.tseries.offsets.CBMonthBegin) or [CustomBusinessMonthBegin](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.tseries.offsets.CustomBusinessMonthBegin.html#pandas.tseries.offsets.CustomBusinessMonthBegin) | 'CBMS' | custom business month begin
[SemiMonthEnd](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.tseries.offsets.SemiMonthEnd.html#pandas.tseries.offsets.SemiMonthEnd) | 'SM' | 15th (or other day_of_month) and calendar month end
[SemiMonthBegin](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.tseries.offsets.SemiMonthBegin.html#pandas.tseries.offsets.SemiMonthBegin) | 'SMS' | 15th (or other day_of_month) and calendar month begin
[QuarterEnd](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.tseries.offsets.QuarterEnd.html#pandas.tseries.offsets.QuarterEnd) | 'Q' | calendar quarter end
[QuarterBegin](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.tseries.offsets.QuarterBegin.html#pandas.tseries.offsets.QuarterBegin) | 'QS' | calendar quarter begin
[BQuarterEnd](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.tseries.offsets.BQuarterEnd.html#pandas.tseries.offsets.BQuarterEnd) | 'BQ | business quarter end
[BQuarterBegin](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.tseries.offsets.BQuarterBegin.html#pandas.tseries.offsets.BQuarterBegin) | 'BQS' | business quarter begin
[FY5253Quarter](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.tseries.offsets.FY5253Quarter.html#pandas.tseries.offsets.FY5253Quarter) | 'REQ' | retail (aka 52-53 week) quarter
[YearEnd](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.tseries.offsets.YearEnd.html#pandas.tseries.offsets.YearEnd) | 'A' | calendar year end
[YearBegin](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.tseries.offsets.YearBegin.html#pandas.tseries.offsets.YearBegin) | 'AS' or 'BYS' | calendar year begin
[BYearEnd](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.tseries.offsets.BYearEnd.html#pandas.tseries.offsets.BYearEnd) | 'BA' | business year end
[BYearBegin](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.tseries.offsets.BYearBegin.html#pandas.tseries.offsets.BYearBegin) | 'BAS' | business year begin
[FY5253](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.tseries.offsets.FY5253.html#pandas.tseries.offsets.FY5253) | 'RE' | retail (aka 52-53 week) year
[Easter](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.tseries.offsets.Easter.html#pandas.tseries.offsets.Easter) | None | Easter holiday
[BusinessHour](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.tseries.offsets.Hour.html#pandas.tseries.offsets.Hour) | 'BH' | business hour
[CustomBusinessHour](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.tseries.offsets.CustomBusinessHour.html#pandas.tseries.offsets.CustomBusinessHour) | 'CBH' | custom business hour
[Day](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.tseries.offsets.Day.html#pandas.tseries.offsets.Day) | 'D' | one absolute day
[Hour](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.tseries.offsets.Hour.html#pandas.tseries.offsets.Hour) | 'H' | one hour
[Minute](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.tseries.offsets.Minute.html#pandas.tseries.offsets.Minute) | 'T' or 'min' | one minute
[Second](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.tseries.offsets.Second.html#pandas.tseries.offsets.Second) | 'S' | one second
[Milli](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.tseries.offsets.Milli.html#pandas.tseries.offsets.Milli) | 'L' or 'ms' | one millisecond
[Micro](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.tseries.offsets.Micro.html#pandas.tseries.offsets.Micro) | 'U' or 'us' | one microsecond
[Nano](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.tseries.offsets.Nano.html#pandas.tseries.offsets.Nano) | 'N' | one nanosecond

``DateOffsets`` additionally have ``rollforward()`` and ``rollback()``
methods for moving a date forward or backward respectively to a valid offset
date relative to the offset. For example, business offsets will roll dates
that land on the weekends (Saturday and Sunday) forward to Monday since
business offsets operate on the weekdays.

``` python
In [150]: ts = pd.Timestamp('2018-01-06 00:00:00')

In [151]: ts.day_name()
Out[151]: 'Saturday'

# BusinessHour's valid offset dates are Monday through Friday
In [152]: offset = pd.offsets.BusinessHour(start='09:00')

# Bring the date to the closest offset date (Monday)
In [153]: offset.rollforward(ts)
Out[153]: Timestamp('2018-01-08 09:00:00')

# Date is brought to the closest offset date first and then the hour is added
In [154]: ts + offset
Out[154]: Timestamp('2018-01-08 10:00:00')
```

These operations preserve time (hour, minute, etc) information by default.
To reset time to midnight, use ``normalize()`` before or after applying
the operation (depending on whether you want the time information included
in the operation).

``` python
In [155]: ts = pd.Timestamp('2014-01-01 09:00')

In [156]: day = pd.offsets.Day()

In [157]: day.apply(ts)
Out[157]: Timestamp('2014-01-02 09:00:00')

In [158]: day.apply(ts).normalize()
Out[158]: Timestamp('2014-01-02 00:00:00')

In [159]: ts = pd.Timestamp('2014-01-01 22:00')

In [160]: hour = pd.offsets.Hour()

In [161]: hour.apply(ts)
Out[161]: Timestamp('2014-01-01 23:00:00')

In [162]: hour.apply(ts).normalize()
Out[162]: Timestamp('2014-01-01 00:00:00')

In [163]: hour.apply(pd.Timestamp("2014-01-01 23:30")).normalize()
Out[163]: Timestamp('2014-01-02 00:00:00')
```

### Parametric offsets

Some of the offsets can be “parameterized” when created to result in different
behaviors. For example, the ``Week`` offset for generating weekly data accepts a
``weekday`` parameter which results in the generated dates always lying on a
particular day of the week:

``` python
In [164]: d = datetime.datetime(2008, 8, 18, 9, 0)

In [165]: d
Out[165]: datetime.datetime(2008, 8, 18, 9, 0)

In [166]: d + pd.offsets.Week()
Out[166]: Timestamp('2008-08-25 09:00:00')

In [167]: d + pd.offsets.Week(weekday=4)
Out[167]: Timestamp('2008-08-22 09:00:00')

In [168]: (d + pd.offsets.Week(weekday=4)).weekday()
Out[168]: 4

In [169]: d - pd.offsets.Week()
Out[169]: Timestamp('2008-08-11 09:00:00')
```

The ``normalize`` option will be effective for addition and subtraction.

``` python
In [170]: d + pd.offsets.Week(normalize=True)
Out[170]: Timestamp('2008-08-25 00:00:00')

In [171]: d - pd.offsets.Week(normalize=True)
Out[171]: Timestamp('2008-08-11 00:00:00')
```

Another example is parameterizing ``YearEnd`` with the specific ending month:

``` python
In [172]: d + pd.offsets.YearEnd()
Out[172]: Timestamp('2008-12-31 09:00:00')

In [173]: d + pd.offsets.YearEnd(month=6)
Out[173]: Timestamp('2009-06-30 09:00:00')
```

### Using offsets with ``Series`` / ``DatetimeIndex``

Offsets can be used with either a ``Series`` or ``DatetimeIndex`` to
apply the offset to each element.

``` python
In [174]: rng = pd.date_range('2012-01-01', '2012-01-03')

In [175]: s = pd.Series(rng)

In [176]: rng
Out[176]: DatetimeIndex(['2012-01-01', '2012-01-02', '2012-01-03'], dtype='datetime64[ns]', freq='D')

In [177]: rng + pd.DateOffset(months=2)
Out[177]: DatetimeIndex(['2012-03-01', '2012-03-02', '2012-03-03'], dtype='datetime64[ns]', freq='D')

In [178]: s + pd.DateOffset(months=2)
Out[178]: 
0   2012-03-01
1   2012-03-02
2   2012-03-03
dtype: datetime64[ns]

In [179]: s - pd.DateOffset(months=2)
Out[179]: 
0   2011-11-01
1   2011-11-02
2   2011-11-03
dtype: datetime64[ns]
```

If the offset class maps directly to a ``Timedelta`` (``Day``, ``Hour``,
``Minute``, ``Second``, ``Micro``, ``Milli``, ``Nano``) it can be
used exactly like a ``Timedelta`` - see the
[Timedelta section](timedeltas.html#timedeltas-operations) for more examples.

``` python
In [180]: s - pd.offsets.Day(2)
Out[180]: 
0   2011-12-30
1   2011-12-31
2   2012-01-01
dtype: datetime64[ns]

In [181]: td = s - pd.Series(pd.date_range('2011-12-29', '2011-12-31'))

In [182]: td
Out[182]: 
0   3 days
1   3 days
2   3 days
dtype: timedelta64[ns]

In [183]: td + pd.offsets.Minute(15)
Out[183]: 
0   3 days 00:15:00
1   3 days 00:15:00
2   3 days 00:15:00
dtype: timedelta64[ns]
```

Note that some offsets (such as ``BQuarterEnd``) do not have a
vectorized implementation.  They can still be used but may
calculate significantly slower and will show a ``PerformanceWarning``

``` python
In [184]: rng + pd.offsets.BQuarterEnd()
Out[184]: DatetimeIndex(['2012-03-30', '2012-03-30', '2012-03-30'], dtype='datetime64[ns]', freq='D')
```

### Custom business days

The ``CDay`` or ``CustomBusinessDay`` class provides a parametric
``BusinessDay`` class which can be used to create customized business day
calendars which account for local holidays and local weekend conventions.

As an interesting example, let’s look at Egypt where a Friday-Saturday weekend is observed.

``` python
In [185]: weekmask_egypt = 'Sun Mon Tue Wed Thu'

# They also observe International Workers' Day so let's
# add that for a couple of years
In [186]: holidays = ['2012-05-01',
   .....:             datetime.datetime(2013, 5, 1),
   .....:             np.datetime64('2014-05-01')]
   .....: 

In [187]: bday_egypt = pd.offsets.CustomBusinessDay(holidays=holidays,
   .....:                                           weekmask=weekmask_egypt)
   .....: 

In [188]: dt = datetime.datetime(2013, 4, 30)

In [189]: dt + 2 * bday_egypt
Out[189]: Timestamp('2013-05-05 00:00:00')
```

Let’s map to the weekday names:

``` python
In [190]: dts = pd.date_range(dt, periods=5, freq=bday_egypt)

In [191]: pd.Series(dts.weekday, dts).map(
   .....:     pd.Series('Mon Tue Wed Thu Fri Sat Sun'.split()))
   .....: 
Out[191]: 
2013-04-30    Tue
2013-05-02    Thu
2013-05-05    Sun
2013-05-06    Mon
2013-05-07    Tue
Freq: C, dtype: object
```

Holiday calendars can be used to provide the list of holidays.  See the
[holiday calendar](#timeseries-holiday) section for more information.

``` python
In [192]: from pandas.tseries.holiday import USFederalHolidayCalendar

In [193]: bday_us = pd.offsets.CustomBusinessDay(calendar=USFederalHolidayCalendar())

# Friday before MLK Day
In [194]: dt = datetime.datetime(2014, 1, 17)

# Tuesday after MLK Day (Monday is skipped because it's a holiday)
In [195]: dt + bday_us
Out[195]: Timestamp('2014-01-21 00:00:00')
```

Monthly offsets that respect a certain holiday calendar can be defined
in the usual way.

``` python
In [196]: bmth_us = pd.offsets.CustomBusinessMonthBegin(
   .....:     calendar=USFederalHolidayCalendar())
   .....: 

# Skip new years
In [197]: dt = datetime.datetime(2013, 12, 17)

In [198]: dt + bmth_us
Out[198]: Timestamp('2014-01-02 00:00:00')

# Define date index with custom offset
In [199]: pd.date_range(start='20100101', end='20120101', freq=bmth_us)
Out[199]: 
DatetimeIndex(['2010-01-04', '2010-02-01', '2010-03-01', '2010-04-01',
               '2010-05-03', '2010-06-01', '2010-07-01', '2010-08-02',
               '2010-09-01', '2010-10-01', '2010-11-01', '2010-12-01',
               '2011-01-03', '2011-02-01', '2011-03-01', '2011-04-01',
               '2011-05-02', '2011-06-01', '2011-07-01', '2011-08-01',
               '2011-09-01', '2011-10-03', '2011-11-01', '2011-12-01'],
              dtype='datetime64[ns]', freq='CBMS')
```

::: tip Note

The frequency string ‘C’ is used to indicate that a CustomBusinessDay
DateOffset is used, it is important to note that since CustomBusinessDay is
a parameterised type, instances of CustomBusinessDay may differ and this is
not detectable from the ‘C’ frequency string. The user therefore needs to
ensure that the ‘C’ frequency string is used consistently within the user’s
application.

:::

### Business hour

The ``BusinessHour`` class provides a business hour representation on ``BusinessDay``,
allowing to use specific start and end times.

By default, ``BusinessHour`` uses 9:00 - 17:00 as business hours.
Adding ``BusinessHour`` will increment ``Timestamp`` by hourly frequency.
If target ``Timestamp`` is out of business hours, move to the next business hour
then increment it. If the result exceeds the business hours end, the remaining
hours are added to the next business day.

``` python
In [200]: bh = pd.offsets.BusinessHour()

In [201]: bh
Out[201]: <BusinessHour: BH=09:00-17:00>

# 2014-08-01 is Friday
In [202]: pd.Timestamp('2014-08-01 10:00').weekday()
Out[202]: 4

In [203]: pd.Timestamp('2014-08-01 10:00') + bh
Out[203]: Timestamp('2014-08-01 11:00:00')

# Below example is the same as: pd.Timestamp('2014-08-01 09:00') + bh
In [204]: pd.Timestamp('2014-08-01 08:00') + bh
Out[204]: Timestamp('2014-08-01 10:00:00')

# If the results is on the end time, move to the next business day
In [205]: pd.Timestamp('2014-08-01 16:00') + bh
Out[205]: Timestamp('2014-08-04 09:00:00')

# Remainings are added to the next day
In [206]: pd.Timestamp('2014-08-01 16:30') + bh
Out[206]: Timestamp('2014-08-04 09:30:00')

# Adding 2 business hours
In [207]: pd.Timestamp('2014-08-01 10:00') + pd.offsets.BusinessHour(2)
Out[207]: Timestamp('2014-08-01 12:00:00')

# Subtracting 3 business hours
In [208]: pd.Timestamp('2014-08-01 10:00') + pd.offsets.BusinessHour(-3)
Out[208]: Timestamp('2014-07-31 15:00:00')
```

You can also specify ``start`` and ``end`` time by keywords. The argument must
be a ``str`` with an ``hour:minute`` representation or a ``datetime.time``
instance. Specifying seconds, microseconds and nanoseconds as business hour
results in ``ValueError``.

``` python
In [209]: bh = pd.offsets.BusinessHour(start='11:00', end=datetime.time(20, 0))

In [210]: bh
Out[210]: <BusinessHour: BH=11:00-20:00>

In [211]: pd.Timestamp('2014-08-01 13:00') + bh
Out[211]: Timestamp('2014-08-01 14:00:00')

In [212]: pd.Timestamp('2014-08-01 09:00') + bh
Out[212]: Timestamp('2014-08-01 12:00:00')

In [213]: pd.Timestamp('2014-08-01 18:00') + bh
Out[213]: Timestamp('2014-08-01 19:00:00')
```

Passing ``start`` time later than ``end`` represents midnight business hour.
In this case, business hour exceeds midnight and overlap to the next day.
Valid business hours are distinguished by whether it started from valid ``BusinessDay``.

``` python
In [214]: bh = pd.offsets.BusinessHour(start='17:00', end='09:00')

In [215]: bh
Out[215]: <BusinessHour: BH=17:00-09:00>

In [216]: pd.Timestamp('2014-08-01 17:00') + bh
Out[216]: Timestamp('2014-08-01 18:00:00')

In [217]: pd.Timestamp('2014-08-01 23:00') + bh
Out[217]: Timestamp('2014-08-02 00:00:00')

# Although 2014-08-02 is Saturday,
# it is valid because it starts from 08-01 (Friday).
In [218]: pd.Timestamp('2014-08-02 04:00') + bh
Out[218]: Timestamp('2014-08-02 05:00:00')

# Although 2014-08-04 is Monday,
# it is out of business hours because it starts from 08-03 (Sunday).
In [219]: pd.Timestamp('2014-08-04 04:00') + bh
Out[219]: Timestamp('2014-08-04 18:00:00')
```

Applying ``BusinessHour.rollforward`` and ``rollback`` to out of business hours results in
the next business hour start or previous day’s end. Different from other offsets, ``BusinessHour.rollforward``
may output different results from ``apply`` by definition.

This is because one day’s business hour end is equal to next day’s business hour start. For example,
under the default business hours (9:00 - 17:00), there is no gap (0 minutes) between ``2014-08-01 17:00`` and
``2014-08-04 09:00``.

``` python
# This adjusts a Timestamp to business hour edge
In [220]: pd.offsets.BusinessHour().rollback(pd.Timestamp('2014-08-02 15:00'))
Out[220]: Timestamp('2014-08-01 17:00:00')

In [221]: pd.offsets.BusinessHour().rollforward(pd.Timestamp('2014-08-02 15:00'))
Out[221]: Timestamp('2014-08-04 09:00:00')

# It is the same as BusinessHour().apply(pd.Timestamp('2014-08-01 17:00')).
# And it is the same as BusinessHour().apply(pd.Timestamp('2014-08-04 09:00'))
In [222]: pd.offsets.BusinessHour().apply(pd.Timestamp('2014-08-02 15:00'))
Out[222]: Timestamp('2014-08-04 10:00:00')

# BusinessDay results (for reference)
In [223]: pd.offsets.BusinessHour().rollforward(pd.Timestamp('2014-08-02'))
Out[223]: Timestamp('2014-08-04 09:00:00')

# It is the same as BusinessDay().apply(pd.Timestamp('2014-08-01'))
# The result is the same as rollworward because BusinessDay never overlap.
In [224]: pd.offsets.BusinessHour().apply(pd.Timestamp('2014-08-02'))
Out[224]: Timestamp('2014-08-04 10:00:00')
```

``BusinessHour`` regards Saturday and Sunday as holidays. To use arbitrary
holidays, you can use ``CustomBusinessHour`` offset, as explained in the
following subsection.

### Custom business hour

*New in version 0.18.1.* 

The ``CustomBusinessHour`` is a mixture of ``BusinessHour`` and ``CustomBusinessDay`` which
allows you to specify arbitrary holidays. ``CustomBusinessHour`` works as the same
as ``BusinessHour`` except that it skips specified custom holidays.

``` python
In [225]: from pandas.tseries.holiday import USFederalHolidayCalendar

In [226]: bhour_us = pd.offsets.CustomBusinessHour(calendar=USFederalHolidayCalendar())

# Friday before MLK Day
In [227]: dt = datetime.datetime(2014, 1, 17, 15)

In [228]: dt + bhour_us
Out[228]: Timestamp('2014-01-17 16:00:00')

# Tuesday after MLK Day (Monday is skipped because it's a holiday)
In [229]: dt + bhour_us * 2
Out[229]: Timestamp('2014-01-21 09:00:00')
```

You can use keyword arguments supported by either ``BusinessHour`` and ``CustomBusinessDay``.

``` python
In [230]: bhour_mon = pd.offsets.CustomBusinessHour(start='10:00',
   .....:                                           weekmask='Tue Wed Thu Fri')
   .....: 

# Monday is skipped because it's a holiday, business hour starts from 10:00
In [231]: dt + bhour_mon * 2
Out[231]: Timestamp('2014-01-21 10:00:00')
```

### Offset aliases

A number of string aliases are given to useful common time series
frequencies. We will refer to these aliases as *offset aliases*.

Alias | Description
---|---
B | business day frequency
C | custom business day frequency
D | calendar day frequency
W | weekly frequency
M | month end frequency
SM | semi-month end frequency (15th and end of month)
BM | business month end frequency
CBM | custom business month end frequency
MS | month start frequency
SMS | semi-month start frequency (1st and 15th)
BMS | business month start frequency
CBMS | custom business month start frequency
Q | quarter end frequency
BQ | business quarter end frequency
QS | quarter start frequency
BQS | business quarter start frequency
A, Y | year end frequency
BA, BY | business year end frequency
AS, YS | year start frequency
BAS, BYS | business year start frequency
BH | business hour frequency
H | hourly frequency
T, min | minutely frequency
S | secondly frequency
L, ms | milliseconds
U, us | microseconds
N | nanoseconds

### Combining aliases

As we have seen previously, the alias and the offset instance are fungible in
most functions:

``` python
In [232]: pd.date_range(start, periods=5, freq='B')
Out[232]: 
DatetimeIndex(['2011-01-03', '2011-01-04', '2011-01-05', '2011-01-06',
               '2011-01-07'],
              dtype='datetime64[ns]', freq='B')

In [233]: pd.date_range(start, periods=5, freq=pd.offsets.BDay())
Out[233]: 
DatetimeIndex(['2011-01-03', '2011-01-04', '2011-01-05', '2011-01-06',
               '2011-01-07'],
              dtype='datetime64[ns]', freq='B')
```

You can combine together day and intraday offsets:

``` python
In [234]: pd.date_range(start, periods=10, freq='2h20min')
Out[234]: 
DatetimeIndex(['2011-01-01 00:00:00', '2011-01-01 02:20:00',
               '2011-01-01 04:40:00', '2011-01-01 07:00:00',
               '2011-01-01 09:20:00', '2011-01-01 11:40:00',
               '2011-01-01 14:00:00', '2011-01-01 16:20:00',
               '2011-01-01 18:40:00', '2011-01-01 21:00:00'],
              dtype='datetime64[ns]', freq='140T')

In [235]: pd.date_range(start, periods=10, freq='1D10U')
Out[235]: 
DatetimeIndex([       '2011-01-01 00:00:00', '2011-01-02 00:00:00.000010',
               '2011-01-03 00:00:00.000020', '2011-01-04 00:00:00.000030',
               '2011-01-05 00:00:00.000040', '2011-01-06 00:00:00.000050',
               '2011-01-07 00:00:00.000060', '2011-01-08 00:00:00.000070',
               '2011-01-09 00:00:00.000080', '2011-01-10 00:00:00.000090'],
              dtype='datetime64[ns]', freq='86400000010U')
```

### Anchored offsets

For some frequencies you can specify an anchoring suffix:

Alias | Description
---|---
W-SUN | weekly frequency (Sundays). Same as ‘W’
W-MON | weekly frequency (Mondays)
W-TUE | weekly frequency (Tuesdays)
W-WED | weekly frequency (Wednesdays)
W-THU | weekly frequency (Thursdays)
W-FRI | weekly frequency (Fridays)
W-SAT | weekly frequency (Saturdays)
(B)Q(S)-DEC | quarterly frequency, year ends in December. Same as ‘Q’
(B)Q(S)-JAN | quarterly frequency, year ends in January
(B)Q(S)-FEB | quarterly frequency, year ends in February
(B)Q(S)-MAR | quarterly frequency, year ends in March
(B)Q(S)-APR | quarterly frequency, year ends in April
(B)Q(S)-MAY | quarterly frequency, year ends in May
(B)Q(S)-JUN | quarterly frequency, year ends in June
(B)Q(S)-JUL | quarterly frequency, year ends in July
(B)Q(S)-AUG | quarterly frequency, year ends in August
(B)Q(S)-SEP | quarterly frequency, year ends in September
(B)Q(S)-OCT | quarterly frequency, year ends in October
(B)Q(S)-NOV | quarterly frequency, year ends in November
(B)A(S)-DEC | annual frequency, anchored end of December. Same as ‘A’
(B)A(S)-JAN | annual frequency, anchored end of January
(B)A(S)-FEB | annual frequency, anchored end of February
(B)A(S)-MAR | annual frequency, anchored end of March
(B)A(S)-APR | annual frequency, anchored end of April
(B)A(S)-MAY | annual frequency, anchored end of May
(B)A(S)-JUN | annual frequency, anchored end of June
(B)A(S)-JUL | annual frequency, anchored end of July
(B)A(S)-AUG | annual frequency, anchored end of August
(B)A(S)-SEP | annual frequency, anchored end of September
(B)A(S)-OCT | annual frequency, anchored end of October
(B)A(S)-NOV | annual frequency, anchored end of November

These can be used as arguments to ``date_range``, ``bdate_range``, constructors
for ``DatetimeIndex``, as well as various other timeseries-related functions
in pandas.

### Anchored offset semantics

For those offsets that are anchored to the start or end of specific
frequency (``MonthEnd``, ``MonthBegin``, ``WeekEnd``, etc), the following
rules apply to rolling forward and backwards.

When ``n`` is not 0, if the given date is not on an anchor point, it snapped to the next(previous)
anchor point, and moved ``|n|-1`` additional steps forwards or backwards.

``` python
In [236]: pd.Timestamp('2014-01-02') + pd.offsets.MonthBegin(n=1)
Out[236]: Timestamp('2014-02-01 00:00:00')

In [237]: pd.Timestamp('2014-01-02') + pd.offsets.MonthEnd(n=1)
Out[237]: Timestamp('2014-01-31 00:00:00')

In [238]: pd.Timestamp('2014-01-02') - pd.offsets.MonthBegin(n=1)
Out[238]: Timestamp('2014-01-01 00:00:00')

In [239]: pd.Timestamp('2014-01-02') - pd.offsets.MonthEnd(n=1)
Out[239]: Timestamp('2013-12-31 00:00:00')

In [240]: pd.Timestamp('2014-01-02') + pd.offsets.MonthBegin(n=4)
Out[240]: Timestamp('2014-05-01 00:00:00')

In [241]: pd.Timestamp('2014-01-02') - pd.offsets.MonthBegin(n=4)
Out[241]: Timestamp('2013-10-01 00:00:00')
```

If the given date *is* on an anchor point, it is moved ``|n|`` points forwards
or backwards.

``` python
In [242]: pd.Timestamp('2014-01-01') + pd.offsets.MonthBegin(n=1)
Out[242]: Timestamp('2014-02-01 00:00:00')

In [243]: pd.Timestamp('2014-01-31') + pd.offsets.MonthEnd(n=1)
Out[243]: Timestamp('2014-02-28 00:00:00')

In [244]: pd.Timestamp('2014-01-01') - pd.offsets.MonthBegin(n=1)
Out[244]: Timestamp('2013-12-01 00:00:00')

In [245]: pd.Timestamp('2014-01-31') - pd.offsets.MonthEnd(n=1)
Out[245]: Timestamp('2013-12-31 00:00:00')

In [246]: pd.Timestamp('2014-01-01') + pd.offsets.MonthBegin(n=4)
Out[246]: Timestamp('2014-05-01 00:00:00')

In [247]: pd.Timestamp('2014-01-31') - pd.offsets.MonthBegin(n=4)
Out[247]: Timestamp('2013-10-01 00:00:00')
```

For the case when ``n=0``, the date is not moved if on an anchor point, otherwise
it is rolled forward to the next anchor point.

``` python
In [248]: pd.Timestamp('2014-01-02') + pd.offsets.MonthBegin(n=0)
Out[248]: Timestamp('2014-02-01 00:00:00')

In [249]: pd.Timestamp('2014-01-02') + pd.offsets.MonthEnd(n=0)
Out[249]: Timestamp('2014-01-31 00:00:00')

In [250]: pd.Timestamp('2014-01-01') + pd.offsets.MonthBegin(n=0)
Out[250]: Timestamp('2014-01-01 00:00:00')

In [251]: pd.Timestamp('2014-01-31') + pd.offsets.MonthEnd(n=0)
Out[251]: Timestamp('2014-01-31 00:00:00')
```

### Holidays / holiday calendars

Holidays and calendars provide a simple way to define holiday rules to be used
with ``CustomBusinessDay`` or in other analysis that requires a predefined
set of holidays.  The ``AbstractHolidayCalendar`` class provides all the necessary
methods to return a list of holidays and only ``rules`` need to be defined
in a specific holiday calendar class. Furthermore, the ``start_date`` and ``end_date``
class attributes determine over what date range holidays are generated.  These
should be overwritten on the ``AbstractHolidayCalendar`` class to have the range
apply to all calendar subclasses.  ``USFederalHolidayCalendar`` is the
only calendar that exists and primarily serves as an example for developing
other calendars.

For holidays that occur on fixed dates (e.g., US Memorial Day or July 4th) an
observance rule determines when that holiday is observed if it falls on a weekend
or some other non-observed day.  Defined observance rules are:

Rule | Description
---|---
nearest_workday | move Saturday to Friday and Sunday to Monday
sunday_to_monday | move Sunday to following Monday
next_monday_or_tuesday | move Saturday to Monday and Sunday/Monday to Tuesday
previous_friday | move Saturday and Sunday to previous Friday”
next_monday | move Saturday and Sunday to following Monday

An example of how holidays and holiday calendars are defined:

``` python
In [252]: from pandas.tseries.holiday import Holiday, USMemorialDay,\
   .....:     AbstractHolidayCalendar, nearest_workday, MO
   .....: 

In [253]: class ExampleCalendar(AbstractHolidayCalendar):
   .....:     rules = [
   .....:         USMemorialDay,
   .....:         Holiday('July 4th', month=7, day=4, observance=nearest_workday),
   .....:         Holiday('Columbus Day', month=10, day=1,
   .....:                 offset=pd.DateOffset(weekday=MO(2)))]
   .....: 

In [254]: cal = ExampleCalendar()

In [255]: cal.holidays(datetime.datetime(2012, 1, 1), datetime.datetime(2012, 12, 31))
Out[255]: DatetimeIndex(['2012-05-28', '2012-07-04', '2012-10-08'], dtype='datetime64[ns]', freq=None)
```

hint: | weekday=MO(2) is same as 2 * Week(weekday=2)
---|---

Using this calendar, creating an index or doing offset arithmetic skips weekends
and holidays (i.e., Memorial Day/July 4th).  For example, the below defines
a custom business day offset using the ``ExampleCalendar``.  Like any other offset,
it can be used to create a ``DatetimeIndex`` or added to ``datetime``
or ``Timestamp`` objects.

``` python
In [256]: pd.date_range(start='7/1/2012', end='7/10/2012',
   .....:               freq=pd.offsets.CDay(calendar=cal)).to_pydatetime()
   .....: 
Out[256]: 
array([datetime.datetime(2012, 7, 2, 0, 0),
       datetime.datetime(2012, 7, 3, 0, 0),
       datetime.datetime(2012, 7, 5, 0, 0),
       datetime.datetime(2012, 7, 6, 0, 0),
       datetime.datetime(2012, 7, 9, 0, 0),
       datetime.datetime(2012, 7, 10, 0, 0)], dtype=object)

In [257]: offset = pd.offsets.CustomBusinessDay(calendar=cal)

In [258]: datetime.datetime(2012, 5, 25) + offset
Out[258]: Timestamp('2012-05-29 00:00:00')

In [259]: datetime.datetime(2012, 7, 3) + offset
Out[259]: Timestamp('2012-07-05 00:00:00')

In [260]: datetime.datetime(2012, 7, 3) + 2 * offset
Out[260]: Timestamp('2012-07-06 00:00:00')

In [261]: datetime.datetime(2012, 7, 6) + offset
Out[261]: Timestamp('2012-07-09 00:00:00')
```

Ranges are defined by the ``start_date`` and ``end_date`` class attributes
of ``AbstractHolidayCalendar``.  The defaults are shown below.

``` python
In [262]: AbstractHolidayCalendar.start_date
Out[262]: Timestamp('1970-01-01 00:00:00')

In [263]: AbstractHolidayCalendar.end_date
Out[263]: Timestamp('2030-12-31 00:00:00')
```

These dates can be overwritten by setting the attributes as
datetime/Timestamp/string.

``` python
In [264]: AbstractHolidayCalendar.start_date = datetime.datetime(2012, 1, 1)

In [265]: AbstractHolidayCalendar.end_date = datetime.datetime(2012, 12, 31)

In [266]: cal.holidays()
Out[266]: DatetimeIndex(['2012-05-28', '2012-07-04', '2012-10-08'], dtype='datetime64[ns]', freq=None)
```

Every calendar class is accessible by name using the ``get_calendar`` function
which returns a holiday class instance.  Any imported calendar class will
automatically be available by this function.  Also, ``HolidayCalendarFactory``
provides an easy interface to create calendars that are combinations of calendars
or calendars with additional rules.

``` python
In [267]: from pandas.tseries.holiday import get_calendar, HolidayCalendarFactory,\
   .....:     USLaborDay
   .....: 

In [268]: cal = get_calendar('ExampleCalendar')

In [269]: cal.rules
Out[269]: 
[Holiday: Memorial Day (month=5, day=31, offset=<DateOffset: weekday=MO(-1)>),
 Holiday: July 4th (month=7, day=4, observance=<function nearest_workday at 0x7f65d1933ea0>),
 Holiday: Columbus Day (month=10, day=1, offset=<DateOffset: weekday=MO(+2)>)]

In [270]: new_cal = HolidayCalendarFactory('NewExampleCalendar', cal, USLaborDay)

In [271]: new_cal.rules
Out[271]: 
[Holiday: Labor Day (month=9, day=1, offset=<DateOffset: weekday=MO(+1)>),
 Holiday: Memorial Day (month=5, day=31, offset=<DateOffset: weekday=MO(-1)>),
 Holiday: July 4th (month=7, day=4, observance=<function nearest_workday at 0x7f65d1933ea0>),
 Holiday: Columbus Day (month=10, day=1, offset=<DateOffset: weekday=MO(+2)>)]
```

## Time Series-Related Instance Methods

### Shifting / lagging

One may want to *shift* or *lag* the values in a time series back and forward in
time. The method for this is [``shift()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.shift.html#pandas.Series.shift), which is available on all of
the pandas objects.

``` python
In [272]: ts = pd.Series(range(len(rng)), index=rng)

In [273]: ts = ts[:5]

In [274]: ts.shift(1)
Out[274]: 
2012-01-01    NaN
2012-01-02    0.0
2012-01-03    1.0
Freq: D, dtype: float64
```

The ``shift`` method accepts an ``freq`` argument which can accept a
``DateOffset`` class or other ``timedelta``-like object or also an
[offset alias](#timeseries-offset-aliases):

``` python
In [275]: ts.shift(5, freq=pd.offsets.BDay())
Out[275]: 
2012-01-06    0
2012-01-09    1
2012-01-10    2
Freq: B, dtype: int64

In [276]: ts.shift(5, freq='BM')
Out[276]: 
2012-05-31    0
2012-05-31    1
2012-05-31    2
Freq: D, dtype: int64
```

Rather than changing the alignment of the data and the index, ``DataFrame`` and
``Series`` objects also have a [``tshift()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.tshift.html#pandas.Series.tshift) convenience method that
changes all the dates in the index by a specified number of offsets:

``` python
In [277]: ts.tshift(5, freq='D')
Out[277]: 
2012-01-06    0
2012-01-07    1
2012-01-08    2
Freq: D, dtype: int64
```

Note that with ``tshift``, the leading entry is no longer NaN because the data
is not being realigned.

### Frequency conversion

The primary function for changing frequencies is the [``asfreq()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.asfreq.html#pandas.Series.asfreq)
method. For a ``DatetimeIndex``, this is basically just a thin, but convenient
wrapper around [``reindex()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.reindex.html#pandas.Series.reindex)  which generates a ``date_range`` and
calls ``reindex``.

``` python
In [278]: dr = pd.date_range('1/1/2010', periods=3, freq=3 * pd.offsets.BDay())

In [279]: ts = pd.Series(np.random.randn(3), index=dr)

In [280]: ts
Out[280]: 
2010-01-01    1.494522
2010-01-06   -0.778425
2010-01-11   -0.253355
Freq: 3B, dtype: float64

In [281]: ts.asfreq(pd.offsets.BDay())
Out[281]: 
2010-01-01    1.494522
2010-01-04         NaN
2010-01-05         NaN
2010-01-06   -0.778425
2010-01-07         NaN
2010-01-08         NaN
2010-01-11   -0.253355
Freq: B, dtype: float64
```

``asfreq`` provides a further convenience so you can specify an interpolation
method for any gaps that may appear after the frequency conversion.

``` python
In [282]: ts.asfreq(pd.offsets.BDay(), method='pad')
Out[282]: 
2010-01-01    1.494522
2010-01-04    1.494522
2010-01-05    1.494522
2010-01-06   -0.778425
2010-01-07   -0.778425
2010-01-08   -0.778425
2010-01-11   -0.253355
Freq: B, dtype: float64
```

### Filling forward / backward

Related to ``asfreq`` and ``reindex`` is [``fillna()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.fillna.html#pandas.Series.fillna), which is
documented in the [missing data section](missing_data.html#missing-data-fillna).

### Converting to Python datetimes

``DatetimeIndex`` can be converted to an array of Python native
[``datetime.datetime``](https://docs.python.org/3/library/datetime.html#datetime.datetime) objects using the ``to_pydatetime`` method.

## Resampling

::: danger Warning

The interface to ``.resample`` has changed in 0.18.0 to be more groupby-like and hence more flexible.
See the [whatsnew docs](https://pandas.pydata.org/pandas-docs/stable/whatsnew/v0.18.0.html#whatsnew-0180-breaking-resample) for a comparison with prior versions.

:::

Pandas has a simple, powerful, and efficient functionality for performing
resampling operations during frequency conversion (e.g., converting secondly
data into 5-minutely data). This is extremely common in, but not limited to,
financial applications.

[``resample()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.resample.html#pandas.Series.resample) is a time-based groupby, followed by a reduction method
on each of its groups. See some [cookbook examples](cookbook.html#cookbook-resample) for
some advanced strategies.

Starting in version 0.18.1, the ``resample()`` function can be used directly from
``DataFrameGroupBy`` objects, see the [groupby docs](groupby.html#groupby-transform-window-resample).

::: tip Note

``.resample()`` is similar to using a [``rolling()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.rolling.html#pandas.Series.rolling) operation with
a time-based offset, see a discussion [here](computation.html#stats-moments-ts-versus-resampling).

:::

### Basics

``` python
In [283]: rng = pd.date_range('1/1/2012', periods=100, freq='S')

In [284]: ts = pd.Series(np.random.randint(0, 500, len(rng)), index=rng)

In [285]: ts.resample('5Min').sum()
Out[285]: 
2012-01-01    25103
Freq: 5T, dtype: int64
```

The ``resample`` function is very flexible and allows you to specify many
different parameters to control the frequency conversion and resampling
operation.

Any function available via [dispatching](groupby.html#groupby-dispatch) is available as
a method of the returned object, including ``sum``, ``mean``, ``std``, ``sem``,
``max``, ``min``, ``median``, ``first``, ``last``, ``ohlc``:

``` python
In [286]: ts.resample('5Min').mean()
Out[286]: 
2012-01-01    251.03
Freq: 5T, dtype: float64

In [287]: ts.resample('5Min').ohlc()
Out[287]: 
            open  high  low  close
2012-01-01   308   460    9    205

In [288]: ts.resample('5Min').max()
Out[288]: 
2012-01-01    460
Freq: 5T, dtype: int64
```

For downsampling, ``closed`` can be set to ‘left’ or ‘right’ to specify which
end of the interval is closed:

``` python
In [289]: ts.resample('5Min', closed='right').mean()
Out[289]: 
2011-12-31 23:55:00    308.000000
2012-01-01 00:00:00    250.454545
Freq: 5T, dtype: float64

In [290]: ts.resample('5Min', closed='left').mean()
Out[290]: 
2012-01-01    251.03
Freq: 5T, dtype: float64
```

Parameters like ``label`` and ``loffset`` are used to manipulate the resulting
labels. ``label`` specifies whether the result is labeled with the beginning or
the end of the interval. ``loffset`` performs a time adjustment on the output
labels.

``` python
In [291]: ts.resample('5Min').mean()  # by default label='left'
Out[291]: 
2012-01-01    251.03
Freq: 5T, dtype: float64

In [292]: ts.resample('5Min', label='left').mean()
Out[292]: 
2012-01-01    251.03
Freq: 5T, dtype: float64

In [293]: ts.resample('5Min', label='left', loffset='1s').mean()
Out[293]: 
2012-01-01 00:00:01    251.03
dtype: float64
```

::: danger Warning

The default values for ``label`` and ``closed`` is ‘**left**’ for all
frequency offsets except for ‘M’, ‘A’, ‘Q’, ‘BM’, ‘BA’, ‘BQ’, and ‘W’
which all have a default of ‘right’.

This might unintendedly lead to looking ahead, where the value for a later
time is pulled back to a previous time as in the following example with
the [``BusinessDay``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.tseries.offsets.BusinessDay.html#pandas.tseries.offsets.BusinessDay) frequency:

``` python
In [294]: s = pd.date_range('2000-01-01', '2000-01-05').to_series()

In [295]: s.iloc[2] = pd.NaT

In [296]: s.dt.weekday_name
Out[296]: 
2000-01-01     Saturday
2000-01-02       Sunday
2000-01-03          NaN
2000-01-04      Tuesday
2000-01-05    Wednesday
Freq: D, dtype: object

# default: label='left', closed='left'
In [297]: s.resample('B').last().dt.weekday_name
Out[297]: 
1999-12-31       Sunday
2000-01-03          NaN
2000-01-04      Tuesday
2000-01-05    Wednesday
Freq: B, dtype: object
```

Notice how the value for Sunday got pulled back to the previous Friday.
To get the behavior where the value for Sunday is pushed to Monday, use
instead

``` python
In [298]: s.resample('B', label='right', closed='right').last().dt.weekday_name
Out[298]: 
2000-01-03       Sunday
2000-01-04      Tuesday
2000-01-05    Wednesday
Freq: B, dtype: object
```

:::

The ``axis`` parameter can be set to 0 or 1 and allows you to resample the
specified axis for a ``DataFrame``.

``kind`` can be set to ‘timestamp’ or ‘period’ to convert the resulting index
to/from timestamp and time span representations. By default ``resample``
retains the input representation.

``convention`` can be set to ‘start’ or ‘end’ when resampling period data
(detail below). It specifies how low frequency periods are converted to higher
frequency periods.

### Upsampling

For upsampling, you can specify a way to upsample and the ``limit`` parameter to interpolate over the gaps that are created:

``` python
# from secondly to every 250 milliseconds
In [299]: ts[:2].resample('250L').asfreq()
Out[299]: 
2012-01-01 00:00:00.000    308.0
2012-01-01 00:00:00.250      NaN
2012-01-01 00:00:00.500      NaN
2012-01-01 00:00:00.750      NaN
2012-01-01 00:00:01.000    204.0
Freq: 250L, dtype: float64

In [300]: ts[:2].resample('250L').ffill()
Out[300]: 
2012-01-01 00:00:00.000    308
2012-01-01 00:00:00.250    308
2012-01-01 00:00:00.500    308
2012-01-01 00:00:00.750    308
2012-01-01 00:00:01.000    204
Freq: 250L, dtype: int64

In [301]: ts[:2].resample('250L').ffill(limit=2)
Out[301]: 
2012-01-01 00:00:00.000    308.0
2012-01-01 00:00:00.250    308.0
2012-01-01 00:00:00.500    308.0
2012-01-01 00:00:00.750      NaN
2012-01-01 00:00:01.000    204.0
Freq: 250L, dtype: float64
```

### Sparse resampling

Sparse timeseries are the ones where you have a lot fewer points relative
to the amount of time you are looking to resample. Naively upsampling a sparse
series can potentially generate lots of intermediate values. When you don’t want
to use a method to fill these values, e.g. ``fill_method`` is ``None``, then
intermediate values will be filled with ``NaN``.

Since ``resample`` is a time-based groupby, the following is a method to efficiently
resample only the groups that are not all ``NaN``.

``` python
In [302]: rng = pd.date_range('2014-1-1', periods=100, freq='D') + pd.Timedelta('1s')

In [303]: ts = pd.Series(range(100), index=rng)
```

If we want to resample to the full range of the series:

``` python
In [304]: ts.resample('3T').sum()
Out[304]: 
2014-01-01 00:00:00     0
2014-01-01 00:03:00     0
2014-01-01 00:06:00     0
2014-01-01 00:09:00     0
2014-01-01 00:12:00     0
                       ..
2014-04-09 23:48:00     0
2014-04-09 23:51:00     0
2014-04-09 23:54:00     0
2014-04-09 23:57:00     0
2014-04-10 00:00:00    99
Freq: 3T, Length: 47521, dtype: int64
```

We can instead only resample those groups where we have points as follows:

``` python
In [305]: from functools import partial

In [306]: from pandas.tseries.frequencies import to_offset

In [307]: def round(t, freq):
   .....:     freq = to_offset(freq)
   .....:     return pd.Timestamp((t.value // freq.delta.value) * freq.delta.value)
   .....: 

In [308]: ts.groupby(partial(round, freq='3T')).sum()
Out[308]: 
2014-01-01     0
2014-01-02     1
2014-01-03     2
2014-01-04     3
2014-01-05     4
              ..
2014-04-06    95
2014-04-07    96
2014-04-08    97
2014-04-09    98
2014-04-10    99
Length: 100, dtype: int64
```

### Aggregation

Similar to the [aggregating API](https://pandas.pydata.org/pandas-docs/stable/getting_started/basics.html#basics-aggregate), [groupby API](groupby.html#groupby-aggregate), and the [window functions API](computation.html#stats-aggregate),
a ``Resampler`` can be selectively resampled.

Resampling a ``DataFrame``, the default will be to act on all columns with the same function.

``` python
In [309]: df = pd.DataFrame(np.random.randn(1000, 3),
   .....:                   index=pd.date_range('1/1/2012', freq='S', periods=1000),
   .....:                   columns=['A', 'B', 'C'])
   .....: 

In [310]: r = df.resample('3T')

In [311]: r.mean()
Out[311]: 
                            A         B         C
2012-01-01 00:00:00 -0.033823 -0.121514 -0.081447
2012-01-01 00:03:00  0.056909  0.146731 -0.024320
2012-01-01 00:06:00 -0.058837  0.047046 -0.052021
2012-01-01 00:09:00  0.063123 -0.026158 -0.066533
2012-01-01 00:12:00  0.186340 -0.003144  0.074752
2012-01-01 00:15:00 -0.085954 -0.016287 -0.050046
```

We can select a specific column or columns using standard getitem.

``` python
In [312]: r['A'].mean()
Out[312]: 
2012-01-01 00:00:00   -0.033823
2012-01-01 00:03:00    0.056909
2012-01-01 00:06:00   -0.058837
2012-01-01 00:09:00    0.063123
2012-01-01 00:12:00    0.186340
2012-01-01 00:15:00   -0.085954
Freq: 3T, Name: A, dtype: float64

In [313]: r[['A', 'B']].mean()
Out[313]: 
                            A         B
2012-01-01 00:00:00 -0.033823 -0.121514
2012-01-01 00:03:00  0.056909  0.146731
2012-01-01 00:06:00 -0.058837  0.047046
2012-01-01 00:09:00  0.063123 -0.026158
2012-01-01 00:12:00  0.186340 -0.003144
2012-01-01 00:15:00 -0.085954 -0.016287
```

You can pass a list or dict of functions to do aggregation with, outputting a ``DataFrame``:

``` python
In [314]: r['A'].agg([np.sum, np.mean, np.std])
Out[314]: 
                           sum      mean       std
2012-01-01 00:00:00  -6.088060 -0.033823  1.043263
2012-01-01 00:03:00  10.243678  0.056909  1.058534
2012-01-01 00:06:00 -10.590584 -0.058837  0.949264
2012-01-01 00:09:00  11.362228  0.063123  1.028096
2012-01-01 00:12:00  33.541257  0.186340  0.884586
2012-01-01 00:15:00  -8.595393 -0.085954  1.035476
```

On a resampled ``DataFrame``, you can pass a list of functions to apply to each
column, which produces an aggregated result with a hierarchical index:

``` python
In [315]: r.agg([np.sum, np.mean])
Out[315]: 
                             A                    B                    C          
                           sum      mean        sum      mean        sum      mean
2012-01-01 00:00:00  -6.088060 -0.033823 -21.872530 -0.121514 -14.660515 -0.081447
2012-01-01 00:03:00  10.243678  0.056909  26.411633  0.146731  -4.377642 -0.024320
2012-01-01 00:06:00 -10.590584 -0.058837   8.468289  0.047046  -9.363825 -0.052021
2012-01-01 00:09:00  11.362228  0.063123  -4.708526 -0.026158 -11.975895 -0.066533
2012-01-01 00:12:00  33.541257  0.186340  -0.565895 -0.003144  13.455299  0.074752
2012-01-01 00:15:00  -8.595393 -0.085954  -1.628689 -0.016287  -5.004580 -0.050046
```

By passing a dict to ``aggregate`` you can apply a different aggregation to the
columns of a ``DataFrame``:

``` python
In [316]: r.agg({'A': np.sum,
   .....:        'B': lambda x: np.std(x, ddof=1)})
   .....: 
Out[316]: 
                             A         B
2012-01-01 00:00:00  -6.088060  1.001294
2012-01-01 00:03:00  10.243678  1.074597
2012-01-01 00:06:00 -10.590584  0.987309
2012-01-01 00:09:00  11.362228  0.944953
2012-01-01 00:12:00  33.541257  1.095025
2012-01-01 00:15:00  -8.595393  1.035312
```

The function names can also be strings. In order for a string to be valid it
must be implemented on the resampled object:

``` python
In [317]: r.agg({'A': 'sum', 'B': 'std'})
Out[317]: 
                             A         B
2012-01-01 00:00:00  -6.088060  1.001294
2012-01-01 00:03:00  10.243678  1.074597
2012-01-01 00:06:00 -10.590584  0.987309
2012-01-01 00:09:00  11.362228  0.944953
2012-01-01 00:12:00  33.541257  1.095025
2012-01-01 00:15:00  -8.595393  1.035312
```

Furthermore, you can also specify multiple aggregation functions for each column separately.

``` python
In [318]: r.agg({'A': ['sum', 'std'], 'B': ['mean', 'std']})
Out[318]: 
                             A                   B          
                           sum       std      mean       std
2012-01-01 00:00:00  -6.088060  1.043263 -0.121514  1.001294
2012-01-01 00:03:00  10.243678  1.058534  0.146731  1.074597
2012-01-01 00:06:00 -10.590584  0.949264  0.047046  0.987309
2012-01-01 00:09:00  11.362228  1.028096 -0.026158  0.944953
2012-01-01 00:12:00  33.541257  0.884586 -0.003144  1.095025
2012-01-01 00:15:00  -8.595393  1.035476 -0.016287  1.035312
```

If a ``DataFrame`` does not have a datetimelike index, but instead you want
to resample based on datetimelike column in the frame, it can passed to the
``on`` keyword.

``` python
In [319]: df = pd.DataFrame({'date': pd.date_range('2015-01-01', freq='W', periods=5),
   .....:                    'a': np.arange(5)},
   .....:                   index=pd.MultiIndex.from_arrays([
   .....:                       [1, 2, 3, 4, 5],
   .....:                       pd.date_range('2015-01-01', freq='W', periods=5)],
   .....:                       names=['v', 'd']))
   .....: 

In [320]: df
Out[320]: 
                   date  a
v d                       
1 2015-01-04 2015-01-04  0
2 2015-01-11 2015-01-11  1
3 2015-01-18 2015-01-18  2
4 2015-01-25 2015-01-25  3
5 2015-02-01 2015-02-01  4

In [321]: df.resample('M', on='date').sum()
Out[321]: 
            a
date         
2015-01-31  6
2015-02-28  4
```

Similarly, if you instead want to resample by a datetimelike
level of ``MultiIndex``, its name or location can be passed to the
``level`` keyword.

``` python
In [322]: df.resample('M', level='d').sum()
Out[322]: 
            a
d            
2015-01-31  6
2015-02-28  4
```

### Iterating through groups

With the ``Resampler`` object in hand, iterating through the grouped data is very
natural and functions similarly to [``itertools.groupby()``](https://docs.python.org/3/library/itertools.html#itertools.groupby):

``` python
In [323]: small = pd.Series(
   .....:     range(6),
   .....:     index=pd.to_datetime(['2017-01-01T00:00:00',
   .....:                           '2017-01-01T00:30:00',
   .....:                           '2017-01-01T00:31:00',
   .....:                           '2017-01-01T01:00:00',
   .....:                           '2017-01-01T03:00:00',
   .....:                           '2017-01-01T03:05:00'])
   .....: )
   .....: 

In [324]: resampled = small.resample('H')

In [325]: for name, group in resampled:
   .....:     print("Group: ", name)
   .....:     print("-" * 27)
   .....:     print(group, end="\n\n")
   .....: 
Group:  2017-01-01 00:00:00
---------------------------
2017-01-01 00:00:00    0
2017-01-01 00:30:00    1
2017-01-01 00:31:00    2
dtype: int64

Group:  2017-01-01 01:00:00
---------------------------
2017-01-01 01:00:00    3
dtype: int64

Group:  2017-01-01 02:00:00
---------------------------
Series([], dtype: int64)

Group:  2017-01-01 03:00:00
---------------------------
2017-01-01 03:00:00    4
2017-01-01 03:05:00    5
dtype: int64
```

See [Iterating through groups](groupby.html#groupby-iterating-label) or ``Resampler.__iter__`` for more.

## Time span representation

Regular intervals of time are represented by ``Period`` objects in pandas while
sequences of ``Period`` objects are collected in a ``PeriodIndex``, which can
be created with the convenience function ``period_range``.

### Period

A ``Period`` represents a span of time (e.g., a day, a month, a quarter, etc).
You can specify the span via ``freq`` keyword using a frequency alias like below.
Because ``freq`` represents a span of ``Period``, it cannot be negative like “-3D”.

``` python
In [326]: pd.Period('2012', freq='A-DEC')
Out[326]: Period('2012', 'A-DEC')

In [327]: pd.Period('2012-1-1', freq='D')
Out[327]: Period('2012-01-01', 'D')

In [328]: pd.Period('2012-1-1 19:00', freq='H')
Out[328]: Period('2012-01-01 19:00', 'H')

In [329]: pd.Period('2012-1-1 19:00', freq='5H')
Out[329]: Period('2012-01-01 19:00', '5H')
```

Adding and subtracting integers from periods shifts the period by its own
frequency. Arithmetic is not allowed between ``Period`` with different ``freq`` (span).

``` python
In [330]: p = pd.Period('2012', freq='A-DEC')

In [331]: p + 1
Out[331]: Period('2013', 'A-DEC')

In [332]: p - 3
Out[332]: Period('2009', 'A-DEC')

In [333]: p = pd.Period('2012-01', freq='2M')

In [334]: p + 2
Out[334]: Period('2012-05', '2M')

In [335]: p - 1
Out[335]: Period('2011-11', '2M')

In [336]: p == pd.Period('2012-01', freq='3M')
---------------------------------------------------------------------------
IncompatibleFrequency                     Traceback (most recent call last)
<ipython-input-336-4b67dc0b596c> in <module>
----> 1 p == pd.Period('2012-01', freq='3M')

/pandas/pandas/_libs/tslibs/period.pyx in pandas._libs.tslibs.period._Period.__richcmp__()

IncompatibleFrequency: Input has different freq=3M from Period(freq=2M)
```

If ``Period`` freq is daily or higher (``D``, ``H``, ``T``, ``S``, ``L``, ``U``, ``N``), ``offsets`` and ``timedelta``-like can be added if the result can have the same freq. Otherwise, ``ValueError`` will be raised.

``` python
In [337]: p = pd.Period('2014-07-01 09:00', freq='H')

In [338]: p + pd.offsets.Hour(2)
Out[338]: Period('2014-07-01 11:00', 'H')

In [339]: p + datetime.timedelta(minutes=120)
Out[339]: Period('2014-07-01 11:00', 'H')

In [340]: p + np.timedelta64(7200, 's')
Out[340]: Period('2014-07-01 11:00', 'H')
```

``` python
In [1]: p + pd.offsets.Minute(5)
Traceback
   ...
ValueError: Input has different freq from Period(freq=H)
```

If ``Period`` has other frequencies, only the same ``offsets`` can be added. Otherwise, ``ValueError`` will be raised.

``` python
In [341]: p = pd.Period('2014-07', freq='M')

In [342]: p + pd.offsets.MonthEnd(3)
Out[342]: Period('2014-10', 'M')
```

``` python
In [1]: p + pd.offsets.MonthBegin(3)
Traceback
   ...
ValueError: Input has different freq from Period(freq=M)
```

Taking the difference of ``Period`` instances with the same frequency will
return the number of frequency units between them:

``` python
In [343]: pd.Period('2012', freq='A-DEC') - pd.Period('2002', freq='A-DEC')
Out[343]: <10 * YearEnds: month=12>
```

### PeriodIndex and period_range

Regular sequences of ``Period`` objects can be collected in a ``PeriodIndex``,
which can be constructed using the ``period_range`` convenience function:

``` python
In [344]: prng = pd.period_range('1/1/2011', '1/1/2012', freq='M')

In [345]: prng
Out[345]: 
PeriodIndex(['2011-01', '2011-02', '2011-03', '2011-04', '2011-05', '2011-06',
             '2011-07', '2011-08', '2011-09', '2011-10', '2011-11', '2011-12',
             '2012-01'],
            dtype='period[M]', freq='M')
```

The ``PeriodIndex`` constructor can also be used directly:

``` python
In [346]: pd.PeriodIndex(['2011-1', '2011-2', '2011-3'], freq='M')
Out[346]: PeriodIndex(['2011-01', '2011-02', '2011-03'], dtype='period[M]', freq='M')
```

Passing multiplied frequency outputs a sequence of ``Period`` which
has multiplied span.

``` python
In [347]: pd.period_range(start='2014-01', freq='3M', periods=4)
Out[347]: PeriodIndex(['2014-01', '2014-04', '2014-07', '2014-10'], dtype='period[3M]', freq='3M')
```

If ``start`` or ``end`` are ``Period`` objects, they will be used as anchor
endpoints for a ``PeriodIndex`` with frequency matching that of the
``PeriodIndex`` constructor.

``` python
In [348]: pd.period_range(start=pd.Period('2017Q1', freq='Q'),
   .....:                 end=pd.Period('2017Q2', freq='Q'), freq='M')
   .....: 
Out[348]: PeriodIndex(['2017-03', '2017-04', '2017-05', '2017-06'], dtype='period[M]', freq='M')
```

Just like ``DatetimeIndex``, a ``PeriodIndex`` can also be used to index pandas
objects:

``` python
In [349]: ps = pd.Series(np.random.randn(len(prng)), prng)

In [350]: ps
Out[350]: 
2011-01   -2.916901
2011-02    0.514474
2011-03    1.346470
2011-04    0.816397
2011-05    2.258648
2011-06    0.494789
2011-07    0.301239
2011-08    0.464776
2011-09   -1.393581
2011-10    0.056780
2011-11    0.197035
2011-12    2.261385
2012-01   -0.329583
Freq: M, dtype: float64
```

``PeriodIndex`` supports addition and subtraction with the same rule as ``Period``.

``` python
In [351]: idx = pd.period_range('2014-07-01 09:00', periods=5, freq='H')

In [352]: idx
Out[352]: 
PeriodIndex(['2014-07-01 09:00', '2014-07-01 10:00', '2014-07-01 11:00',
             '2014-07-01 12:00', '2014-07-01 13:00'],
            dtype='period[H]', freq='H')

In [353]: idx + pd.offsets.Hour(2)
Out[353]: 
PeriodIndex(['2014-07-01 11:00', '2014-07-01 12:00', '2014-07-01 13:00',
             '2014-07-01 14:00', '2014-07-01 15:00'],
            dtype='period[H]', freq='H')

In [354]: idx = pd.period_range('2014-07', periods=5, freq='M')

In [355]: idx
Out[355]: PeriodIndex(['2014-07', '2014-08', '2014-09', '2014-10', '2014-11'], dtype='period[M]', freq='M')

In [356]: idx + pd.offsets.MonthEnd(3)
Out[356]: PeriodIndex(['2014-10', '2014-11', '2014-12', '2015-01', '2015-02'], dtype='period[M]', freq='M')
```

``PeriodIndex`` has its own dtype named ``period``, refer to [Period Dtypes](#timeseries-period-dtype).

### Period dtypes

*New in version 0.19.0.* 

``PeriodIndex`` has a custom ``period`` dtype. This is a pandas extension
dtype similar to the [timezone aware dtype](#timeseries-timezone-series) (``datetime64[ns, tz]``).

The ``period`` dtype holds the ``freq`` attribute and is represented with
``period[freq]`` like ``period[D]`` or ``period[M]``, using [frequency strings](#timeseries-offset-aliases).

``` python
In [357]: pi = pd.period_range('2016-01-01', periods=3, freq='M')

In [358]: pi
Out[358]: PeriodIndex(['2016-01', '2016-02', '2016-03'], dtype='period[M]', freq='M')

In [359]: pi.dtype
Out[359]: period[M]
```

The ``period`` dtype can be used in ``.astype(...)``. It allows one to change the
``freq`` of a ``PeriodIndex`` like ``.asfreq()`` and convert a
``DatetimeIndex`` to ``PeriodIndex`` like ``to_period()``:

``` python
# change monthly freq to daily freq
In [360]: pi.astype('period[D]')
Out[360]: PeriodIndex(['2016-01-31', '2016-02-29', '2016-03-31'], dtype='period[D]', freq='D')

# convert to DatetimeIndex
In [361]: pi.astype('datetime64[ns]')
Out[361]: DatetimeIndex(['2016-01-01', '2016-02-01', '2016-03-01'], dtype='datetime64[ns]', freq='MS')

# convert to PeriodIndex
In [362]: dti = pd.date_range('2011-01-01', freq='M', periods=3)

In [363]: dti
Out[363]: DatetimeIndex(['2011-01-31', '2011-02-28', '2011-03-31'], dtype='datetime64[ns]', freq='M')

In [364]: dti.astype('period[M]')
Out[364]: PeriodIndex(['2011-01', '2011-02', '2011-03'], dtype='period[M]', freq='M')
```

### PeriodIndex partial string indexing

You can pass in dates and strings to ``Series`` and ``DataFrame`` with ``PeriodIndex``, in the same manner as ``DatetimeIndex``. For details, refer to [DatetimeIndex Partial String Indexing](#timeseries-partialindexing).

``` python
In [365]: ps['2011-01']
Out[365]: -2.9169013294054507

In [366]: ps[datetime.datetime(2011, 12, 25):]
Out[366]: 
2011-12    2.261385
2012-01   -0.329583
Freq: M, dtype: float64

In [367]: ps['10/31/2011':'12/31/2011']
Out[367]: 
2011-10    0.056780
2011-11    0.197035
2011-12    2.261385
Freq: M, dtype: float64
```

Passing a string representing a lower frequency than ``PeriodIndex`` returns partial sliced data.

``` python
In [368]: ps['2011']
Out[368]: 
2011-01   -2.916901
2011-02    0.514474
2011-03    1.346470
2011-04    0.816397
2011-05    2.258648
2011-06    0.494789
2011-07    0.301239
2011-08    0.464776
2011-09   -1.393581
2011-10    0.056780
2011-11    0.197035
2011-12    2.261385
Freq: M, dtype: float64

In [369]: dfp = pd.DataFrame(np.random.randn(600, 1),
   .....:                    columns=['A'],
   .....:                    index=pd.period_range('2013-01-01 9:00',
   .....:                                          periods=600,
   .....:                                          freq='T'))
   .....: 

In [370]: dfp
Out[370]: 
                         A
2013-01-01 09:00 -0.538468
2013-01-01 09:01 -1.365819
2013-01-01 09:02 -0.969051
2013-01-01 09:03 -0.331152
2013-01-01 09:04 -0.245334
...                    ...
2013-01-01 18:55  0.522460
2013-01-01 18:56  0.118710
2013-01-01 18:57  0.167517
2013-01-01 18:58  0.922883
2013-01-01 18:59  1.721104

[600 rows x 1 columns]

In [371]: dfp['2013-01-01 10H']
Out[371]: 
                         A
2013-01-01 10:00 -0.308975
2013-01-01 10:01  0.542520
2013-01-01 10:02  1.061068
2013-01-01 10:03  0.754005
2013-01-01 10:04  0.352933
...                    ...
2013-01-01 10:55 -0.865621
2013-01-01 10:56 -1.167818
2013-01-01 10:57 -2.081748
2013-01-01 10:58 -0.527146
2013-01-01 10:59  0.802298

[60 rows x 1 columns]
```

As with ``DatetimeIndex``, the endpoints will be included in the result. The example below slices data starting from 10:00 to 11:59.

``` python
In [372]: dfp['2013-01-01 10H':'2013-01-01 11H']
Out[372]: 
                         A
2013-01-01 10:00 -0.308975
2013-01-01 10:01  0.542520
2013-01-01 10:02  1.061068
2013-01-01 10:03  0.754005
2013-01-01 10:04  0.352933
...                    ...
2013-01-01 11:55 -0.590204
2013-01-01 11:56  1.539990
2013-01-01 11:57 -1.224826
2013-01-01 11:58  0.578798
2013-01-01 11:59 -0.685496

[120 rows x 1 columns]
```

### Frequency conversion and resampling with PeriodIndex

The frequency of ``Period`` and ``PeriodIndex`` can be converted via the ``asfreq``
method. Let’s start with the fiscal year 2011, ending in December:

``` python
In [373]: p = pd.Period('2011', freq='A-DEC')

In [374]: p
Out[374]: Period('2011', 'A-DEC')
```

We can convert it to a monthly frequency. Using the ``how`` parameter, we can
specify whether to return the starting or ending month:

``` python
In [375]: p.asfreq('M', how='start')
Out[375]: Period('2011-01', 'M')

In [376]: p.asfreq('M', how='end')
Out[376]: Period('2011-12', 'M')
```

The shorthands ‘s’ and ‘e’ are provided for convenience:

``` python
In [377]: p.asfreq('M', 's')
Out[377]: Period('2011-01', 'M')

In [378]: p.asfreq('M', 'e')
Out[378]: Period('2011-12', 'M')
```

Converting to a “super-period” (e.g., annual frequency is a super-period of
quarterly frequency) automatically returns the super-period that includes the
input period:

``` python
In [379]: p = pd.Period('2011-12', freq='M')

In [380]: p.asfreq('A-NOV')
Out[380]: Period('2012', 'A-NOV')
```

Note that since we converted to an annual frequency that ends the year in
November, the monthly period of December 2011 is actually in the 2012 A-NOV
period.

Period conversions with anchored frequencies are particularly useful for
working with various quarterly data common to economics, business, and other
fields. Many organizations define quarters relative to the month in which their
fiscal year starts and ends. Thus, first quarter of 2011 could start in 2010 or
a few months into 2011. Via anchored frequencies, pandas works for all quarterly
frequencies ``Q-JAN`` through ``Q-DEC``.

``Q-DEC`` define regular calendar quarters:

``` python
In [381]: p = pd.Period('2012Q1', freq='Q-DEC')

In [382]: p.asfreq('D', 's')
Out[382]: Period('2012-01-01', 'D')

In [383]: p.asfreq('D', 'e')
Out[383]: Period('2012-03-31', 'D')
```

``Q-MAR`` defines fiscal year end in March:

``` python
In [384]: p = pd.Period('2011Q4', freq='Q-MAR')

In [385]: p.asfreq('D', 's')
Out[385]: Period('2011-01-01', 'D')

In [386]: p.asfreq('D', 'e')
Out[386]: Period('2011-03-31', 'D')
```

## Converting between representations

Timestamped data can be converted to PeriodIndex-ed data using ``to_period``
and vice-versa using ``to_timestamp``:

``` python
In [387]: rng = pd.date_range('1/1/2012', periods=5, freq='M')

In [388]: ts = pd.Series(np.random.randn(len(rng)), index=rng)

In [389]: ts
Out[389]: 
2012-01-31    1.931253
2012-02-29   -0.184594
2012-03-31    0.249656
2012-04-30   -0.978151
2012-05-31   -0.873389
Freq: M, dtype: float64

In [390]: ps = ts.to_period()

In [391]: ps
Out[391]: 
2012-01    1.931253
2012-02   -0.184594
2012-03    0.249656
2012-04   -0.978151
2012-05   -0.873389
Freq: M, dtype: float64

In [392]: ps.to_timestamp()
Out[392]: 
2012-01-01    1.931253
2012-02-01   -0.184594
2012-03-01    0.249656
2012-04-01   -0.978151
2012-05-01   -0.873389
Freq: MS, dtype: float64
```

Remember that ‘s’ and ‘e’ can be used to return the timestamps at the start or
end of the period:

``` python
In [393]: ps.to_timestamp('D', how='s')
Out[393]: 
2012-01-01    1.931253
2012-02-01   -0.184594
2012-03-01    0.249656
2012-04-01   -0.978151
2012-05-01   -0.873389
Freq: MS, dtype: float64
```

Converting between period and timestamp enables some convenient arithmetic
functions to be used. In the following example, we convert a quarterly
frequency with year ending in November to 9am of the end of the month following
the quarter end:

``` python
In [394]: prng = pd.period_range('1990Q1', '2000Q4', freq='Q-NOV')

In [395]: ts = pd.Series(np.random.randn(len(prng)), prng)

In [396]: ts.index = (prng.asfreq('M', 'e') + 1).asfreq('H', 's') + 9

In [397]: ts.head()
Out[397]: 
1990-03-01 09:00   -0.109291
1990-06-01 09:00   -0.637235
1990-09-01 09:00   -1.735925
1990-12-01 09:00    2.096946
1991-03-01 09:00   -1.039926
Freq: H, dtype: float64
```

## Representing out-of-bounds spans

If you have data that is outside of the ``Timestamp`` bounds, see [Timestamp limitations](#timeseries-timestamp-limits),
then you can use a ``PeriodIndex`` and/or ``Series`` of ``Periods`` to do computations.

``` python
In [398]: span = pd.period_range('1215-01-01', '1381-01-01', freq='D')

In [399]: span
Out[399]: 
PeriodIndex(['1215-01-01', '1215-01-02', '1215-01-03', '1215-01-04',
             '1215-01-05', '1215-01-06', '1215-01-07', '1215-01-08',
             '1215-01-09', '1215-01-10',
             ...
             '1380-12-23', '1380-12-24', '1380-12-25', '1380-12-26',
             '1380-12-27', '1380-12-28', '1380-12-29', '1380-12-30',
             '1380-12-31', '1381-01-01'],
            dtype='period[D]', length=60632, freq='D')
```

To convert from an ``int64`` based YYYYMMDD representation.

``` python
In [400]: s = pd.Series([20121231, 20141130, 99991231])

In [401]: s
Out[401]: 
0    20121231
1    20141130
2    99991231
dtype: int64

In [402]: def conv(x):
   .....:     return pd.Period(year=x // 10000, month=x // 100 % 100,
   .....:                      day=x % 100, freq='D')
   .....: 

In [403]: s.apply(conv)
Out[403]: 
0    2012-12-31
1    2014-11-30
2    9999-12-31
dtype: period[D]

In [404]: s.apply(conv)[2]
Out[404]: Period('9999-12-31', 'D')
```

These can easily be converted to a ``PeriodIndex``:

``` python
In [405]: span = pd.PeriodIndex(s.apply(conv))

In [406]: span
Out[406]: PeriodIndex(['2012-12-31', '2014-11-30', '9999-12-31'], dtype='period[D]', freq='D')
```

## Time zone handling

pandas provides rich support for working with timestamps in different time
zones using the ``pytz`` and ``dateutil`` libraries or class:*datetime.timezone*
objects from the standard library.

### Working with time zones

By default, pandas objects are time zone unaware:

``` python
In [407]: rng = pd.date_range('3/6/2012 00:00', periods=15, freq='D')

In [408]: rng.tz is None
Out[408]: True
```

To localize these dates to a time zone (assign a particular time zone to a naive date),
you can use the ``tz_localize`` method or the ``tz`` keyword argument in
[``date_range()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.date_range.html#pandas.date_range), [``Timestamp``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Timestamp.html#pandas.Timestamp), or [``DatetimeIndex``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DatetimeIndex.html#pandas.DatetimeIndex).
You can either pass ``pytz`` or ``dateutil`` time zone objects or Olson time zone database strings.
Olson time zone strings will return ``pytz`` time zone objects by default.
To return ``dateutil`` time zone objects, append ``dateutil/`` before the string.

- In ``pytz`` you can find a list of common (and less common) time zones using
``from pytz import common_timezones, all_timezones``.
- ``dateutil`` uses the OS time zones so there isn’t a fixed list available. For
common zones, the names are the same as ``pytz``.

``` python
In [409]: import dateutil

# pytz
In [410]: rng_pytz = pd.date_range('3/6/2012 00:00', periods=3, freq='D',
   .....:                          tz='Europe/London')
   .....: 

In [411]: rng_pytz.tz
Out[411]: <DstTzInfo 'Europe/London' LMT-1 day, 23:59:00 STD>

# dateutil
In [412]: rng_dateutil = pd.date_range('3/6/2012 00:00', periods=3, freq='D')

In [413]: rng_dateutil = rng_dateutil.tz_localize('dateutil/Europe/London')

In [414]: rng_dateutil.tz
Out[414]: tzfile('/usr/share/zoneinfo/Europe/London')

# dateutil - utc special case
In [415]: rng_utc = pd.date_range('3/6/2012 00:00', periods=3, freq='D',
   .....:                         tz=dateutil.tz.tzutc())
   .....: 

In [416]: rng_utc.tz
Out[416]: tzutc()
```

*New in version 0.25.0.* 

``` python
# datetime.timezone
In [417]: rng_utc = pd.date_range('3/6/2012 00:00', periods=3, freq='D',
   .....:                         tz=datetime.timezone.utc)
   .....: 

In [418]: rng_utc.tz
Out[418]: datetime.timezone.utc
```

Note that the ``UTC`` time zone is a special case in ``dateutil`` and should be constructed explicitly
as an instance of ``dateutil.tz.tzutc``. You can also construct other time
zones objects explicitly first.

``` python
In [419]: import pytz

# pytz
In [420]: tz_pytz = pytz.timezone('Europe/London')

In [421]: rng_pytz = pd.date_range('3/6/2012 00:00', periods=3, freq='D')

In [422]: rng_pytz = rng_pytz.tz_localize(tz_pytz)

In [423]: rng_pytz.tz == tz_pytz
Out[423]: True

# dateutil
In [424]: tz_dateutil = dateutil.tz.gettz('Europe/London')

In [425]: rng_dateutil = pd.date_range('3/6/2012 00:00', periods=3, freq='D',
   .....:                              tz=tz_dateutil)
   .....: 

In [426]: rng_dateutil.tz == tz_dateutil
Out[426]: True
```

To convert a time zone aware pandas object from one time zone to another,
you can use the ``tz_convert`` method.

``` python
In [427]: rng_pytz.tz_convert('US/Eastern')
Out[427]: 
DatetimeIndex(['2012-03-05 19:00:00-05:00', '2012-03-06 19:00:00-05:00',
               '2012-03-07 19:00:00-05:00'],
              dtype='datetime64[ns, US/Eastern]', freq='D')
```

::: tip Note

When using ``pytz`` time zones, [``DatetimeIndex``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DatetimeIndex.html#pandas.DatetimeIndex) will construct a different
time zone object than a [``Timestamp``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Timestamp.html#pandas.Timestamp) for the same time zone input. A [``DatetimeIndex``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DatetimeIndex.html#pandas.DatetimeIndex)
can hold a collection of [``Timestamp``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Timestamp.html#pandas.Timestamp) objects that may have different UTC offsets and cannot be
succinctly represented by one ``pytz`` time zone instance while one [``Timestamp``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Timestamp.html#pandas.Timestamp)
represents one point in time with a specific UTC offset.

``` python
In [428]: dti = pd.date_range('2019-01-01', periods=3, freq='D', tz='US/Pacific')

In [429]: dti.tz
Out[429]: <DstTzInfo 'US/Pacific' LMT-1 day, 16:07:00 STD>

In [430]: ts = pd.Timestamp('2019-01-01', tz='US/Pacific')

In [431]: ts.tz
Out[431]: <DstTzInfo 'US/Pacific' PST-1 day, 16:00:00 STD>
```

:::

::: danger Warning

Be wary of conversions between libraries. For some time zones, ``pytz`` and ``dateutil`` have different
definitions of the zone. This is more of a problem for unusual time zones than for
‘standard’ zones like ``US/Eastern``.

:::

::: danger Warning

Be aware that a time zone definition across versions of time zone libraries may not
be considered equal.  This may cause problems when working with stored data that
is localized using one version and operated on with a different version.
See [here](io.html#io-hdf5-notes) for how to handle such a situation.

:::

::: danger Warning

For ``pytz`` time zones, it is incorrect to pass a time zone object directly into
the ``datetime.datetime`` constructor
(e.g., ``datetime.datetime(2011, 1, 1, tz=pytz.timezone('US/Eastern'))``.
Instead, the datetime needs to be localized using the ``localize`` method
on the ``pytz`` time zone object.

:::

Under the hood, all timestamps are stored in UTC. Values from a time zone aware
[``DatetimeIndex``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DatetimeIndex.html#pandas.DatetimeIndex) or [``Timestamp``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Timestamp.html#pandas.Timestamp) will have their fields (day, hour, minute, etc.)
localized to the time zone. However, timestamps with the same UTC value are
still considered to be equal even if they are in different time zones:

``` python
In [432]: rng_eastern = rng_utc.tz_convert('US/Eastern')

In [433]: rng_berlin = rng_utc.tz_convert('Europe/Berlin')

In [434]: rng_eastern[2]
Out[434]: Timestamp('2012-03-07 19:00:00-0500', tz='US/Eastern', freq='D')

In [435]: rng_berlin[2]
Out[435]: Timestamp('2012-03-08 01:00:00+0100', tz='Europe/Berlin', freq='D')

In [436]: rng_eastern[2] == rng_berlin[2]
Out[436]: True
```

Operations between [``Series``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.html#pandas.Series) in different time zones will yield UTC
[``Series``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.html#pandas.Series), aligning the data on the UTC timestamps:

``` python
In [437]: ts_utc = pd.Series(range(3), pd.date_range('20130101', periods=3, tz='UTC'))

In [438]: eastern = ts_utc.tz_convert('US/Eastern')

In [439]: berlin = ts_utc.tz_convert('Europe/Berlin')

In [440]: result = eastern + berlin

In [441]: result
Out[441]: 
2013-01-01 00:00:00+00:00    0
2013-01-02 00:00:00+00:00    2
2013-01-03 00:00:00+00:00    4
Freq: D, dtype: int64

In [442]: result.index
Out[442]: 
DatetimeIndex(['2013-01-01 00:00:00+00:00', '2013-01-02 00:00:00+00:00',
               '2013-01-03 00:00:00+00:00'],
              dtype='datetime64[ns, UTC]', freq='D')
```

To remove time zone information, use ``tz_localize(None)`` or ``tz_convert(None)``.
``tz_localize(None)`` will remove the time zone yielding the local time representation.
``tz_convert(None)`` will remove the time zone after converting to UTC time.

``` python
In [443]: didx = pd.date_range(start='2014-08-01 09:00', freq='H',
   .....:                      periods=3, tz='US/Eastern')
   .....: 

In [444]: didx
Out[444]: 
DatetimeIndex(['2014-08-01 09:00:00-04:00', '2014-08-01 10:00:00-04:00',
               '2014-08-01 11:00:00-04:00'],
              dtype='datetime64[ns, US/Eastern]', freq='H')

In [445]: didx.tz_localize(None)
Out[445]: 
DatetimeIndex(['2014-08-01 09:00:00', '2014-08-01 10:00:00',
               '2014-08-01 11:00:00'],
              dtype='datetime64[ns]', freq='H')

In [446]: didx.tz_convert(None)
Out[446]: 
DatetimeIndex(['2014-08-01 13:00:00', '2014-08-01 14:00:00',
               '2014-08-01 15:00:00'],
              dtype='datetime64[ns]', freq='H')

# tz_convert(None) is identical to tz_convert('UTC').tz_localize(None)
In [447]: didx.tz_convert('UTC').tz_localize(None)
Out[447]: 
DatetimeIndex(['2014-08-01 13:00:00', '2014-08-01 14:00:00',
               '2014-08-01 15:00:00'],
              dtype='datetime64[ns]', freq='H')
```

### Ambiguous times when localizing

``tz_localize`` may not be able to determine the UTC offset of a timestamp
because daylight savings time (DST) in a local time zone causes some times to occur
twice within one day (“clocks fall back”). The following options are available:

- ``'raise'``: Raises a ``pytz.AmbiguousTimeError`` (the default behavior)
- ``'infer'``: Attempt to determine the correct offset base on the monotonicity of the timestamps
- ``'NaT'``: Replaces ambiguous times with ``NaT``
- ``bool``: ``True`` represents a DST time, ``False`` represents non-DST time. An array-like of ``bool`` values is supported for a sequence of times.

``` python
In [448]: rng_hourly = pd.DatetimeIndex(['11/06/2011 00:00', '11/06/2011 01:00',
   .....:                                '11/06/2011 01:00', '11/06/2011 02:00'])
   .....:
```

This will fail as there are ambiguous times (``'11/06/2011 01:00'``)

``` python
In [2]: rng_hourly.tz_localize('US/Eastern')
AmbiguousTimeError: Cannot infer dst time from Timestamp('2011-11-06 01:00:00'), try using the 'ambiguous' argument
```

Handle these ambiguous times by specifying the following.

``` python
In [449]: rng_hourly.tz_localize('US/Eastern', ambiguous='infer')
Out[449]: 
DatetimeIndex(['2011-11-06 00:00:00-04:00', '2011-11-06 01:00:00-04:00',
               '2011-11-06 01:00:00-05:00', '2011-11-06 02:00:00-05:00'],
              dtype='datetime64[ns, US/Eastern]', freq=None)

In [450]: rng_hourly.tz_localize('US/Eastern', ambiguous='NaT')
Out[450]: 
DatetimeIndex(['2011-11-06 00:00:00-04:00', 'NaT', 'NaT',
               '2011-11-06 02:00:00-05:00'],
              dtype='datetime64[ns, US/Eastern]', freq=None)

In [451]: rng_hourly.tz_localize('US/Eastern', ambiguous=[True, True, False, False])
Out[451]: 
DatetimeIndex(['2011-11-06 00:00:00-04:00', '2011-11-06 01:00:00-04:00',
               '2011-11-06 01:00:00-05:00', '2011-11-06 02:00:00-05:00'],
              dtype='datetime64[ns, US/Eastern]', freq=None)
```

### Nonexistent times when localizing

A DST transition may also shift the local time ahead by 1 hour creating nonexistent
local times (“clocks spring forward”). The behavior of localizing a timeseries with nonexistent times
can be controlled by the ``nonexistent`` argument. The following options are available:

- ``'raise'``: Raises a ``pytz.NonExistentTimeError`` (the default behavior)
- ``'NaT'``: Replaces nonexistent times with ``NaT``
- ``'shift_forward'``: Shifts nonexistent times forward to the closest real time
- ``'shift_backward'``: Shifts nonexistent times backward to the closest real time
- timedelta object: Shifts nonexistent times by the timedelta duration

``` python
In [452]: dti = pd.date_range(start='2015-03-29 02:30:00', periods=3, freq='H')

# 2:30 is a nonexistent time
```

Localization of nonexistent times will raise an error by default.

``` python
In [2]: dti.tz_localize('Europe/Warsaw')
NonExistentTimeError: 2015-03-29 02:30:00
```

Transform nonexistent times to ``NaT`` or shift the times.

``` python
In [453]: dti
Out[453]: 
DatetimeIndex(['2015-03-29 02:30:00', '2015-03-29 03:30:00',
               '2015-03-29 04:30:00'],
              dtype='datetime64[ns]', freq='H')

In [454]: dti.tz_localize('Europe/Warsaw', nonexistent='shift_forward')
Out[454]: 
DatetimeIndex(['2015-03-29 03:00:00+02:00', '2015-03-29 03:30:00+02:00',
               '2015-03-29 04:30:00+02:00'],
              dtype='datetime64[ns, Europe/Warsaw]', freq='H')

In [455]: dti.tz_localize('Europe/Warsaw', nonexistent='shift_backward')
Out[455]: 
DatetimeIndex(['2015-03-29 01:59:59.999999999+01:00',
                         '2015-03-29 03:30:00+02:00',
                         '2015-03-29 04:30:00+02:00'],
              dtype='datetime64[ns, Europe/Warsaw]', freq='H')

In [456]: dti.tz_localize('Europe/Warsaw', nonexistent=pd.Timedelta(1, unit='H'))
Out[456]: 
DatetimeIndex(['2015-03-29 03:30:00+02:00', '2015-03-29 03:30:00+02:00',
               '2015-03-29 04:30:00+02:00'],
              dtype='datetime64[ns, Europe/Warsaw]', freq='H')

In [457]: dti.tz_localize('Europe/Warsaw', nonexistent='NaT')
Out[457]: 
DatetimeIndex(['NaT', '2015-03-29 03:30:00+02:00',
               '2015-03-29 04:30:00+02:00'],
              dtype='datetime64[ns, Europe/Warsaw]', freq='H')
```

### Time zone series operations

A [``Series``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.html#pandas.Series) with time zone **naive** values is
represented with a dtype of ``datetime64[ns]``.

``` python
In [458]: s_naive = pd.Series(pd.date_range('20130101', periods=3))

In [459]: s_naive
Out[459]: 
0   2013-01-01
1   2013-01-02
2   2013-01-03
dtype: datetime64[ns]
```

A [``Series``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.html#pandas.Series) with a time zone **aware** values is
represented with a dtype of ``datetime64[ns, tz]`` where ``tz`` is the time zone

``` python
In [460]: s_aware = pd.Series(pd.date_range('20130101', periods=3, tz='US/Eastern'))

In [461]: s_aware
Out[461]: 
0   2013-01-01 00:00:00-05:00
1   2013-01-02 00:00:00-05:00
2   2013-01-03 00:00:00-05:00
dtype: datetime64[ns, US/Eastern]
```

Both of these [``Series``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.html#pandas.Series) time zone information
can be manipulated via the ``.dt`` accessor, see [the dt accessor section](https://pandas.pydata.org/pandas-docs/stable/getting_started/basics.html#basics-dt-accessors).

For example, to localize and convert a naive stamp to time zone aware.

``` python
In [462]: s_naive.dt.tz_localize('UTC').dt.tz_convert('US/Eastern')
Out[462]: 
0   2012-12-31 19:00:00-05:00
1   2013-01-01 19:00:00-05:00
2   2013-01-02 19:00:00-05:00
dtype: datetime64[ns, US/Eastern]
```

Time zone information can also be manipulated using the ``astype`` method.
This method can localize and convert time zone naive timestamps or
convert time zone aware timestamps.

``` python
# localize and convert a naive time zone
In [463]: s_naive.astype('datetime64[ns, US/Eastern]')
Out[463]: 
0   2012-12-31 19:00:00-05:00
1   2013-01-01 19:00:00-05:00
2   2013-01-02 19:00:00-05:00
dtype: datetime64[ns, US/Eastern]

# make an aware tz naive
In [464]: s_aware.astype('datetime64[ns]')
Out[464]: 
0   2013-01-01 05:00:00
1   2013-01-02 05:00:00
2   2013-01-03 05:00:00
dtype: datetime64[ns]

# convert to a new time zone
In [465]: s_aware.astype('datetime64[ns, CET]')
Out[465]: 
0   2013-01-01 06:00:00+01:00
1   2013-01-02 06:00:00+01:00
2   2013-01-03 06:00:00+01:00
dtype: datetime64[ns, CET]
```

::: tip Note

Using [``Series.to_numpy()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.to_numpy.html#pandas.Series.to_numpy) on a ``Series``, returns a NumPy array of the data.
NumPy does not currently support time zones (even though it is *printing* in the local time zone!),
therefore an object array of Timestamps is returned for time zone aware data:

``` python
In [466]: s_naive.to_numpy()
Out[466]: 
array(['2013-01-01T00:00:00.000000000', '2013-01-02T00:00:00.000000000',
       '2013-01-03T00:00:00.000000000'], dtype='datetime64[ns]')

In [467]: s_aware.to_numpy()
Out[467]: 
array([Timestamp('2013-01-01 00:00:00-0500', tz='US/Eastern', freq='D'),
       Timestamp('2013-01-02 00:00:00-0500', tz='US/Eastern', freq='D'),
       Timestamp('2013-01-03 00:00:00-0500', tz='US/Eastern', freq='D')],
      dtype=object)
```

By converting to an object array of Timestamps, it preserves the time zone
information. For example, when converting back to a Series:

``` python
In [468]: pd.Series(s_aware.to_numpy())
Out[468]: 
0   2013-01-01 00:00:00-05:00
1   2013-01-02 00:00:00-05:00
2   2013-01-03 00:00:00-05:00
dtype: datetime64[ns, US/Eastern]
```

However, if you want an actual NumPy ``datetime64[ns]`` array (with the values
converted to UTC) instead of an array of objects, you can specify the
``dtype`` argument:

``` python
In [469]: s_aware.to_numpy(dtype='datetime64[ns]')
Out[469]: 
array(['2013-01-01T05:00:00.000000000', '2013-01-02T05:00:00.000000000',
       '2013-01-03T05:00:00.000000000'], dtype='datetime64[ns]')
```

:::
