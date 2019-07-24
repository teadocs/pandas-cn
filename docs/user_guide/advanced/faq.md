# 其他索引常见问题

## Integer indexing

## 数值索引

Label-based indexing with integer axis labels is a thorny topic. It has been discussed heavily on mailing lists and among various members of the scientific Python community. In Pandas, our general viewpoint is that labels matter more than integer locations. Therefore, with an integer axis index only label-based indexing is possible with the standard tools like ``.loc``. The following code will generate exceptions:

使用数值作为各维度的标签，再基于标签进行索引是一个非常痛苦的话题。在Scientific Python社区的邮件列表中，进行着剧烈的争论。在Pandas中，我们一般性的观点是，标签比实际的（用数值表示的）位置更为重要。因此，对于使用数值作为标签的的对象来说，只有基于标签的索引才可以在标准工具，例如``.loc``方法，中正常使用。下面的代码将引发错误：

```python
s = pd.Series(range(5))
s[-1]
df = pd.DataFrame(np.random.randn(5, 4))
df
df.loc[-2:]
```

This deliberate decision was made to prevent ambiguities and subtle bugs (many users reported finding bugs when the API change was made to stop “falling back” on position-based indexing).

我们特意地做了这样的设计，是为了阻止歧义性以及一些难以避免的小bug（当我们修改了函数，从而阻止了“滚回”到基于位置的索引方式以后，许多用户报告说，他们发现了bug）。

## Non-monotonic indexes require exact matches

## 非单调索引要求严格匹配



If the index of a ``Series`` or ``DataFrame`` is monotonically increasing or decreasing, then the bounds of a label-based slice can be outside the range of the index, much like slice indexing a normal Python ``list``. Monotonicity of an index can be tested with the ``is_monotonic_increasing`` and ``is_monotonic_decreasing`` attributes.

如果一个  ``序列`` 或者 ``数据表``是单调递增或递减的，那么基于标签的切片行为的边界是可以超出索引的，这与普通的python``列表``的索引切片非常相似。索引的单调性可以使用 ``is_monotonic_increasing`` 和``is_monotonic_decreasing`` 属性来检查

```python
In [183]: df = pd.DataFrame(index=[2,3,3,4,5], columns=['data'], data=list(range(5)))

In [184]: df.index.is_monotonic_increasing
Out[184]: True

# no rows 0 or 1, but still returns rows 2, 3 (both of them), and 4:
In [185]: df.loc[0:4, :]
Out[185]: 
   data
2     0
3     1
3     2
4     3

# slice is are outside the index, so empty DataFrame is returned
In [186]: df.loc[13:15, :]
Out[186]: 
Empty DataFrame
Columns: [data]
Index: []
```

On the other hand, if the index is not monotonic, then both slice bounds must be unique members of the index.

另一方面，如果索引不是单调的，那么切片的两侧边界都必须是索引值中的唯一值。

```python
In [187]: df = pd.DataFrame(index=[2,3,1,4,3,5], columns=['data'], data=list(range(6)))

In [188]: df.index.is_monotonic_increasing
Out[188]: False

# OK because 2 and 4 are in the index
In [189]: df.loc[2:4, :]
Out[189]: 
   data
2     0
3     1
1     2
4     3
```

```python
# 0 is not in the index
In [9]: df.loc[0:4, :]
KeyError: 0

# 3 is not a unique label
In [11]: df.loc[2:3, :]
KeyError: 'Cannot get right slice bound for non-unique label: 3'
```

