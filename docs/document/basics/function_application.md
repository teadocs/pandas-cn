# 函数应用

To apply your own or another library’s functions to pandas objects, you should be aware of the three methods below. The appropriate method to use depends on whether your function expects to operate on an entire ``DataFrame`` or ``Series``, row- or column-wise, or elementwise.

1. Tablewise Function Application: pipe()
1. Row or Column-wise Function Application: apply()
1. Aggregation API: agg() and transform()
1. Applying Elementwise Functions: applymap()

## Tablewise Function Application

``DataFrames`` and Series can of course just be passed into functions. However, if the function needs to be called in a chain, consider using the [pipe()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.pipe.html#pandas.DataFrame.pipe) method. Compare the following

```python
# f, g, and h are functions taking and returning ``DataFrames``
>>> f(g(h(df), arg1=1), arg2=2, arg3=3)
```

with the equivalent

```python
>>> (df.pipe(h)
       .pipe(g, arg1=1)
       .pipe(f, arg2=2, arg3=3)
    )
```

Pandas encourages the second style, which is known as method chaining. ``pipe`` makes it easy to use your own or another library’s functions in method chains, alongside pandas’ methods.

In the example above, the functions ``f, g``, and h each expected the ``DataFrame`` as the first positional argument. What if the function you wish to apply takes its data as, say, the second argument? In this case, provide pipe with a tuple of ``(callable, data_keyword)``. ``.pipe`` will route the ``DataFrame`` to the argument specified in the tuple.

For example, we can fit a regression using statsmodels. Their API expects a formula first and a ``DataFrame`` as the second argument, ``data``. We pass in the function, keyword pair ``(sm.ols, 'data')`` to ``pipe``:

```python
In [138]: import statsmodels.formula.api as sm

In [139]: bb = pd.read_csv('data/baseball.csv', index_col='id')

In [140]: (bb.query('h > 0')
   .....:    .assign(ln_h = lambda df: np.log(df.h))
   .....:    .pipe((sm.ols, 'data'), 'hr ~ ln_h + year + g + C(lg)')
   .....:    .fit()
   .....:    .summary()
   .....: )
   .....: 
Out[140]: 
<class 'statsmodels.iolib.summary.Summary'>
"""
                            OLS Regression Results                            
==============================================================================
Dep. Variable:                     hr   R-squared:                       0.685
Model:                            OLS   Adj. R-squared:                  0.665
Method:                 Least Squares   F-statistic:                     34.28
Date:                Sun, 05 Aug 2018   Prob (F-statistic):           3.48e-15
Time:                        11:57:36   Log-Likelihood:                -205.92
No. Observations:                  68   AIC:                             421.8
Df Residuals:                      63   BIC:                             432.9
Df Model:                           4                                         
Covariance Type:            nonrobust                                         
===============================================================================
                  coef    std err          t      P>|t|      [0.025      0.975]
-------------------------------------------------------------------------------
Intercept   -8484.7720   4664.146     -1.819      0.074   -1.78e+04     835.780
C(lg)[T.NL]    -2.2736      1.325     -1.716      0.091      -4.922       0.375
ln_h           -1.3542      0.875     -1.547      0.127      -3.103       0.395
year            4.2277      2.324      1.819      0.074      -0.417       8.872
g               0.1841      0.029      6.258      0.000       0.125       0.243
==============================================================================
Omnibus:                       10.875   Durbin-Watson:                   1.999
Prob(Omnibus):                  0.004   Jarque-Bera (JB):               17.298
Skew:                           0.537   Prob(JB):                     0.000175
Kurtosis:                       5.225   Cond. No.                     1.49e+07
==============================================================================

Warnings:
[1] Standard Errors assume that the covariance matrix of the errors is correctly specified.
[2] The condition number is large, 1.49e+07. This might indicate that there are
strong multicollinearity or other numerical problems.
"""
```

The pipe method is inspired by unix pipes and more recently [dplyr](https://github.com/hadley/dplyr) and [magrittr](https://github.com/smbache/magrittr), which have introduced the popular (%>%) (read pipe) operator for [R](http://www.r-project.org/). The implementation of pipe here is quite clean and feels right at home in python. We encourage you to view the source code of [pipe()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.pipe.html#pandas.DataFrame.pipe).

## Row or Column-wise Function Application

Arbitrary functions can be applied along the axes of a DataFrame using the [apply()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.apply.html#pandas.DataFrame.apply) method, which, like the descriptive statistics methods, takes an optional axis argument:

```python
In [141]: df.apply(np.mean)
Out[141]: 
one     -0.272211
two      0.667306
three    0.024661
dtype: float64

In [142]: df.apply(np.mean, axis=1)
Out[142]: 
a    0.011457
b    0.558507
c    0.635781
d   -0.839603
dtype: float64

In [143]: df.apply(lambda x: x.max() - x.min())
Out[143]: 
one      1.563773
two      2.973170
three    3.154112
dtype: float64

In [144]: df.apply(np.cumsum)
Out[144]: 
        one       two     three
a -1.101558  1.124472       NaN
b -1.278848  3.611576 -0.634293
c -0.816633  3.125511  1.296901
d       NaN  2.669223  0.073983

In [145]: df.apply(np.exp)
Out[145]: 
        one        two    three
a  0.332353   3.078592      NaN
b  0.837537  12.026397  0.53031
c  1.587586   0.615041  6.89774
d       NaN   0.633631  0.29437
```

The [apply()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.apply.html#pandas.DataFrame.apply) method will also dispatch on a string method name.

```python
In [146]: df.apply('mean')
Out[146]: 
one     -0.272211
two      0.667306
three    0.024661
dtype: float64

In [147]: df.apply('mean', axis=1)
Out[147]: 
a    0.011457
b    0.558507
c    0.635781
d   -0.839603
dtype: float64
```

The return type of the function passed to [apply()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.apply.html#pandas.DataFrame.apply) affects the type of the final output from DataFrame.apply for the default behaviour:

- If the applied function returns a Series, the final output is a ``DataFrame``. The columns match the index of the ``Series`` returned by the applied function.
- If the applied function returns any other type, the final output is a Series.

This default behaviour can be overridden using the ``result_type``, which accepts three options: ``reduce``, ``broadcast``, and ``expand``. These will determine how list-likes return values expand (or not) to a ``DataFrame``.

[apply()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.apply.html#pandas.DataFrame.apply) combined with some cleverness can be used to answer many questions about a data set. For example, suppose we wanted to extract the date where the maximum value for each column occurred:

```python
In [148]: tsdf = pd.DataFrame(np.random.randn(1000, 3), columns=['A', 'B', 'C'],
   .....:                     index=pd.date_range('1/1/2000', periods=1000))
   .....: 

In [149]: tsdf.apply(lambda x: x.idxmax())
Out[149]: 
A   2001-04-25
B   2002-05-31
C   2002-09-25
dtype: datetime64[ns]
```

You may also pass additional arguments and keyword arguments to the [apply()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.apply.html#pandas.DataFrame.apply) method. For instance, consider the following function you would like to apply:

```python
def subtract_and_divide(x, sub, divide=1):
    return (x - sub) / divide
```

You may then apply this function as follows:

```python
df.apply(subtract_and_divide, args=(5,), divide=3)
```

Another useful feature is the ability to pass Series methods to carry out some Series operation on each column or row:

```python
In [150]: tsdf
Out[150]: 
                   A         B         C
2000-01-01 -0.720299  0.546303 -0.082042
2000-01-02  0.200295 -0.577554 -0.908402
2000-01-03  0.102533  1.653614  0.303319
2000-01-04       NaN       NaN       NaN
2000-01-05       NaN       NaN       NaN
2000-01-06       NaN       NaN       NaN
2000-01-07       NaN       NaN       NaN
2000-01-08  0.532566  0.341548  0.150493
2000-01-09  0.330418  1.761200  0.567133
2000-01-10 -0.251020  1.020099  1.893177

In [151]: tsdf.apply(pd.Series.interpolate)
Out[151]: 
                   A         B         C
2000-01-01 -0.720299  0.546303 -0.082042
2000-01-02  0.200295 -0.577554 -0.908402
2000-01-03  0.102533  1.653614  0.303319
2000-01-04  0.188539  1.391201  0.272754
2000-01-05  0.274546  1.128788  0.242189
2000-01-06  0.360553  0.866374  0.211624
2000-01-07  0.446559  0.603961  0.181059
2000-01-08  0.532566  0.341548  0.150493
2000-01-09  0.330418  1.761200  0.567133
2000-01-10 -0.251020  1.020099  1.893177
```

Finally, [apply()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.apply.html#pandas.DataFrame.apply) takes an argument raw which is False by default, which converts each row or column into a Series before applying the function. When set to True, the passed function will instead receive an ndarray object, which has positive performance implications if you do not need the indexing functionality.

### Aggregation API

*New in version 0.20.0.*

The aggregation API allows one to express possibly multiple aggregation operations in a single concise way. This API is similar across pandas objects, see [groupby API](http://pandas.pydata.org/pandas-docs/stable/groupby.html#groupby-aggregate), the [window functions API](http://pandas.pydata.org/pandas-docs/stable/computation.html#stats-aggregate), and the [resample API](http://pandas.pydata.org/pandas-docs/stable/timeseries.html#timeseries-aggregate). The entry point for aggregation is [DataFrame.aggregate()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.aggregate.html#pandas.DataFrame.aggregate), or the alias [DataFrame.agg()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.agg.html#pandas.DataFrame.agg).

We will use a similar starting frame from above:

```python
In [152]: tsdf = pd.DataFrame(np.random.randn(10, 3), columns=['A', 'B', 'C'],
   .....:                     index=pd.date_range('1/1/2000', periods=10))
   .....: 

In [153]: tsdf.iloc[3:7] = np.nan

In [154]: tsdf
Out[154]: 
                   A         B         C
2000-01-01  0.170247 -0.916844  0.835024
2000-01-02  1.259919  0.801111  0.445614
2000-01-03  1.453046  2.430373  0.653093
2000-01-04       NaN       NaN       NaN
2000-01-05       NaN       NaN       NaN
2000-01-06       NaN       NaN       NaN
2000-01-07       NaN       NaN       NaN
2000-01-08 -1.874526  0.569822 -0.609644
2000-01-09  0.812462  0.565894 -1.461363
2000-01-10 -0.985475  1.388154 -0.078747
```

Using a single function is equivalent to [apply()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.apply.html#pandas.DataFrame.apply). You can also pass named methods as strings. These will return a Series of the aggregated output:

```python
In [155]: tsdf.agg(np.sum)
Out[155]: 
A    0.835673
B    4.838510
C   -0.216025
dtype: float64

In [156]: tsdf.agg('sum')
Out[156]: 
A    0.835673
B    4.838510
C   -0.216025
dtype: float64

# these are equivalent to a ``.sum()`` because we are aggregating on a single function
In [157]: tsdf.sum()
Out[157]: 
A    0.835673
B    4.838510
C   -0.216025
dtype: float64
```

Single aggregations on a ``Series`` this will return a scalar value:

```python
In [158]: tsdf.A.agg('sum')
Out[158]: 0.83567297915820504
```

### Aggregating with multiple functions

You can pass multiple aggregation arguments as a list. The results of each of the passed functions will be a row in the resulting ``DataFrame``. These are naturally named from the aggregation function.

```python
In [159]: tsdf.agg(['sum'])
Out[159]: 
            A        B         C
sum  0.835673  4.83851 -0.216025
```

Multiple functions yield multiple rows:

```python
In [160]: tsdf.agg(['sum', 'mean'])
Out[160]: 
             A         B         C
sum   0.835673  4.838510 -0.216025
mean  0.139279  0.806418 -0.036004
```

On a ``Series``, multiple functions return a Series, indexed by the function names:

```python
In [161]: tsdf.A.agg(['sum', 'mean'])
Out[161]: 
sum     0.835673
mean    0.139279
Name: A, dtype: float64
```

Passing a ``lambda`` function will yield a ``<lambda>`` named row:

```python
In [162]: tsdf.A.agg(['sum', lambda x: x.mean()])
Out[162]: 
sum         0.835673
<lambda>    0.139279
Name: A, dtype: float64
```

Passing a named function will yield that name for the row:

```python
In [163]: def mymean(x):
   .....:    return x.mean()
   .....: 

In [164]: tsdf.A.agg(['sum', mymean])
Out[164]: 
sum       0.835673
mymean    0.139279
Name: A, dtype: float64
```

### Aggregating with a dict

Passing a dictionary of column names to a scalar or a list of scalars, to DataFrame.agg allows you to customize which functions are applied to which columns. Note that the results are not in any particular order, you can use an OrderedDict instead to guarantee ordering.

```python
In [165]: tsdf.agg({'A': 'mean', 'B': 'sum'})
Out[165]: 
A    0.139279
B    4.838510
dtype: float64
```

Passing a list-like will generate a DataFrame output. You will get a matrix-like output of all of the aggregators. The output will consist of all unique functions. Those that are not noted for a particular column will be NaN:

```python
In [166]: tsdf.agg({'A': ['mean', 'min'], 'B': 'sum'})
Out[166]: 
             A        B
mean  0.139279      NaN
min  -1.874526      NaN
sum        NaN  4.83851
```

### Mixed Dtypes

When presented with mixed dtypes that cannot aggregate, ``.agg`` will only take the valid aggregations. This is similar to how groupby ``.agg`` works.

```python
In [167]: mdf = pd.DataFrame({'A': [1, 2, 3],
   .....:                     'B': [1., 2., 3.],
   .....:                     'C': ['foo', 'bar', 'baz'],
   .....:                     'D': pd.date_range('20130101', periods=3)})
   .....: 

In [168]: mdf.dtypes
Out[168]: 
A             int64
B           float64
C            object
D    datetime64[ns]
dtype: object
```

```python
In [169]: mdf.agg(['min', 'sum'])
Out[169]: 
     A    B          C          D
min  1  1.0        bar 2013-01-01
sum  6  6.0  foobarbaz        NaT
```

### Custom describe

With ``.agg()`` is it possible to easily create a custom describe function, similar to the built in [describe function](http://pandas.pydata.org/pandas-docs/stable/basics.html#basics-describe).

```python
In [170]: from functools import partial

In [171]: q_25 = partial(pd.Series.quantile, q=0.25)

In [172]: q_25.__name__ = '25%'

In [173]: q_75 = partial(pd.Series.quantile, q=0.75)

In [174]: q_75.__name__ = '75%'

In [175]: tsdf.agg(['count', 'mean', 'std', 'min', q_25, 'median', q_75, 'max'])
Out[175]: 
               A         B         C
count   6.000000  6.000000  6.000000
mean    0.139279  0.806418 -0.036004
std     1.323362  1.100830  0.874990
min    -1.874526 -0.916844 -1.461363
25%    -0.696544  0.566876 -0.476920
median  0.491354  0.685467  0.183433
75%     1.148055  1.241393  0.601223
max     1.453046  2.430373  0.835024
```

## Transform API

*New in version 0.20.0.*

The [transform()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.transform.html#pandas.DataFrame.transform) method returns an object that is indexed the same (same size) as the original. This API allows you to provide multiple operations at the same time rather than one-by-one. Its API is quite similar to the .agg API.

We create a frame similar to the one used in the above sections.

```python
In [176]: tsdf = pd.DataFrame(np.random.randn(10, 3), columns=['A', 'B', 'C'],
   .....:                     index=pd.date_range('1/1/2000', periods=10))
   .....: 

In [177]: tsdf.iloc[3:7] = np.nan

In [178]: tsdf
Out[178]: 
                   A         B         C
2000-01-01 -0.578465 -0.503335 -0.987140
2000-01-02 -0.767147 -0.266046  1.083797
2000-01-03  0.195348  0.722247 -0.894537
2000-01-04       NaN       NaN       NaN
2000-01-05       NaN       NaN       NaN
2000-01-06       NaN       NaN       NaN
2000-01-07       NaN       NaN       NaN
2000-01-08 -0.556397  0.542165 -0.308675
2000-01-09 -1.010924 -0.672504 -1.139222
2000-01-10  0.354653  0.563622 -0.365106
```

Transform the entire frame. ``.transform()`` allows input functions as: a NumPy function, a string function name or a user defined function.

```python
In [179]: tsdf.transform(np.abs)
Out[179]: 
                   A         B         C
2000-01-01  0.578465  0.503335  0.987140
2000-01-02  0.767147  0.266046  1.083797
2000-01-03  0.195348  0.722247  0.894537
2000-01-04       NaN       NaN       NaN
2000-01-05       NaN       NaN       NaN
2000-01-06       NaN       NaN       NaN
2000-01-07       NaN       NaN       NaN
2000-01-08  0.556397  0.542165  0.308675
2000-01-09  1.010924  0.672504  1.139222
2000-01-10  0.354653  0.563622  0.365106

In [180]: tsdf.transform('abs')
Out[180]: 
                   A         B         C
2000-01-01  0.578465  0.503335  0.987140
2000-01-02  0.767147  0.266046  1.083797
2000-01-03  0.195348  0.722247  0.894537
2000-01-04       NaN       NaN       NaN
2000-01-05       NaN       NaN       NaN
2000-01-06       NaN       NaN       NaN
2000-01-07       NaN       NaN       NaN
2000-01-08  0.556397  0.542165  0.308675
2000-01-09  1.010924  0.672504  1.139222
2000-01-10  0.354653  0.563622  0.365106

In [181]: tsdf.transform(lambda x: x.abs())
Out[181]: 
                   A         B         C
2000-01-01  0.578465  0.503335  0.987140
2000-01-02  0.767147  0.266046  1.083797
2000-01-03  0.195348  0.722247  0.894537
2000-01-04       NaN       NaN       NaN
2000-01-05       NaN       NaN       NaN
2000-01-06       NaN       NaN       NaN
2000-01-07       NaN       NaN       NaN
2000-01-08  0.556397  0.542165  0.308675
2000-01-09  1.010924  0.672504  1.139222
2000-01-10  0.354653  0.563622  0.365106
```

Here [transform()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.transform.html#pandas.DataFrame.transform) received a single function; this is equivalent to a ufunc application.

```python
In [182]: np.abs(tsdf)
Out[182]: 
                   A         B         C
2000-01-01  0.578465  0.503335  0.987140
2000-01-02  0.767147  0.266046  1.083797
2000-01-03  0.195348  0.722247  0.894537
2000-01-04       NaN       NaN       NaN
2000-01-05       NaN       NaN       NaN
2000-01-06       NaN       NaN       NaN
2000-01-07       NaN       NaN       NaN
2000-01-08  0.556397  0.542165  0.308675
2000-01-09  1.010924  0.672504  1.139222
2000-01-10  0.354653  0.563622  0.365106
```

Passing a single function to .transform() with a Series will yield a single Series in return.

```python
In [183]: tsdf.A.transform(np.abs)
Out[183]: 
2000-01-01    0.578465
2000-01-02    0.767147
2000-01-03    0.195348
2000-01-04         NaN
2000-01-05         NaN
2000-01-06         NaN
2000-01-07         NaN
2000-01-08    0.556397
2000-01-09    1.010924
2000-01-10    0.354653
Freq: D, Name: A, dtype: float64
```

### Transform with multiple functions

Passing multiple functions will yield a column multi-indexed DataFrame. The first level will be the original frame column names; the second level will be the names of the transforming functions.

```python
In [184]: tsdf.transform([np.abs, lambda x: x+1])
Out[184]: 
                   A                   B                   C          
            absolute  <lambda>  absolute  <lambda>  absolute  <lambda>
2000-01-01  0.578465  0.421535  0.503335  0.496665  0.987140  0.012860
2000-01-02  0.767147  0.232853  0.266046  0.733954  1.083797  2.083797
2000-01-03  0.195348  1.195348  0.722247  1.722247  0.894537  0.105463
2000-01-04       NaN       NaN       NaN       NaN       NaN       NaN
2000-01-05       NaN       NaN       NaN       NaN       NaN       NaN
2000-01-06       NaN       NaN       NaN       NaN       NaN       NaN
2000-01-07       NaN       NaN       NaN       NaN       NaN       NaN
2000-01-08  0.556397  0.443603  0.542165  1.542165  0.308675  0.691325
2000-01-09  1.010924 -0.010924  0.672504  0.327496  1.139222 -0.139222
2000-01-10  0.354653  1.354653  0.563622  1.563622  0.365106  0.634894
```

Passing multiple functions to a Series will yield a DataFrame. The resulting column names will be the transforming functions.

```python
In [185]: tsdf.A.transform([np.abs, lambda x: x+1])
Out[185]: 
            absolute  <lambda>
2000-01-01  0.578465  0.421535
2000-01-02  0.767147  0.232853
2000-01-03  0.195348  1.195348
2000-01-04       NaN       NaN
2000-01-05       NaN       NaN
2000-01-06       NaN       NaN
2000-01-07       NaN       NaN
2000-01-08  0.556397  0.443603
2000-01-09  1.010924 -0.010924
2000-01-10  0.354653  1.354653
```

### Transforming with a dict

Passing a dict of functions will allow selective transforming per column.

```python
In [186]: tsdf.transform({'A': np.abs, 'B': lambda x: x+1})
Out[186]: 
                   A         B
2000-01-01  0.578465  0.496665
2000-01-02  0.767147  0.733954
2000-01-03  0.195348  1.722247
2000-01-04       NaN       NaN
2000-01-05       NaN       NaN
2000-01-06       NaN       NaN
2000-01-07       NaN       NaN
2000-01-08  0.556397  1.542165
2000-01-09  1.010924  0.327496
2000-01-10  0.354653  1.563622
```

Passing a dict of lists will generate a multi-indexed DataFrame with these selective transforms.

```python
In [187]: tsdf.transform({'A': np.abs, 'B': [lambda x: x+1, 'sqrt']})
Out[187]: 
                   A         B          
            absolute  <lambda>      sqrt
2000-01-01  0.578465  0.496665       NaN
2000-01-02  0.767147  0.733954       NaN
2000-01-03  0.195348  1.722247  0.849851
2000-01-04       NaN       NaN       NaN
2000-01-05       NaN       NaN       NaN
2000-01-06       NaN       NaN       NaN
2000-01-07       NaN       NaN       NaN
2000-01-08  0.556397  1.542165  0.736318
2000-01-09  1.010924  0.327496       NaN
2000-01-10  0.354653  1.563622  0.750748
```

## Applying Elementwise Functions

Since not all functions can be vectorized (accept NumPy arrays and return another array or value), the methods [applymap()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.applymap.html#pandas.DataFrame.applymap) on DataFrame and analogously [map()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.map.html#pandas.Series.map) on Series accept any Python function taking a single value and returning a single value. For example:

```python
In [188]: df4
Out[188]: 
        one       two     three
a -1.101558  1.124472       NaN
b -0.177289  2.487104 -0.634293
c  0.462215 -0.486066  1.931194
d       NaN -0.456288 -1.222918

In [189]: f = lambda x: len(str(x))

In [190]: df4['one'].map(f)
Out[190]: 
a    19
b    20
c    18
d     3
Name: one, dtype: int64

In [191]: df4.applymap(f)
Out[191]: 
   one  two  three
a   19   18      3
b   20   18     19
c   18   20     18
d    3   19     19
```

[Series.map()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.map.html#pandas.Series.map) has an additional feature; it can be used to easily “link” or “map” values defined by a secondary series. This is closely related to [merging/joining functionality](http://pandas.pydata.org/pandas-docs/stable/merging.html#merging):

```python
In [192]: s = pd.Series(['six', 'seven', 'six', 'seven', 'six'],
   .....:               index=['a', 'b', 'c', 'd', 'e'])
   .....: 

In [193]: t = pd.Series({'six' : 6., 'seven' : 7.})

In [194]: s
Out[194]: 
a      six
b    seven
c      six
d    seven
e      six
dtype: object

In [195]: s.map(t)
Out[195]: 
a    6.0
b    7.0
c    6.0
d    7.0
e    6.0
dtype: float64
```

## Applying with a Panel

Applying with a ``Panel`` will pass a ``Series`` to the applied function. If the applied function returns a ``Series``, the result of the application will be a ``Panel``. If the applied function reduces to a scalar, the result of the application will be a ``DataFrame``.

```python
In [196]: import pandas.util.testing as tm

In [197]: panel = tm.makePanel(5)

In [198]: panel
Out[198]: 
<class 'pandas.core.panel.Panel'>
Dimensions: 3 (items) x 5 (major_axis) x 4 (minor_axis)
Items axis: ItemA to ItemC
Major_axis axis: 2000-01-03 00:00:00 to 2000-01-07 00:00:00
Minor_axis axis: A to D

In [199]: panel['ItemA']
Out[199]: 
                   A         B         C         D
2000-01-03  1.092702  0.604244 -2.927808  0.339642
2000-01-04 -1.481449 -0.487265  0.082065  1.499953
2000-01-05  1.781190  1.990533  0.456554 -0.317818
2000-01-06 -0.031543  0.327007 -1.757911  0.447371
2000-01-07  0.480993  1.053639  0.982407 -1.315799
```

A transformational apply.

```python
In [200]: result = panel.apply(lambda x: x*2, axis='items')

In [201]: result
Out[201]: 
<class 'pandas.core.panel.Panel'>
Dimensions: 3 (items) x 5 (major_axis) x 4 (minor_axis)
Items axis: ItemA to ItemC
Major_axis axis: 2000-01-03 00:00:00 to 2000-01-07 00:00:00
Minor_axis axis: A to D

In [202]: result['ItemA']
Out[202]: 
                   A         B         C         D
2000-01-03  2.185405  1.208489 -5.855616  0.679285
2000-01-04 -2.962899 -0.974530  0.164130  2.999905
2000-01-05  3.562379  3.981066  0.913107 -0.635635
2000-01-06 -0.063086  0.654013 -3.515821  0.894742
2000-01-07  0.961986  2.107278  1.964815 -2.631598
```

A reduction operation.

```python
In [203]: panel.apply(lambda x: x.dtype, axis='items')
Out[203]: 
                  A        B        C        D
2000-01-03  float64  float64  float64  float64
2000-01-04  float64  float64  float64  float64
2000-01-05  float64  float64  float64  float64
2000-01-06  float64  float64  float64  float64
2000-01-07  float64  float64  float64  float64
```

A similar reduction type operation.

```python
In [204]: panel.apply(lambda x: x.sum(), axis='major_axis')
Out[204]: 
      ItemA     ItemB     ItemC
A  1.841893  0.918017 -1.160547
B  3.488158 -2.629773  0.603397
C -3.164692  0.805970  0.806501
D  0.653349 -0.152299  0.252577
```

This last reduction is equivalent to:

```python
In [205]: panel.sum('major_axis')
Out[205]: 
      ItemA     ItemB     ItemC
A  1.841893  0.918017 -1.160547
B  3.488158 -2.629773  0.603397
C -3.164692  0.805970  0.806501
D  0.653349 -0.152299  0.252577
```

A transformation operation that returns a Panel, but is computing the z-score across the major_axis.

```python
In [206]: result = panel.apply(
   .....:            lambda x: (x-x.mean())/x.std(),
   .....:            axis='major_axis')
   .....: 

In [207]: result
Out[207]: 
<class 'pandas.core.panel.Panel'>
Dimensions: 3 (items) x 5 (major_axis) x 4 (minor_axis)
Items axis: ItemA to ItemC
Major_axis axis: 2000-01-03 00:00:00 to 2000-01-07 00:00:00
Minor_axis axis: A to D

In [208]: result['ItemA']
Out[208]: 
                   A         B         C         D
2000-01-03  0.585813 -0.102070 -1.394063  0.201263
2000-01-04 -1.496089 -1.295066  0.434343  1.318766
2000-01-05  1.142642  1.413112  0.661833 -0.431942
2000-01-06 -0.323445 -0.405085 -0.683386  0.305017
2000-01-07  0.091079  0.389108  0.981273 -1.393105
```

Apply can also accept multiple axes in the axis argument. This will pass a DataFrame of the cross-section to the applied function.

```python
In [209]: f = lambda x: ((x.T-x.mean(1))/x.std(1)).T

In [210]: result = panel.apply(f, axis = ['items','major_axis'])

In [211]: result
Out[211]: 
<class 'pandas.core.panel.Panel'>
Dimensions: 4 (items) x 5 (major_axis) x 3 (minor_axis)
Items axis: A to D
Major_axis axis: 2000-01-03 00:00:00 to 2000-01-07 00:00:00
Minor_axis axis: ItemA to ItemC

In [212]: result.loc[:,:,'ItemA']
Out[212]: 
                   A         B         C         D
2000-01-03  0.859304  0.448509 -1.109374  0.397237
2000-01-04 -1.053319 -1.063370  0.986639  1.152266
2000-01-05  1.106511  1.143185 -0.093917 -0.583083
2000-01-06  0.561619 -0.835608 -1.075936  0.194525
2000-01-07 -0.339514  1.097901  0.747522 -1.147605
```

This is equivalent to the following:

```python
In [213]: result = pd.Panel(dict([ (ax, f(panel.loc[:,:,ax]))
   .....:                         for ax in panel.minor_axis ]))
   .....: 

In [214]: result
Out[214]: 
<class 'pandas.core.panel.Panel'>
Dimensions: 4 (items) x 5 (major_axis) x 3 (minor_axis)
Items axis: A to D
Major_axis axis: 2000-01-03 00:00:00 to 2000-01-07 00:00:00
Minor_axis axis: ItemA to ItemC

In [215]: result.loc[:,:,'ItemA']
Out[215]: 
                   A         B         C         D
2000-01-03  0.859304  0.448509 -1.109374  0.397237
2000-01-04 -1.053319 -1.063370  0.986639  1.152266
2000-01-05  1.106511  1.143185 -0.093917 -0.583083
2000-01-06  0.561619 -0.835608 -1.075936  0.194525
2000-01-07 -0.339514  1.097901  0.747522 -1.147605
```