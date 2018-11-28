# 计算缺少的数据

Missing values propagate naturally through arithmetic operations between pandas objects.

```python
In [27]: a
Out[27]: 
        one       two
a       NaN  0.501113
c       NaN  0.580967
e  0.057802  0.761948
f -0.443160 -0.974602
h -0.443160 -1.053898

In [28]: b
Out[28]: 
        one       two     three
a       NaN  0.501113 -0.355322
c       NaN  0.580967  0.983801
e  0.057802  0.761948 -0.712964
f -0.443160 -0.974602  1.047704
h       NaN -1.053898 -0.019369

In [29]: a + b
Out[29]: 
        one  three       two
a       NaN    NaN  1.002226
c       NaN    NaN  1.161935
e  0.115604    NaN  1.523896
f -0.886321    NaN -1.949205
h       NaN    NaN -2.107796
```

The descriptive statistics and computational methods discussed in the [data structure overview](http://pandas.pydata.org/pandas-docs/stable/basics.html#basics-stats) (and listed [here](http://pandas.pydata.org/pandas-docs/stable/api.html#api-series-stats) and [here](http://pandas.pydata.org/pandas-docs/stable/api.html#api-dataframe-stats)) are all written to account for missing data. For example:

- When summing data, NA (missing) values will be treated as zero.
- If the data are all NA, the result will be 0.
- Cumulative methods like [cumsum()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.cumsum.html#pandas.DataFrame.cumsum) and [cumprod()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.cumprod.html#pandas.DataFrame.cumprod) ignore NA values by default, but preserve them in the resulting arrays. To override this behaviour and include NA values, use ``skipna=False``.

```python
In [30]: df
Out[30]: 
        one       two     three
a       NaN  0.501113 -0.355322
c       NaN  0.580967  0.983801
e  0.057802  0.761948 -0.712964
f -0.443160 -0.974602  1.047704
h       NaN -1.053898 -0.019369

In [31]: df['one'].sum()
Out[31]: -0.38535826528461409

In [32]: df.mean(1)
Out[32]: 
a    0.072895
c    0.782384
e    0.035595
f   -0.123353
h   -0.536633
dtype: float64

In [33]: df.cumsum()
Out[33]: 
        one       two     three
a       NaN  0.501113 -0.355322
c       NaN  1.082080  0.628479
e  0.057802  1.844028 -0.084485
f -0.385358  0.869426  0.963219
h       NaN -0.184472  0.943850

In [34]: df.cumsum(skipna=False)
Out[34]: 
   one       two     three
a  NaN  0.501113 -0.355322
c  NaN  1.082080  0.628479
e  NaN  1.844028 -0.084485
f  NaN  0.869426  0.963219
h  NaN -0.184472  0.943850
```

## Sum/Prod of Empties/Nans

<div class="warning-warp">
<b>警告</b><p> This behavior is now standard as of v0.22.0 and is consistent with the default in <code>numpy</code>; previously sum/prod of all-NA or empty Series/DataFrames would return NaN. See <a href="http://pandas.pydata.org/pandas-docs/stable/whatsnew.html#whatsnew-0220">v0.22.0 whatsnew for more.</a></p>
</div>

The sum of an empty or all-NA Series or column of a DataFrame is 0.

```python
In [35]: pd.Series([np.nan]).sum()
Out[35]: 0.0

In [36]: pd.Series([]).sum()
Out[36]: 0.0
```

The product of an empty or all-NA Series or column of a DataFrame is 1.

```python
In [37]: pd.Series([np.nan]).prod()
Out[37]: 1.0

In [38]: pd.Series([]).prod()
Out[38]: 1.0
```

## NA values in GroupBy

NA groups in GroupBy are automatically excluded. This behavior is consistent with R, for example:

```python
In [39]: df
Out[39]: 
        one       two     three
a       NaN  0.501113 -0.355322
c       NaN  0.580967  0.983801
e  0.057802  0.761948 -0.712964
f -0.443160 -0.974602  1.047704
h       NaN -1.053898 -0.019369

In [40]: df.groupby('one').mean()
Out[40]: 
                two     three
one                          
-0.443160 -0.974602  1.047704
 0.057802  0.761948 -0.712964
```

See the groupby section [here](http://pandas.pydata.org/pandas-docs/stable/groupby.html#groupby-missing) for more information.

