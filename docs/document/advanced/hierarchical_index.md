# 具有层次索引的高级索引

Syntactically integrating ``MultiIndex`` in advanced indexing with ``.loc`` is a bit challenging, but we’ve made every effort to do so. In general, MultiIndex keys take the form of tuples. For example, the following works as you would expect:

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

If you also want to index a specific column with ``.loc``, you must use a tuple like this:

```python
In [39]: df.loc[('bar', 'two'), 'A']
Out[39]: 0.80524402538637851
```

You don’t have to specify all levels of the ``MultiIndex`` by passing only the first elements of the tuple. For example, you can use “partial” indexing to get all elements with ``bar`` in the first level as follows:

df.loc[‘bar’]

This is a shortcut for the slightly more verbose notation ``df.loc[('bar',),]`` (equivalent to ``df.loc['bar',]`` in this example).

“Partial” slicing also works quite nicely.

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

```python
In [43]: df.loc[[('bar', 'two'), ('qux', 'one')]]
Out[43]: 
                     A         B         C
first second                              
bar   two     0.805244  0.813850  1.607920
qux   one    -1.170299  1.130127  0.974466
```

**Note**: It is important to note that tuples and lists are not treated identically in pandas when it comes to indexing. Whereas a tuple is interpreted as one multi-level key, a list is used to specify several keys. Or in other words, tuples go horizontally (traversing levels), lists go vertically (scanning levels).

Importantly, a list of tuples indexes several complete ``MultiIndex`` keys, whereas a tuple of lists refer to several values within a level:

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

You can slice a ``MultiIndex`` by providing multiple indexers.

You can provide any of the selectors as if you are indexing by label, see [Selection by Label](http://pandas.pydata.org/pandas-docs/stable/indexing.html#indexing-label), including slices, lists of labels, labels, and boolean indexers.

You can use ``slice(None)`` to select all the contents of that level. You do not need to specify all the *deeper levels*, they will be implied as ``slice(None)``.

As usual, **both sides** of the slicers are included as this is label indexing.

<div class="warning-warp">
<b>警告</b><p>You should specify all axes in the .loc specifier, meaning the indexer for the index and for the columns. There are some ambiguous cases where the passed indexer could be mis-interpreted as indexing both axes, rather than into say the MultiIndex for the rows.

You should do this:

<pre class="prettyprint language-python">
<code class="hljs">
df.loc[(slice('A1','A3'),.....), :]
</code>
</pre>

You should not do this:

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

You can use [pandas.IndexSlice](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.IndexSlice.html#pandas.IndexSlice) to facilitate a more natural syntax using :, rather than using slice(None).

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

The ``xs`` method of ``DataFrame`` additionally takes a level argument to make selecting data at a particular level of a MultiIndex easier.

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

```python
In [75]: df.xs('one', level='second', axis=1, drop_level=True)
Out[75]: 
first       bar       baz       foo       qux
A      0.895717 -1.206412  1.431256 -1.170299
B      0.410835  0.132003 -0.076467  1.130127
C     -1.413681  1.024180  0.875906  0.974466
```

## Advanced reindexing and alignment

The parameter ``level`` has been added to the ``reindex`` and ``align`` methods of pandas objects. This is useful to broadcast values across a level. For instance:

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

The ``swaplevel`` function can switch the order of two levels:

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

The ``reorder_levels`` function generalizes the ``swaplevel`` function, allowing you to permute the hierarchical index levels in one step:

```python
In [87]: df[:5].reorder_levels([1,0], axis=0)
Out[87]: 
               0         1
y one   1.519970 -0.493662
x one   0.600178  0.274230
y zero  0.132885 -0.023688
x zero  2.410179  1.450520
```