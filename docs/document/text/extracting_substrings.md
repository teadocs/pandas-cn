# 提取子字符串

## 提取第一个匹配的对象  (extract)

<div class="warning-warp">
<b>警告</b>
<p>
在 0.18.0中，<code>extract</code> 拥有了 <code>expand</code> 参数。当 <code>expand=False</code>时， 将返回一个序列，索引或者数据表， 这取决于原对象和正则表达式（之前的版本也是如此）。当 <code>expand=True</code> 时，它则总是返回一个``DataFrame``，这样可以更加一致，并且减少用户的混淆。 ``Expand=True`` 从0.23.0版本之后成为默认值。
</p>
</div>

``extract`` 方法接受一个至少含有一个捕获组的 [正则表达式](https://docs.python.org/3/library/re.html) 。

使用超过一个捕获组的正则表达式则会提取并返回一个数据表，每一列为一个捕获组。

```python
In [79]: pd.Series(['a1', 'b2', 'c3']).str.extract('([ab])(\d)', expand=False)
Out[79]: 
     0    1
0    a    1
1    b    2
2  NaN  NaN
```

没有成功匹配的元素将会返回一行``NaN``。因此，一个序列的混乱的字符串可以被‘转换’为一个类似索引的序列或数据表。返回的内容会更为清爽，而且不需要使用``get()``方法来访问元组中的成员或者``re.match``对象。返回的类型将总是``object``类，即使匹配失败，返回的全是``NaN``。

有名称的捕获组，如：

```python
In [80]: pd.Series(['a1', 'b2', 'c3']).str.extract('(?P<letter>[ab])(?P<digit>\d)', expand=False)
Out[80]: 
  letter digit
0      a     1
1      b     2
2    NaN   NaN
```

可选组类似，如：

```python
In [81]: pd.Series(['a1', 'b2', '3']).str.extract('([ab])?(\d)', expand=False)
Out[81]: 
     0  1
0    a  1
1    b  2
2  NaN  3
```

也可以被使用。注意，任何有名称的捕获组，其名称都会被用做列名，否则将会直接使用数字

如果仅使用正则表达式捕获一个组，而``expand=True``，那么仍然将返回一个数据表。

```python
In [82]: pd.Series(['a1', 'b2', 'c3']).str.extract('[ab](\d)', expand=True)
Out[82]: 
     0
0    1
1    2
2  NaN
```

如果``expand=False``，则会返回一个序列。

```python
In [83]: pd.Series(['a1', 'b2', 'c3']).str.extract('[ab](\d)', expand=False)
Out[83]: 
0      1
1      2
2    NaN
dtype: object
```

在索引上使用正则表达式，并且仅捕获一个组时，将会返回一个数据表，如果``expand=True``。

```python
In [84]: s = pd.Series(["a1", "b2", "c3"], ["A11", "B22", "C33"])

In [85]: s
Out[85]: 
A11    a1
B22    b2
C33    c3
dtype: object

In [86]: s.index.str.extract("(?P<letter>[a-zA-Z])", expand=True)
Out[86]: 
  letter
0      A
1      B
2      C
```

如果``expand=False``，则返回一个``Index``。

```python
In [87]: s.index.str.extract("(?P<letter>[a-zA-Z])", expand=False)
Out[87]: Index(['A', 'B', 'C'], dtype='object', name='letter')
```

如果在索引上使用正则并捕获多个组，则返回一个数据表，如果``expand=True``。

```python
In [88]: s.index.str.extract("(?P<letter>[a-zA-Z])([0-9]+)", expand=True)
Out[88]: 
  letter   1
0      A  11
1      B  22
2      C  33
```

 如果 ``expand=False``，则抛出``ValueError``。

```python
>>> s.index.str.extract("(?P<letter>[a-zA-Z])([0-9]+)", expand=False)
ValueError: only one regex group is supported with Index
```

下面的表格总结了``extract (expand=False)``时的行为（输入对象在第一列，捕获组的数量在第一行）

- | 1 group | >1 group
Index | Index | ValueError
Series | Series | DataFrame

## 提取所有的匹配 (extractall)

*New in version 0.18.0*.

不同于 ``extract``（只返回第一个匹配），

```python
In [89]: s = pd.Series(["a1a2", "b1", "c1"], index=["A", "B", "C"])

In [90]: s
Out[90]: 
A    a1a2
B      b1
C      c1
dtype: object

In [91]: two_groups = '(?P<letter>[a-z])(?P<digit>[0-9])'

In [92]: s.str.extract(two_groups, expand=True)
Out[92]: 
  letter digit
A      a     1
B      b     1
C      c     1
```

··``extractall``方法返回所有的匹配。``extractall``总是返回一个带有行多重索引的数据表，最后一级被命名为``match``，它指出匹配的顺序

```python
In [93]: s.str.extractall(two_groups)
Out[93]: 
        letter digit
  match             
A 0          a     1
  1          a     2
B 0          b     1
C 0          c     1
```

当所有的对象字串都只有一个匹配时，

```python
In [94]: s = pd.Series(['a3', 'b3', 'c2'])

In [95]: s
Out[95]: 
0    a3
1    b3
2    c2
dtype: object
```

``extractall(pat).xs(0, level='match')`` 的返回与``extract(pat)``相同。

```python
In [96]: extract_result = s.str.extract(two_groups, expand=True)

In [97]: extract_result
Out[97]: 
  letter digit
0      a     3
1      b     3
2      c     2

In [98]: extractall_result = s.str.extractall(two_groups)

In [99]: extractall_result
Out[99]: 
        letter digit
  match             
0 0          a     3
1 0          b     3
2 0          c     2

In [100]: extractall_result.xs(0, level="match")
Out[100]: 
  letter digit
0      a     3
1      b     3
2      c     2
```

索引也支持``.str.extractall``。 它返回一个数据表，其中包含与``Series.str.estractall``相同的结果，使用默认索引（从0开始）

*New in version 0.19.0*.

```python
In [101]: pd.Index(["a1a2", "b1", "c1"]).str.extractall(two_groups)
Out[101]: 
        letter digit
  match             
0 0          a     1
  1          a     2
1 0          b     1
2 0          c     1

In [102]: pd.Series(["a1a2", "b1", "c1"]).str.extractall(two_groups)
Out[102]: 
        letter digit
  match             
0 0          a     1
  1          a     2
1 0          b     1
2 0          c     1
```
