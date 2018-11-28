# 缺失数据相关基础知识

## 何时/为何数据丢失？

Some might quibble over our usage of missing. By “missing” we simply mean **NA** (“not available”) or “not present for whatever reason”. Many data sets simply arrive with missing data, either because it exists and was not collected or it never existed. For example, in a collection of financial time series, some of the time series might start on different dates. Thus, values prior to the start date would generally be marked as missing.

In pandas, one of the most common ways that missing data is **introduced** into a data set is by reindexing. For example:

```python
In [1]: df = pd.DataFrame(np.random.randn(5, 3), index=['a', 'c', 'e', 'f', 'h'],
   ...:                   columns=['one', 'two', 'three'])
   ...: 

In [2]: df['four'] = 'bar'

In [3]: df['five'] = df['one'] > 0

In [4]: df
Out[4]: 
        one       two     three four   five
a -0.166778  0.501113 -0.355322  bar  False
c -0.337890  0.580967  0.983801  bar  False
e  0.057802  0.761948 -0.712964  bar   True
f -0.443160 -0.974602  1.047704  bar  False
h -0.717852 -1.053898 -0.019369  bar  False

In [5]: df2 = df.reindex(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'])

In [6]: df2
Out[6]: 
        one       two     three four   five
a -0.166778  0.501113 -0.355322  bar  False
b       NaN       NaN       NaN  NaN    NaN
c -0.337890  0.580967  0.983801  bar  False
d       NaN       NaN       NaN  NaN    NaN
e  0.057802  0.761948 -0.712964  bar   True
f -0.443160 -0.974602  1.047704  bar  False
g       NaN       NaN       NaN  NaN    NaN
h -0.717852 -1.053898 -0.019369  bar  False
```

## Values considered “missing”

As data comes in many shapes and forms, pandas aims to be flexible with regard to handling missing data. While NaN is the default missing value marker for reasons of computational speed and convenience, we need to be able to easily detect this value with data of different types: floating point, integer, boolean, and general object. In many cases, however, the Python None will arise and we wish to also consider that “missing” or “not available” or “NA”.

**Note**: If you want to consider ``inf`` and ``-inf`` to be “NA” in computations, you can set ``pandas.options.mode.use_inf_as_na = True.``

To make detecting missing values easier (and across different array dtypes), pandas provides the [isna()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.isna.html#pandas.isna) and [notna()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.notna.html#pandas.notna) functions, which are also methods on Series and DataFrame objects:

```python
In [7]: df2['one']
Out[7]: 
a   -0.166778
b         NaN
c   -0.337890
d         NaN
e    0.057802
f   -0.443160
g         NaN
h   -0.717852
Name: one, dtype: float64

In [8]: pd.isna(df2['one'])
Out[8]: 
a    False
b     True
c    False
d     True
e    False
f    False
g     True
h    False
Name: one, dtype: bool

In [9]: df2['four'].notna()
Out[9]: 
a     True
b    False
c     True
d    False
e     True
f     True
g    False
h     True
Name: four, dtype: bool

In [10]: df2.isna()
Out[10]: 
     one    two  three   four   five
a  False  False  False  False  False
b   True   True   True   True   True
c  False  False  False  False  False
d   True   True   True   True   True
e  False  False  False  False  False
f  False  False  False  False  False
g   True   True   True   True   True
h  False  False  False  False  False
```

<div class="warning-warp">
<b>警告</b><p>One has to be mindful that in Python (and NumPy), the <code>nan's</code> don’t compare equal, but None's do. Note that pandas/NumPy uses the fact that <code> np.nan != np.nan </code>, and treats None like <code>np.nan</code>.</p>
<pre class="prettyprint language-python">
<code class="hljs">
In [11]: None == None
Out[11]: True

In [12]: np.nan == np.nan
Out[12]: False
</code>
</pre>

So as compared to above, a scalar equality comparison versus a None/np.nan doesn’t provide useful information.

<pre class="prettyprint language-python">
<code class="hljs">
In [13]: df2['one'] == np.nan
Out[13]: 
a    False
b    False
c    False
d    False
e    False
f    False
g    False
h    False
Name: one, dtype: bool
</code>
</pre>
</div>