# .dt访问器

Series has an accessor to succinctly return datetime like properties for the values of the Series, if it is a datetime/period like Series. This will return a Series, indexed like the existing Series.

```python
# datetime
In [280]: s = pd.Series(pd.date_range('20130101 09:10:12', periods=4))

In [281]: s
Out[281]: 
0   2013-01-01 09:10:12
1   2013-01-02 09:10:12
2   2013-01-03 09:10:12
3   2013-01-04 09:10:12
dtype: datetime64[ns]

In [282]: s.dt.hour
Out[282]: 
0    9
1    9
2    9
3    9
dtype: int64

In [283]: s.dt.second
Out[283]: 
0    12
1    12
2    12
3    12
dtype: int64

In [284]: s.dt.day
Out[284]: 
0    1
1    2
2    3
3    4
dtype: int64
```

This enables nice expressions like this:

```python
In [285]: s[s.dt.day==2]
Out[285]: 
1   2013-01-02 09:10:12
dtype: datetime64[ns]
```

You can easily produces tz aware transformations:

```python
In [286]: stz = s.dt.tz_localize('US/Eastern')

In [287]: stz
Out[287]: 
0   2013-01-01 09:10:12-05:00
1   2013-01-02 09:10:12-05:00
2   2013-01-03 09:10:12-05:00
3   2013-01-04 09:10:12-05:00
dtype: datetime64[ns, US/Eastern]

In [288]: stz.dt.tz
Out[288]: <DstTzInfo 'US/Eastern' LMT-1 day, 19:04:00 STD>
```

You can also chain these types of operations:

```python
In [289]: s.dt.tz_localize('UTC').dt.tz_convert('US/Eastern')
Out[289]: 
0   2013-01-01 04:10:12-05:00
1   2013-01-02 04:10:12-05:00
2   2013-01-03 04:10:12-05:00
3   2013-01-04 04:10:12-05:00
dtype: datetime64[ns, US/Eastern]
```

You can also format datetime values as strings with [Series.dt.strftime()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.dt.strftime.html#pandas.Series.dt.strftime) which supports the same format as the standard [strftime()](https://docs.python.org/3/library/datetime.html#datetime.datetime.strftime).

```python
# DatetimeIndex
In [290]: s = pd.Series(pd.date_range('20130101', periods=4))

In [291]: s
Out[291]: 
0   2013-01-01
1   2013-01-02
2   2013-01-03
3   2013-01-04
dtype: datetime64[ns]

In [292]: s.dt.strftime('%Y/%m/%d')
Out[292]: 
0    2013/01/01
1    2013/01/02
2    2013/01/03
3    2013/01/04
dtype: object
```

```python
# PeriodIndex
In [293]: s = pd.Series(pd.period_range('20130101', periods=4))

In [294]: s
Out[294]: 
0   2013-01-01
1   2013-01-02
2   2013-01-03
3   2013-01-04
dtype: object

In [295]: s.dt.strftime('%Y/%m/%d')
Out[295]: 
0    2013/01/01
1    2013/01/02
2    2013/01/03
3    2013/01/04
dtype: object
```

The ``.dt`` accessor works for period and timedelta dtypes.

```python
# period
In [296]: s = pd.Series(pd.period_range('20130101', periods=4, freq='D'))

In [297]: s
Out[297]: 
0   2013-01-01
1   2013-01-02
2   2013-01-03
3   2013-01-04
dtype: object

In [298]: s.dt.year
Out[298]: 
0    2013
1    2013
2    2013
3    2013
dtype: int64

In [299]: s.dt.day
Out[299]: 
0    1
1    2
2    3
3    4
dtype: int64
```

```python
# timedelta
In [300]: s = pd.Series(pd.timedelta_range('1 day 00:00:05', periods=4, freq='s'))

In [301]: s
Out[301]: 
0   1 days 00:00:05
1   1 days 00:00:06
2   1 days 00:00:07
3   1 days 00:00:08
dtype: timedelta64[ns]

In [302]: s.dt.days
Out[302]: 
0    1
1    1
2    1
3    1
dtype: int64

In [303]: s.dt.seconds
Out[303]: 
0    5
1    6
2    7
3    8
dtype: int64

In [304]: s.dt.components
Out[304]: 
   days  hours  minutes  seconds  milliseconds  microseconds  nanoseconds
0     1      0        0        5             0             0            0
1     1      0        0        6             0             0            0
2     1      0        0        7             0             0            0
3     1      0        0        8             0             0            0
```

**Note:** Series.dt will raise a TypeError if you access with a non-datetime-like values.