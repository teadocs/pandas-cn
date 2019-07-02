# 拼接

Pandas提供了不同的方法将序列或索引与他们自己或者其他的对象进行拼接，所有的方法都是基于各自的[cat()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Series.str.cat.html#Pandas.Series.str.cat)。 ``Index.str.cat``。

## 将单个序列拼接为一个完整字符串

序列或索引的内容可以进行拼接：

```python
In [41]: s = pd.Series(['a', 'b', 'c', 'd'])

In [42]: s.str.cat(sep=',')
Out[42]: 'a,b,c,d'
```

如果没有额外声明，``sep`` 即分隔符默认为空字串，即``sep=''``：

```python
In [43]: s.str.cat()
Out[43]: 'abcd'
```

默认情况下，缺失值会被忽略。使用``na_rep``参数，可以对缺失值进行赋值：

```python
In [44]: t = pd.Series(['a', 'b', np.nan, 'd'])

In [45]: t.str.cat(sep=',')
Out[45]: 'a,b,d'

In [46]: t.str.cat(sep=',', na_rep='-')
Out[46]: 'a,b,-,d'
```

## 拼接序列和其他类列表型对象为新的序列

[cat()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Series.str.cat.html#Pandas.Series.str.cat) 的第一个参数为类列表对象，但必须要确保长度与序列或索引相同.

```python
In [47]: s.str.cat(['A', 'B', 'C', 'D'])
Out[47]: 
0    aA
1    bB
2    cC
3    dD
dtype: object
```

任何一端的缺失值都会导致之中结果为缺失值，除非使用``na_rep``：

```python
In [48]: s.str.cat(t)
Out[48]: 
0     aa
1     bb
2    NaN
3     dd
dtype: object

In [49]: s.str.cat(t, na_rep='-')
Out[49]: 
0    aa
1    bb
2    c-
3    dd
dtype: object
```

## 拼接序列与类数组对象为新的序列

*New in version 0.23.0*.

``others`` 参数可以是二维的。此时，行数需要与序列或索引的长度相同。

```python
In [50]: d = pd.concat([t, s], axis=1)

In [51]: s
Out[51]: 
0    a
1    b
2    c
3    d
dtype: object

In [52]: d
Out[52]: 
     0  1
0    a  a
1    b  b
2  NaN  c
3    d  d

In [53]: s.str.cat(d, na_rep='-')
Out[53]: 
0    aaa
1    bbb
2    c-c
3    ddd
dtype: object
```

## 对齐拼接序列与带索引的对象成为新的序列

*New in version 0.23.0*.

对于拼接序列或者数据表，我们可以使用 ``join``关键字来对齐索引。

```python
In [54]: u = pd.Series(['b', 'd', 'a', 'c'], index=[1, 3, 0, 2])

In [55]: s
Out[55]: 
0    a
1    b
2    c
3    d
dtype: object

In [56]: u
Out[56]: 
1    b
3    d
0    a
2    c
dtype: object

In [57]: s.str.cat(u)
Out[57]: 
0    ab
1    bd
2    ca
3    dc
dtype: object

In [58]: s.str.cat(u, join='left')
Out[58]: 
0    aa
1    bb
2    cc
3    dd
dtype: object
```

<div class="warning-warp">
<b>警告</b>
<p>
如果不使用  <code>join</code> 关键字，<a href="http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Series.str.cat.html#Pandas.Series.str.cat">cat()</a>方法将会滚回到0.23.0版之前，即（无对齐）模式。但如果任何的索引不一致时，将会抛出一个<code>FutureWarning</code> 警告，因为在未来的版本中，默认行为将改为<code>join='left'</code> 。
</p>
</div>

``join`` 的选项为（``'left'``, ``'outer'``, ``'inner'``, ``'right'``）中的一个。特别的，对齐操作使得两个对象可以是不同的长度。

```python
In [59]: v = pd.Series(['z', 'a', 'b', 'd', 'e'], index=[-1, 0, 1, 3, 4])

In [60]: s
Out[60]: 
0    a
1    b
2    c
3    d
dtype: object

In [61]: v
Out[61]: 
-1    z
 0    a
 1    b
 3    d
 4    e
dtype: object

In [62]: s.str.cat(v, join='left', na_rep='-')
Out[62]: 
0    aa
1    bb
2    c-
3    dd
dtype: object

In [63]: s.str.cat(v, join='outer', na_rep='-')
Out[63]: 
-1    -z
 0    aa
 1    bb
 2    c-
 3    dd
 4    -e
dtype: object
```

当``others``是一个数据表时，也可以执行相同的对齐操作：

```python
In [64]: f = d.loc[[3, 2, 1, 0], :]

In [65]: s
Out[65]: 
0    a
1    b
2    c
3    d
dtype: object

In [66]: f
Out[66]: 
     0  1
3    d  d
2  NaN  c
1    b  b
0    a  a

In [67]: s.str.cat(f, join='left', na_rep='-')
Out[67]: 
0    aaa
1    bbb
2    c-c
3    ddd
dtype: object
```

## 将一个序列与多个对象拼接为一个新的序列

所有的一维，类列表对象都可以任意组合进一个类列表的容器（包括迭代器，dict-视图等）：

```python
In [68]: s
Out[68]: 
0    a
1    b
2    c
3    d
dtype: object

In [69]: u
Out[69]: 
1    b
3    d
0    a
2    c
dtype: object

In [70]: s.str.cat([u, pd.Index(u.values), ['A', 'B', 'C', 'D'], map(str, u.index)], na_rep='-')
Out[70]: 
0    abbA1
1    bddB3
2    caaC0
3    dccD2
dtype: object
```

所有的元素必须与序列或索引有相同的长度，除了那些有索引的，且``join``不为None的对象：

```python
In [71]: v
Out[71]: 
-1    z
 0    a
 1    b
 3    d
 4    e
dtype: object

In [72]: s.str.cat([u, v, ['A', 'B', 'C', 'D']], join='outer', na_rep='-')
Out[72]: 
-1    --z-
 0    aaaA
 1    bbbB
 2    cc-C
 3    dddD
 4    --e-
dtype: object
```

如果在一个包含不同的索引的``others``列表上使用``join='right'``，所有索引的并集将会被作为最终拼接的基础：

```python
In [73]: u.loc[[3]]
Out[73]: 
3    d
dtype: object

In [74]: v.loc[[-1, 0]]
Out[74]: 
-1    z
 0    a
dtype: object

In [75]: s.str.cat([u.loc[[3]], v.loc[[-1, 0]]], join='right', na_rep='-')
Out[75]: 
-1    --z
 0    a-a
 3    dd-
dtype: object
```
