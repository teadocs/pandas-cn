# 时间序列(Timeseries)


[Between times](http://stackoverflow.com/questions/14539992/Pandas-drop-rows-outside-of-time-range)

[Using indexer between time](http://stackoverflow.com/questions/17559885/Pandas-dataframe-mask-based-on-index)

[Constructing a datetime range that excludes weekends and includes only certain times](http://stackoverflow.com/questions/24010830/Pandas-generate-sequential-timestamp-with-jump/24014440#24014440?)

[Vectorized Lookup](http://stackoverflow.com/questions/13893227/vectorized-look-up-of-values-in-Pandas-dataframe)

[Aggregation and plotting time series](http://nipunbatra.github.io/2015/06/timeseries/)

Turn a matrix with hours in columns and days in rows into a continuous row sequence in the form of a time series. [How to rearrange a Python Pandas DataFrame?](http://stackoverflow.com/questions/15432659/how-to-rearrange-a-python-Pandas-dataframe)

[Dealing with duplicates when reindexing a timeseries to a specified frequency](http://stackoverflow.com/questions/22244383/Pandas-df-refill-adding-two-columns-of-different-shape)

Calculate the first day of the month for each entry in a DatetimeIndex

```python
In [147]: dates = pd.date_range('2000-01-01', periods=5)

In [148]: dates.to_period(freq='M').to_timestamp()
Out[148]: 
DatetimeIndex(['2000-01-01', '2000-01-01', '2000-01-01', '2000-01-01',
               '2000-01-01'],
              dtype='datetime64[ns]', freq=None)
```

## Resampling

The [Resample](http://Pandas.pydata.org/Pandas-docs/stable/timeseries.html#timeseries-resampling) docs.

[Using Grouper instead of TimeGrouper for time grouping of values](https://stackoverflow.com/questions/15297053/how-can-i-divide-single-values-of-a-dataframe-by-monthly-averages)

[Time grouping with some missing values](https://stackoverflow.com/questions/33637312/Pandas-grouper-by-frequency-with-completeness-requirement)

[Valid frequency arguments to Grouper](http://Pandas.pydata.org/Pandas-docs/stable/timeseries.html#offset-aliases)

[Grouping using a MultiIndex](https://stackoverflow.com/questions/41483763/Pandas-timegrouper-on-multiindex)

[Using TimeGrouper and another grouping to create subgroups, then apply a custom function](https://github.com/Pandas-dev/Pandas/issues/3791)

[Resampling with custom periods](http://stackoverflow.com/questions/15408156/resampling-with-custom-periods)

[Resample intraday frame without adding new days](http://stackoverflow.com/questions/14898574/resample-intrday-Pandas-dataframe-without-add-new-days)

[Resample minute data](http://stackoverflow.com/questions/14861023/resampling-minute-data)

[Resample with groupby](http://stackoverflow.com/q/18677271/564538)