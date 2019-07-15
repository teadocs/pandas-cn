# 缺失数据(Missing Data)

The [missing data](http://Pandas.pydata.org/Pandas-docs/stable/missing_data.html#missing-data) docs.

Fill forward a reversed timeseries

```python
In [79]: df = pd.DataFrame(np.random.randn(6,1), index=pd.date_range('2013-08-01', periods=6, freq='B'), columns=list('A'))

In [80]: df.loc[df.index[3], 'A'] = np.nan

In [81]: df
Out[81]: 
                   A
2013-08-01 -1.054874
2013-08-02 -0.179642
2013-08-05  0.639589
2013-08-06       NaN
2013-08-07  1.906684
2013-08-08  0.104050

In [82]: df.reindex(df.index[::-1]).ffill()
Out[82]: 
                   A
2013-08-08  0.104050
2013-08-07  1.906684
2013-08-06  1.906684
2013-08-05  0.639589
2013-08-02 -0.179642
2013-08-01 -1.054874
```

[cumsum reset at NaN values](http://stackoverflow.com/questions/18196811/cumsum-reset-at-nan)

## Replace

[Using replace with backrefs](http://stackoverflow.com/questions/16818871/extracting-value-and-creating-new-column-out-of-it)