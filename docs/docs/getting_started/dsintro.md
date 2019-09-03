# 数据结构简介

首先，我们将快速、粗略的概述Pandas中的基本数据结构，以帮助您入门。数据类型，索引和轴标记/对齐的基本行为适用于所有对象。首先，导入NumPy并将pandas加载到命名空间中：

``` python
In [1]: import numpy as np

In [2]: import pandas as pd
```

这是一个要记住的基本原则：**数据正确对齐是必须的**。除非您明确不要对齐，否则请不要破坏标签和数据之间的链接。

现在我们将简要介绍数据结构，然后在单独的部分中介绍所有的大类功能和方法。

## Series

[``Series``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.html#pandas.Series)是一维标记的数组，能够保存任何数据类型（整数，字符串，浮点数，Python对象等）。轴标签统称为**索引**。创建 Series 的基本方法是调用：

``` python
>>> s = pd.Series(data, index=index)
```

在这里，``data``可以有很多不同的东西：

- 一个Python词典
- 一个ndarray
- 标量值（如5）

传递的**索引**是轴标签列表。因此，根据**数据的**不同，这可分为几种情况：

**来自ndarray**

如果``data``是ndarray，则**索引**的长度必须与**数据的**长度相同。如果没有传递索引，将创建一个具有值的索引。``[0, ..., len(data) - 1]``

``` python
In [3]: s = pd.Series(np.random.randn(5), index=['a', 'b', 'c', 'd', 'e'])

In [4]: s
Out[4]: 
a    0.469112
b   -0.282863
c   -1.509059
d   -1.135632
e    1.212112
dtype: float64

In [5]: s.index
Out[5]: Index(['a', 'b', 'c', 'd', 'e'], dtype='object')

In [6]: pd.Series(np.random.randn(5))
Out[6]: 
0   -0.173215
1    0.119209
2   -1.044236
3   -0.861849
4   -2.104569
dtype: float64
```

::: tip 注意

pandas支持非唯一索引值。如果尝试不支持重复索引值的操作，则此时将引发异常。懒惰的原因几乎都是基于性能的（计算中有很多实例，比如GroupBy中没有使用索引的部分）。

:::

**从字典**

Series可以从dicts实例化：

``` python
In [7]: d = {'b': 1, 'a': 0, 'c': 2}

In [8]: pd.Series(d)
Out[8]: 
b    1
a    0
c    2
dtype: int64
```

::: tip 注意

当数据是dict，并且未传递``Series``索引时，如果您使用的是Python版本> = 3.6且Pandas版本> = 0.23 ，则索引将按dict的插入顺序排序。

如果您使用的是Python < 3.6或Pandas < 0.23，并且未传递``Series``索引，则索引将是词汇顺序的dict键列表。

:::

在上面的示例中，如果您使用的是低于3.6的Python版本或低于0.23的Pandas版本，``Series``则将按字典键的词法顺序（即而不是）进行排序。``['a', 'b', 'c']````['b', 'a', 'c']``

如果传递索引，则将拉出与索引中的标签对应的数据中的值。

``` python
In [9]: d = {'a': 0., 'b': 1., 'c': 2.}

In [10]: pd.Series(d)
Out[10]: 
a    0.0
b    1.0
c    2.0
dtype: float64

In [11]: pd.Series(d, index=['b', 'c', 'd', 'a'])
Out[11]: 
b    1.0
c    2.0
d    NaN
a    0.0
dtype: float64
```

::: tip 注意

NaN（不是数字）是pandas中使用的标准缺失数据标记。

:::

**从标量值**

如果``data``是标量值，则必须提供索引。将重复该值以匹配**索引**的长度。

``` python
In [12]: pd.Series(5., index=['a', 'b', 'c', 'd', 'e'])
Out[12]: 
a    5.0
b    5.0
c    5.0
d    5.0
e    5.0
dtype: float64
```

### Series是类似ndarray的数据类型

``Series``的行为和``ndarray``非常的相似，并且是大多数NumPy函数的有效参数。但是，切片等操作也会对索引进行切片。

``` python
In [13]: s[0]
Out[13]: 0.4691122999071863

In [14]: s[:3]
Out[14]: 
a    0.469112
b   -0.282863
c   -1.509059
dtype: float64

In [15]: s[s > s.median()]
Out[15]: 
a    0.469112
e    1.212112
dtype: float64

In [16]: s[[4, 3, 1]]
Out[16]: 
e    1.212112
d   -1.135632
b   -0.282863
dtype: float64

In [17]: np.exp(s)
Out[17]: 
a    1.598575
b    0.753623
c    0.221118
d    0.321219
e    3.360575
dtype: float64
```

::: tip 注意

我们将
在[部分中讨论](https://pandas.pydata.org/pandas-docs/stable/user_guide/indexing.html#indexing)基于数组的索引。``s[[4, 3, 1]]``[](https://pandas.pydata.org/pandas-docs/stable/user_guide/indexing.html#indexing)

:::

像NumPy数组一样，Pandas的Series有一个[``dtype``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.dtype.html#pandas.Series.dtype)。

``` python
In [18]: s.dtype
Out[18]: dtype('float64')
```

这通常是NumPy dtype。但是，大Pandas和第三方库在几个地方扩展了NumPy的类型系统，在这种情况下，dtype将是一个[``ExtensionDtype``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.api.extensions.ExtensionDtype.html#pandas.api.extensions.ExtensionDtype)。pandas中的一些示例是[分类数据](https://pandas.pydata.org/pandas-docs/stable/user_guide/categorical.html#categorical)和[Nullable整数数据类型](https://pandas.pydata.org/pandas-docs/stable/user_guide/integer_na.html#integer-na)。请参阅[dtypes](basics.html#basics-dtypes) 
了解更多信息。

如果您需要实际阵列支持a ``Series``，请使用[``Series.array``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.array.html#pandas.Series.array)。

``` python
In [19]: s.array
Out[19]: 
<PandasArray>
[ 0.4691122999071863, -0.2828633443286633, -1.5090585031735124,
 -1.1356323710171934,  1.2121120250208506]
Length: 5, dtype: float64
```

当您需要在没有索引的情况下执行某些操作时（例如，禁用[自动对齐）](#dsintro-alignment)，访问该数组非常有用。

[``Series.array``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.array.html#pandas.Series.array)将永远是一个[``ExtensionArray``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.api.extensions.ExtensionArray.html#pandas.api.extensions.ExtensionArray)。简而言之，ExtensionArray是一个围绕一个或多个*具体*数组的薄包装器，如a
 [``numpy.ndarray``](https://docs.scipy.org/doc/numpy/reference/generated/numpy.ndarray.html#numpy.ndarray)。Pandas知道如何``ExtensionArray``将它存储在一个``Series``或一个列中``DataFrame``。请参阅[dtypes](basics.html#basics-dtypes)了解更多信息。

虽然 Series 是ndarray，如果你需要一个*真正的* ndarray，那么使用
 [``Series.to_numpy()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.to_numpy.html#pandas.Series.to_numpy)。

``` python
In [20]: s.to_numpy()
Out[20]: array([ 0.4691, -0.2829, -1.5091, -1.1356,  1.2121])
```

即使 Series 由a支持[``ExtensionArray``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.api.extensions.ExtensionArray.html#pandas.api.extensions.ExtensionArray)，
 [``Series.to_numpy()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.to_numpy.html#pandas.Series.to_numpy)也会返回NumPy ndarray。

### Series是类似dict（字典）的数据类型

Series类似于固定大小的dict，您可以通过索引标签获取和设置值：

``` python
In [21]: s['a']
Out[21]: 0.4691122999071863

In [22]: s['e'] = 12.

In [23]: s
Out[23]: 
a     0.469112
b    -0.282863
c    -1.509059
d    -1.135632
e    12.000000
dtype: float64

In [24]: 'e' in s
Out[24]: True

In [25]: 'f' in s
Out[25]: False
```

如果未包含标签，则会引发异常：

``` python
>>> s['f']
KeyError: 'f'
```

使用该``get``方法，缺少的标签将返回None或指定的默认值：

``` python
In [26]: s.get('f')

In [27]: s.get('f', np.nan)
Out[27]: nan
```

另请参阅[有关属性访问](https://pandas.pydata.org/pandas-docs/stable/user_guide/indexing.html#indexing-attribute-access)的[部分](https://pandas.pydata.org/pandas-docs/stable/user_guide/indexing.html#indexing-attribute-access)。

### 矢量化操作和标签对齐Series

使用原始NumPy数组时，通常不需要循环使用value-by-value。在pandas中使用Series时也是如此。Series也可以传递到大多数期待ndarray的NumPy方法。

``` python
In [28]: s + s
Out[28]: 
a     0.938225
b    -0.565727
c    -3.018117
d    -2.271265
e    24.000000
dtype: float64

In [29]: s * 2
Out[29]: 
a     0.938225
b    -0.565727
c    -3.018117
d    -2.271265
e    24.000000
dtype: float64

In [30]: np.exp(s)
Out[30]: 
a         1.598575
b         0.753623
c         0.221118
d         0.321219
e    162754.791419
dtype: float64
```

Series和ndarray之间的主要区别在于Series之间的操作会根据标签自动对齐数据。因此，您可以在不考虑所涉及的Series是否具有相同标签的情况下编写计算。

``` python
In [31]: s[1:] + s[:-1]
Out[31]: 
a         NaN
b   -0.565727
c   -3.018117
d   -2.271265
e         NaN
dtype: float64
```

未对齐 Series 之间的操作结果将包含所涉及的索引的**并集**。如果在一个 Series 或另一个 Series 中找不到标签，则结果将标记为缺失``NaN``。能够编写代码而不进行任何明确的数据对齐，可以在交互式数据分析和研究中获得巨大的自由度和灵活性。除了用于处理标记数据的大多数相关工具之外，大Pandas数据结构的集成数据对齐功能设置了Pandas。

::: tip 注意

通常，我们选择使不同索引对象之间的操作的默认结果产生索引的**并集**，以避免信息丢失。尽管缺少数据，但索引标签通常是重要信息，作为计算的一部分。您当然可以选择通过**dropna**函数删除缺少数据的标签。

:::

### 名称属性

Series 还可以有一个``name``属性：

``` python
In [32]: s = pd.Series(np.random.randn(5), name='something')

In [33]: s
Out[33]: 
0   -0.494929
1    1.071804
2    0.721555
3   -0.706771
4   -1.039575
Name: something, dtype: float64

In [34]: s.name
Out[34]: 'something'
```

``name``在许多情况下， Series 会自动分配，特别是在获取1D DataFrame切片时，如下所示。

*版本0.18.0中的新功能。* 

您可以使用该[``pandas.Series.rename()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.rename.html#pandas.Series.rename)方法重命名Series 。

``` python
In [35]: s2 = s.rename("different")

In [36]: s2.name
Out[36]: 'different'
```

请注意，``s``并``s2``参考不同的对象。

## 数据帧

**DataFrame**是一个二维标记数据结构，具有可能不同类型的列。您可以将其视为电子表格或SQL表，或Series对象的字典。它通常是最常用的pandas对象。与Series一样，DataFrame接受许多不同类型的输入：

- 1D ndarray，list，dicts或Series的Dict
- 二维numpy.ndarray
- [结构化或记录](https://docs.scipy.org/doc/numpy/user/basics.rec.html) ndarray
- 一个 ``Series``
- 另一个 ``DataFrame``

除了数据，您还可以选择传递**索引**（行标签）和
 **列**（列标签）参数。如果传递索引和/或列，则可以保证生成的DataFrame的索引和/或列。因此， Series 的字典加上特定索引将丢弃与传递的索引不匹配的所有数据。

如果未传递轴标签，则将根据常识规则从输入数据构造它们。

::: tip 注意

当数据是dict ``columns``且未指定时，``DataFrame``
如果您使用的是Python版本> = 3.6且Pandas> = 0.23 ，则列将按dict的插入顺序排序。

如果您使用的是Python < 3.6或Pandas < 0.23，并且``columns``未指定，则``DataFrame``列将是词汇顺序的dict键列表。

:::

### 来自 Series 的 dict 或 dicts
 
得到的**索引**将是各个**Series**的索引的并集。如果有任何嵌套的dict，则首先将这些dicts转换为Series。如果没有传递列，则列将是dict键的有序列表。

``` python
In [37]: d = {'one': pd.Series([1., 2., 3.], index=['a', 'b', 'c']),
   ....:      'two': pd.Series([1., 2., 3., 4.], index=['a', 'b', 'c', 'd'])}
   ....: 

In [38]: df = pd.DataFrame(d)

In [39]: df
Out[39]: 
   one  two
a  1.0  1.0
b  2.0  2.0
c  3.0  3.0
d  NaN  4.0

In [40]: pd.DataFrame(d, index=['d', 'b', 'a'])
Out[40]: 
   one  two
d  NaN  4.0
b  2.0  2.0
a  1.0  1.0

In [41]: pd.DataFrame(d, index=['d', 'b', 'a'], columns=['two', 'three'])
Out[41]: 
   two three
d  4.0   NaN
b  2.0   NaN
a  1.0   NaN
```

可以通过访问**index**和**columns**属性分别访问行标签和列标签：

::: tip 注意

当一组特定的列与数据的dict一起传递时，传递的列将覆盖dict中的键。

:::

``` python
In [42]: df.index
Out[42]: Index(['a', 'b', 'c', 'd'], dtype='object')

In [43]: df.columns
Out[43]: Index(['one', 'two'], dtype='object')
```

### 来自 ndarrays / lists的字典

ndarrays必须都是相同的长度。如果传递索引，则它必须明显与数组的长度相同。如果没有传递索引，结果将是``range(n)``，``n``数组长度在哪里。

``` python
In [44]: d = {'one': [1., 2., 3., 4.],
   ....:      'two': [4., 3., 2., 1.]}
   ....: 

In [45]: pd.DataFrame(d)
Out[45]: 
   one  two
0  1.0  4.0
1  2.0  3.0
2  3.0  2.0
3  4.0  1.0

In [46]: pd.DataFrame(d, index=['a', 'b', 'c', 'd'])
Out[46]: 
   one  two
a  1.0  4.0
b  2.0  3.0
c  3.0  2.0
d  4.0  1.0
```

### 来自结构化或数组记录

这种情况的处理方式与数组的字典相同。

``` python
In [47]: data = np.zeros((2, ), dtype=[('A', 'i4'), ('B', 'f4'), ('C', 'a10')])

In [48]: data[:] = [(1, 2., 'Hello'), (2, 3., "World")]

In [49]: pd.DataFrame(data)
Out[49]: 
   A    B         C
0  1  2.0  b'Hello'
1  2  3.0  b'World'

In [50]: pd.DataFrame(data, index=['first', 'second'])
Out[50]: 
        A    B         C
first   1  2.0  b'Hello'
second  2  3.0  b'World'

In [51]: pd.DataFrame(data, columns=['C', 'A', 'B'])
Out[51]: 
          C  A    B
0  b'Hello'  1  2.0
1  b'World'  2  3.0
```

::: tip 注意

DataFrame并不像二维NumPy ndarray那样工作。

:::

### 来自dicts列表

``` python
In [52]: data2 = [{'a': 1, 'b': 2}, {'a': 5, 'b': 10, 'c': 20}]

In [53]: pd.DataFrame(data2)
Out[53]: 
   a   b     c
0  1   2   NaN
1  5  10  20.0

In [54]: pd.DataFrame(data2, index=['first', 'second'])
Out[54]: 
        a   b     c
first   1   2   NaN
second  5  10  20.0

In [55]: pd.DataFrame(data2, columns=['a', 'b'])
Out[55]: 
   a   b
0  1   2
1  5  10
```

### 来自元组的词典

您可以通过传递元组字典自动创建MultiIndexed帧。

``` python
In [56]: pd.DataFrame({('a', 'b'): {('A', 'B'): 1, ('A', 'C'): 2},
   ....:               ('a', 'a'): {('A', 'C'): 3, ('A', 'B'): 4},
   ....:               ('a', 'c'): {('A', 'B'): 5, ('A', 'C'): 6},
   ....:               ('b', 'a'): {('A', 'C'): 7, ('A', 'B'): 8},
   ....:               ('b', 'b'): {('A', 'D'): 9, ('A', 'B'): 10}})
   ....: 
Out[56]: 
       a              b      
       b    a    c    a     b
A B  1.0  4.0  5.0  8.0  10.0
  C  2.0  3.0  6.0  7.0   NaN
  D  NaN  NaN  NaN  NaN   9.0
```

### 来自 Series 

结果将是一个与输入Series具有相同索引的DataFrame，以及一个列，其名称是Series的原始名称（仅当没有提供其他列名时）。

**缺失数据**

在[缺失数据](https://pandas.pydata.org/pandas-docs/stable/user_guide/missing_data.html#missing-data) 
部分中将对此主题进行更多说明。要构造包含缺失数据的DataFrame，我们使用它``np.nan``来表示缺失值。或者，您可以将a ``numpy.MaskedArray``
作为data参数传递给DataFrame构造函数，并且其被屏蔽的条目将被视为缺失。

### 替代构造函数

**DataFrame.from_dict**

``DataFrame.from_dict``采用dicts的dict或类似数组序列的dict并返回DataFrame。``DataFrame``除了默认情况下的``orient``参数外，它的操作类似于构造函数``'columns'``，但可以将其设置``'index'``为使用dict键作为行标签。

``` python
In [57]: pd.DataFrame.from_dict(dict([('A', [1, 2, 3]), ('B', [4, 5, 6])]))
Out[57]: 
   A  B
0  1  4
1  2  5
2  3  6
```

如果通过``orient='index'``，则键将是行标签。在这种情况下，您还可以传递所需的列名：

``` python
In [58]: pd.DataFrame.from_dict(dict([('A', [1, 2, 3]), ('B', [4, 5, 6])]),
   ....:                        orient='index', columns=['one', 'two', 'three'])
   ....: 
Out[58]: 
   one  two  three
A    1    2      3
B    4    5      6
```

**DataFrame.from_records**

``DataFrame.from_records``获取元组列表或带有结构化dtype的ndarray。它类似于普通``DataFrame``构造函数，但生成的DataFrame索引可能是结构化dtype的特定字段。例如：

``` python
In [59]: data
Out[59]: 
array([(1, 2., b'Hello'), (2, 3., b'World')],
      dtype=[('A', '<i4'), ('B', '<f4'), ('C', 'S10')])

In [60]: pd.DataFrame.from_records(data, index='C')
Out[60]: 
          A    B
C               
b'Hello'  1  2.0
b'World'  2  3.0
```

### 列选择、添加、删除

您可以在语义上将DataFrame视为类似索引的Series对象的dict。获取，设置和删除列的工作方式与类似的dict操作相同：

``` python
In [61]: df['one']
Out[61]: 
a    1.0
b    2.0
c    3.0
d    NaN
Name: one, dtype: float64

In [62]: df['three'] = df['one'] * df['two']

In [63]: df['flag'] = df['one'] > 2

In [64]: df
Out[64]: 
   one  two  three   flag
a  1.0  1.0    1.0  False
b  2.0  2.0    4.0  False
c  3.0  3.0    9.0   True
d  NaN  4.0    NaN  False
```

列可以像dict一样删除或弹出：

``` python
In [65]: del df['two']

In [66]: three = df.pop('three')

In [67]: df
Out[67]: 
   one   flag
a  1.0  False
b  2.0  False
c  3.0   True
d  NaN  False
```

插入标量值时，它会自然地传播以填充列：

``` python
In [68]: df['foo'] = 'bar'

In [69]: df
Out[69]: 
   one   flag  foo
a  1.0  False  bar
b  2.0  False  bar
c  3.0   True  bar
d  NaN  False  bar
```

插入与DataFrame不具有相同索引的Series时，它将符合DataFrame的索引：

``` python
In [70]: df['one_trunc'] = df['one'][:2]

In [71]: df
Out[71]: 
   one   flag  foo  one_trunc
a  1.0  False  bar        1.0
b  2.0  False  bar        2.0
c  3.0   True  bar        NaN
d  NaN  False  bar        NaN
```

您可以插入原始ndarrays，但它们的长度必须与DataFrame索引的长度相匹配。

默认情况下，列会在末尾插入。该``insert``函数可用于插入列中的特定位置：

``` python
In [72]: df.insert(1, 'bar', df['one'])

In [73]: df
Out[73]: 
   one  bar   flag  foo  one_trunc
a  1.0  1.0  False  bar        1.0
b  2.0  2.0  False  bar        2.0
c  3.0  3.0   True  bar        NaN
d  NaN  NaN  False  bar        NaN
```

### 在方法链中分配新列

受[dplyr](https://dplyr.tidyverse.org/reference/mutate.html)
``mutate``动词的启发，DataFrame有一种[``assign()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.assign.html#pandas.DataFrame.assign)
方法可以让您轻松创建可能从现有列派生的新列。

``` python
In [74]: iris = pd.read_csv('data/iris.data')

In [75]: iris.head()
Out[75]: 
   SepalLength  SepalWidth  PetalLength  PetalWidth         Name
0          5.1         3.5          1.4         0.2  Iris-setosa
1          4.9         3.0          1.4         0.2  Iris-setosa
2          4.7         3.2          1.3         0.2  Iris-setosa
3          4.6         3.1          1.5         0.2  Iris-setosa
4          5.0         3.6          1.4         0.2  Iris-setosa

In [76]: (iris.assign(sepal_ratio=iris['SepalWidth'] / iris['SepalLength'])
   ....:      .head())
   ....: 
Out[76]: 
   SepalLength  SepalWidth  PetalLength  PetalWidth         Name  sepal_ratio
0          5.1         3.5          1.4         0.2  Iris-setosa     0.686275
1          4.9         3.0          1.4         0.2  Iris-setosa     0.612245
2          4.7         3.2          1.3         0.2  Iris-setosa     0.680851
3          4.6         3.1          1.5         0.2  Iris-setosa     0.673913
4          5.0         3.6          1.4         0.2  Iris-setosa     0.720000
```

在上面的示例中，我们插入了一个预先计算的值。我们还可以传递一个参数的函数，以便在分配给的DataFrame上进行求值。

``` python
In [77]: iris.assign(sepal_ratio=lambda x: (x['SepalWidth'] / x['SepalLength'])).head()
Out[77]: 
   SepalLength  SepalWidth  PetalLength  PetalWidth         Name  sepal_ratio
0          5.1         3.5          1.4         0.2  Iris-setosa     0.686275
1          4.9         3.0          1.4         0.2  Iris-setosa     0.612245
2          4.7         3.2          1.3         0.2  Iris-setosa     0.680851
3          4.6         3.1          1.5         0.2  Iris-setosa     0.673913
4          5.0         3.6          1.4         0.2  Iris-setosa     0.720000
```

``assign`` **始终**返回数据的副本，保持原始DataFrame不变。

当您没有对手头的DataFrame的引用时，传递可调用的，而不是要插入的实际值。这``assign``在操作链中使用时很常见。例如，我们可以将DataFrame限制为仅包含Sepal Length大于5的观察值，计算比率，并绘制：

``` python
In [78]: (iris.query('SepalLength > 5')
   ....:      .assign(SepalRatio=lambda x: x.SepalWidth / x.SepalLength,
   ....:              PetalRatio=lambda x: x.PetalWidth / x.PetalLength)
   ....:      .plot(kind='scatter', x='SepalRatio', y='PetalRatio'))
   ....: 
Out[78]: <matplotlib.axes._subplots.AxesSubplot at 0x7f66075a7978>
```

![basics_assign](/static/images/basics_assign.png)

由于函数是传入的，因此在分配给的DataFrame上计算函数。重要的是，这是已经过滤到那些萼片长度大于5的行的DataFrame。首先进行过滤，然后进行比率计算。这是一个我们没有对可用的*过滤* DataFrame 的引用的示例。

功能签名``assign``很简单``**kwargs``。键是新字段的列名，值是要插入的值（例如，a ``Series``或NumPy数组），或者是要在其上调用的一个参数的函数``DataFrame``。一个*副本*的原始数据帧的返回，插入新的值。

*在版本0.23.0中更改的。* 

从Python 3.6开始，``**kwargs``保留了顺序。这允许*依赖*赋值，其中稍后的表达式``**kwargs``可以引用先前在其中创建的列[``assign()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.assign.html#pandas.DataFrame.assign)。

``` python
In [79]: dfa = pd.DataFrame({"A": [1, 2, 3],
   ....:                     "B": [4, 5, 6]})
   ....: 

In [80]: dfa.assign(C=lambda x: x['A'] + x['B'],
   ....:            D=lambda x: x['A'] + x['C'])
   ....: 
Out[80]: 
   A  B  C   D
0  1  4  5   6
1  2  5  7   9
2  3  6  9  12
```

在第二个表达式中，``x['C']``将引用新创建的列，它等于。``dfa['A'] + dfa['B']``

要编写与所有Python版本兼容的代码，请将赋值分成两部分。

``` python
In [81]: dependent = pd.DataFrame({"A": [1, 1, 1]})

In [82]: (dependent.assign(A=lambda x: x['A'] + 1)
   ....:           .assign(B=lambda x: x['A'] + 2))
   ....: 
Out[82]: 
   A  B
0  2  4
1  2  4
2  2  4
```

::: danger 警告

从属赋值可能会巧妙地改变Python 3.6和旧版Python之间的代码行为。

如果你想在3.6之前和之后编写支持python版本的代码，你需要在传递``assign``表达式时要小心

- 更新现有列
- 请参阅相同的新更新列 ``assign``

例如，我们将更新列“A”，然后在创建“B”时引用它。

``` python
>>> dependent = pd.DataFrame({"A": [1, 1, 1]})
>>> dependent.assign(A=lambda x: x["A"] + 1, B=lambda x: x["A"] + 2)
```

对于Python 3.5和更早版本的表述制定``B``指的是“旧”值``A``，。然后输出``[1, 1, 1]``

``` 
A  B
0  2  3
1  2  3
2  2  3
```

对于Python 3.6和以后，表达创建``A``指的是“新”值``A``，，这导致``[2, 2, 2]``

``` 
A  B
0  2  4
1  2  4
2  2  4
```

:::

### 索引/选择

索引的基础知识如下：

手术 | 句法 | 结果
---|---|---
选择列 | df[col] |  Series 
按标签选择行 | df.loc[label] |  Series 
按整数位置选择行 | df.iloc[loc] |  Series 
切片行 | df[5:10] | 数据帧
按布尔向量选择行 | df[bool_vec] | 数据帧

例如，行选择返回一个Series，其索引是DataFrame的列：

``` python
In [83]: df.loc['b']
Out[83]: 
one              2
bar              2
flag         False
foo            bar
one_trunc        2
Name: b, dtype: object

In [84]: df.iloc[2]
Out[84]: 
one             3
bar             3
flag         True
foo           bar
one_trunc     NaN
Name: c, dtype: object
```

有关基于标签的复杂索引和切片的更详尽处理，
请参阅[索引部分](https://pandas.pydata.org/pandas-docs/stable/user_guide/indexing.html#indexing)。
我们将[在重建索引](basics.html#basics-reindexing)一节中介绍重新索引/符合新标签集的基础知识。

### 数据对齐和算术

DataFrame对象之间的数据对齐自动 **在列和索引（行标签）** 上对齐。同样，生成的对象将具有列和行标签的并集。

``` python
In [85]: df = pd.DataFrame(np.random.randn(10, 4), columns=['A', 'B', 'C', 'D'])

In [86]: df2 = pd.DataFrame(np.random.randn(7, 3), columns=['A', 'B', 'C'])

In [87]: df + df2
Out[87]: 
          A         B         C   D
0  0.045691 -0.014138  1.380871 NaN
1 -0.955398 -1.501007  0.037181 NaN
2 -0.662690  1.534833 -0.859691 NaN
3 -2.452949  1.237274 -0.133712 NaN
4  1.414490  1.951676 -2.320422 NaN
5 -0.494922 -1.649727 -1.084601 NaN
6 -1.047551 -0.748572 -0.805479 NaN
7       NaN       NaN       NaN NaN
8       NaN       NaN       NaN NaN
9       NaN       NaN       NaN NaN
```

在DataFrame和Series之间执行操作时，默认行为是在DataFrame**列**上对齐Series**索引**，从而按行进行[广播]((http://docs.scipy.org/doc/numpy/user/basics.broadcasting.html))。例如：
 
``` python
In [88]: df - df.iloc[0]
Out[88]: 
          A         B         C         D
0  0.000000  0.000000  0.000000  0.000000
1 -1.359261 -0.248717 -0.453372 -1.754659
2  0.253128  0.829678  0.010026 -1.991234
3 -1.311128  0.054325 -1.724913 -1.620544
4  0.573025  1.500742 -0.676070  1.367331
5 -1.741248  0.781993 -1.241620 -2.053136
6 -1.240774 -0.869551 -0.153282  0.000430
7 -0.743894  0.411013 -0.929563 -0.282386
8 -1.194921  1.320690  0.238224 -1.482644
9  2.293786  1.856228  0.773289 -1.446531
```

在使用时间序列数据的特殊情况下，如果DataFrame索引包含日期，则广播将按列进行：

``` python
In [89]: index = pd.date_range('1/1/2000', periods=8)

In [90]: df = pd.DataFrame(np.random.randn(8, 3), index=index, columns=list('ABC'))

In [91]: df
Out[91]: 
                   A         B         C
2000-01-01 -1.226825  0.769804 -1.281247
2000-01-02 -0.727707 -0.121306 -0.097883
2000-01-03  0.695775  0.341734  0.959726
2000-01-04 -1.110336 -0.619976  0.149748
2000-01-05 -0.732339  0.687738  0.176444
2000-01-06  0.403310 -0.154951  0.301624
2000-01-07 -2.179861 -1.369849 -0.954208
2000-01-08  1.462696 -1.743161 -0.826591

In [92]: type(df['A'])
Out[92]: pandas.core.series.Series

In [93]: df - df['A']
Out[93]: 
            2000-01-01 00:00:00  2000-01-02 00:00:00  2000-01-03 00:00:00  2000-01-04 00:00:00  ...  2000-01-08 00:00:00   A   B   C
2000-01-01                  NaN                  NaN                  NaN                  NaN  ...                  NaN NaN NaN NaN
2000-01-02                  NaN                  NaN                  NaN                  NaN  ...                  NaN NaN NaN NaN
2000-01-03                  NaN                  NaN                  NaN                  NaN  ...                  NaN NaN NaN NaN
2000-01-04                  NaN                  NaN                  NaN                  NaN  ...                  NaN NaN NaN NaN
2000-01-05                  NaN                  NaN                  NaN                  NaN  ...                  NaN NaN NaN NaN
2000-01-06                  NaN                  NaN                  NaN                  NaN  ...                  NaN NaN NaN NaN
2000-01-07                  NaN                  NaN                  NaN                  NaN  ...                  NaN NaN NaN NaN
2000-01-08                  NaN                  NaN                  NaN                  NaN  ...                  NaN NaN NaN NaN

[8 rows x 11 columns]
```

::: danger 警告

``` python
df - df['A']
```

现已弃用，将在以后的版本中删除。复制此行为的首选方法是

``` python
df.sub(df['A'], axis=0)
```

:::

有关匹配和广播行为的显式控制，请参阅[灵活二进制操作](basics.html#basics-binop)一节。

使用标量的操作正如您所期望的那样：

``` python
In [94]: df * 5 + 2
Out[94]: 
                   A         B         C
2000-01-01 -4.134126  5.849018 -4.406237
2000-01-02 -1.638535  1.393469  1.510587
2000-01-03  5.478873  3.708672  6.798628
2000-01-04 -3.551681 -1.099880  2.748742
2000-01-05 -1.661697  5.438692  2.882222
2000-01-06  4.016548  1.225246  3.508122
2000-01-07 -8.899303 -4.849247 -2.771039
2000-01-08  9.313480 -6.715805 -2.132955

In [95]: 1 / df
Out[95]: 
                   A         B          C
2000-01-01 -0.815112  1.299033  -0.780489
2000-01-02 -1.374179 -8.243600 -10.216313
2000-01-03  1.437247  2.926250   1.041965
2000-01-04 -0.900628 -1.612966   6.677871
2000-01-05 -1.365487  1.454041   5.667510
2000-01-06  2.479485 -6.453662   3.315381
2000-01-07 -0.458745 -0.730007  -1.047990
2000-01-08  0.683669 -0.573671  -1.209788

In [96]: df ** 4
Out[96]: 
                    A         B         C
2000-01-01   2.265327  0.351172  2.694833
2000-01-02   0.280431  0.000217  0.000092
2000-01-03   0.234355  0.013638  0.848376
2000-01-04   1.519910  0.147740  0.000503
2000-01-05   0.287640  0.223714  0.000969
2000-01-06   0.026458  0.000576  0.008277
2000-01-07  22.579530  3.521204  0.829033
2000-01-08   4.577374  9.233151  0.466834
```

布尔运算符也可以工作：

``` python
In [97]: df1 = pd.DataFrame({'a': [1, 0, 1], 'b': [0, 1, 1]}, dtype=bool)

In [98]: df2 = pd.DataFrame({'a': [0, 1, 1], 'b': [1, 1, 0]}, dtype=bool)

In [99]: df1 & df2
Out[99]: 
       a      b
0  False  False
1  False   True
2   True  False

In [100]: df1 | df2
Out[100]: 
      a     b
0  True  True
1  True  True
2  True  True

In [101]: df1 ^ df2
Out[101]: 
       a      b
0   True   True
1   True  False
2  False   True

In [102]: -df1
Out[102]: 
       a      b
0  False   True
1   True  False
2  False  False
```

### 转置

要转置，请访问``T``属性（也是``transpose``函数），类似于ndarray：

``` python
# only show the first 5 rows
In [103]: df[:5].T
Out[103]: 
   2000-01-01  2000-01-02  2000-01-03  2000-01-04  2000-01-05
A   -1.226825   -0.727707    0.695775   -1.110336   -0.732339
B    0.769804   -0.121306    0.341734   -0.619976    0.687738
C   -1.281247   -0.097883    0.959726    0.149748    0.176444
```

### DataFrame与NumPy函数的互操作性

Elementwise NumPy ufuncs（log，exp，sqrt，...）和各种其他NumPy函数可以在Series和DataFrame上使用，假设其中的数据是数字：

``` python
In [104]: np.exp(df)
Out[104]: 
                   A         B         C
2000-01-01  0.293222  2.159342  0.277691
2000-01-02  0.483015  0.885763  0.906755
2000-01-03  2.005262  1.407386  2.610980
2000-01-04  0.329448  0.537957  1.161542
2000-01-05  0.480783  1.989212  1.192968
2000-01-06  1.496770  0.856457  1.352053
2000-01-07  0.113057  0.254145  0.385117
2000-01-08  4.317584  0.174966  0.437538

In [105]: np.asarray(df)
Out[105]: 
array([[-1.2268,  0.7698, -1.2812],
       [-0.7277, -0.1213, -0.0979],
       [ 0.6958,  0.3417,  0.9597],
       [-1.1103, -0.62  ,  0.1497],
       [-0.7323,  0.6877,  0.1764],
       [ 0.4033, -0.155 ,  0.3016],
       [-2.1799, -1.3698, -0.9542],
       [ 1.4627, -1.7432, -0.8266]])
```

DataFrame并不是ndarray的替代品，因为它的索引语义和数据模型与n维数组的位置完全不同。

[``Series``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.html#pandas.Series)implements ``__array_ufunc__``，允许它使用NumPy的
 [通用功能](https://docs.scipy.org/doc/numpy/reference/ufuncs.html)。

ufunc应用于Series中的基础数组。

``` python
In [106]: ser = pd.Series([1, 2, 3, 4])

In [107]: np.exp(ser)
Out[107]: 
0     2.718282
1     7.389056
2    20.085537
3    54.598150
dtype: float64
```

*在版本0.25.0中更改：* 当多个``Series``传递给*ufunc* 时，它们在执行操作之前对齐。

与库的其他部分一样，pandas会自动将带标签的输入对齐为具有多个输入的ufunc的一部分。例如，在操作之前使用具有不同排序标签的``numpy.remainder()``
两个[``Series``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.html#pandas.Series)标签将对齐。

``` python
In [108]: ser1 = pd.Series([1, 2, 3], index=['a', 'b', 'c'])

In [109]: ser2 = pd.Series([1, 3, 5], index=['b', 'a', 'c'])

In [110]: ser1
Out[110]: 
a    1
b    2
c    3
dtype: int64

In [111]: ser2
Out[111]: 
b    1
a    3
c    5
dtype: int64

In [112]: np.remainder(ser1, ser2)
Out[112]: 
a    1
b    0
c    3
dtype: int64
```

像往常一样，采用两个索引的并集，并且非重叠值用缺失值填充。

``` python
In [113]: ser3 = pd.Series([2, 4, 6], index=['b', 'c', 'd'])

In [114]: ser3
Out[114]: 
b    2
c    4
d    6
dtype: int64

In [115]: np.remainder(ser1, ser3)
Out[115]: 
a    NaN
b    0.0
c    3.0
d    NaN
dtype: float64
```

当一个二进制ufunc应用于[``Series``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.html#pandas.Series)和[``Index``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Index.html#pandas.Index)，该 Series 执行优先并返回一个 Series 。

``` python
In [116]: ser = pd.Series([1, 2, 3])

In [117]: idx = pd.Index([4, 5, 6])

In [118]: np.maximum(ser, idx)
Out[118]: 
0    4
1    5
2    6
dtype: int64
```

例如，NumPy ufuncs可以安全地应用于[``Series``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Series.html#pandas.Series)非ndarray数组支持[``SparseArray``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.SparseArray.html#pandas.SparseArray)（参见[稀疏计算](https://pandas.pydata.org/pandas-docs/stable/user_guide/sparse.html#sparse-calculation)）。如果可能，应用ufunc而不将基础数据转换为ndarray。

### 控制台显示

将截断非常大的DataFrame以在控制台中显示它们。
您还可以使用[``info()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.info.html#pandas.DataFrame.info)获取摘要。 这里我正在阅读**plyr** R包中的**棒球**数据集的CSV版本）：

``` python
In [119]: baseball = pd.read_csv('data/baseball.csv')

In [120]: print(baseball)
       id     player  year  stint team  lg   g   ab   r    h  X2b  X3b  hr   rbi   sb   cs  bb    so  ibb  hbp   sh   sf  gidp
0   88641  womacto01  2006      2  CHN  NL  19   50   6   14    1    0   1   2.0  1.0  1.0   4   4.0  0.0  0.0  3.0  0.0   0.0
1   88643  schilcu01  2006      1  BOS  AL  31    2   0    1    0    0   0   0.0  0.0  0.0   0   1.0  0.0  0.0  0.0  0.0   0.0
..    ...        ...   ...    ...  ...  ..  ..  ...  ..  ...  ...  ...  ..   ...  ...  ...  ..   ...  ...  ...  ...  ...   ...
98  89533   aloumo01  2007      1  NYN  NL  87  328  51  112   19    1  13  49.0  3.0  0.0  27  30.0  5.0  2.0  0.0  3.0  13.0
99  89534  alomasa02  2007      1  NYN  NL   8   22   1    3    1    0   0   0.0  0.0  0.0   0   3.0  0.0  0.0  0.0  0.0   0.0

[100 rows x 23 columns]

In [121]: baseball.info()
<class 'pandas.core.frame.DataFrame'>
RangeIndex: 100 entries, 0 to 99
Data columns (total 23 columns):
id        100 non-null int64
player    100 non-null object
year      100 non-null int64
stint     100 non-null int64
team      100 non-null object
lg        100 non-null object
g         100 non-null int64
ab        100 non-null int64
r         100 non-null int64
h         100 non-null int64
X2b       100 non-null int64
X3b       100 non-null int64
hr        100 non-null int64
rbi       100 non-null float64
sb        100 non-null float64
cs        100 non-null float64
bb        100 non-null int64
so        100 non-null float64
ibb       100 non-null float64
hbp       100 non-null float64
sh        100 non-null float64
sf        100 non-null float64
gidp      100 non-null float64
dtypes: float64(9), int64(11), object(3)
memory usage: 18.1+ KB
```

但是，使用``to_string`` 将以表格形式返回DataFrame的字符串表示形式，但它并不总是适合控制台宽度：

``` python
In [122]: print(baseball.iloc[-20:, :12].to_string())
       id     player  year  stint team  lg    g   ab   r    h  X2b  X3b
80  89474  finlest01  2007      1  COL  NL   43   94   9   17    3    0
81  89480  embreal01  2007      1  OAK  AL    4    0   0    0    0    0
82  89481  edmonji01  2007      1  SLN  NL  117  365  39   92   15    2
83  89482  easleda01  2007      1  NYN  NL   76  193  24   54    6    0
84  89489  delgaca01  2007      1  NYN  NL  139  538  71  139   30    0
85  89493  cormirh01  2007      1  CIN  NL    6    0   0    0    0    0
86  89494  coninje01  2007      2  NYN  NL   21   41   2    8    2    0
87  89495  coninje01  2007      1  CIN  NL   80  215  23   57   11    1
88  89497  clemero02  2007      1  NYA  AL    2    2   0    1    0    0
89  89498  claytro01  2007      2  BOS  AL    8    6   1    0    0    0
90  89499  claytro01  2007      1  TOR  AL   69  189  23   48   14    0
91  89501  cirilje01  2007      2  ARI  NL   28   40   6    8    4    0
92  89502  cirilje01  2007      1  MIN  AL   50  153  18   40    9    2
93  89521  bondsba01  2007      1  SFN  NL  126  340  75   94   14    0
94  89523  biggicr01  2007      1  HOU  NL  141  517  68  130   31    3
95  89525  benitar01  2007      2  FLO  NL   34    0   0    0    0    0
96  89526  benitar01  2007      1  SFN  NL   19    0   0    0    0    0
97  89530  ausmubr01  2007      1  HOU  NL  117  349  38   82   16    3
98  89533   aloumo01  2007      1  NYN  NL   87  328  51  112   19    1
99  89534  alomasa02  2007      1  NYN  NL    8   22   1    3    1    0
```

默认情况下，宽数据框将跨多行打印：

``` python
In [123]: pd.DataFrame(np.random.randn(3, 12))
Out[123]: 
          0         1         2         3         4         5         6         7         8         9        10        11
0 -0.345352  1.314232  0.690579  0.995761  2.396780  0.014871  3.357427 -0.317441 -1.236269  0.896171 -0.487602 -0.082240
1 -2.182937  0.380396  0.084844  0.432390  1.519970 -0.493662  0.600178  0.274230  0.132885 -0.023688  2.410179  1.450520
2  0.206053 -0.251905 -2.213588  1.063327  1.266143  0.299368 -0.863838  0.408204 -1.048089 -0.025747 -0.988387  0.094055
```

您可以通过设置``display.width``
选项来更改单行打印的数量：

``` python
In [124]: pd.set_option('display.width', 40)  # default is 80

In [125]: pd.DataFrame(np.random.randn(3, 12))
Out[125]: 
          0         1         2         3         4         5         6         7         8         9        10        11
0  1.262731  1.289997  0.082423 -0.055758  0.536580 -0.489682  0.369374 -0.034571 -2.484478 -0.281461  0.030711  0.109121
1  1.126203 -0.977349  1.474071 -0.064034 -1.282782  0.781836 -1.071357  0.441153  2.353925  0.583787  0.221471 -0.744471
2  0.758527  1.729689 -0.964980 -0.845696 -1.340896  1.846883 -1.328865  1.682706 -1.717693  0.888782  0.228440  0.901805
```

您可以通过设置 ``display.max_colwidth`` 调整各列的最大宽度。

``` python
In [126]: datafile = {'filename': ['filename_01', 'filename_02'],
   .....:             'path': ["media/user_name/storage/folder_01/filename_01",
   .....:                      "media/user_name/storage/folder_02/filename_02"]}
   .....: 

In [127]: pd.set_option('display.max_colwidth', 30)

In [128]: pd.DataFrame(datafile)
Out[128]: 
      filename                           path
0  filename_01  media/user_name/storage/fo...
1  filename_02  media/user_name/storage/fo...

In [129]: pd.set_option('display.max_colwidth', 100)

In [130]: pd.DataFrame(datafile)
Out[130]: 
      filename                                           path
0  filename_01  media/user_name/storage/folder_01/filename_01
1  filename_02  media/user_name/storage/folder_02/filename_02
```

您也可以通过该``expand_frame_repr``选项禁用此功能。这将在一个块中打印表。

### DataFrame列属性访问和IPython完成

如果DataFrame列标签是有效的Python变量名称，则可以像属性一样访问该列：

``` python
In [131]: df = pd.DataFrame({'foo1': np.random.randn(5),
   .....:                    'foo2': np.random.randn(5)})
   .....: 

In [132]: df
Out[132]: 
       foo1      foo2
0  1.171216 -0.858447
1  0.520260  0.306996
2 -1.197071 -0.028665
3 -1.066969  0.384316
4 -0.303421  1.574159

In [133]: df.foo1
Out[133]: 
0    1.171216
1    0.520260
2   -1.197071
3   -1.066969
4   -0.303421
Name: foo1, dtype: float64
```

这些列也连接到[IPython](https://ipython.org) 的完成机制，因此它们可以完成制表：

``` python
In [5]: df.fo<TAB>  # noqa: E225, E999
df.foo1  df.foo2
```
