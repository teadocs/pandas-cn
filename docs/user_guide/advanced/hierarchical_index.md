# 具有层次索引的高级索引

Syntactically integrating ``MultiIndex`` in advanced indexing with ``.loc`` is a bit challenging, but we’ve made every effort to do so. In general, MultiIndex keys take the form of tuples. For example, the following works as you would expect:  
语法上，使用``.loc``方法，在高级索引中加入 ``MultiIndex``（多层索引）是有一些挑战的，但是我们一直在尽己所能地去实现这个功能。简单来说，多层索引的索引键（keys）来自元组的格式。例如，下列代码将会按照你的期望工作：
```python
In [36]: df = df.T

In [37]: df
Out[37]: 
                     A         B         C
first second                              
bar   one     0.895717  0.410835 -1.413681
      two     0.805244  0.813850  1.607920
baz   one    -1.206412  0.132003  1.024180
      two     2.565646 -0.827317  0.569605
foo   one     1.431256 -0.076467  0.875906
      two     1.340309 -1.187678 -2.211372
qux   one    -1.170299  1.130127  0.974466
      two    -0.226169 -1.436737 -2.006747

In [38]: df.loc[('bar', 'two'),]
Out[38]: 
A    0.805244
B    0.813850
C    1.607920
Name: (bar, two), dtype: float64
```

Note that ``df.loc['bar', 'two']`` would also work in this example, but this shorthand notation can lead to ambiguity in general.  
注意 ``df.loc['bar', 'two']``也将会在这个用例中正常工作，但是这种便捷的简写方法总的来说是容易产生歧义的。


If you also want to index a specific column with ``.loc``, you must use a tuple like this:  
如果你也希望使用 ``.loc``对某个特定的列进行索引，你需要使用如下的元组样式：
```python
In [39]: df.loc[('bar', 'two'), 'A']
Out[39]: 0.80524402538637851
```

You don’t have to specify all levels of the ``MultiIndex`` by passing only the first elements of the tuple. For example, you can use “partial” indexing to get all elements with ``bar`` in the first level as follows:  
你可以只输入元组的第一个元素，而不需要写出所有的多级索引的每一个层级。例如，你可以使用“局部”索引，来获得所有在第一层为``bar``的元素，参见下例：

df.loc[‘bar’]

This is a shortcut for the slightly more verbose notation ``df.loc[('bar',),]`` (equivalent to ``df.loc['bar',]`` in this example).  
这种方式是对于更为冗长的方式``df.loc[('bar',),]``的一个简写（在本例中，等同于``df.loc['bar',]``）  
“Partial” slicing also works quite nicely.  
您也可以类似地使用“局部”切片。

```python
In [40]: df.loc['baz':'foo']
Out[40]: 
                     A         B         C
first second                              
baz   one    -1.206412  0.132003  1.024180
      two     2.565646 -0.827317  0.569605
foo   one     1.431256 -0.076467  0.875906
      two     1.340309 -1.187678 -2.211372
```

You can slice with a ‘range’ of values, by providing a slice of tuples.  
您可以通过使用一个元组的切片，提供一个值的范围(a ‘range’ of values),来进行切片
```python
In [41]: df.loc[('baz', 'two'):('qux', 'one')]
Out[41]: 
                     A         B         C
first second                              
baz   two     2.565646 -0.827317  0.569605
foo   one     1.431256 -0.076467  0.875906
      two     1.340309 -1.187678 -2.211372
qux   one    -1.170299  1.130127  0.974466

In [42]: df.loc[('baz', 'two'):'foo']
Out[42]: 
                     A         B         C
first second                              
baz   two     2.565646 -0.827317  0.569605
foo   one     1.431256 -0.076467  0.875906
      two     1.340309 -1.187678 -2.211372
```

Passing a list of labels or tuples works similar to reindexing:  
类似于重命名索引（reindexing），您可以通过输入一个标签的元组来实现：
```python
In [43]: df.loc[[('bar', 'two'), ('qux', 'one')]]
Out[43]: 
                     A         B         C
first second                              
bar   two     0.805244  0.813850  1.607920
qux   one    -1.170299  1.130127  0.974466
```

**Note**: It is important to note that tuples and lists are not treated identically in Pandas when it comes to indexing. Whereas a tuple is interpreted as one multi-level key, a list is used to specify several keys. Or in other words, tuples go horizontally (traversing levels), lists go vertically (scanning levels).    
**注意**: 在pandas中，元组和列表，在索引时，是有区别的。一个元组会被识别为一个多层级的索引值（key），而列表被用于表明多个不同的索引值（several keys）。换句话说，元组是按照横向展开的，即水平层级（trasvering levels），而列表是纵向的，即扫描层级（scanning levels）。

