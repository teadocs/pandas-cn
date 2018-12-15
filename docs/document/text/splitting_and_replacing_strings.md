# 拆分和替换字符串

类似``split``的方法返回一个列表类型的序列：

```python
In [15]: s2 = pd.Series(['a_b_c', 'c_d_e', np.nan, 'f_g_h'])

In [16]: s2.str.split('_')
Out[16]: 
0    [a, b, c]
1    [c, d, e]
2          NaN
3    [f, g, h]
dtype: object
```

切分后的列表中的元素可以通过 ``get`` 方法或者 ``[]`` 方法进行读取：

```python
In [17]: s2.str.split('_').str.get(1)
Out[17]: 
0      b
1      d
2    NaN
3      g
dtype: object

In [18]: s2.str.split('_').str[1]
Out[18]: 
0      b
1      d
2    NaN
3      g
dtype: object
```

使用``expand``方法可以轻易地将这种返回展开为一个数据表.

```python
In [19]: s2.str.split('_', expand=True)
Out[19]: 
     0    1    2
0    a    b    c
1    c    d    e
2  NaN  NaN  NaN
3    f    g    h
```

同样，我们也可以限制切分的次数：

```python
In [20]: s2.str.split('_', expand=True, n=1)
Out[20]: 
     0    1
0    a  b_c
1    c  d_e
2  NaN  NaN
3    f  g_h
```

``rsplit``与``split``相似，不同的是，这个切分的方向是反的。即，从字串的尾端向首段切分：

```python
In [21]: s2.str.rsplit('_', expand=True, n=1)
Out[21]: 
     0    1
0  a_b    c
1  c_d    e
2  NaN  NaN
3  f_g    h
```

``replace`` 方法默认使用 [正则表达式](https://docs.python.org/3/library/re.html):

```python
In [22]: s3 = pd.Series(['A', 'B', 'C', 'Aaba', 'Baca',
   ....:                '', np.nan, 'CABA', 'dog', 'cat'])
   ....: 

In [23]: s3
Out[23]: 
0       A
1       B
2       C
3    Aaba
4    Baca
5        
6     NaN
7    CABA
8     dog
9     cat
dtype: object

In [24]: s3.str.replace('^.a|dog', 'XX-XX ', case=False)
Out[24]: 
0           A
1           B
2           C
3    XX-XX ba
4    XX-XX ca
5            
6         NaN
7    XX-XX BA
8      XX-XX 
9     XX-XX t
dtype: object
```

一定要实时记得，是正则表达式，因此要格外小心。例如，因为正则表达式中的‘$’符号,下列代码将会导致一些麻烦：

```python
# Consider the following badly formatted financial data
In [25]: dollars = pd.Series(['12', '-$10', '$10,000'])

# This does what you'd naively expect:
In [26]: dollars.str.replace('$', '')
Out[26]: 
0        12
1       -10
2    10,000
dtype: object

# But this doesn't:
In [27]: dollars.str.replace('-$', '-')
Out[27]: 
0         12
1       -$10
2    $10,000
dtype: object

# We need to escape the special character (for >1 len patterns)
In [28]: dollars.str.replace(r'-\$', '-')
Out[28]: 
0         12
1        -10
2    $10,000
dtype: object
```

*New in version 0.23.0*.

如果你只是向单纯地替换字符(（等价于python中的[str.replace()](https://docs.python.org/3/library/stdtypes.html#str.replace)), ，你可以将可选参数 ``regex`` 设置为 ``False``，而不是傻傻地转义所有符号。这种情况下，``pat`` 和 ``repl`` 就都将作为普通字符对待：

```python
# These lines are equivalent
In [29]: dollars.str.replace(r'-\$', '-')
Out[29]: 
0         12
1        -10
2    $10,000
dtype: object

In [30]: dollars.str.replace('-$', '-', regex=False)
Out[30]: 
0         12
1        -10
2    $10,000
dtype: object
```

*New in version 0.20.0*.

``replace`` 方法也可以传入一个可调用对象作为替换值。它针对每一个 ``pat`` 通过 [re.sub()](https://docs.python.org/3/library/re.html#re.sub)来调用。可调用对象应只具有一个形参（一个正则表达式对象）并且返回一个字符串。

```python
# Reverse every lowercase alphabetic word
In [31]: pat = r'[a-z]+'

In [32]: repl = lambda m: m.group(0)[::-1]

In [33]: pd.Series(['foo 123', 'bar baz', np.nan]).str.replace(pat, repl)
Out[33]: 
0    oof 123
1    rab zab
2        NaN
dtype: object

# Using regex groups
In [34]: pat = r"(?P<one>\w+) (?P<two>\w+) (?P<three>\w+)"

In [35]: repl = lambda m: m.group('two').swapcase()

In [36]: pd.Series(['Foo Bar Baz', np.nan]).str.replace(pat, repl)
Out[36]: 
0    bAR
1    NaN
dtype: object
```

*New in version 0.20.0*.

 ``replace`` 方法也可以接受一个来自 [re.compile()](https://docs.python.org/3/library/re.html#re.compile) 编译过的正则表达式对象，来做为``表达式``。所有的标记都应该被包含在这个已经编译好的正则表达式对象中。

```python
In [37]: import re

In [38]: regex_pat = re.compile(r'^.a|dog', flags=re.IGNORECASE)

In [39]: s3.str.replace(regex_pat, 'XX-XX ')
Out[39]: 
0           A
1           B
2           C
3    XX-XX ba
4    XX-XX ca
5            
6         NaN
7    XX-XX BA
8      XX-XX 
9     XX-XX t
dtype: object
```

如果在已经使用编译的正则对象中继续传入``flags`` 参数，并进行替换，将会导致``ValueError``.

```python
In [40]: s3.str.replace(regex_pat, 'XX-XX ', flags=re.IGNORECASE)
---------------------------------------------------------------------------
ValueError: case and flags cannot be set when pat is a compiled regex
```
