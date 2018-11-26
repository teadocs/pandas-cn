# 统计函数

## Percent Change

``Series``, ``DataFrame``, and ``Panel`` all have a method [pct_change()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.pct_change.html#pandas.DataFrame.pct_change) to compute the percent change over a given number of periods (using ``fill_method`` to fill NA/null values *before* computing the percent change).

```python
In [1]: ser = pd.Series(np.random.randn(8))

In [2]: ser.pct_change()
Out[2]: 
0         NaN
1   -1.602976
2    4.334938
3   -0.247456
4   -2.067345
5   -1.142903
6   -1.688214
7   -9.759729
dtype: float64
```

```python
In [3]: df = pd.DataFrame(np.random.randn(10, 4))

In [4]: df.pct_change(periods=3)
Out[4]: 
          0         1         2         3
0       NaN       NaN       NaN       NaN
1       NaN       NaN       NaN       NaN
2       NaN       NaN       NaN       NaN
3 -0.218320 -1.054001  1.987147 -0.510183
4 -0.439121 -1.816454  0.649715 -4.822809
5 -0.127833 -3.042065 -5.866604 -1.776977
6 -2.596833 -1.959538 -2.111697 -3.798900
7 -0.117826 -2.169058  0.036094 -0.067696
8  2.492606 -1.357320 -1.205802 -1.558697
9 -1.012977  2.324558 -1.003744 -0.371806
```

## Covariance

[Series.cov()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.cov.html#pandas.Series.cov) can be used to compute covariance between series (excluding missing values).

```python
In [5]: s1 = pd.Series(np.random.randn(1000))

In [6]: s2 = pd.Series(np.random.randn(1000))

In [7]: s1.cov(s2)
Out[7]: 0.00068010881743108204
```

Analogously, [DataFrame.cov()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.cov.html#pandas.DataFrame.cov) to compute pairwise covariances among the series in the DataFrame, also excluding NA/null values.

**Note**: Assuming the missing data are missing at random this results in an estimate for the covariance matrix which is unbiased. However, for many applications this estimate may not be acceptable because the estimated covariance matrix is not guaranteed to be positive semi-definite. This could lead to estimated correlations having absolute values which are greater than one, and/or a non-invertible covariance matrix. See [Estimation of covariance matrices](http://en.wikipedia.org/w/index.php?title=Estimation_of_covariance_matrices) for more details.

```python
In [8]: frame = pd.DataFrame(np.random.randn(1000, 5), columns=['a', 'b', 'c', 'd', 'e'])

In [9]: frame.cov()
Out[9]: 
          a         b         c         d         e
a  1.000882 -0.003177 -0.002698 -0.006889  0.031912
b -0.003177  1.024721  0.000191  0.009212  0.000857
c -0.002698  0.000191  0.950735 -0.031743 -0.005087
d -0.006889  0.009212 -0.031743  1.002983 -0.047952
e  0.031912  0.000857 -0.005087 -0.047952  1.042487
```

``DataFrame.cov`` also supports an optional ``min_periods`` keyword that specifies the required minimum number of observations for each column pair in order to have a valid result.

```python
In [10]: frame = pd.DataFrame(np.random.randn(20, 3), columns=['a', 'b', 'c'])

In [11]: frame.loc[frame.index[:5], 'a'] = np.nan

In [12]: frame.loc[frame.index[5:10], 'b'] = np.nan

In [13]: frame.cov()
Out[13]: 
          a         b         c
a  1.123670 -0.412851  0.018169
b -0.412851  1.154141  0.305260
c  0.018169  0.305260  1.301149

In [14]: frame.cov(min_periods=12)
Out[14]: 
          a         b         c
a  1.123670       NaN  0.018169
b       NaN  1.154141  0.305260
c  0.018169  0.305260  1.301149
```

## Correlation

Correlation may be computed using the [corr()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.corr.html#pandas.DataFrame.corr) method. Using the ``method`` parameter, several methods for computing correlations are provided:

Method name | Description
``pearson (default)`` | Standard correlation coefficient
``kendall`` | Kendall Tau correlation coefficient
``spearman`` | Spearman rank correlation coefficient

All of these are currently computed using pairwise complete observations. Wikipedia has articles covering the above correlation coefficients:

- [Pearson correlation coefficient](https://en.wikipedia.org/wiki/Pearson_correlation_coefficient)
- [Kendall rank correlation coefficient](https://en.wikipedia.org/wiki/Kendall_rank_correlation_coefficient)
- [Spearman’s rank correlation coefficient](https://en.wikipedia.org/wiki/Spearman%27s_rank_correlation_coefficient)

**Note**：Please see the [caveats](http://pandas.pydata.org/pandas-docs/stable/computation.html#computation-covariance-caveats) associated with this method of calculating correlation matrices in the [covariance section](http://pandas.pydata.org/pandas-docs/stable/computation.html#computation-covariance).

```python
In [15]: frame = pd.DataFrame(np.random.randn(1000, 5), columns=['a', 'b', 'c', 'd', 'e'])

In [16]: frame.iloc[::2] = np.nan

# Series with Series
In [17]: frame['a'].corr(frame['b'])
Out[17]: 0.013479040400098794

In [18]: frame['a'].corr(frame['b'], method='spearman')
Out[18]: -0.0072898851595406371

# Pairwise correlation of DataFrame columns
In [19]: frame.corr()
Out[19]: 
          a         b         c         d         e
a  1.000000  0.013479 -0.049269 -0.042239 -0.028525
b  0.013479  1.000000 -0.020433 -0.011139  0.005654
c -0.049269 -0.020433  1.000000  0.018587 -0.054269
d -0.042239 -0.011139  0.018587  1.000000 -0.017060
e -0.028525  0.005654 -0.054269 -0.017060  1.000000
```

Note that non-numeric columns will be automatically excluded from the correlation calculation.

Like ``cov``, ``corr`` also supports the optional ``min_periods`` keyword:

```python
In [20]: frame = pd.DataFrame(np.random.randn(20, 3), columns=['a', 'b', 'c'])

In [21]: frame.loc[frame.index[:5], 'a'] = np.nan

In [22]: frame.loc[frame.index[5:10], 'b'] = np.nan

In [23]: frame.corr()
Out[23]: 
          a         b         c
a  1.000000 -0.121111  0.069544
b -0.121111  1.000000  0.051742
c  0.069544  0.051742  1.000000

In [24]: frame.corr(min_periods=12)
Out[24]: 
          a         b         c
a  1.000000       NaN  0.069544
b       NaN  1.000000  0.051742
c  0.069544  0.051742  1.000000
```

A related method [corrwith()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.corrwith.html#pandas.DataFrame.corrwith) is implemented on DataFrame to compute the correlation between like-labeled Series contained in different DataFrame objects.

```python
In [25]: index = ['a', 'b', 'c', 'd', 'e']

In [26]: columns = ['one', 'two', 'three', 'four']

In [27]: df1 = pd.DataFrame(np.random.randn(5, 4), index=index, columns=columns)

In [28]: df2 = pd.DataFrame(np.random.randn(4, 4), index=index[:4], columns=columns)

In [29]: df1.corrwith(df2)
Out[29]: 
one     -0.125501
two     -0.493244
three    0.344056
four     0.004183
dtype: float64

In [30]: df2.corrwith(df1, axis=1)
Out[30]: 
a   -0.675817
b    0.458296
c    0.190809
d   -0.186275
e         NaN
dtype: float64
```

## Data ranking

The [rank()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.rank.html#pandas.Series.rank) method produces a data ranking with ties being assigned the mean of the ranks (by default) for the group:

```python
In [31]: s = pd.Series(np.random.np.random.randn(5), index=list('abcde'))

In [32]: s['d'] = s['b'] # so there's a tie

In [33]: s.rank()
Out[33]: 
a    5.0
b    2.5
c    1.0
d    2.5
e    4.0
dtype: float64
```

[rank()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.rank.html#pandas.DataFrame.rank) is also a DataFrame method and can rank either the rows (``axis=0``) or the columns (``axis=1``). NaN values are excluded from the ranking.

```python
In [34]: df = pd.DataFrame(np.random.np.random.randn(10, 6))

In [35]: df[4] = df[2][:5] # some ties

In [36]: df
Out[36]: 
          0         1         2         3         4         5
0 -0.904948 -1.163537 -1.457187  0.135463 -1.457187  0.294650
1 -0.976288 -0.244652 -0.748406 -0.999601 -0.748406 -0.800809
2  0.401965  1.460840  1.256057  1.308127  1.256057  0.876004
3  0.205954  0.369552 -0.669304  0.038378 -0.669304  1.140296
4 -0.477586 -0.730705 -1.129149 -0.601463 -1.129149 -0.211196
5 -1.092970 -0.689246  0.908114  0.204848       NaN  0.463347
6  0.376892  0.959292  0.095572 -0.593740       NaN -0.069180
7 -1.002601  1.957794 -0.120708  0.094214       NaN -1.467422
8 -0.547231  0.664402 -0.519424 -0.073254       NaN -1.263544
9 -0.250277 -0.237428 -1.056443  0.419477       NaN  1.375064

In [37]: df.rank(1)
Out[37]: 
     0    1    2    3    4    5
0  4.0  3.0  1.5  5.0  1.5  6.0
1  2.0  6.0  4.5  1.0  4.5  3.0
2  1.0  6.0  3.5  5.0  3.5  2.0
3  4.0  5.0  1.5  3.0  1.5  6.0
4  5.0  3.0  1.5  4.0  1.5  6.0
5  1.0  2.0  5.0  3.0  NaN  4.0
6  4.0  5.0  3.0  1.0  NaN  2.0
7  2.0  5.0  3.0  4.0  NaN  1.0
8  2.0  5.0  3.0  4.0  NaN  1.0
9  2.0  3.0  1.0  4.0  NaN  5.0
```

``rank`` optionally takes a parameter ``ascending`` which by default is true; when false, data is reverse-ranked, with larger values assigned a smaller rank.

``rank`` supports different tie-breaking methods, specified with the ``method`` parameter:

- ``average`` : average rank of tied group
- ``min`` : lowest rank in the group
- ``max`` : highest rank in the group
- ``first`` : ranks assigned in the order they appear in the array