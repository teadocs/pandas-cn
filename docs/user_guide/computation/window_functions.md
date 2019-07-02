# 窗口函数

For working with data, a number of window functions are provided for computing common window or rolling statistics. Among these are count, sum, mean, median, correlation, variance, covariance, standard deviation, skewness, and kurtosis.

The ``rolling()`` and ``expanding()`` functions can be used directly from DataFrameGroupBy objects, see the [groupby docs](http://Pandas.pydata.org/Pandas-docs/stable/groupby.html#groupby-transform-window-resample).

**Note**：The API for window statistics is quite similar to the way one works with GroupBy objects, see the documentation [here](http://Pandas.pydata.org/Pandas-docs/stable/groupby.html#groupby).

We work with ``rolling``, ``expanding`` and ``exponentially`` ``weighted`` data through the corresponding objects, **Rolling**, **Expanding** and **EWM**.

```python
In [38]: s = pd.Series(np.random.randn(1000), index=pd.date_range('1/1/2000', periods=1000))

In [39]: s = s.cumsum()

In [40]: s
Out[40]: 
2000-01-01    -0.268824
2000-01-02    -1.771855
2000-01-03    -0.818003
2000-01-04    -0.659244
2000-01-05    -1.942133
2000-01-06    -1.869391
2000-01-07     0.563674
                ...    
2002-09-20   -68.233054
2002-09-21   -66.765687
2002-09-22   -67.457323
2002-09-23   -69.253182
2002-09-24   -70.296818
2002-09-25   -70.844674
2002-09-26   -72.475016
Freq: D, Length: 1000, dtype: float64
```

These are created from methods on ``Series`` and ``DataFrame``.

```python
In [41]: r = s.rolling(window=60)

In [42]: r
Out[42]: Rolling [window=60,center=False,axis=0]
```

These object provide tab-completion of the available methods and properties.

```python
In [14]: r.
r.agg         r.apply       r.count       r.exclusions  r.max         r.median      r.name        r.skew        r.sum
r.aggregate   r.corr        r.cov         r.kurt        r.mean        r.min         r.quantile    r.std         r.var
```

Generally these methods all have the same interface. They all accept the following arguments:

- ``window``: size of moving window
- ``min_periods``: threshold of non-null data points to require (otherwise result is NA)
- ``center``: boolean, whether to set the labels at the center (default is False)

We can then call methods on these ``rolling`` objects. These return like-indexed objects:

```python
In [43]: r.mean()
Out[43]: 
2000-01-01          NaN
2000-01-02          NaN
2000-01-03          NaN
2000-01-04          NaN
2000-01-05          NaN
2000-01-06          NaN
2000-01-07          NaN
                ...    
2002-09-20   -62.694135
2002-09-21   -62.812190
2002-09-22   -62.914971
2002-09-23   -63.061867
2002-09-24   -63.213876
2002-09-25   -63.375074
2002-09-26   -63.539734
Freq: D, Length: 1000, dtype: float64
```

```python
In [44]: s.plot(style='k--')
Out[44]: <matplotlib.axes._subplots.AxesSubplot at 0x7f2115c02ba8>

In [45]: r.mean().plot(style='k')
Out[45]: <matplotlib.axes._subplots.AxesSubplot at 0x7f2115c02ba8>
```

![窗口函数绘制的图像](/static/images/rolling_mean_ex.png)

They can also be applied to DataFrame objects. This is really just syntactic sugar for applying the moving window operator to all of the DataFrame’s columns:

```python
In [46]: df = pd.DataFrame(np.random.randn(1000, 4),
   ....:                   index=pd.date_range('1/1/2000', periods=1000),
   ....:                   columns=['A', 'B', 'C', 'D'])
   ....: 

In [47]: df = df.cumsum()

In [48]: df.rolling(window=60).sum().plot(subplots=True)
Out[48]: 
array([<matplotlib.axes._subplots.AxesSubplot object at 0x7f21156c40f0>,
       <matplotlib.axes._subplots.AxesSubplot object at 0x7f2115662ef0>,
       <matplotlib.axes._subplots.AxesSubplot object at 0x7f21156950f0>,
       <matplotlib.axes._subplots.AxesSubplot object at 0x7f211563d2b0>], dtype=object)
```

![窗口函数绘制的图像2](/static/images/rolling_mean_frame.png)

## Method Summary

We provide a number of common statistical functions:

Method | Description
---|---
[count()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.core.window.Rolling.count.html#Pandas.core.window.Rolling.count) | Number of non-null observations
[sum()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.core.window.Rolling.sum.html#Pandas.core.window.Rolling.sum) | Sum of values
[mean()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.core.window.Rolling.mean.html#Pandas.core.window.Rolling.mean) | Mean of values
[median()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.core.window.Rolling.median.html#Pandas.core.window.Rolling.median) | Arithmetic median of values
[min()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.core.window.Rolling.min.html#Pandas.core.window.Rolling.min) | Minimum
[max()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.core.window.Rolling.max.html#Pandas.core.window.Rolling.max) | Maximum
[std()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.core.window.Rolling.std.html#Pandas.core.window.Rolling.std) | Bessel-corrected sample standard deviation
[var()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.core.window.Rolling.var.html#Pandas.core.window.Rolling.var) | Unbiased variance
[skew()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.core.window.Rolling.skew.html#Pandas.core.window.Rolling.skew) | Sample skewness (3rd moment)
[kurt()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.core.window.Rolling.kurt.html#Pandas.core.window.Rolling.kurt) | Sample kurtosis (4th moment)
[quantile()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.core.window.Rolling.quantile.html#Pandas.core.window.Rolling.quantile) | Sample quantile (value at %)
[apply()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.core.window.Rolling.apply.html#Pandas.core.window.Rolling.apply) | Generic apply
[cov()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.core.window.Rolling.cov.html#Pandas.core.window.Rolling.cov) | Unbiased covariance (binary)
[corr()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.core.window.Rolling.corr.html#Pandas.core.window.Rolling.corr) | Correlation (binary)

The [apply()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.core.window.Rolling.apply.html#Pandas.core.window.Rolling.apply) function takes an extra ``func`` argument and performs generic rolling computations. The ``func`` argument should be a single function that produces a single value from an ndarray input. Suppose we wanted to compute the mean absolute deviation on a rolling basis:

```python
In [49]: mad = lambda x: np.fabs(x - x.mean()).mean()

In [50]: s.rolling(window=60).apply(mad, raw=True).plot(style='k')
Out[50]: <matplotlib.axes._subplots.AxesSubplot at 0x7f21153d6ef0>
```

![窗口函数绘制的图像3](/static/images/rolling_apply_ex.png)

## Rolling Windows

Passing ``win_type`` to ``.rolling`` generates a generic rolling window computation, that is weighted according the ``win_type``. The following methods are available:

Method | Description
---|---
[sum()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.core.window.Window.sum.html#Pandas.core.window.Window.sum) | Sum of values
[mean()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.core.window.Window.mean.html#Pandas.core.window.Window.mean) | Mean of values

The weights used in the window are specified by the ``win_type`` keyword. The list of recognized types are the [scipy.signal window functions](https://docs.scipy.org/doc/scipy/reference/signal.html#window-functions):

- ``boxcar``
- ``triang``
- ``blackman``
- ``hamming``
- ``bartlett``
- ``parzen``
- ``bohman``
- ``blackmanharris``
- ``nuttall``
- ``barthann``
- ``kaiser (needs beta)``
- ``gaussian (needs std)``
- ``general_gaussian (needs power, width)``
- ``slepian (needs width).``

```python
In [51]: ser = pd.Series(np.random.randn(10), index=pd.date_range('1/1/2000', periods=10))

In [52]: ser.rolling(window=5, win_type='triang').mean()
Out[52]: 
2000-01-01         NaN
2000-01-02         NaN
2000-01-03         NaN
2000-01-04         NaN
2000-01-05   -1.037870
2000-01-06   -0.767705
2000-01-07   -0.383197
2000-01-08   -0.395513
2000-01-09   -0.558440
2000-01-10   -0.672416
Freq: D, dtype: float64
```

Note that the ``boxcar`` window is equivalent to [mean()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.core.window.Rolling.mean.html#Pandas.core.window.Rolling.mean).

```python
In [53]: ser.rolling(window=5, win_type='boxcar').mean()
Out[53]: 
2000-01-01         NaN
2000-01-02         NaN
2000-01-03         NaN
2000-01-04         NaN
2000-01-05   -0.841164
2000-01-06   -0.779948
2000-01-07   -0.565487
2000-01-08   -0.502815
2000-01-09   -0.553755
2000-01-10   -0.472211
Freq: D, dtype: float64

In [54]: ser.rolling(window=5).mean()
Out[54]: 
2000-01-01         NaN
2000-01-02         NaN
2000-01-03         NaN
2000-01-04         NaN
2000-01-05   -0.841164
2000-01-06   -0.779948
2000-01-07   -0.565487
2000-01-08   -0.502815
2000-01-09   -0.553755
2000-01-10   -0.472211
Freq: D, dtype: float64
```

For some windowing functions, additional parameters must be specified:

```python
In [55]: ser.rolling(window=5, win_type='gaussian').mean(std=0.1)
Out[55]: 
2000-01-01         NaN
2000-01-02         NaN
2000-01-03         NaN
2000-01-04         NaN
2000-01-05   -1.309989
2000-01-06   -1.153000
2000-01-07    0.606382
2000-01-08   -0.681101
2000-01-09   -0.289724
2000-01-10   -0.996632
Freq: D, dtype: float64
```

**Note**: For ``.sum()`` with a ``win_type``, there is no normalization done to the weights for the window. Passing custom weights of ``[1, 1, 1]`` will yield a different result than passing weights of ``[2, 2, 2]``, for example. When passing a ``win_type`` instead of explicitly specifying the weights, the weights are already normalized so that the largest weight is 1.
In contrast, the nature of the ``.mean()`` calculation is such that the weights are normalized with respect to each other. Weights of ``[1, 1, 1]`` and ``[2, 2, 2]`` yield the same result.

## Time-aware Rolling

*New in version 0.19.0*.

New in version 0.19.0 are the ability to pass an offset (or convertible) to a ``.rolling()`` method and have it produce variable sized windows based on the passed time window. For each time point, this includes all preceding values occurring within the indicated time delta.

This can be particularly useful for a non-regular time frequency index.

```python
In [56]: dft = pd.DataFrame({'B': [0, 1, 2, np.nan, 4]},
   ....:                    index=pd.date_range('20130101 09:00:00', periods=5, freq='s'))
   ....: 

In [57]: dft
Out[57]: 
                       B
2013-01-01 09:00:00  0.0
2013-01-01 09:00:01  1.0
2013-01-01 09:00:02  2.0
2013-01-01 09:00:03  NaN
2013-01-01 09:00:04  4.0
```

This is a regular frequency index. Using an integer window parameter works to roll along the window frequency.

```python
In [58]: dft.rolling(2).sum()
Out[58]: 
                       B
2013-01-01 09:00:00  NaN
2013-01-01 09:00:01  1.0
2013-01-01 09:00:02  3.0
2013-01-01 09:00:03  NaN
2013-01-01 09:00:04  NaN

In [59]: dft.rolling(2, min_periods=1).sum()
Out[59]: 
                       B
2013-01-01 09:00:00  0.0
2013-01-01 09:00:01  1.0
2013-01-01 09:00:02  3.0
2013-01-01 09:00:03  2.0
2013-01-01 09:00:04  4.0
```

Specifying an offset allows a more intuitive specification of the rolling frequency.

```python
In [60]: dft.rolling('2s').sum()
Out[60]: 
                       B
2013-01-01 09:00:00  0.0
2013-01-01 09:00:01  1.0
2013-01-01 09:00:02  3.0
2013-01-01 09:00:03  2.0
2013-01-01 09:00:04  4.0
```

Using a non-regular, but still monotonic index, rolling with an integer window does not impart any special calculation.

```python
In [61]: dft = pd.DataFrame({'B': [0, 1, 2, np.nan, 4]},
   ....:                    index = pd.Index([pd.Timestamp('20130101 09:00:00'),
   ....:                                      pd.Timestamp('20130101 09:00:02'),
   ....:                                      pd.Timestamp('20130101 09:00:03'),
   ....:                                      pd.Timestamp('20130101 09:00:05'),
   ....:                                      pd.Timestamp('20130101 09:00:06')],
   ....:                                     name='foo'))
   ....: 

In [62]: dft
Out[62]: 
                       B
foo                     
2013-01-01 09:00:00  0.0
2013-01-01 09:00:02  1.0
2013-01-01 09:00:03  2.0
2013-01-01 09:00:05  NaN
2013-01-01 09:00:06  4.0

In [63]: dft.rolling(2).sum()
Out[63]: 
                       B
foo                     
2013-01-01 09:00:00  NaN
2013-01-01 09:00:02  1.0
2013-01-01 09:00:03  3.0
2013-01-01 09:00:05  NaN
2013-01-01 09:00:06  NaN
```

Using the time-specification generates variable windows for this sparse data.

```python
In [64]: dft.rolling('2s').sum()
Out[64]: 
                       B
foo                     
2013-01-01 09:00:00  0.0
2013-01-01 09:00:02  1.0
2013-01-01 09:00:03  3.0
2013-01-01 09:00:05  NaN
2013-01-01 09:00:06  4.0
```

Furthermore, we now allow an optional ``on`` parameter to specify a column (rather than the default of the index) in a DataFrame.

```python
In [65]: dft = dft.reset_index()

In [66]: dft
Out[66]: 
                  foo    B
0 2013-01-01 09:00:00  0.0
1 2013-01-01 09:00:02  1.0
2 2013-01-01 09:00:03  2.0
3 2013-01-01 09:00:05  NaN
4 2013-01-01 09:00:06  4.0

In [67]: dft.rolling('2s', on='foo').sum()
Out[67]: 
                  foo    B
0 2013-01-01 09:00:00  0.0
1 2013-01-01 09:00:02  1.0
2 2013-01-01 09:00:03  3.0
3 2013-01-01 09:00:05  NaN
4 2013-01-01 09:00:06  4.0
```

## Rolling Window Endpoints

*New in version 0.20.0*.

The inclusion of the interval endpoints in rolling window calculations can be specified with the ``closed`` parameter:

closed | Description | Default for
---|---|---
right | close right endpoint | time-based windows
left | close left endpoint | -
both | close both endpoints | fixed windows
neither	open endpoints | -

For example, having the right endpoint open is useful in many problems that require that there is no contamination from present information back to past information. This allows the rolling window to compute statistics “up to that point in time”, but not including that point in time.

```python
In [68]: df = pd.DataFrame({'x': 1},
   ....:                   index = [pd.Timestamp('20130101 09:00:01'),
   ....:                            pd.Timestamp('20130101 09:00:02'),
   ....:                            pd.Timestamp('20130101 09:00:03'),
   ....:                            pd.Timestamp('20130101 09:00:04'),
   ....:                            pd.Timestamp('20130101 09:00:06')])
   ....: 

In [69]: df["right"] = df.rolling('2s', closed='right').x.sum()  # default

In [70]: df["both"] = df.rolling('2s', closed='both').x.sum()

In [71]: df["left"] = df.rolling('2s', closed='left').x.sum()

In [72]: df["neither"] = df.rolling('2s', closed='neither').x.sum()

In [73]: df
Out[73]: 
                     x  right  both  left  neither
2013-01-01 09:00:01  1    1.0   1.0   NaN      NaN
2013-01-01 09:00:02  1    2.0   2.0   1.0      1.0
2013-01-01 09:00:03  1    2.0   3.0   2.0      1.0
2013-01-01 09:00:04  1    2.0   3.0   2.0      1.0
2013-01-01 09:00:06  1    1.0   2.0   1.0      NaN
```

Currently, this feature is only implemented for time-based windows. For fixed windows, the closed parameter cannot be set and the rolling window will always have both endpoints closed.

## Time-aware Rolling vs. Resampling

Using ``.rolling()`` with a time-based index is quite similar to [resampling](http://Pandas.pydata.org/Pandas-docs/stable/timeseries.html#timeseries-resampling). They both operate and perform reductive operations on time-indexed Pandas objects.

When using ``.rolling()`` with an offset. The offset is a time-delta. Take a backwards-in-time looking window, and aggregate all of the values in that window (including the end-point, but not the start-point). This is the new value at that point in the result. These are variable sized windows in time-space for each point of the input. You will get a same sized result as the input.

When using ``.resample()`` with an offset. Construct a new index that is the frequency of the offset. For each frequency bin, aggregate points from the input within a backwards-in-time looking window that fall in that bin. The result of this aggregation is the output for that frequency point. The windows are fixed size in the frequency space. Your result will have the shape of a regular frequency between the min and the max of the original input object.

To summarize, ``.rolling()`` is a time-based window operation, while ``.resample()`` is a frequency-based window operation.

## Centering Windows

By default the labels are set to the right edge of the window, but a ``center`` keyword is available so the labels can be set at the center.

```python
In [74]: ser.rolling(window=5).mean()
Out[74]: 
2000-01-01         NaN
2000-01-02         NaN
2000-01-03         NaN
2000-01-04         NaN
2000-01-05   -0.841164
2000-01-06   -0.779948
2000-01-07   -0.565487
2000-01-08   -0.502815
2000-01-09   -0.553755
2000-01-10   -0.472211
Freq: D, dtype: float64

In [75]: ser.rolling(window=5, center=True).mean()
Out[75]: 
2000-01-01         NaN
2000-01-02         NaN
2000-01-03   -0.841164
2000-01-04   -0.779948
2000-01-05   -0.565487
2000-01-06   -0.502815
2000-01-07   -0.553755
2000-01-08   -0.472211
2000-01-09         NaN
2000-01-10         NaN
Freq: D, dtype: float64
```

## Binary Window Functions

[cov()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.core.window.Rolling.cov.html#Pandas.core.window.Rolling.cov) and [corr()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.core.window.Rolling.corr.html#Pandas.core.window.Rolling.corr) can compute moving window statistics about two Series or any combination of DataFrame/Series or DataFrame/DataFrame. Here is the behavior in each case:

- two ``Series``: compute the statistic for the pairing.
- ``DataFrame/Series``: compute the statistics for each column of the DataFrame with the passed Series, thus returning a DataFrame.
- ``DataFrame/DataFrame``: by default compute the statistic for matching column names, returning a DataFrame. If the keyword argument ``pairwise=True`` is passed then computes the statistic for each pair of columns, returning a ``MultiIndexed DataFrame`` whose index are the dates in question (see [the next section](http://Pandas.pydata.org/Pandas-docs/stable/computation.html#stats-moments-corr-pairwise)).

For example:

```python
In [76]: df = pd.DataFrame(np.random.randn(1000, 4),
   ....:                   index=pd.date_range('1/1/2000', periods=1000),
   ....:                   columns=['A', 'B', 'C', 'D'])
   ....: 

In [77]: df = df.cumsum()

In [78]: df2 = df[:20]

In [79]: df2.rolling(window=5).corr(df2['B'])
Out[79]: 
                   A    B         C         D
2000-01-01       NaN  NaN       NaN       NaN
2000-01-02       NaN  NaN       NaN       NaN
2000-01-03       NaN  NaN       NaN       NaN
2000-01-04       NaN  NaN       NaN       NaN
2000-01-05  0.768775  1.0 -0.977990  0.800252
2000-01-06  0.744106  1.0 -0.967912  0.830021
2000-01-07  0.683257  1.0 -0.928969  0.384916
...              ...  ...       ...       ...
2000-01-14 -0.392318  1.0  0.570240 -0.591056
2000-01-15  0.017217  1.0  0.649900 -0.896258
2000-01-16  0.691078  1.0  0.807450 -0.939302
2000-01-17  0.274506  1.0  0.582601 -0.902954
2000-01-18  0.330459  1.0  0.515707 -0.545268
2000-01-19  0.046756  1.0 -0.104334 -0.419799
2000-01-20 -0.328241  1.0 -0.650974 -0.777777

[20 rows x 4 columns]
```

## Computing rolling pairwise covariances and correlations

<div class="warning-warp">
<b>警告</b><p>Prior to version 0.20.0 if pairwise=True was passed, a Panel would be returned. This will now return a 2-level MultiIndexed DataFrame, see the whatsnew <a href="http://Pandas.pydata.org/Pandas-docs/stable/whatsnew.html#whatsnew-0200-api-breaking-rolling-pairwise">here</a>.
</p>
</div>

In financial data analysis and other fields it’s common to compute covariance and correlation matrices for a collection of time series. Often one is also interested in moving-window covariance and correlation matrices. This can be done by passing the ``pairwise`` keyword argument, which in the case of ``DataFrame`` inputs will yield a MultiIndexed ``DataFrame`` whose ``index`` are the dates in question. In the case of a single ``DataFrame`` argument the ``pairwise`` argument can even be omitted:

**Note**: Missing values are ignored and each entry is computed using the pairwise complete observations. Please see the [covariance section](http://Pandas.pydata.org/Pandas-docs/stable/computation.html#computation-covariance) for [caveats](http://Pandas.pydata.org/Pandas-docs/stable/computation.html#computation-covariance-caveats) associated with this method of calculating covariance and correlation matrices.

```python
In [80]: covs = df[['B','C','D']].rolling(window=50).cov(df[['A','B','C']], pairwise=True)

In [81]: covs.loc['2002-09-22':]
Out[81]: 
                     B         C         D
2002-09-22 A  1.367467  8.676734 -8.047366
           B  3.067315  0.865946 -1.052533
           C  0.865946  7.739761 -4.943924
2002-09-23 A  0.910343  8.669065 -8.443062
           B  2.625456  0.565152 -0.907654
           C  0.565152  7.825521 -5.367526
2002-09-24 A  0.463332  8.514509 -8.776514
           B  2.306695  0.267746 -0.732186
           C  0.267746  7.771425 -5.696962
2002-09-25 A  0.467976  8.198236 -9.162599
           B  2.307129  0.267287 -0.754080
           C  0.267287  7.466559 -5.822650
2002-09-26 A  0.545781  7.899084 -9.326238
           B  2.311058  0.322295 -0.844451
           C  0.322295  7.038237 -5.684445
```

```python
In [82]: correls = df.rolling(window=50).corr()

In [83]: correls.loc['2002-09-22':]
Out[83]: 
                     A         B         C         D
2002-09-22 A  1.000000  0.186397  0.744551 -0.769767
           B  0.186397  1.000000  0.177725 -0.240802
           C  0.744551  0.177725  1.000000 -0.712051
           D -0.769767 -0.240802 -0.712051  1.000000
2002-09-23 A  1.000000  0.134723  0.743113 -0.758758
           B  0.134723  1.000000  0.124683 -0.209934
           C  0.743113  0.124683  1.000000 -0.719088
...                ...       ...       ...       ...
2002-09-25 B  0.075157  1.000000  0.064399 -0.164179
           C  0.731888  0.064399  1.000000 -0.704686
           D -0.739160 -0.164179 -0.704686  1.000000
2002-09-26 A  1.000000  0.087756  0.727792 -0.736562
           B  0.087756  1.000000  0.079913 -0.179477
           C  0.727792  0.079913  1.000000 -0.692303
           D -0.736562 -0.179477 -0.692303  1.000000

[20 rows x 4 columns]
```

You can efficiently retrieve the time series of correlations between two columns by reshaping and indexing:

```python
In [84]: correls.unstack(1)[('A', 'C')].plot()
Out[84]: <matplotlib.axes._subplots.AxesSubplot at 0x7f210fd6a2b0>
```

![窗口函数绘制的图像4](/static/images/rolling_corr_pairwise_ex.png)