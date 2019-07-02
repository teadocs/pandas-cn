# 分层索引(多索引)

分层/多级索引在处理复杂的数据分析和数据操作方面为开发者奠定了基础，尤其是在处理高纬度数据处理上。本质上，它使您能够在较低维度的数据结构(如Series (1d)和DataFrame (2d))中存储和操作任意维数的数据。

在本节中，我们将展示“层次”索引的确切含义，以及它如何与上面和前面部分描述的所有panda索引功能集成。稍后，在讨论[group by](http://pandas.pydata.org/pandas-docs/stable/groupby.html#groupby)和[pivoting and ping data](http://pandas.pydata.org/pandas- docs/stable/ping.html # ping)时，我们将展示一些重要的应用程序，以说明它如何帮助构建分析数据的结构。

请参阅[cookbook]((/document/cookbook/index.html))，查看一些高级策略.

在0.24.0版本中的改变:**MultIndex.labels**被更名为**MultIndex.codes**,同时**MultIndex.set_labes**更名为**MultiIndex.set_codes**



## 创建多级索引和分层索引对象

`MultiIndex`对象是标准索引对象的分层模拟，标准`index`对象通常将axis标签存储在panda对象中。您可以将` MultiIndex`看作一个元组数组，其中每个元组都是惟一的。可以从数组列表(使用`MultiIndex.from_arrays()`)、元组数组(使用` MultiIndex.from_tuples()`或交叉迭代器集(使用`MultiIndex.from_product()`)或者将一个`DataFrame`(使用`MultiIndex.from_frame()`)创建多索引。当传递一个元组列表时，索引构造函数将尝试返回一个`MultiIndex`。下面的示例演示了初始化多索引的不同方法。

```python
In [1]: arrays = [['bar', 'bar', 'baz', 'baz', 'foo', 'foo', 'qux', 'qux'],
   ...:           ['one', 'two', 'one', 'two', 'one', 'two', 'one', 'two']]
   ...: 

In [2]: tuples = list(zip(*arrays))

In [3]: tuples
Out[3]: 
[('bar', 'one'),
 ('bar', 'two'),
 ('baz', 'one'),
 ('baz', 'two'),
 ('foo', 'one'),
 ('foo', 'two'),
 ('qux', 'one'),
 ('qux', 'two')]

In [4]: index = pd.MultiIndex.from_tuples(tuples, names=['first', 'second'])

In [5]: index
Out[5]: 
MultiIndex(levels=[['bar', 'baz', 'foo', 'qux'], ['one', 'two']],
           labels=[[0, 0, 1, 1, 2, 2, 3, 3], [0, 1, 0, 1, 0, 1, 0, 1]],
           names=['first', 'second'])

In [6]: s = pd.Series(np.random.randn(8), index=index)

In [7]: s
Out[7]: 
first  second
bar    one       0.469112
       two      -0.282863
baz    one      -1.509059
       two      -1.135632
foo    one       1.212112
       two      -0.173215
qux    one       0.119209
       two      -1.044236
dtype: float64
```

当您想要在两个迭代器中对每个元素进行配对时，可以更容易地使用`MultiIndex.from_product()`函数:

```python
In [8]: iterables = [['bar', 'baz', 'foo', 'qux'], ['one', 'two']]

In [9]: pd.MultiIndex.from_product(iterables, names=['first', 'second'])
Out[9]: 
MultiIndex(levels=[['bar', 'baz', 'foo', 'qux'], ['one', 'two']],
           labels=[[0, 0, 1, 1, 2, 2, 3, 3], [0, 1, 0, 1, 0, 1, 0, 1]],
           names=['first', 'second'])
```

还可以使用`MultiIndex.from_frame()`方法直接将一个`DataFrame`对象构造一个多索引。这是`MultiIndex.to_frame()`的一个补充方法。

0.24.0版本新增。

```python
In [10]: df = pd.DataFrame([['bar', 'one'], ['bar', 'two'],
   ....:                    ['foo', 'one'], ['foo', 'two']],
   ....:                   columns=['first', 'second'])
   ....: 

In [11]: pd.MultiIndex.from_frame(df)
Out[11]: 
MultiIndex(levels=[['bar', 'foo'], ['one', 'two']],
           codes=[[0, 0, 1, 1], [0, 1, 0, 1]],
           names=['first', 'second'])
```

为了方便，您可以将数组列表直接传递到`Series`或`DataFrame`中，从而自动构造一个`MultiIndex`:

```python
In [12]: arrays = [np.array(['bar', 'bar', 'baz', 'baz', 'foo', 'foo', 'qux', 'qux']),
   ....:           np.array(['one', 'two', 'one', 'two', 'one', 'two', 'one', 'two'])]
   ....: 

In [13]: s = pd.Series(np.random.randn(8), index=arrays)

In [14]: s
Out[14]: 
bar  one   -0.861849
     two   -2.104569
baz  one   -0.494929
     two    1.071804
foo  one    0.721555
     two   -0.706771
qux  one   -1.039575
     two    0.271860
dtype: float64

In [15]: df = pd.DataFrame(np.random.randn(8, 4), index=arrays)

In [16]: df
Out[16]: 
                0         1         2         3
bar one -0.424972  0.567020  0.276232 -1.087401
    two -0.673690  0.113648 -1.478427  0.524988
baz one  0.404705  0.577046 -1.715002 -1.039268
    two -0.370647 -1.157892 -1.344312  0.844885
foo one  1.075770 -0.109050  1.643563 -1.469388
    two  0.357021 -0.674600 -1.776904 -0.968914
qux one -1.294524  0.413738  0.276662 -0.472035
    two -0.013960 -0.362543 -0.006154 -0.923061
```

所`MultiIndex`构造函数都接受`names`参数，该参数存储级别本身的字符串名称。如果没有提供name属性，将分配`None`:

```python
In [17]: df.index.names
Out[17]: FrozenList([None, None])
```

此索引可以备份panda对象的任何轴，索引的**级别**由开发者决定:

```python
In [18]: df = pd.DataFrame(np.random.randn(3, 8), index=['A', 'B', 'C'], columns=index)

In [19]: df
Out[19]: 
first        bar                 baz                 foo                 qux          
second       one       two       one       two       one       two       one       two
A       0.895717  0.805244 -1.206412  2.565646  1.431256  1.340309 -1.170299 -0.226169
B       0.410835  0.813850  0.132003 -0.827317 -0.076467 -1.187678  1.130127 -1.436737
C      -1.413681  1.607920  1.024180  0.569605  0.875906 -2.211372  0.974466 -2.006747

In [20]: pd.DataFrame(np.random.randn(6, 6), index=index[:6], columns=index[:6])
Out[20]: 
first              bar                 baz                 foo          
second             one       two       one       two       one       two
first second                                                            
bar   one    -0.410001 -0.078638  0.545952 -1.219217 -1.226825  0.769804
      two    -1.281247 -0.727707 -0.121306 -0.097883  0.695775  0.341734
baz   one     0.959726 -1.110336 -0.619976  0.149748 -0.732339  0.687738
      two     0.176444  0.403310 -0.154951  0.301624 -2.179861 -1.369849
foo   one    -0.954208  1.462696 -1.743161 -0.826591 -0.345352  1.314232
      two     0.690579  0.995761  2.396780  0.014871  3.357427 -0.317441
```

我们已经“稀疏化”了更高级别的索引，使控制台的输出更容易显示。注意，可以使用`pandas.set_options()`中的`multi_sparse`选项控制索引的显示方式:

```python
In [21]: with pd.option_context('display.multi_sparse', False):
   ....:     df
   ....: 
```

值得记住的是，没有什么可以阻止您使用元组作为轴上的原子标签:

```python
In [22]: pd.Series(np.random.randn(8), index=tuples)
Out[22]: 
(bar, one)   -1.236269
(bar, two)    0.896171
(baz, one)   -0.487602
(baz, two)   -0.082240
(foo, one)   -2.182937
(foo, two)    0.380396
(qux, one)    0.084844
(qux, two)    0.432390
dtype: float64
```

`MultiIndex`之所以重要，是因为它允许您进行分组、选择和重新构造操作，我们将在下面的文档和后续部分中进行描述。正如您将在后面的部分中看到的，您可以发现自己使用分层索引的数据，而不需要显式地创建一个`MultiIndex`。然而，当从文件中加载数据时，您可能希望在准备数据集时生成自己的`MultiIndex`。

## 重构层次标签

方法`get_level_values()`将返回特定级别每个位置的标签向量:

```python
In [23]: index.get_level_values(0)
Out[23]: Index(['bar', 'bar', 'baz', 'baz', 'foo', 'foo', 'qux', 'qux'], dtype='object', name='first')

In [24]: index.get_level_values('second')
Out[24]: Index(['one', 'two', 'one', 'two', 'one', 'two', 'one', 'two'], dtype='object', name='second')
```

## 基本索引轴上的多索引

层次索引的一个重要特性是，您可以通过“partial”标签来选择数据，该标签标识数据中的子组。**局部** *选择“降低”层次索引的级别，其结果完全类似于在常规数据aframe中选择列:

```python
In [25]: df['bar']
Out[25]: 
second       one       two
A       0.895717  0.805244
B       0.410835  0.813850
C      -1.413681  1.607920

In [26]: df['bar', 'one']
Out[26]: 
A    0.895717
B    0.410835
C   -1.413681
Name: (bar, one), dtype: float64

In [27]: df['bar']['one']
Out[27]: 
A    0.895717
B    0.410835
C   -1.413681
Name: one, dtype: float64

In [28]: s['qux']
Out[28]: 
one   -1.039575
two    0.271860
dtype: float64
```

有关如何在更深层次上进行选择，请参见[具有层次索引的横截面](http://pandas.pydata.org/pandas- docs/stable/advance.html #advanced-xs)。

## 定义不同层次索引

`MultiIndex`的repr显示了一个索引的所有定义级别，即使它们实际上没有被使用。在切割索引时，您可能会注意到这一点。例如:

```python
In [29]: df.columns  # original MultiIndex
Out[29]: 
MultiIndex(levels=[['bar', 'baz', 'foo', 'qux'], ['one', 'two']],
           labels=[[0, 0, 1, 1, 2, 2, 3, 3], [0, 1, 0, 1, 0, 1, 0, 1]],
           names=['first', 'second'])

In [30]: df[['foo','qux']].columns  # sliced
Out[30]: 
MultiIndex(levels=[['bar', 'baz', 'foo', 'qux'], ['one', 'two']],
           labels=[[2, 2, 3, 3], [0, 1, 0, 1]],
           names=['first', 'second'])
```

这样做是为了避免重新计算级别，从而使切片具有很高的性能。如果只想查看使用的级别，可以使用[MultiIndex.get_level_values() ](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.MultiIndex.get_level_values.html#pandas.MultiIndex.get_level_values)方法。

```python
In [31]: df[['foo','qux']].columns.values
Out[31]: array([('foo', 'one'), ('foo', 'two'), ('qux', 'one'), ('qux', 'two')], dtype=object)

# for a specific level
In [32]: df[['foo','qux']].columns.get_level_values(0)
Out[32]: Index(['foo', 'foo', 'qux', 'qux'], dtype='object', name='first')
```

若要仅使用已使用的级别来重构`MultiIndex `，可以使用`remove_unused_levels()`方法。

*新版本0.20.0*。

```python
In [33]: df[['foo','qux']].columns.remove_unused_levels()
Out[33]: 
MultiIndex(levels=[['foo', 'qux'], ['one', 'two']],
           labels=[[0, 0, 1, 1], [0, 1, 0, 1]],
           names=['first', 'second'])
```

## 数据对齐和使用 `reindex`

在轴上具有`MultiIndex`的不同索引对象之间的操作将如您所期望的那样工作;数据对齐的工作原理与元组索引相同:

```python
In [34]: s + s[:-2]
Out[34]: 
bar  one   -1.723698
     two   -4.209138
baz  one   -0.989859
     two    2.143608
foo  one    1.443110
     two   -1.413542
qux  one         NaN
     two         NaN
dtype: float64

In [35]: s + s[::2]
Out[35]: 
bar  one   -1.723698
     two         NaN
baz  one   -0.989859
     two         NaN
foo  one    1.443110
     two         NaN
qux  one   -2.079150
     two         NaN
dtype: float64
```

`Series/DataFrames`对象的`reindex()` 方法可以调用另一个`MultiIndex` ，甚至一个列表或数组元组:

```python
In [36]: s.reindex(index[:3])
Out[36]: 
first  second
bar    one      -0.861849
       two      -2.104569
baz    one      -0.494929
dtype: float64

In [37]: s.reindex([('foo', 'two'), ('bar', 'one'), ('qux', 'one'), ('baz', 'one')])
Out[37]: 
foo  two   -0.706771
bar  one   -0.861849
qux  one   -1.039575
baz  one   -0.494929
dtype: float64
```