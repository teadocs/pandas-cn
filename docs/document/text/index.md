# Pandas 处理文本字符串

序列和索引包含一些列的字符操作方法，这可以是我们轻易操作数组中的各个元素。最重要的是，这些方法可以自动跳过 缺失/NA 值。这些方法可以在str属性中访问到，并且基本上和python内建的（标量）字符串方法同名。

```python
In [1]: s = pd.Series(['A', 'B', 'C', 'Aaba', 'Baca', np.nan, 'CABA', 'dog', 'cat'])

In [2]: s.str.lower()
Out[2]: 
0       a
1       b
2       c
3    aaba
4    baca
5     NaN
6    caba
7     dog
8     cat
dtype: object

In [3]: s.str.upper()
Out[3]: 
0       A
1       B
2       C
3    AABA
4    BACA
5     NaN
6    CABA
7     DOG
8     CAT
dtype: object

In [4]: s.str.len()
Out[4]: 
0    1.0
1    1.0
2    1.0
3    4.0
4    4.0
5    NaN
6    4.0
7    3.0
8    3.0
dtype: float64
In [5]: idx = pd.Index([' jack', 'jill ', ' jesse ', 'frank'])
```

```python
In [6]: idx.str.strip()
Out[6]: Index(['jack', 'jill', 'jesse', 'frank'], dtype='object')

In [7]: idx.str.lstrip()
Out[7]: Index(['jack', 'jill ', 'jesse ', 'frank'], dtype='object')

In [8]: idx.str.rstrip()
Out[8]: Index([' jack', 'jill', ' jesse', 'frank'], dtype='object')
```

索引的字符串方法在清理或者转换数据表列的时候非常有用。例如，你的列中或许会包含首位的白空格：

```python
In [9]: df = pd.DataFrame(randn(3, 2), columns=[' Column A ', ' Column B '],
   ...:                   index=range(3))
   ...: 

In [10]: df
Out[10]: 
    Column A    Column B 
0   -1.425575   -1.336299
1    0.740933    1.032121
2   -1.585660    0.913812
```

因为 ``df.columns`` 是一个索引对象，因此我们可以使用 ``.str`` 访问器

```python
In [11]: df.columns.str.strip()
Out[11]: Index(['Column A', 'Column B'], dtype='object')

In [12]: df.columns.str.lower()
Out[12]: Index([' column a ', ' column b '], dtype='object')
```

这些字符串方法则可以被用来清理需要的列。这里，我们想清理开头和结尾的白空格，将所有的名称都换为小写，并且将其余的空格都替换为下划线：

```python
In [13]: df.columns = df.columns.str.strip().str.lower().str.replace(' ', '_')

In [14]: df
Out[14]: 
   column_a  column_b
0 -1.425575 -1.336299
1  0.740933  1.032121
2 -1.585660  0.913812
```

**注意**: 如果你有一个序列，里面有很多重复的值（即，序列中唯一元素的数量远小于序列的长度），将原有序列转换为一种分类类型，然后使用.str.<medond> 或者 .dt.<property>，则会获得更快的速度。速度的差异来源于，在分类类型的序列中，字符操作只是在.categories中完成的，而不是针对序列中的每一个元素。

请注意，相比于字符串类型的``序列``，带``..categories``类型的 ``分类`` 类别的 ``序列``有一些限制（例如，你不能像其中的元素追加其他的字串：``s + " " + s`` 将不能正确工作，如果s是一个``分类``类型的序列。并且，``.str`` 中，那些可以对 ``列表（list）`` 类型的元素进行操作的方法，在分类序列中也无法使用。
