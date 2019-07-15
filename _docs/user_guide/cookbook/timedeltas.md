# 时间增量(Timedeltas)

The [Timedeltas](http://Pandas.pydata.org/Pandas-docs/stable/timedeltas.html#timedeltas-timedeltas) docs.

[Using timedeltas](http://github.com/Pandas-dev/Pandas/pull/2899)

```python
In [175]: s  = pd.Series(pd.date_range('2012-1-1', periods=3, freq='D'))

In [176]: s - s.max()
Out[176]: 
0   -2 days
1   -1 days
2    0 days
dtype: timedelta64[ns]

In [177]: s.max() - s
Out[177]: 
0   2 days
1   1 days
2   0 days
dtype: timedelta64[ns]

In [178]: s - datetime.datetime(2011,1,1,3,5)
Out[178]: 
0   364 days 20:55:00
1   365 days 20:55:00
2   366 days 20:55:00
dtype: timedelta64[ns]

In [179]: s + datetime.timedelta(minutes=5)
Out[179]: 
0   2012-01-01 00:05:00
1   2012-01-02 00:05:00
2   2012-01-03 00:05:00
dtype: datetime64[ns]

In [180]: datetime.datetime(2011,1,1,3,5) - s
Out[180]: 
0   -365 days +03:05:00
1   -366 days +03:05:00
2   -367 days +03:05:00
dtype: timedelta64[ns]

In [181]: datetime.timedelta(minutes=5) + s
Out[181]: 
0   2012-01-01 00:05:00
1   2012-01-02 00:05:00
2   2012-01-03 00:05:00
dtype: datetime64[ns]
```

[Adding and subtracting deltas and dates](http://stackoverflow.com/questions/16385785/add-days-to-dates-in-dataframe)

```python
In [182]: deltas = pd.Series([ datetime.timedelta(days=i) for i in range(3) ])

In [183]: df = pd.DataFrame(dict(A = s, B = deltas)); df
Out[183]: 
           A      B
0 2012-01-01 0 days
1 2012-01-02 1 days
2 2012-01-03 2 days

In [184]: df['New Dates'] = df['A'] + df['B'];

In [185]: df['Delta'] = df['A'] - df['New Dates']; df
Out[185]: 
           A      B  New Dates   Delta
0 2012-01-01 0 days 2012-01-01  0 days
1 2012-01-02 1 days 2012-01-03 -1 days
2 2012-01-03 2 days 2012-01-05 -2 days

In [186]: df.dtypes
Out[186]: 
A             datetime64[ns]
B            timedelta64[ns]
New Dates     datetime64[ns]
Delta        timedelta64[ns]
dtype: object
```

[Another example](http://stackoverflow.com/questions/15683588/iterating-through-a-Pandas-dataframe)

Values can be set to NaT using np.nan, similar to datetime

```python
In [187]: y = s - s.shift(); y
Out[187]: 
0      NaT
1   1 days
2   1 days
dtype: timedelta64[ns]

In [188]: y[1] = np.nan; y
Out[188]: 
0      NaT
1      NaT
2   1 days
dtype: timedelta64[ns]
```