Importantly, a list of tuples indexes several complete ``MultiIndex`` keys, whereas a tuple of lists refer to several values within a level:  
注意，一个元组构成的列表提供的是完整的多级索引，而一个列表构成的元组提供的是同一个级别中的多个值

```python
In [44]: s = pd.Series([1, 2, 3, 4, 5, 6],
   ....:               index=pd.MultiIndex.from_product([["A", "B"], ["c", "d", "e"]]))
   ....: 

In [45]: s.loc[[("A", "c"), ("B", "d")]]  # list of tuples
Out[45]: 
A  c    1
B  d    5
dtype: int64

In [46]: s.loc[(["A", "B"], ["c", "d"])]  # tuple of lists
Out[46]: 
A  c    1
   d    2
B  c    4
   d    5
dtype: int64
```

## Using slicers
## 使用切片器
You can slice a ``MultiIndex`` by providing multiple indexers.  
你可以使用多级索引器来切片一个``多级索引``  
You can provide any of the selectors as if you are indexing by label, see [Selection by Label](http://Pandas.pydata.org/Pandas-docs/stable/indexing.html#indexing-label), including slices, lists of labels, labels, and boolean indexers.  
你可以提供任意的选择器，就仿佛你按照标签索引一样，参见[按照标签索引](http://Pandas.pydata.org/Pandas-docs/stable/indexing.html#indexing-label), 包含切片，标签构成的列表，标签，和布尔值索引器。

You can use ``slice(None)`` to select all the contents of that level. You do not need to specify all the *deeper levels*, they will be implied as ``slice(None)``.  
你可以使用``slice(None)``来选择所有的该级别的内容。你不需要指明所有的*深层级别*，他们将按照``slice(None)``的方式来做默认推测。


As usual, **both sides** of the slicers are included as this is label indexing.  
一如既往，切片器的**两侧**都会被包含进来，因为这是按照标签索引的方式进行的。

<div class="warning-warp">
<b>警告</b><p>You should specify all axes in the .loc specifier, meaning the indexer for the index and for the columns. There are some ambiguous cases where the passed indexer could be mis-interpreted as indexing both axes, rather than into say the MultiIndex for the rows.  
<b>警告</b><p>你需要在.loc中声明所有的维度，这意味着同时包含行索引以及列索引。在一些情况下，索引器中的数据有可能会被错误地识别为在两个维度同时进行索引，而不是只对行进行多层级索引。

You should do this:  
建议使用下列的方式：

<pre class="prettyprint language-python">
<code class="hljs">
df.loc[(slice('A1','A3'),.....), :]
</code>
</pre>

You should not do this:  
不建议使用下列的方式：

<pre class="prettyprint language-python">
<code class="hljs">
df.loc[(slice('A1','A3'),.....)]
</code>
</pre>
</div>

```python
In [47]: def mklbl(prefix,n):
   ....:     return ["%s%s" % (prefix,i)  for i in range(n)]
   ....: 

In [48]: miindex = pd.MultiIndex.from_product([mklbl('A',4),
   ....:                                       mklbl('B',2),
   ....:                                       mklbl('C',4),
   ....:                                       mklbl('D',2)])
   ....: 

In [49]: micolumns = pd.MultiIndex.from_tuples([('a','foo'),('a','bar'),
   ....:                                        ('b','foo'),('b','bah')],
   ....:                                       names=['lvl0', 'lvl1'])
   ....: 

In [50]: dfmi = pd.DataFrame(np.arange(len(miindex)*len(micolumns)).reshape((len(miindex),len(micolumns))),
   ....:                     index=miindex,
   ....:                     columns=micolumns).sort_index().sort_index(axis=1)
   ....: 

In [51]: dfmi
Out[51]: 
lvl0           a         b     
lvl1         bar  foo  bah  foo
A0 B0 C0 D0    1    0    3    2
         D1    5    4    7    6
      C1 D0    9    8   11   10
         D1   13   12   15   14
      C2 D0   17   16   19   18
         D1   21   20   23   22
      C3 D0   25   24   27   26
...          ...  ...  ...  ...
A3 B1 C0 D1  229  228  231  230
      C1 D0  233  232  235  234
         D1  237  236  239  238
      C2 D0  241  240  243  242
         D1  245  244  247  246
      C3 D0  249  248  251  250
         D1  253  252  255  254

[64 rows x 4 columns]
```

Basic multi-index slicing using slices, lists, and labels.  
使用切片，列表和标签来进行简单的多层级切片

```python
In [52]: dfmi.loc[(slice('A1','A3'), slice(None), ['C1', 'C3']), :]
Out[52]: 
lvl0           a         b     
lvl1         bar  foo  bah  foo
A1 B0 C1 D0   73   72   75   74
         D1   77   76   79   78
      C3 D0   89   88   91   90
         D1   93   92   95   94
   B1 C1 D0  105  104  107  106
         D1  109  108  111  110
      C3 D0  121  120  123  122
...          ...  ...  ...  ...
A3 B0 C1 D1  205  204  207  206
      C3 D0  217  216  219  218
         D1  221  220  223  222
   B1 C1 D0  233  232  235  234
         D1  237  236  239  238
      C3 D0  249  248  251  250
         D1  253  252  255  254

[24 rows x 4 columns]
```

You can use [Pandas.IndexSlice](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.IndexSlice.html#Pandas.IndexSlice) to facilitate a more natural syntax using :, rather than using slice(None).  
你可以使用[pandas.IndexSlice](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.IndexSlice.html#Pandas.IndexSlice)，即使用‘：’，一个更为符合习惯的语法，而不是使用slice(None)。


```python
In [53]: idx = pd.IndexSlice

In [54]: dfmi.loc[idx[:, :, ['C1', 'C3']], idx[:, 'foo']]
Out[54]: 
lvl0           a    b
lvl1         foo  foo
A0 B0 C1 D0    8   10
         D1   12   14
      C3 D0   24   26
         D1   28   30
   B1 C1 D0   40   42
         D1   44   46
      C3 D0   56   58
...          ...  ...
A3 B0 C1 D1  204  206
      C3 D0  216  218
         D1  220  222
   B1 C1 D0  232  234
         D1  236  238
      C3 D0  248  250
         D1  252  254

[32 rows x 2 columns]
```

It is possible to perform quite complicated selections using this method on multiple axes at the same time.  
您可以使用这种方法在两个维度上同时实现非常复杂的选择

```python
In [55]: dfmi.loc['A1', (slice(None), 'foo')]
Out[55]: 
lvl0        a    b
lvl1      foo  foo
B0 C0 D0   64   66
      D1   68   70
   C1 D0   72   74
      D1   76   78
   C2 D0   80   82
      D1   84   86
   C3 D0   88   90
...       ...  ...
B1 C0 D1  100  102
   C1 D0  104  106
      D1  108  110
   C2 D0  112  114
      D1  116  118
   C3 D0  120  122
      D1  124  126

[16 rows x 2 columns]

In [56]: dfmi.loc[idx[:, :, ['C1', 'C3']], idx[:, 'foo']]
Out[56]: 
lvl0           a    b
lvl1         foo  foo
A0 B0 C1 D0    8   10
         D1   12   14
      C3 D0   24   26
         D1   28   30
   B1 C1 D0   40   42
         D1   44   46
      C3 D0   56   58
...          ...  ...
A3 B0 C1 D1  204  206
      C3 D0  216  218
         D1  220  222
   B1 C1 D0  232  234
         D1  236  238
      C3 D0  248  250
         D1  252  254

[32 rows x 2 columns]
```

Using a boolean indexer you can provide selection related to the values.  
使用布尔索引器，您可以对数值进行选择。

```python
In [57]: mask = dfmi[('a', 'foo')] > 200

In [58]: dfmi.loc[idx[mask, :, ['C1', 'C3']], idx[:, 'foo']]
Out[58]: 
lvl0           a    b
lvl1         foo  foo
A3 B0 C1 D1  204  206
      C3 D0  216  218
         D1  220  222
   B1 C1 D0  232  234
         D1  236  238
      C3 D0  248  250
         D1  252  254
```

You can also specify the ``axis`` argument to ``.loc`` to interpret the passed slicers on a single axis.  
您也可以使用``.loc``来明确您所希望的``维度``，从而只在一个维度上来进行切片。

```python
In [59]: dfmi.loc(axis=0)[:, :, ['C1', 'C3']]
Out[59]: 
lvl0           a         b     
lvl1         bar  foo  bah  foo
A0 B0 C1 D0    9    8   11   10
         D1   13   12   15   14
      C3 D0   25   24   27   26
         D1   29   28   31   30
   B1 C1 D0   41   40   43   42
         D1   45   44   47   46
      C3 D0   57   56   59   58
...          ...  ...  ...  ...
A3 B0 C1 D1  205  204  207  206
      C3 D0  217  216  219  218
         D1  221  220  223  222
   B1 C1 D0  233  232  235  234
         D1  237  236  239  238
      C3 D0  249  248  251  250
         D1  253  252  255  254

[32 rows x 4 columns]
```

Furthermore you can set the values using the following methods.  
进一步，您可以使用下列的方式来赋值

```python
In [60]: df2 = dfmi.copy()

In [61]: df2.loc(axis=0)[:, :, ['C1', 'C3']] = -10

In [62]: df2
Out[62]: 
lvl0           a         b     
lvl1         bar  foo  bah  foo
A0 B0 C0 D0    1    0    3    2
         D1    5    4    7    6
      C1 D0  -10  -10  -10  -10
         D1  -10  -10  -10  -10
      C2 D0   17   16   19   18
         D1   21   20   23   22
      C3 D0  -10  -10  -10  -10
...          ...  ...  ...  ...
A3 B1 C0 D1  229  228  231  230
      C1 D0  -10  -10  -10  -10
         D1  -10  -10  -10  -10
      C2 D0  241  240  243  242
         D1  245  244  247  246
      C3 D0  -10  -10  -10  -10
         D1  -10  -10  -10  -10

[64 rows x 4 columns]
```

You can use a right-hand-side of an alignable object as well.  
您也可以在等号的右侧使用一个可以被“重命名”的对象来赋值

```python
In [63]: df2 = dfmi.copy()

In [64]: df2.loc[idx[:, :, ['C1', 'C3']], :] = df2 * 1000

In [65]: df2
Out[65]: 
lvl0              a               b        
lvl1            bar     foo     bah     foo
A0 B0 C0 D0       1       0       3       2
         D1       5       4       7       6
      C1 D0    9000    8000   11000   10000
         D1   13000   12000   15000   14000
      C2 D0      17      16      19      18
         D1      21      20      23      22
      C3 D0   25000   24000   27000   26000
...             ...     ...     ...     ...
A3 B1 C0 D1     229     228     231     230
      C1 D0  233000  232000  235000  234000
         D1  237000  236000  239000  238000
      C2 D0     241     240     243     242
         D1     245     244     247     246
      C3 D0  249000  248000  251000  250000
         D1  253000  252000  255000  254000

[64 rows x 4 columns]
```

## Cross-section
## 交叉选择
The ``xs`` method of ``DataFrame`` additionally takes a level argument to make selecting data at a particular level of a MultiIndex easier.  
``DataFrame`` 的``xs``方法接受一个额外的参数，从而可以简便地在某个特定的多级索引中的某一个层级进行数据的选取。

```python
In [66]: df
Out[66]: 
                     A         B         C
first second                              
bar   one     0.895717  0.410835 -1.413681
      two     0.805244  0.813850  1.607920
baz   one    -1.206412  0.132003  1.024180
      two     2.565646 -0.827317  0.569605
foo   one     1.431256 -0.076467  0.875906
      two     1.340309 -1.187678 -2.211372
qux   one    -1.170299  1.130127  0.974466
      two    -0.226169 -1.436737 -2.006747

In [67]: df.xs('one', level='second')
Out[67]: 
              A         B         C
first                              
bar    0.895717  0.410835 -1.413681
baz   -1.206412  0.132003  1.024180
foo    1.431256 -0.076467  0.875906
qux   -1.170299  1.130127  0.974466
```

```python
# using the slicers
In [68]: df.loc[(slice(None),'one'),:]
Out[68]: 
                     A         B         C
first second                              
bar   one     0.895717  0.410835 -1.413681
baz   one    -1.206412  0.132003  1.024180
foo   one     1.431256 -0.076467  0.875906
qux   one    -1.170299  1.130127  0.974466
```

You can also select on the columns with xs(), by providing the axis argument.  
您也可以用xs()并填写坐标参数来选择列。

```python
In [69]: df = df.T

In [70]: df.xs('one', level='second', axis=1)
Out[70]: 
first       bar       baz       foo       qux
A      0.895717 -1.206412  1.431256 -1.170299
B      0.410835  0.132003 -0.076467  1.130127
C     -1.413681  1.024180  0.875906  0.974466
```

```python
# using the slicers
In [71]: df.loc[:,(slice(None),'one')]
Out[71]: 
first        bar       baz       foo       qux
second       one       one       one       one
A       0.895717 -1.206412  1.431256 -1.170299
B       0.410835  0.132003 -0.076467  1.130127
C      -1.413681  1.024180  0.875906  0.974466
```

xs() also allows selection with multiple keys.  
xs() 也接受多个键（keys）来进行选取

```python
In [72]: df.xs(('one', 'bar'), level=('second', 'first'), axis=1)
Out[72]: 
first        bar
second       one
A       0.895717
B       0.410835
C      -1.413681
# using the slicers
In [73]: df.loc[:,('bar','one')]
Out[73]: 
A    0.895717
B    0.410835
C   -1.413681
Name: (bar, one), dtype: float64
```

You can pass ``drop_level=False`` to xs() to retain the level that was selected.  
您可以向xs()传入 ``drop_level=False`` 来保留那些已经选取的层级。
```python
In [74]: df.xs('one', level='second', axis=1, drop_level=False)
Out[74]: 
first        bar       baz       foo       qux
second       one       one       one       one
A       0.895717 -1.206412  1.431256 -1.170299
B       0.410835  0.132003 -0.076467  1.130127
C      -1.413681  1.024180  0.875906  0.974466
```

Compare the above with the result using drop_level=True (the default value).  
请比较上面，使用drop_level=True (默认值)的结果。
```python
In [75]: df.xs('one', level='second', axis=1, drop_level=True)
Out[75]: 
first       bar       baz       foo       qux
A      0.895717 -1.206412  1.431256 -1.170299
B      0.410835  0.132003 -0.076467  1.130127
C     -1.413681  1.024180  0.875906  0.974466
```

## Advanced reindexing and alignment
## 高级重命名索引及对齐
The parameter ``level`` has been added to the ``reindex`` and ``align`` methods of Pandas objects. This is useful to broadcast values across a level. For instance:  
``level``参数已经被加入到pandas对象中的 ``reindex`` 和 ``align``方法中。这将有助于沿着一个层级来广播值（broadcast values）。例如：

```python
In [76]: midx = pd.MultiIndex(levels=[['zero', 'one'], ['x','y']],
   ....:                      labels=[[1,1,0,0],[1,0,1,0]])
   ....: 

In [77]: df = pd.DataFrame(np.random.randn(4,2), index=midx)

In [78]: df
Out[78]: 
               0         1
one  y  1.519970 -0.493662
     x  0.600178  0.274230
zero y  0.132885 -0.023688
     x  2.410179  1.450520

In [79]: df2 = df.mean(level=0)

In [80]: df2
Out[80]: 
             0         1
one   1.060074 -0.109716
zero  1.271532  0.713416

In [81]: df2.reindex(df.index, level=0)
Out[81]: 
               0         1
one  y  1.060074 -0.109716
     x  1.060074 -0.109716
zero y  1.271532  0.713416
     x  1.271532  0.713416

# aligning
In [82]: df_aligned, df2_aligned = df.align(df2, level=0)

In [83]: df_aligned
Out[83]: 
               0         1
one  y  1.519970 -0.493662
     x  0.600178  0.274230
zero y  0.132885 -0.023688
     x  2.410179  1.450520

In [84]: df2_aligned
Out[84]: 
               0         1
one  y  1.060074 -0.109716
     x  1.060074 -0.109716
zero y  1.271532  0.713416
     x  1.271532  0.713416
```

## Swapping levels with swaplevel()  
## 使用swaplevel()来交换层级
The ``swaplevel`` function can switch the order of two levels:  
``swaplevel``函数可以用来交换两个层级
```python
In [85]: df[:5]
Out[85]: 
               0         1
one  y  1.519970 -0.493662
     x  0.600178  0.274230
zero y  0.132885 -0.023688
     x  2.410179  1.450520

In [86]: df[:5].swaplevel(0, 1, axis=0)
Out[86]: 
               0         1
y one   1.519970 -0.493662
x one   0.600178  0.274230
y zero  0.132885 -0.023688
x zero  2.410179  1.450520
```

## Reordering levels with reorder_levels()
## 使用reorder_levels()来进行层级重排序
The ``reorder_levels`` function generalizes the ``swaplevel`` function, allowing you to permute the hierarchical index levels in one step:  
``reorder_levels``是一个更一般化的 ``swaplevel``方法，允许您用简单的一步来重排列索引的层级
```python
In [87]: df[:5].reorder_levels([1,0], axis=0)
Out[87]: 
               0         1
y one   1.519970 -0.493662
x one   0.600178  0.274230
y zero  0.132885 -0.023688
x zero  2.410179  1.450520
```