[Index.is_monotonic_increasing()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Index.is_monotonic_increasing.html#Pandas.Index.is_monotonic_increasing) and [Index.is_monotonic_decreasing()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Index.is_monotonic_decreasing.html#Pandas.Index.is_monotonic_decreasing) only check that an index is weakly monotonic. To check for strict montonicity, you can combine one of those with [Index.is_unique()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Index.is_unique.html#Pandas.Index.is_unique)

[Index.is_monotonic_increasing()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Index.is_monotonic_increasing.html#Pandas.Index.is_monotonic_increasing) 和[Index.is_monotonic_decreasing()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Index.is_monotonic_decreasing.html#Pandas.Index.is_monotonic_decreasing) 方法只能进行弱单调性的检查。要进行严格的单调性检查，你可以配合[Index.is_unique()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Index.is_unique.html#Pandas.Index.is_unique)方法一起使用。



```python
In [190]: weakly_monotonic = pd.Index(['a', 'b', 'c', 'c'])

In [191]: weakly_monotonic
Out[191]: Index(['a', 'b', 'c', 'c'], dtype='object')

In [192]: weakly_monotonic.is_monotonic_increasing
Out[192]: True

In [193]: weakly_monotonic.is_monotonic_increasing & weakly_monotonic.is_unique
Out[193]: False
```

## Endpoints are inclusive

## 终止点被包含在内



Compared with standard Python sequence slicing in which the slice endpoint is not inclusive, label-based slicing in Pandas **is inclusive**. The primary reason for this is that it is often not possible to easily determine the “successor” or next element after a particular label in an index. For example, consider the following Series:

与表中的python序列切片中，终止点不被包含不同，基于标签的切片在Pandas中，终止点是被**包含在内**的。最主要的原因是因为，我们很难准确地确定在索引中的“下一个”标签“到底是什么。例如下面这个序列：

```python
In [194]: s = pd.Series(np.random.randn(6), index=list('abcdef'))

In [195]: s
Out[195]: 
a    0.112246
b    0.871721
c   -0.816064
d   -0.784880
e    1.030659
f    0.187483
dtype: float64
```

Suppose we wished to slice from c to e, using integers this would be accomplished as such:

如果我们希望从c选取到e，如果我们使用基于数值的索引，那将会由如下操作：

```python
In [196]: s[2:5]
Out[196]: 
c   -0.816064
d   -0.784880
e    1.030659
dtype: float64
```

However, if you only had c and e, determining the next element in the index can be somewhat complicated. For example, the following does not work:

然而，如果你只有c和e，确定下一个索引中的元素将会是比较困难的。例如，下面的这种方法完全是行不通的：

```python
s.loc['c':'e'+1]
```

A very common use case is to limit a time series to start and end at two specific dates. To enable this, we made the design to make label-based slicing include both endpoints:

一个非常常见的用例是限制一个时间序列的起始和终止日期。为了能够便于操作，我们决定在基于标签的切片行为中包含两个端点：

```python
In [197]: s.loc['c':'e']
Out[197]: 
c   -0.816064
d   -0.784880
e    1.030659
dtype: float64
```

This is most definitely a “practicality beats purity” sort of thing, but it is something to watch out for if you expect label-based slicing to behave exactly in the way that standard Python integer slicing works.

这是一个非常典型的“显示战胜理想”的情况，但是如果你仅仅是想当然的认为基于标签的索引应该会和标准python中的整数型索引有着相同的行为时，你也确实需要多加留意。

## Indexing potentially changes underlying Series dtype

## 索引会潜在地改变序列的dtype



The different indexing operation can potentially change the dtype of a ``Series``.

不同的索引操作有可能会潜在地改变一个``序列``的dtypes

```python
In [198]: series1 = pd.Series([1, 2, 3])

In [199]: series1.dtype
Out[199]: dtype('int64')

In [200]: res = series1.reindex([0, 4])

In [201]: res.dtype
Out[201]: dtype('float64')

In [202]: res
Out[202]: 
0    1.0
4    NaN
dtype: float64
```

```python
In [203]: series2 = pd.Series([True])

In [204]: series2.dtype
Out[204]: dtype('bool')

In [205]: res = series2.reindex_like(series1)

In [206]: res.dtype
Out[206]: dtype('O')

In [207]: res
Out[207]: 
0    True
1     NaN
2     NaN
dtype: object
```

This is because the (re)indexing operations above silently inserts NaNs and the ``dtype`` changes accordingly. This can cause some issues when using ``numpy ufuncs`` such as ``numpy.logical_and``.

这是因为上述（重新）索引的操作悄悄地插入了NaN，因此dtype也就随之发生改变了。如果你在使用一些numpy的ufunc，如 ``numpy.logical_and``是，将会导致一些问题。

See the [this old issue](https://github.com/pydata/Pandas/issues/2388) for a more detailed discussion.

参见 [this old issue](https://github.com/pydata/Pandas/issues/2388) 了解更详细的讨论过程