# 描述性统计

There exists a large number of methods for computing descriptive statistics and other related operations on [Series](http://pandas.pydata.org/pandas-docs/stable/api.html#api-series-stats), [DataFrame](http://pandas.pydata.org/pandas-docs/stable/api.html#api-dataframe-stats), and [Panel](http://pandas.pydata.org/pandas-docs/stable/api.html#api-panel-stats). Most of these are aggregations (hence producing a lower-dimensional result) like [sum()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.sum.html#pandas.DataFrame.sum), [mean()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.mean.html#pandas.DataFrame.mean), and [quantile()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.quantile.html#pandas.DataFrame.quantile), but some of them, like [cumsum()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.cumsum.html#pandas.DataFrame.cumsum) and [cumprod()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.cumprod.html#pandas.DataFrame.cumprod), produce an object of the same size. Generally speaking, these methods take an axis argument, just like ndarray.{sum, std, …}, but the axis can be specified by name or integer:

- **Series**: no axis argument needed
- **DataFrame**: “index” (axis=0, default), “columns” (axis=1)
- **Panel**: “items” (axis=0), “major” (axis=1, default), “minor” (axis=2)

For example:

```python
In [77]: df
Out[77]: 
        one       two     three
a -1.101558  1.124472       NaN
b -0.177289  2.487104 -0.634293
c  0.462215 -0.486066  1.931194
d       NaN -0.456288 -1.222918

In [78]: df.mean(0)
Out[78]: 
one     -0.272211
two      0.667306
three    0.024661
dtype: float64

In [79]: df.mean(1)
Out[79]: 
a    0.011457
b    0.558507
c    0.635781
d   -0.839603
dtype: float64
```

All such methods have a skipna option signaling whether to exclude missing data (``True`` by default):

```python
In [80]: df.sum(0, skipna=False)
Out[80]: 
one           NaN
two      2.669223
three         NaN
dtype: float64

In [81]: df.sum(axis=1, skipna=True)
Out[81]: 
a    0.022914
b    1.675522
c    1.907343
d   -1.679206
dtype: float64
```

Combined with the broadcasting / arithmetic behavior, one can describe various statistical procedures, like standardization (rendering data zero mean and standard deviation 1), very concisely:

```python
In [82]: ts_stand = (df - df.mean()) / df.std()

In [83]: ts_stand.std()
Out[83]: 
one      1.0
two      1.0
three    1.0
dtype: float64

In [84]: xs_stand = df.sub(df.mean(1), axis=0).div(df.std(1), axis=0)

In [85]: xs_stand.std(1)
Out[85]: 
a    1.0
b    1.0
c    1.0
d    1.0
dtype: float64
```

Note that methods like [cumsum()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.cumsum.html#pandas.DataFrame.cumsum) and [cumprod()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.cumprod.html#pandas.DataFrame.cumprod) preserve the location of NaN values. This is somewhat different from [expanding()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.expanding.html#pandas.DataFrame.expanding) and [rolling()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.rolling.html#pandas.DataFrame.rolling). For more details please see this note.

```python
In [86]: df.cumsum()
Out[86]: 
        one       two     three
a -1.101558  1.124472       NaN
b -1.278848  3.611576 -0.634293
c -0.816633  3.125511  1.296901
d       NaN  2.669223  0.073983
```

Here is a quick reference summary table of common functions. Each also takes an optional level parameter which applies only if the object has a [hierarchical index](http://pandas.pydata.org/pandas-docs/stable/advanced.html#advanced-hierarchical).

Function | Description
---|---
count | Number of non-NA observations
sum | Sum of values
mean | Mean of values
mad | Mean absolute deviation
median | Arithmetic median of values
min | Minimum
max | Maximum
mode | Mode
abs | Absolute Value
prod | Product of values
std | Bessel-corrected sample standard deviation
var | Unbiased variance
sem | Standard error of the mean
skew | Sample skewness (3rd moment)
kurt | Sample kurtosis (4th moment)
quantile | Sample quantile (value at %)
cumsum | Cumulative sum
cumprod | Cumulative product
cummax | Cumulative maximum
cummin | Cumulative minimum

Note that by chance some NumPy methods, like mean, std, and sum, will exclude NAs on Series input by default:

```python
In [87]: np.mean(df['one'])
Out[87]: -0.27221094480450114

In [88]: np.mean(df['one'].values)
Out[88]: nan
```

[Series.nunique()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.nunique.html#pandas.Series.nunique) will return the number of unique non-NA values in a Series:

```python
In [89]: series = pd.Series(np.random.randn(500))

In [90]: series[20:500] = np.nan

In [91]: series[10:20]  = 5

In [92]: series.nunique()
Out[92]: 11
```

## Summarizing data: describe

There is a convenient [describe()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.describe.html#pandas.DataFrame.describe) function which computes a variety of summary statistics about a Series or the columns of a DataFrame (excluding NAs of course):

```python
In [93]: series = pd.Series(np.random.randn(1000))

In [94]: series[::2] = np.nan

In [95]: series.describe()
Out[95]: 
count    500.000000
mean      -0.032127
std        1.067484
min       -3.463789
25%       -0.725523
50%       -0.053230
75%        0.679790
max        3.120271
dtype: float64

In [96]: frame = pd.DataFrame(np.random.randn(1000, 5), columns=['a', 'b', 'c', 'd', 'e'])

In [97]: frame.iloc[::2] = np.nan

In [98]: frame.describe()
Out[98]: 
                a           b           c           d           e
count  500.000000  500.000000  500.000000  500.000000  500.000000
mean    -0.045109   -0.052045    0.024520    0.006117    0.001141
std      1.029268    1.002320    1.042793    1.040134    1.005207
min     -2.915767   -3.294023   -3.610499   -2.907036   -3.010899
25%     -0.763783   -0.720389   -0.609600   -0.665896   -0.682900
50%     -0.086033   -0.048843    0.006093    0.043191   -0.001651
75%      0.663399    0.620980    0.728382    0.735973    0.656439
max      3.400646    2.925597    3.416896    3.331522    3.007143
```

You can select specific percentiles to include in the output:

```python
In [99]: series.describe(percentiles=[.05, .25, .75, .95])
Out[99]: 
count    500.000000
mean      -0.032127
std        1.067484
min       -3.463789
5%        -1.733545
25%       -0.725523
50%       -0.053230
75%        0.679790
95%        1.854383
max        3.120271
dtype: float64
```

By default, the median is always included.

For a non-numerical Series object, [describe()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.describe.html#pandas.Series.describe) will give a simple summary of the number of unique values and most frequently occurring values:

```python
In [100]: s = pd.Series(['a', 'a', 'b', 'b', 'a', 'a', np.nan, 'c', 'd', 'a'])

In [101]: s.describe()
Out[101]: 
count     9
unique    4
top       a
freq      5
dtype: object
```

Note that on a mixed-type DataFrame object, [describe()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.describe.html#pandas.DataFrame.describe) will restrict the summary to include only numerical columns or, if none are, only categorical columns:

```python
In [102]: frame = pd.DataFrame({'a': ['Yes', 'Yes', 'No', 'No'], 'b': range(4)})

In [103]: frame.describe()
Out[103]: 
              b
count  4.000000
mean   1.500000
std    1.290994
min    0.000000
25%    0.750000
50%    1.500000
75%    2.250000
max    3.000000
```

This behaviour can be controlled by providing a list of types as include/exclude arguments. The special value all can also be used:

```python
In [104]: frame.describe(include=['object'])
Out[104]: 
          a
count     4
unique    2
top     Yes
freq      2

In [105]: frame.describe(include=['number'])
Out[105]: 
              b
count  4.000000
mean   1.500000
std    1.290994
min    0.000000
25%    0.750000
50%    1.500000
75%    2.250000
max    3.000000

In [106]: frame.describe(include='all')
Out[106]: 
          a         b
count     4  4.000000
unique    2       NaN
top     Yes       NaN
freq      2       NaN
mean    NaN  1.500000
std     NaN  1.290994
min     NaN  0.000000
25%     NaN  0.750000
50%     NaN  1.500000
75%     NaN  2.250000
max     NaN  3.000000
```

That feature relies on [select_dtypes](http://pandas.pydata.org/pandas-docs/stable/basics.html#basics-selectdtypes). Refer to there for details about accepted inputs.

## Index of Min/Max Values

The [idxmin()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.idxmin.html#pandas.DataFrame.idxmin) and [idxmax()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.idxmax.html#pandas.DataFrame.idxmax) functions on Series and DataFrame compute the index labels with the minimum and maximum corresponding values:

```python
In [107]: s1 = pd.Series(np.random.randn(5))

In [108]: s1
Out[108]: 
0   -1.649461
1    0.169660
2    1.246181
3    0.131682
4   -2.001988
dtype: float64

In [109]: s1.idxmin(), s1.idxmax()
Out[109]: (4, 2)

In [110]: df1 = pd.DataFrame(np.random.randn(5,3), columns=['A','B','C'])

In [111]: df1
Out[111]: 
          A         B         C
0 -1.273023  0.870502  0.214583
1  0.088452 -0.173364  1.207466
2  0.546121  0.409515 -0.310515
3  0.585014 -0.490528 -0.054639
4 -0.239226  0.701089  0.228656

In [112]: df1.idxmin(axis=0)
Out[112]: 
A    0
B    3
C    2
dtype: int64

In [113]: df1.idxmax(axis=1)
Out[113]: 
0    B
1    C
2    A
3    A
4    B
dtype: object
```

When there are multiple rows (or columns) matching the minimum or maximum value, [idxmin()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.idxmin.html#pandas.DataFrame.idxmin) and [idxmax()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.idxmax.html#pandas.DataFrame.idxmax) return the first matching index:

```python
In [114]: df3 = pd.DataFrame([2, 1, 1, 3, np.nan], columns=['A'], index=list('edcba'))

In [115]: df3
Out[115]: 
     A
e  2.0
d  1.0
c  1.0
b  3.0
a  NaN

In [116]: df3['A'].idxmin()
Out[116]: 'd'
```

**Note**: idxmin and idxmax are called argmin and argmax in NumPy.

## Value counts (histogramming) / Mode

The [value_counts()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.value_counts.html#pandas.Series.value_counts) Series method and top-level function computes a histogram of a 1D array of values. It can also be used as a function on regular arrays:

```python
In [117]: data = np.random.randint(0, 7, size=50)

In [118]: data
Out[118]: 
array([3, 3, 0, 2, 1, 0, 5, 5, 3, 6, 1, 5, 6, 2, 0, 0, 6, 3, 3, 5, 0, 4, 3,
       3, 3, 0, 6, 1, 3, 5, 5, 0, 4, 0, 6, 3, 6, 5, 4, 3, 2, 1, 5, 0, 1, 1,
       6, 4, 1, 4])

In [119]: s = pd.Series(data)

In [120]: s.value_counts()
Out[120]: 
3    11
0     9
5     8
6     7
1     7
4     5
2     3
dtype: int64

In [121]: pd.value_counts(data)
Out[121]: 
3    11
0     9
5     8
6     7
1     7
4     5
2     3
dtype: int64
```

Similarly, you can get the most frequently occurring value(s) (the mode) of the values in a Series or DataFrame:

```python
In [122]: s5 = pd.Series([1, 1, 3, 3, 3, 5, 5, 7, 7, 7])

In [123]: s5.mode()
Out[123]: 
0    3
1    7
dtype: int64

In [124]: df5 = pd.DataFrame({"A": np.random.randint(0, 7, size=50),
   .....:                     "B": np.random.randint(-10, 15, size=50)})
   .....: 

In [125]: df5.mode()
Out[125]: 
   A  B
0  2 -5
```

## Discretization and quantiling

Continuous values can be discretized using the [cut()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.cut.html#pandas.cut) (bins based on values) and [qcut()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.qcut.html#pandas.qcut) (bins based on sample quantiles) functions:

```python
In [126]: arr = np.random.randn(20)

In [127]: factor = pd.cut(arr, 4)

In [128]: factor
Out[128]: 
[(-2.611, -1.58], (0.473, 1.499], (-2.611, -1.58], (-1.58, -0.554], (-0.554, 0.473], ..., (0.473, 1.499], (0.473, 1.499], (-0.554, 0.473], (-0.554, 0.473], (-0.554, 0.473]]
Length: 20
Categories (4, interval[float64]): [(-2.611, -1.58] < (-1.58, -0.554] < (-0.554, 0.473] <
                                    (0.473, 1.499]]

In [129]: factor = pd.cut(arr, [-5, -1, 0, 1, 5])

In [130]: factor
Out[130]: 
[(-5, -1], (0, 1], (-5, -1], (-1, 0], (-1, 0], ..., (1, 5], (1, 5], (-1, 0], (-1, 0], (-1, 0]]
Length: 20
Categories (4, interval[int64]): [(-5, -1] < (-1, 0] < (0, 1] < (1, 5]]
```

[qcut()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.qcut.html#pandas.qcut) computes sample quantiles. For example, we could slice up some normally distributed data into equal-size quartiles like so:

```python
In [131]: arr = np.random.randn(30)

In [132]: factor = pd.qcut(arr, [0, .25, .5, .75, 1])

In [133]: factor
Out[133]: 
[(0.544, 1.976], (0.544, 1.976], (-1.255, -0.375], (0.544, 1.976], (-0.103, 0.544], ..., (-0.103, 0.544], (0.544, 1.976], (-0.103, 0.544], (-1.255, -0.375], (-0.375, -0.103]]
Length: 30
Categories (4, interval[float64]): [(-1.255, -0.375] < (-0.375, -0.103] < (-0.103, 0.544] <
                                    (0.544, 1.976]]

In [134]: pd.value_counts(factor)
Out[134]: 
(0.544, 1.976]      8
(-1.255, -0.375]    8
(-0.103, 0.544]     7
(-0.375, -0.103]    7
dtype: int64
```

We can also pass infinite values to define the bins:

```python
In [135]: arr = np.random.randn(20)

In [136]: factor = pd.cut(arr, [-np.inf, 0, np.inf])

In [137]: factor
Out[137]: 
[(0.0, inf], (0.0, inf], (0.0, inf], (0.0, inf], (-inf, 0.0], ..., (-inf, 0.0], (-inf, 0.0], (0.0, inf], (-inf, 0.0], (0.0, inf]]
Length: 20
Categories (2, interval[float64]): [(-inf, 0.0] < (0.0, inf]]
```