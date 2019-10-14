# MultiIndex / advanced indexing

This section covers [indexing with a MultiIndex](#advanced-hierarchical)
and [other advanced indexing features](#indexing-index-types).

See the [Indexing and Selecting Data](indexing.html#indexing) for general indexing documentation.

::: danger Warning

Whether a copy or a reference is returned for a setting operation may
depend on the context.  This is sometimes called ``chained assignment`` and
should be avoided.  See [Returning a View versus Copy](indexing.html#indexing-view-versus-copy).

:::

See the [cookbook](cookbook.html#cookbook-selection) for some advanced strategies.

## Hierarchical indexing (MultiIndex)

Hierarchical / Multi-level indexing is very exciting as it opens the door to some
quite sophisticated data analysis and manipulation, especially for working with
higher dimensional data. In essence, it enables you to store and manipulate
data with an arbitrary number of dimensions in lower dimensional data
structures like ``Series`` (1d) and ``DataFrame`` (2d).

In this section, we will show what exactly we mean by “hierarchical” indexing
and how it integrates with all of the pandas indexing functionality
described above and in prior sections. Later, when discussing [group by](groupby.html#groupby) and [pivoting and reshaping data](reshaping.html#reshaping), we’ll show
non-trivial applications to illustrate how it aids in structuring data for
analysis.

See the [cookbook](cookbook.html#cookbook-multi-index) for some advanced strategies.

*Changed in version 0.24.0:* ``MultiIndex.labels`` has been renamed to [``MultiIndex.codes``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.MultiIndex.codes.html#pandas.MultiIndex.codes)
and ``MultiIndex.set_labels`` to [``MultiIndex.set_codes``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.MultiIndex.set_codes.html#pandas.MultiIndex.set_codes).

### Creating a MultiIndex (hierarchical index) object

The [``MultiIndex``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.MultiIndex.html#pandas.MultiIndex) object is the hierarchical analogue of the standard
[``Index``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Index.html#pandas.Index) object which typically stores the axis labels in pandas objects. You
can think of ``MultiIndex`` as an array of tuples where each tuple is unique. A
``MultiIndex`` can be created from a list of arrays (using
[``MultiIndex.from_arrays()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.MultiIndex.from_arrays.html#pandas.MultiIndex.from_arrays)), an array of tuples (using
[``MultiIndex.from_tuples()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.MultiIndex.from_tuples.html#pandas.MultiIndex.from_tuples)), a crossed set of iterables (using
[``MultiIndex.from_product()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.MultiIndex.from_product.html#pandas.MultiIndex.from_product)), or a [``DataFrame``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.html#pandas.DataFrame) (using
[``MultiIndex.from_frame()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.MultiIndex.from_frame.html#pandas.MultiIndex.from_frame)).  The ``Index`` constructor will attempt to return
a ``MultiIndex`` when it is passed a list of tuples.  The following examples
demonstrate different ways to initialize MultiIndexes.

``` python
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
MultiIndex([('bar', 'one'),
            ('bar', 'two'),
            ('baz', 'one'),
            ('baz', 'two'),
            ('foo', 'one'),
            ('foo', 'two'),
            ('qux', 'one'),
            ('qux', 'two')],
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

When you want every pairing of the elements in two iterables, it can be easier
to use the [``MultiIndex.from_product()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.MultiIndex.from_product.html#pandas.MultiIndex.from_product) method:

``` python
In [8]: iterables = [['bar', 'baz', 'foo', 'qux'], ['one', 'two']]

In [9]: pd.MultiIndex.from_product(iterables, names=['first', 'second'])
Out[9]: 
MultiIndex([('bar', 'one'),
            ('bar', 'two'),
            ('baz', 'one'),
            ('baz', 'two'),
            ('foo', 'one'),
            ('foo', 'two'),
            ('qux', 'one'),
            ('qux', 'two')],
           names=['first', 'second'])
```

You can also construct a ``MultiIndex`` from a ``DataFrame`` directly, using
the method [``MultiIndex.from_frame()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.MultiIndex.from_frame.html#pandas.MultiIndex.from_frame). This is a complementary method to
[``MultiIndex.to_frame()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.MultiIndex.to_frame.html#pandas.MultiIndex.to_frame).

*New in version 0.24.0.* 

``` python
In [10]: df = pd.DataFrame([['bar', 'one'], ['bar', 'two'],
   ....:                    ['foo', 'one'], ['foo', 'two']],
   ....:                   columns=['first', 'second'])
   ....: 

In [11]: pd.MultiIndex.from_frame(df)
Out[11]: 
MultiIndex([('bar', 'one'),
            ('bar', 'two'),
            ('foo', 'one'),
            ('foo', 'two')],
           names=['first', 'second'])
```

As a convenience, you can pass a list of arrays directly into ``Series`` or
``DataFrame`` to construct a ``MultiIndex`` automatically:

``` python
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

All of the ``MultiIndex`` constructors accept a ``names`` argument which stores
string names for the levels themselves. If no names are provided, ``None`` will
be assigned:

``` python
In [17]: df.index.names
Out[17]: FrozenList([None, None])
```

This index can back any axis of a pandas object, and the number of **levels**
of the index is up to you:

``` python
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

We’ve “sparsified” the higher levels of the indexes to make the console output a
bit easier on the eyes. Note that how the index is displayed can be controlled using the
``multi_sparse`` option in ``pandas.set_options()``:

``` python
In [21]: with pd.option_context('display.multi_sparse', False):
   ....:     df
   ....:
```

It’s worth keeping in mind that there’s nothing preventing you from using
tuples as atomic labels on an axis:

``` python
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

The reason that the ``MultiIndex`` matters is that it can allow you to do
grouping, selection, and reshaping operations as we will describe below and in
subsequent areas of the documentation. As you will see in later sections, you
can find yourself working with hierarchically-indexed data without creating a
``MultiIndex`` explicitly yourself. However, when loading data from a file, you
may wish to generate your own ``MultiIndex`` when preparing the data set.

### Reconstructing the level labels

The method [``get_level_values()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.MultiIndex.get_level_values.html#pandas.MultiIndex.get_level_values) will return a vector of the labels for each
location at a particular level:

``` python
In [23]: index.get_level_values(0)
Out[23]: Index(['bar', 'bar', 'baz', 'baz', 'foo', 'foo', 'qux', 'qux'], dtype='object', name='first')

In [24]: index.get_level_values('second')
Out[24]: Index(['one', 'two', 'one', 'two', 'one', 'two', 'one', 'two'], dtype='object', name='second')
```

### Basic indexing on axis with MultiIndex

One of the important features of hierarchical indexing is that you can select
data by a “partial” label identifying a subgroup in the data. **Partial**
selection “drops” levels of the hierarchical index in the result in a
completely analogous way to selecting a column in a regular DataFrame:

``` python
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

See [Cross-section with hierarchical index](#advanced-xs) for how to select
on a deeper level.

### Defined levels

The [``MultiIndex``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.MultiIndex.html#pandas.MultiIndex) keeps all the defined levels of an index, even
if they are not actually used. When slicing an index, you may notice this.
For example:

``` python
In [29]: df.columns.levels  # original MultiIndex
Out[29]: FrozenList([['bar', 'baz', 'foo', 'qux'], ['one', 'two']])

In [30]: df[['foo','qux']].columns.levels  # sliced
Out[30]: FrozenList([['bar', 'baz', 'foo', 'qux'], ['one', 'two']])
```

This is done to avoid a recomputation of the levels in order to make slicing
highly performant. If you want to see only the used levels, you can use the
[``get_level_values()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.MultiIndex.get_level_values.html#pandas.MultiIndex.get_level_values) method.

``` python
In [31]: df[['foo', 'qux']].columns.to_numpy()
Out[31]: 
array([('foo', 'one'), ('foo', 'two'), ('qux', 'one'), ('qux', 'two')],
      dtype=object)

# for a specific level
In [32]: df[['foo', 'qux']].columns.get_level_values(0)
Out[32]: Index(['foo', 'foo', 'qux', 'qux'], dtype='object', name='first')
```

To reconstruct the ``MultiIndex`` with only the used levels, the
[``remove_unused_levels()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.MultiIndex.remove_unused_levels.html#pandas.MultiIndex.remove_unused_levels) method may be used.

*New in version 0.20.0.* 

``` python
In [33]: new_mi = df[['foo', 'qux']].columns.remove_unused_levels()

In [34]: new_mi.levels
Out[34]: FrozenList([['foo', 'qux'], ['one', 'two']])
```

### Data alignment and using ``reindex``

Operations between differently-indexed objects having ``MultiIndex`` on the
axes will work as you expect; data alignment will work the same as an Index of
tuples:

``` python
In [35]: s + s[:-2]
Out[35]: 
bar  one   -1.723698
     two   -4.209138
baz  one   -0.989859
     two    2.143608
foo  one    1.443110
     two   -1.413542
qux  one         NaN
     two         NaN
dtype: float64

In [36]: s + s[::2]
Out[36]: 
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

The [``reindex()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.reindex.html#pandas.DataFrame.reindex) method of ``Series``/``DataFrames`` can be
called with another ``MultiIndex``, or even a list or array of tuples:

``` python
In [37]: s.reindex(index[:3])
Out[37]: 
first  second
bar    one      -0.861849
       two      -2.104569
baz    one      -0.494929
dtype: float64

In [38]: s.reindex([('foo', 'two'), ('bar', 'one'), ('qux', 'one'), ('baz', 'one')])
Out[38]: 
foo  two   -0.706771
bar  one   -0.861849
qux  one   -1.039575
baz  one   -0.494929
dtype: float64
```

## Advanced indexing with hierarchical index

Syntactically integrating ``MultiIndex`` in advanced indexing with ``.loc`` is a
bit challenging, but we’ve made every effort to do so. In general, MultiIndex
keys take the form of tuples. For example, the following works as you would expect:

``` python
In [39]: df = df.T

In [40]: df
Out[40]: 
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

In [41]: df.loc[('bar', 'two')]
Out[41]: 
A    0.805244
B    0.813850
C    1.607920
Name: (bar, two), dtype: float64
```

Note that ``df.loc['bar', 'two']`` would also work in this example, but this shorthand
notation can lead to ambiguity in general.

If you also want to index a specific column with ``.loc``, you must use a tuple
like this:

``` python
In [42]: df.loc[('bar', 'two'), 'A']
Out[42]: 0.8052440253863785
```

You don’t have to specify all levels of the ``MultiIndex`` by passing only the
first elements of the tuple. For example, you can use “partial” indexing to
get all elements with ``bar`` in the first level as follows:

df.loc[‘bar’]

This is a shortcut for the slightly more verbose notation ``df.loc[('bar',),]`` (equivalent
to ``df.loc['bar',]`` in this example).

“Partial” slicing also works quite nicely.

``` python
In [43]: df.loc['baz':'foo']
Out[43]: 
                     A         B         C
first second                              
baz   one    -1.206412  0.132003  1.024180
      two     2.565646 -0.827317  0.569605
foo   one     1.431256 -0.076467  0.875906
      two     1.340309 -1.187678 -2.211372
```

You can slice with a ‘range’ of values, by providing a slice of tuples.

``` python
In [44]: df.loc[('baz', 'two'):('qux', 'one')]
Out[44]: 
                     A         B         C
first second                              
baz   two     2.565646 -0.827317  0.569605
foo   one     1.431256 -0.076467  0.875906
      two     1.340309 -1.187678 -2.211372
qux   one    -1.170299  1.130127  0.974466

In [45]: df.loc[('baz', 'two'):'foo']
Out[45]: 
                     A         B         C
first second                              
baz   two     2.565646 -0.827317  0.569605
foo   one     1.431256 -0.076467  0.875906
      two     1.340309 -1.187678 -2.211372
```

Passing a list of labels or tuples works similar to reindexing:

``` python
In [46]: df.loc[[('bar', 'two'), ('qux', 'one')]]
Out[46]: 
                     A         B         C
first second                              
bar   two     0.805244  0.813850  1.607920
qux   one    -1.170299  1.130127  0.974466
```

::: tip Note

It is important to note that tuples and lists are not treated identically
in pandas when it comes to indexing. Whereas a tuple is interpreted as one
multi-level key, a list is used to specify several keys. Or in other words,
tuples go horizontally (traversing levels), lists go vertically (scanning levels).

:::

Importantly, a list of tuples indexes several complete ``MultiIndex`` keys,
whereas a tuple of lists refer to several values within a level:

``` python
In [47]: s = pd.Series([1, 2, 3, 4, 5, 6],
   ....:               index=pd.MultiIndex.from_product([["A", "B"], ["c", "d", "e"]]))
   ....: 

In [48]: s.loc[[("A", "c"), ("B", "d")]]  # list of tuples
Out[48]: 
A  c    1
B  d    5
dtype: int64

In [49]: s.loc[(["A", "B"], ["c", "d"])]  # tuple of lists
Out[49]: 
A  c    1
   d    2
B  c    4
   d    5
dtype: int64
```

### Using slicers

You can slice a ``MultiIndex`` by providing multiple indexers.

You can provide any of the selectors as if you are indexing by label, see [Selection by Label](indexing.html#indexing-label),
including slices, lists of labels, labels, and boolean indexers.

You can use ``slice(None)`` to select all the contents of *that* level. You do not need to specify all the
*deeper* levels, they will be implied as ``slice(None)``.

As usual, **both sides** of the slicers are included as this is label indexing.

::: danger Warning

You should specify all axes in the ``.loc`` specifier, meaning the indexer for the **index** and
for the **columns**. There are some ambiguous cases where the passed indexer could be mis-interpreted
as indexing *both* axes, rather than into say the ``MultiIndex`` for the rows.

You should do this:

``` python
df.loc[(slice('A1', 'A3'), ...), :]             # noqa: E999
```

You should **not** do this:

``` python
df.loc[(slice('A1', 'A3'), ...)]                # noqa: E999
```

:::

``` python
In [50]: def mklbl(prefix, n):
   ....:     return ["%s%s" % (prefix, i) for i in range(n)]
   ....: 

In [51]: miindex = pd.MultiIndex.from_product([mklbl('A', 4),
   ....:                                       mklbl('B', 2),
   ....:                                       mklbl('C', 4),
   ....:                                       mklbl('D', 2)])
   ....: 

In [52]: micolumns = pd.MultiIndex.from_tuples([('a', 'foo'), ('a', 'bar'),
   ....:                                        ('b', 'foo'), ('b', 'bah')],
   ....:                                       names=['lvl0', 'lvl1'])
   ....: 

In [53]: dfmi = pd.DataFrame(np.arange(len(miindex) * len(micolumns))
   ....:                       .reshape((len(miindex), len(micolumns))),
   ....:                     index=miindex,
   ....:                     columns=micolumns).sort_index().sort_index(axis=1)
   ....: 

In [54]: dfmi
Out[54]: 
lvl0           a         b     
lvl1         bar  foo  bah  foo
A0 B0 C0 D0    1    0    3    2
         D1    5    4    7    6
      C1 D0    9    8   11   10
         D1   13   12   15   14
      C2 D0   17   16   19   18
...          ...  ...  ...  ...
A3 B1 C1 D1  237  236  239  238
      C2 D0  241  240  243  242
         D1  245  244  247  246
      C3 D0  249  248  251  250
         D1  253  252  255  254

[64 rows x 4 columns]
```

Basic MultiIndex slicing using slices, lists, and labels.

``` python
In [55]: dfmi.loc[(slice('A1', 'A3'), slice(None), ['C1', 'C3']), :]
Out[55]: 
lvl0           a         b     
lvl1         bar  foo  bah  foo
A1 B0 C1 D0   73   72   75   74
         D1   77   76   79   78
      C3 D0   89   88   91   90
         D1   93   92   95   94
   B1 C1 D0  105  104  107  106
...          ...  ...  ...  ...
A3 B0 C3 D1  221  220  223  222
   B1 C1 D0  233  232  235  234
         D1  237  236  239  238
      C3 D0  249  248  251  250
         D1  253  252  255  254

[24 rows x 4 columns]
```

You can use [``pandas.IndexSlice``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.IndexSlice.html#pandas.IndexSlice) to facilitate a more natural syntax
using ``:``, rather than using ``slice(None)``.

``` python
In [56]: idx = pd.IndexSlice

In [57]: dfmi.loc[idx[:, :, ['C1', 'C3']], idx[:, 'foo']]
Out[57]: 
lvl0           a    b
lvl1         foo  foo
A0 B0 C1 D0    8   10
         D1   12   14
      C3 D0   24   26
         D1   28   30
   B1 C1 D0   40   42
...          ...  ...
A3 B0 C3 D1  220  222
   B1 C1 D0  232  234
         D1  236  238
      C3 D0  248  250
         D1  252  254

[32 rows x 2 columns]
```

It is possible to perform quite complicated selections using this method on multiple
axes at the same time.

``` python
In [58]: dfmi.loc['A1', (slice(None), 'foo')]
Out[58]: 
lvl0        a    b
lvl1      foo  foo
B0 C0 D0   64   66
      D1   68   70
   C1 D0   72   74
      D1   76   78
   C2 D0   80   82
...       ...  ...
B1 C1 D1  108  110
   C2 D0  112  114
      D1  116  118
   C3 D0  120  122
      D1  124  126

[16 rows x 2 columns]

In [59]: dfmi.loc[idx[:, :, ['C1', 'C3']], idx[:, 'foo']]
Out[59]: 
lvl0           a    b
lvl1         foo  foo
A0 B0 C1 D0    8   10
         D1   12   14
      C3 D0   24   26
         D1   28   30
   B1 C1 D0   40   42
...          ...  ...
A3 B0 C3 D1  220  222
   B1 C1 D0  232  234
         D1  236  238
      C3 D0  248  250
         D1  252  254

[32 rows x 2 columns]
```

Using a boolean indexer you can provide selection related to the *values*.

``` python
In [60]: mask = dfmi[('a', 'foo')] > 200

In [61]: dfmi.loc[idx[mask, :, ['C1', 'C3']], idx[:, 'foo']]
Out[61]: 
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

You can also specify the ``axis`` argument to ``.loc`` to interpret the passed
slicers on a single axis.

``` python
In [62]: dfmi.loc(axis=0)[:, :, ['C1', 'C3']]
Out[62]: 
lvl0           a         b     
lvl1         bar  foo  bah  foo
A0 B0 C1 D0    9    8   11   10
         D1   13   12   15   14
      C3 D0   25   24   27   26
         D1   29   28   31   30
   B1 C1 D0   41   40   43   42
...          ...  ...  ...  ...
A3 B0 C3 D1  221  220  223  222
   B1 C1 D0  233  232  235  234
         D1  237  236  239  238
      C3 D0  249  248  251  250
         D1  253  252  255  254

[32 rows x 4 columns]
```

Furthermore, you can *set* the values using the following methods.

``` python
In [63]: df2 = dfmi.copy()

In [64]: df2.loc(axis=0)[:, :, ['C1', 'C3']] = -10

In [65]: df2
Out[65]: 
lvl0           a         b     
lvl1         bar  foo  bah  foo
A0 B0 C0 D0    1    0    3    2
         D1    5    4    7    6
      C1 D0  -10  -10  -10  -10
         D1  -10  -10  -10  -10
      C2 D0   17   16   19   18
...          ...  ...  ...  ...
A3 B1 C1 D1  -10  -10  -10  -10
      C2 D0  241  240  243  242
         D1  245  244  247  246
      C3 D0  -10  -10  -10  -10
         D1  -10  -10  -10  -10

[64 rows x 4 columns]
```

You can use a right-hand-side of an alignable object as well.

``` python
In [66]: df2 = dfmi.copy()

In [67]: df2.loc[idx[:, :, ['C1', 'C3']], :] = df2 * 1000

In [68]: df2
Out[68]: 
lvl0              a               b        
lvl1            bar     foo     bah     foo
A0 B0 C0 D0       1       0       3       2
         D1       5       4       7       6
      C1 D0    9000    8000   11000   10000
         D1   13000   12000   15000   14000
      C2 D0      17      16      19      18
...             ...     ...     ...     ...
A3 B1 C1 D1  237000  236000  239000  238000
      C2 D0     241     240     243     242
         D1     245     244     247     246
      C3 D0  249000  248000  251000  250000
         D1  253000  252000  255000  254000

[64 rows x 4 columns]
```

### Cross-section

The [``xs()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.xs.html#pandas.DataFrame.xs) method of ``DataFrame`` additionally takes a level argument to make
selecting data at a particular level of a ``MultiIndex`` easier.

``` python
In [69]: df
Out[69]: 
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

In [70]: df.xs('one', level='second')
Out[70]: 
              A         B         C
first                              
bar    0.895717  0.410835 -1.413681
baz   -1.206412  0.132003  1.024180
foo    1.431256 -0.076467  0.875906
qux   -1.170299  1.130127  0.974466
```

``` python
# using the slicers
In [71]: df.loc[(slice(None), 'one'), :]
Out[71]: 
                     A         B         C
first second                              
bar   one     0.895717  0.410835 -1.413681
baz   one    -1.206412  0.132003  1.024180
foo   one     1.431256 -0.076467  0.875906
qux   one    -1.170299  1.130127  0.974466
```

You can also select on the columns with ``xs``, by
providing the axis argument.

``` python
In [72]: df = df.T

In [73]: df.xs('one', level='second', axis=1)
Out[73]: 
first       bar       baz       foo       qux
A      0.895717 -1.206412  1.431256 -1.170299
B      0.410835  0.132003 -0.076467  1.130127
C     -1.413681  1.024180  0.875906  0.974466
```

``` python
# using the slicers
In [74]: df.loc[:, (slice(None), 'one')]
Out[74]: 
first        bar       baz       foo       qux
second       one       one       one       one
A       0.895717 -1.206412  1.431256 -1.170299
B       0.410835  0.132003 -0.076467  1.130127
C      -1.413681  1.024180  0.875906  0.974466
```

``xs`` also allows selection with multiple keys.

``` python
In [75]: df.xs(('one', 'bar'), level=('second', 'first'), axis=1)
Out[75]: 
first        bar
second       one
A       0.895717
B       0.410835
C      -1.413681
```

``` python
# using the slicers
In [76]: df.loc[:, ('bar', 'one')]
Out[76]: 
A    0.895717
B    0.410835
C   -1.413681
Name: (bar, one), dtype: float64
```

You can pass ``drop_level=False`` to ``xs`` to retain
the level that was selected.

``` python
In [77]: df.xs('one', level='second', axis=1, drop_level=False)
Out[77]: 
first        bar       baz       foo       qux
second       one       one       one       one
A       0.895717 -1.206412  1.431256 -1.170299
B       0.410835  0.132003 -0.076467  1.130127
C      -1.413681  1.024180  0.875906  0.974466
```

Compare the above with the result using ``drop_level=True`` (the default value).

``` python
In [78]: df.xs('one', level='second', axis=1, drop_level=True)
Out[78]: 
first       bar       baz       foo       qux
A      0.895717 -1.206412  1.431256 -1.170299
B      0.410835  0.132003 -0.076467  1.130127
C     -1.413681  1.024180  0.875906  0.974466
```

### Advanced reindexing and alignment

Using the parameter ``level`` in the [``reindex()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.reindex.html#pandas.DataFrame.reindex) and
[``align()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.align.html#pandas.DataFrame.align) methods of pandas objects is useful to broadcast
values across a level. For instance:

``` python
In [79]: midx = pd.MultiIndex(levels=[['zero', 'one'], ['x', 'y']],
   ....:                      codes=[[1, 1, 0, 0], [1, 0, 1, 0]])
   ....: 

In [80]: df = pd.DataFrame(np.random.randn(4, 2), index=midx)

In [81]: df
Out[81]: 
               0         1
one  y  1.519970 -0.493662
     x  0.600178  0.274230
zero y  0.132885 -0.023688
     x  2.410179  1.450520

In [82]: df2 = df.mean(level=0)

In [83]: df2
Out[83]: 
             0         1
one   1.060074 -0.109716
zero  1.271532  0.713416

In [84]: df2.reindex(df.index, level=0)
Out[84]: 
               0         1
one  y  1.060074 -0.109716
     x  1.060074 -0.109716
zero y  1.271532  0.713416
     x  1.271532  0.713416

# aligning
In [85]: df_aligned, df2_aligned = df.align(df2, level=0)

In [86]: df_aligned
Out[86]: 
               0         1
one  y  1.519970 -0.493662
     x  0.600178  0.274230
zero y  0.132885 -0.023688
     x  2.410179  1.450520

In [87]: df2_aligned
Out[87]: 
               0         1
one  y  1.060074 -0.109716
     x  1.060074 -0.109716
zero y  1.271532  0.713416
     x  1.271532  0.713416
```

### Swapping levels with ``swaplevel``

The [``swaplevel()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.MultiIndex.swaplevel.html#pandas.MultiIndex.swaplevel) method can switch the order of two levels:

``` python
In [88]: df[:5]
Out[88]: 
               0         1
one  y  1.519970 -0.493662
     x  0.600178  0.274230
zero y  0.132885 -0.023688
     x  2.410179  1.450520

In [89]: df[:5].swaplevel(0, 1, axis=0)
Out[89]: 
               0         1
y one   1.519970 -0.493662
x one   0.600178  0.274230
y zero  0.132885 -0.023688
x zero  2.410179  1.450520
```

### Reordering levels with ``reorder_levels``

The [``reorder_levels()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.MultiIndex.reorder_levels.html#pandas.MultiIndex.reorder_levels) method generalizes the ``swaplevel``
method, allowing you to permute the hierarchical index levels in one step:

``` python
In [90]: df[:5].reorder_levels([1, 0], axis=0)
Out[90]: 
               0         1
y one   1.519970 -0.493662
x one   0.600178  0.274230
y zero  0.132885 -0.023688
x zero  2.410179  1.450520
```

### Renaming names of an ``Index`` or ``MultiIndex``

The [``rename()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.rename.html#pandas.DataFrame.rename) method is used to rename the labels of a
``MultiIndex``, and is typically used to rename the columns of a ``DataFrame``.
The ``columns`` argument of ``rename`` allows a dictionary to be specified
that includes only the columns you wish to rename.

``` python
In [91]: df.rename(columns={0: "col0", 1: "col1"})
Out[91]: 
            col0      col1
one  y  1.519970 -0.493662
     x  0.600178  0.274230
zero y  0.132885 -0.023688
     x  2.410179  1.450520
```

This method can also be used to rename specific labels of the main index
of the ``DataFrame``.

``` python
In [92]: df.rename(index={"one": "two", "y": "z"})
Out[92]: 
               0         1
two  z  1.519970 -0.493662
     x  0.600178  0.274230
zero z  0.132885 -0.023688
     x  2.410179  1.450520
```

The [``rename_axis()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.rename_axis.html#pandas.DataFrame.rename_axis) method is used to rename the name of a
``Index`` or ``MultiIndex``. In particular, the names of the levels of a
``MultiIndex`` can be specified, which is useful if ``reset_index()`` is later
used to move the values from the ``MultiIndex`` to a column.

``` python
In [93]: df.rename_axis(index=['abc', 'def'])
Out[93]: 
                 0         1
abc  def                    
one  y    1.519970 -0.493662
     x    0.600178  0.274230
zero y    0.132885 -0.023688
     x    2.410179  1.450520
```

Note that the columns of a ``DataFrame`` are an index, so that using
``rename_axis`` with the ``columns`` argument will change the name of that
index.

``` python
In [94]: df.rename_axis(columns="Cols").columns
Out[94]: RangeIndex(start=0, stop=2, step=1, name='Cols')
```

Both ``rename`` and ``rename_axis`` support specifying a dictionary,
``Series`` or a mapping function to map labels/names to new values.

## Sorting a ``MultiIndex``

For [``MultiIndex``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.MultiIndex.html#pandas.MultiIndex)-ed objects to be indexed and sliced effectively,
they need to be sorted. As with any index, you can use [``sort_index()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.sort_index.html#pandas.DataFrame.sort_index).

``` python
In [95]: import random

In [96]: random.shuffle(tuples)

In [97]: s = pd.Series(np.random.randn(8), index=pd.MultiIndex.from_tuples(tuples))

In [98]: s
Out[98]: 
baz  one    0.206053
foo  two   -0.251905
qux  one   -2.213588
foo  one    1.063327
bar  two    1.266143
baz  two    0.299368
bar  one   -0.863838
qux  two    0.408204
dtype: float64

In [99]: s.sort_index()
Out[99]: 
bar  one   -0.863838
     two    1.266143
baz  one    0.206053
     two    0.299368
foo  one    1.063327
     two   -0.251905
qux  one   -2.213588
     two    0.408204
dtype: float64

In [100]: s.sort_index(level=0)
Out[100]: 
bar  one   -0.863838
     two    1.266143
baz  one    0.206053
     two    0.299368
foo  one    1.063327
     two   -0.251905
qux  one   -2.213588
     two    0.408204
dtype: float64

In [101]: s.sort_index(level=1)
Out[101]: 
bar  one   -0.863838
baz  one    0.206053
foo  one    1.063327
qux  one   -2.213588
bar  two    1.266143
baz  two    0.299368
foo  two   -0.251905
qux  two    0.408204
dtype: float64
```

You may also pass a level name to ``sort_index`` if the ``MultiIndex`` levels
are named.

``` python
In [102]: s.index.set_names(['L1', 'L2'], inplace=True)

In [103]: s.sort_index(level='L1')
Out[103]: 
L1   L2 
bar  one   -0.863838
     two    1.266143
baz  one    0.206053
     two    0.299368
foo  one    1.063327
     two   -0.251905
qux  one   -2.213588
     two    0.408204
dtype: float64

In [104]: s.sort_index(level='L2')
Out[104]: 
L1   L2 
bar  one   -0.863838
baz  one    0.206053
foo  one    1.063327
qux  one   -2.213588
bar  two    1.266143
baz  two    0.299368
foo  two   -0.251905
qux  two    0.408204
dtype: float64
```

On higher dimensional objects, you can sort any of the other axes by level if
they have a ``MultiIndex``:

``` python
In [105]: df.T.sort_index(level=1, axis=1)
Out[105]: 
        one      zero       one      zero
          x         x         y         y
0  0.600178  2.410179  1.519970  0.132885
1  0.274230  1.450520 -0.493662 -0.023688
```

Indexing will work even if the data are not sorted, but will be rather
inefficient (and show a ``PerformanceWarning``). It will also
return a copy of the data rather than a view:

``` python
In [106]: dfm = pd.DataFrame({'jim': [0, 0, 1, 1],
   .....:                     'joe': ['x', 'x', 'z', 'y'],
   .....:                     'jolie': np.random.rand(4)})
   .....: 

In [107]: dfm = dfm.set_index(['jim', 'joe'])

In [108]: dfm
Out[108]: 
            jolie
jim joe          
0   x    0.490671
    x    0.120248
1   z    0.537020
    y    0.110968
```

``` python
In [4]: dfm.loc[(1, 'z')]
PerformanceWarning: indexing past lexsort depth may impact performance.

Out[4]:
           jolie
jim joe
1   z    0.64094
```

Furthermore, if you try to index something that is not fully lexsorted, this can raise:

``` python
In [5]: dfm.loc[(0, 'y'):(1, 'z')]
UnsortedIndexError: 'Key length (2) was greater than MultiIndex lexsort depth (1)'
```

The [``is_lexsorted()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.MultiIndex.is_lexsorted.html#pandas.MultiIndex.is_lexsorted) method on a ``MultiIndex`` shows if the
index is sorted, and the ``lexsort_depth`` property returns the sort depth:

``` python
In [109]: dfm.index.is_lexsorted()
Out[109]: False

In [110]: dfm.index.lexsort_depth
Out[110]: 1
```

``` python
In [111]: dfm = dfm.sort_index()

In [112]: dfm
Out[112]: 
            jolie
jim joe          
0   x    0.490671
    x    0.120248
1   y    0.110968
    z    0.537020

In [113]: dfm.index.is_lexsorted()
Out[113]: True

In [114]: dfm.index.lexsort_depth
Out[114]: 2
```

And now selection works as expected.

``` python
In [115]: dfm.loc[(0, 'y'):(1, 'z')]
Out[115]: 
            jolie
jim joe          
1   y    0.110968
    z    0.537020
```

## Take methods

Similar to NumPy ndarrays, pandas ``Index``, ``Series``, and ``DataFrame`` also provides
the [``take()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.DataFrame.take.html#pandas.DataFrame.take) method that retrieves elements along a given axis at the given
indices. The given indices must be either a list or an ndarray of integer
index positions. ``take`` will also accept negative integers as relative positions to the end of the object.

``` python
In [116]: index = pd.Index(np.random.randint(0, 1000, 10))

In [117]: index
Out[117]: Int64Index([214, 502, 712, 567, 786, 175, 993, 133, 758, 329], dtype='int64')

In [118]: positions = [0, 9, 3]

In [119]: index[positions]
Out[119]: Int64Index([214, 329, 567], dtype='int64')

In [120]: index.take(positions)
Out[120]: Int64Index([214, 329, 567], dtype='int64')

In [121]: ser = pd.Series(np.random.randn(10))

In [122]: ser.iloc[positions]
Out[122]: 
0   -0.179666
9    1.824375
3    0.392149
dtype: float64

In [123]: ser.take(positions)
Out[123]: 
0   -0.179666
9    1.824375
3    0.392149
dtype: float64
```

For DataFrames, the given indices should be a 1d list or ndarray that specifies
row or column positions.

``` python
In [124]: frm = pd.DataFrame(np.random.randn(5, 3))

In [125]: frm.take([1, 4, 3])
Out[125]: 
          0         1         2
1 -1.237881  0.106854 -1.276829
4  0.629675 -1.425966  1.857704
3  0.979542 -1.633678  0.615855

In [126]: frm.take([0, 2], axis=1)
Out[126]: 
          0         2
0  0.595974  0.601544
1 -1.237881 -1.276829
2 -0.767101  1.499591
3  0.979542  0.615855
4  0.629675  1.857704
```

It is important to note that the ``take`` method on pandas objects are not
intended to work on boolean indices and may return unexpected results.

``` python
In [127]: arr = np.random.randn(10)

In [128]: arr.take([False, False, True, True])
Out[128]: array([-1.1935, -1.1935,  0.6775,  0.6775])

In [129]: arr[[0, 1]]
Out[129]: array([-1.1935,  0.6775])

In [130]: ser = pd.Series(np.random.randn(10))

In [131]: ser.take([False, False, True, True])
Out[131]: 
0    0.233141
0    0.233141
1   -0.223540
1   -0.223540
dtype: float64

In [132]: ser.iloc[[0, 1]]
Out[132]: 
0    0.233141
1   -0.223540
dtype: float64
```

Finally, as a small note on performance, because the ``take`` method handles
a narrower range of inputs, it can offer performance that is a good deal
faster than fancy indexing.

``` python
In [133]: arr = np.random.randn(10000, 5)

In [134]: indexer = np.arange(10000)

In [135]: random.shuffle(indexer)

In [136]: %timeit arr[indexer]
   .....: %timeit arr.take(indexer, axis=0)
   .....: 
152 us +- 988 ns per loop (mean +- std. dev. of 7 runs, 10000 loops each)
41.7 us +- 204 ns per loop (mean +- std. dev. of 7 runs, 10000 loops each)
```

``` python
In [137]: ser = pd.Series(arr[:, 0])

In [138]: %timeit ser.iloc[indexer]
   .....: %timeit ser.take(indexer)
   .....: 
120 us +- 1.05 us per loop (mean +- std. dev. of 7 runs, 10000 loops each)
110 us +- 795 ns per loop (mean +- std. dev. of 7 runs, 10000 loops each)
```

## Index types

We have discussed ``MultiIndex`` in the previous sections pretty extensively.
Documentation about ``DatetimeIndex`` and ``PeriodIndex`` are shown [here](timeseries.html#timeseries-overview),
and documentation about ``TimedeltaIndex`` is found [here](timedeltas.html#timedeltas-index).

In the following sub-sections we will highlight some other index types.

### CategoricalIndex

[``CategoricalIndex``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.CategoricalIndex.html#pandas.CategoricalIndex) is a type of index that is useful for supporting
indexing with duplicates. This is a container around a [``Categorical``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Categorical.html#pandas.Categorical)
and allows efficient indexing and storage of an index with a large number of duplicated elements.

``` python
In [139]: from pandas.api.types import CategoricalDtype

In [140]: df = pd.DataFrame({'A': np.arange(6),
   .....:                    'B': list('aabbca')})
   .....: 

In [141]: df['B'] = df['B'].astype(CategoricalDtype(list('cab')))

In [142]: df
Out[142]: 
   A  B
0  0  a
1  1  a
2  2  b
3  3  b
4  4  c
5  5  a

In [143]: df.dtypes
Out[143]: 
A       int64
B    category
dtype: object

In [144]: df.B.cat.categories
Out[144]: Index(['c', 'a', 'b'], dtype='object')
```

Setting the index will create a ``CategoricalIndex``.

``` python
In [145]: df2 = df.set_index('B')

In [146]: df2.index
Out[146]: CategoricalIndex(['a', 'a', 'b', 'b', 'c', 'a'], categories=['c', 'a', 'b'], ordered=False, name='B', dtype='category')
```

Indexing with ``__getitem__/.iloc/.loc`` works similarly to an ``Index`` with duplicates.
The indexers **must** be in the category or the operation will raise a ``KeyError``.

``` python
In [147]: df2.loc['a']
Out[147]: 
   A
B   
a  0
a  1
a  5
```

The ``CategoricalIndex`` is **preserved** after indexing:

``` python
In [148]: df2.loc['a'].index
Out[148]: CategoricalIndex(['a', 'a', 'a'], categories=['c', 'a', 'b'], ordered=False, name='B', dtype='category')
```

Sorting the index will sort by the order of the categories (recall that we
created the index with ``CategoricalDtype(list('cab'))``, so the sorted
order is ``cab``).

``` python
In [149]: df2.sort_index()
Out[149]: 
   A
B   
c  4
a  0
a  1
a  5
b  2
b  3
```

Groupby operations on the index will preserve the index nature as well.

``` python
In [150]: df2.groupby(level=0).sum()
Out[150]: 
   A
B   
c  4
a  6
b  5

In [151]: df2.groupby(level=0).sum().index
Out[151]: CategoricalIndex(['c', 'a', 'b'], categories=['c', 'a', 'b'], ordered=False, name='B', dtype='category')
```

Reindexing operations will return a resulting index based on the type of the passed
indexer. Passing a list will return a plain-old ``Index``; indexing with
a ``Categorical`` will return a ``CategoricalIndex``, indexed according to the categories
of the **passed** ``Categorical`` dtype. This allows one to arbitrarily index these even with
values **not** in the categories, similarly to how you can reindex **any** pandas index.

``` python
In [152]: df2.reindex(['a', 'e'])
Out[152]: 
     A
B     
a  0.0
a  1.0
a  5.0
e  NaN

In [153]: df2.reindex(['a', 'e']).index
Out[153]: Index(['a', 'a', 'a', 'e'], dtype='object', name='B')

In [154]: df2.reindex(pd.Categorical(['a', 'e'], categories=list('abcde')))
Out[154]: 
     A
B     
a  0.0
a  1.0
a  5.0
e  NaN

In [155]: df2.reindex(pd.Categorical(['a', 'e'], categories=list('abcde'))).index
Out[155]: CategoricalIndex(['a', 'a', 'a', 'e'], categories=['a', 'b', 'c', 'd', 'e'], ordered=False, name='B', dtype='category')
```

::: danger Warning

Reshaping and Comparison operations on a ``CategoricalIndex`` must have the same categories
or a ``TypeError`` will be raised.

``` python
In [9]: df3 = pd.DataFrame({'A': np.arange(6), 'B': pd.Series(list('aabbca')).astype('category')})

In [11]: df3 = df3.set_index('B')

In [11]: df3.index
Out[11]: CategoricalIndex(['a', 'a', 'b', 'b', 'c', 'a'], categories=['a', 'b', 'c'], ordered=False, name='B', dtype='category')

In [12]: pd.concat([df2, df3])
TypeError: categories must match existing categories when appending
```

:::

### Int64Index and RangeIndex

::: danger Warning

Indexing on an integer-based Index with floats has been clarified in 0.18.0, for a summary of the changes, see [here](https://pandas.pydata.org/pandas-docs/stable/whatsnew/v0.18.0.html#whatsnew-0180-float-indexers).

:::

[``Int64Index``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Int64Index.html#pandas.Int64Index) is a fundamental basic index in pandas.
This is an immutable array implementing an ordered, sliceable set.
Prior to 0.18.0, the ``Int64Index`` would provide the default index for all ``NDFrame`` objects.

[``RangeIndex``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.RangeIndex.html#pandas.RangeIndex) is a sub-class of ``Int64Index`` added in version 0.18.0, now providing the default index for all ``NDFrame`` objects.
``RangeIndex`` is an optimized version of ``Int64Index`` that can represent a monotonic ordered set. These are analogous to Python [range types](https://docs.python.org/3/library/stdtypes.html#typesseq-range).

### Float64Index

By default a [``Float64Index``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Float64Index.html#pandas.Float64Index) will be automatically created when passing floating, or mixed-integer-floating values in index creation.
This enables a pure label-based slicing paradigm that makes ``[],ix,loc`` for scalar indexing and slicing work exactly the
same.

``` python
In [156]: indexf = pd.Index([1.5, 2, 3, 4.5, 5])

In [157]: indexf
Out[157]: Float64Index([1.5, 2.0, 3.0, 4.5, 5.0], dtype='float64')

In [158]: sf = pd.Series(range(5), index=indexf)

In [159]: sf
Out[159]: 
1.5    0
2.0    1
3.0    2
4.5    3
5.0    4
dtype: int64
```

Scalar selection for ``[],.loc`` will always be label based. An integer will match an equal float index (e.g. ``3`` is equivalent to ``3.0``).

``` python
In [160]: sf[3]
Out[160]: 2

In [161]: sf[3.0]
Out[161]: 2

In [162]: sf.loc[3]
Out[162]: 2

In [163]: sf.loc[3.0]
Out[163]: 2
```

The only positional indexing is via ``iloc``.

``` python
In [164]: sf.iloc[3]
Out[164]: 3
```

A scalar index that is not found will raise a ``KeyError``.
Slicing is primarily on the values of the index when using ``[],ix,loc``, and
**always** positional when using ``iloc``. The exception is when the slice is
boolean, in which case it will always be positional.

``` python
In [165]: sf[2:4]
Out[165]: 
2.0    1
3.0    2
dtype: int64

In [166]: sf.loc[2:4]
Out[166]: 
2.0    1
3.0    2
dtype: int64

In [167]: sf.iloc[2:4]
Out[167]: 
3.0    2
4.5    3
dtype: int64
```

In float indexes, slicing using floats is allowed.

``` python
In [168]: sf[2.1:4.6]
Out[168]: 
3.0    2
4.5    3
dtype: int64

In [169]: sf.loc[2.1:4.6]
Out[169]: 
3.0    2
4.5    3
dtype: int64
```

In non-float indexes, slicing using floats will raise a ``TypeError``.

``` python
In [1]: pd.Series(range(5))[3.5]
TypeError: the label [3.5] is not a proper indexer for this index type (Int64Index)

In [1]: pd.Series(range(5))[3.5:4.5]
TypeError: the slice start [3.5] is not a proper indexer for this index type (Int64Index)
```

::: danger Warning

Using a scalar float indexer for ``.iloc`` has been removed in 0.18.0, so the following will raise a ``TypeError``:

``` python
In [3]: pd.Series(range(5)).iloc[3.0]
TypeError: cannot do positional indexing on <class 'pandas.indexes.range.RangeIndex'> with these indexers [3.0] of <type 'float'>
```

:::

Here is a typical use-case for using this type of indexing. Imagine that you have a somewhat
irregular timedelta-like indexing scheme, but the data is recorded as floats. This could, for
example, be millisecond offsets.

``` python
In [170]: dfir = pd.concat([pd.DataFrame(np.random.randn(5, 2),
   .....:                                index=np.arange(5) * 250.0,
   .....:                                columns=list('AB')),
   .....:                   pd.DataFrame(np.random.randn(6, 2),
   .....:                                index=np.arange(4, 10) * 250.1,
   .....:                                columns=list('AB'))])
   .....: 

In [171]: dfir
Out[171]: 
               A         B
0.0    -0.435772 -1.188928
250.0  -0.808286 -0.284634
500.0  -1.815703  1.347213
750.0  -0.243487  0.514704
1000.0  1.162969 -0.287725
1000.4 -0.179734  0.993962
1250.5 -0.212673  0.909872
1500.6 -0.733333 -0.349893
1750.7  0.456434 -0.306735
2000.8  0.553396  0.166221
2250.9 -0.101684 -0.734907
```

Selection operations then will always work on a value basis, for all selection operators.

``` python
In [172]: dfir[0:1000.4]
Out[172]: 
               A         B
0.0    -0.435772 -1.188928
250.0  -0.808286 -0.284634
500.0  -1.815703  1.347213
750.0  -0.243487  0.514704
1000.0  1.162969 -0.287725
1000.4 -0.179734  0.993962

In [173]: dfir.loc[0:1001, 'A']
Out[173]: 
0.0      -0.435772
250.0    -0.808286
500.0    -1.815703
750.0    -0.243487
1000.0    1.162969
1000.4   -0.179734
Name: A, dtype: float64

In [174]: dfir.loc[1000.4]
Out[174]: 
A   -0.179734
B    0.993962
Name: 1000.4, dtype: float64
```

You could retrieve the first 1 second (1000 ms) of data as such:

``` python
In [175]: dfir[0:1000]
Out[175]: 
               A         B
0.0    -0.435772 -1.188928
250.0  -0.808286 -0.284634
500.0  -1.815703  1.347213
750.0  -0.243487  0.514704
1000.0  1.162969 -0.287725
```

If you need integer based selection, you should use ``iloc``:

``` python
In [176]: dfir.iloc[0:5]
Out[176]: 
               A         B
0.0    -0.435772 -1.188928
250.0  -0.808286 -0.284634
500.0  -1.815703  1.347213
750.0  -0.243487  0.514704
1000.0  1.162969 -0.287725
```

### IntervalIndex

*New in version 0.20.0.* 

[``IntervalIndex``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.IntervalIndex.html#pandas.IntervalIndex) together with its own dtype, ``IntervalDtype``
as well as the [``Interval``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Interval.html#pandas.Interval) scalar type,  allow first-class support in pandas
for interval notation.

The ``IntervalIndex`` allows some unique indexing and is also used as a
return type for the categories in [``cut()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.cut.html#pandas.cut) and [``qcut()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.qcut.html#pandas.qcut).

#### Indexing with an ``IntervalIndex``

An ``IntervalIndex`` can be used in ``Series`` and in ``DataFrame`` as the index.

``` python
In [177]: df = pd.DataFrame({'A': [1, 2, 3, 4]},
   .....:                   index=pd.IntervalIndex.from_breaks([0, 1, 2, 3, 4]))
   .....: 

In [178]: df
Out[178]: 
        A
(0, 1]  1
(1, 2]  2
(2, 3]  3
(3, 4]  4
```

Label based indexing via ``.loc`` along the edges of an interval works as you would expect,
selecting that particular interval.

``` python
In [179]: df.loc[2]
Out[179]: 
A    2
Name: (1, 2], dtype: int64

In [180]: df.loc[[2, 3]]
Out[180]: 
        A
(1, 2]  2
(2, 3]  3
```

If you select a label *contained* within an interval, this will also select the interval.

``` python
In [181]: df.loc[2.5]
Out[181]: 
A    3
Name: (2, 3], dtype: int64

In [182]: df.loc[[2.5, 3.5]]
Out[182]: 
        A
(2, 3]  3
(3, 4]  4
```

Selecting using an ``Interval`` will only return exact matches (starting from pandas 0.25.0).

``` python
In [183]: df.loc[pd.Interval(1, 2)]
Out[183]: 
A    2
Name: (1, 2], dtype: int64
```

Trying to select an ``Interval`` that is not exactly contained in the ``IntervalIndex`` will raise a ``KeyError``.

``` python
In [7]: df.loc[pd.Interval(0.5, 2.5)]
---------------------------------------------------------------------------
KeyError: Interval(0.5, 2.5, closed='right')
```

Selecting all ``Intervals`` that overlap a given ``Interval`` can be performed using the
[``overlaps()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.IntervalIndex.overlaps.html#pandas.IntervalIndex.overlaps) method to create a boolean indexer.

``` python
In [184]: idxr = df.index.overlaps(pd.Interval(0.5, 2.5))

In [185]: idxr
Out[185]: array([ True,  True,  True, False])

In [186]: df[idxr]
Out[186]: 
        A
(0, 1]  1
(1, 2]  2
(2, 3]  3
```

#### Binning data with ``cut`` and ``qcut``

[``cut()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.cut.html#pandas.cut) and [``qcut()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.qcut.html#pandas.qcut) both return a ``Categorical`` object, and the bins they
create are stored as an ``IntervalIndex`` in its ``.categories`` attribute.

``` python
In [187]: c = pd.cut(range(4), bins=2)

In [188]: c
Out[188]: 
[(-0.003, 1.5], (-0.003, 1.5], (1.5, 3.0], (1.5, 3.0]]
Categories (2, interval[float64]): [(-0.003, 1.5] < (1.5, 3.0]]

In [189]: c.categories
Out[189]: 
IntervalIndex([(-0.003, 1.5], (1.5, 3.0]],
              closed='right',
              dtype='interval[float64]')
```

[``cut()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.cut.html#pandas.cut) also accepts an ``IntervalIndex`` for its ``bins`` argument, which enables
a useful pandas idiom. First, We call [``cut()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.cut.html#pandas.cut) with some data and ``bins`` set to a
fixed number, to generate the bins. Then, we pass the values of ``.categories`` as the
``bins`` argument in subsequent calls to [``cut()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.cut.html#pandas.cut), supplying new data which will be
binned into the same bins.

``` python
In [190]: pd.cut([0, 3, 5, 1], bins=c.categories)
Out[190]: 
[(-0.003, 1.5], (1.5, 3.0], NaN, (-0.003, 1.5]]
Categories (2, interval[float64]): [(-0.003, 1.5] < (1.5, 3.0]]
```

Any value which falls outside all bins will be assigned a ``NaN`` value.

#### Generating ranges of intervals

If we need intervals on a regular frequency, we can use the [``interval_range()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.interval_range.html#pandas.interval_range) function
to create an ``IntervalIndex`` using various combinations of ``start``, ``end``, and ``periods``.
The default frequency for ``interval_range`` is a 1 for numeric intervals, and calendar day for
datetime-like intervals:

``` python
In [191]: pd.interval_range(start=0, end=5)
Out[191]: 
IntervalIndex([(0, 1], (1, 2], (2, 3], (3, 4], (4, 5]],
              closed='right',
              dtype='interval[int64]')

In [192]: pd.interval_range(start=pd.Timestamp('2017-01-01'), periods=4)
Out[192]: 
IntervalIndex([(2017-01-01, 2017-01-02], (2017-01-02, 2017-01-03], (2017-01-03, 2017-01-04], (2017-01-04, 2017-01-05]],
              closed='right',
              dtype='interval[datetime64[ns]]')

In [193]: pd.interval_range(end=pd.Timedelta('3 days'), periods=3)
Out[193]: 
IntervalIndex([(0 days 00:00:00, 1 days 00:00:00], (1 days 00:00:00, 2 days 00:00:00], (2 days 00:00:00, 3 days 00:00:00]],
              closed='right',
              dtype='interval[timedelta64[ns]]')
```

The ``freq`` parameter can used to specify non-default frequencies, and can utilize a variety
of [frequency aliases](timeseries.html#timeseries-offset-aliases) with datetime-like intervals:

``` python
In [194]: pd.interval_range(start=0, periods=5, freq=1.5)
Out[194]: 
IntervalIndex([(0.0, 1.5], (1.5, 3.0], (3.0, 4.5], (4.5, 6.0], (6.0, 7.5]],
              closed='right',
              dtype='interval[float64]')

In [195]: pd.interval_range(start=pd.Timestamp('2017-01-01'), periods=4, freq='W')
Out[195]: 
IntervalIndex([(2017-01-01, 2017-01-08], (2017-01-08, 2017-01-15], (2017-01-15, 2017-01-22], (2017-01-22, 2017-01-29]],
              closed='right',
              dtype='interval[datetime64[ns]]')

In [196]: pd.interval_range(start=pd.Timedelta('0 days'), periods=3, freq='9H')
Out[196]: 
IntervalIndex([(0 days 00:00:00, 0 days 09:00:00], (0 days 09:00:00, 0 days 18:00:00], (0 days 18:00:00, 1 days 03:00:00]],
              closed='right',
              dtype='interval[timedelta64[ns]]')
```

Additionally, the ``closed`` parameter can be used to specify which side(s) the intervals
are closed on.  Intervals are closed on the right side by default.

``` python
In [197]: pd.interval_range(start=0, end=4, closed='both')
Out[197]: 
IntervalIndex([[0, 1], [1, 2], [2, 3], [3, 4]],
              closed='both',
              dtype='interval[int64]')

In [198]: pd.interval_range(start=0, end=4, closed='neither')
Out[198]: 
IntervalIndex([(0, 1), (1, 2), (2, 3), (3, 4)],
              closed='neither',
              dtype='interval[int64]')
```

*New in version 0.23.0.* 

Specifying ``start``, ``end``, and ``periods`` will generate a range of evenly spaced
intervals from ``start`` to ``end`` inclusively, with ``periods`` number of elements
in the resulting ``IntervalIndex``:

``` python
In [199]: pd.interval_range(start=0, end=6, periods=4)
Out[199]: 
IntervalIndex([(0.0, 1.5], (1.5, 3.0], (3.0, 4.5], (4.5, 6.0]],
              closed='right',
              dtype='interval[float64]')

In [200]: pd.interval_range(pd.Timestamp('2018-01-01'),
   .....:                   pd.Timestamp('2018-02-28'), periods=3)
   .....: 
Out[200]: 
IntervalIndex([(2018-01-01, 2018-01-20 08:00:00], (2018-01-20 08:00:00, 2018-02-08 16:00:00], (2018-02-08 16:00:00, 2018-02-28]],
              closed='right',
              dtype='interval[datetime64[ns]]')
```

## Miscellaneous indexing FAQ

### Integer indexing

Label-based indexing with integer axis labels is a thorny topic. It has been
discussed heavily on mailing lists and among various members of the scientific
Python community. In pandas, our general viewpoint is that labels matter more
than integer locations. Therefore, with an integer axis index *only*
label-based indexing is possible with the standard tools like ``.loc``. The
following code will generate exceptions:

``` python
In [201]: s = pd.Series(range(5))

In [202]: s[-1]
---------------------------------------------------------------------------
KeyError                                  Traceback (most recent call last)
<ipython-input-202-76c3dce40054> in <module>
----> 1 s[-1]

/pandas/pandas/core/series.py in __getitem__(self, key)
   1062         key = com.apply_if_callable(key, self)
   1063         try:
-> 1064             result = self.index.get_value(self, key)
   1065 
   1066             if not is_scalar(result):

/pandas/pandas/core/indexes/base.py in get_value(self, series, key)
   4721         k = self._convert_scalar_indexer(k, kind="getitem")
   4722         try:
-> 4723             return self._engine.get_value(s, k, tz=getattr(series.dtype, "tz", None))
   4724         except KeyError as e1:
   4725             if len(self) > 0 and (self.holds_integer() or self.is_boolean()):

/pandas/pandas/_libs/index.pyx in pandas._libs.index.IndexEngine.get_value()

/pandas/pandas/_libs/index.pyx in pandas._libs.index.IndexEngine.get_value()

/pandas/pandas/_libs/index.pyx in pandas._libs.index.IndexEngine.get_loc()

/pandas/pandas/_libs/hashtable_class_helper.pxi in pandas._libs.hashtable.Int64HashTable.get_item()

/pandas/pandas/_libs/hashtable_class_helper.pxi in pandas._libs.hashtable.Int64HashTable.get_item()

KeyError: -1

In [203]: df = pd.DataFrame(np.random.randn(5, 4))

In [204]: df
Out[204]: 
          0         1         2         3
0 -0.130121 -0.476046  0.759104  0.213379
1 -0.082641  0.448008  0.656420 -1.051443
2  0.594956 -0.151360 -0.069303  1.221431
3 -0.182832  0.791235  0.042745  2.069775
4  1.446552  0.019814 -1.389212 -0.702312

In [205]: df.loc[-2:]
Out[205]: 
          0         1         2         3
0 -0.130121 -0.476046  0.759104  0.213379
1 -0.082641  0.448008  0.656420 -1.051443
2  0.594956 -0.151360 -0.069303  1.221431
3 -0.182832  0.791235  0.042745  2.069775
4  1.446552  0.019814 -1.389212 -0.702312
```

This deliberate decision was made to prevent ambiguities and subtle bugs (many
users reported finding bugs when the API change was made to stop “falling back”
on position-based indexing).

### Non-monotonic indexes require exact matches

If the index of a ``Series`` or ``DataFrame`` is monotonically increasing or decreasing, then the bounds
of a label-based slice can be outside the range of the index, much like slice indexing a
normal Python ``list``. Monotonicity of an index can be tested with the [``is_monotonic_increasing()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Index.is_monotonic_increasing.html#pandas.Index.is_monotonic_increasing) and
[``is_monotonic_decreasing()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Index.is_monotonic_decreasing.html#pandas.Index.is_monotonic_decreasing) attributes.

``` python
In [206]: df = pd.DataFrame(index=[2, 3, 3, 4, 5], columns=['data'], data=list(range(5)))

In [207]: df.index.is_monotonic_increasing
Out[207]: True

# no rows 0 or 1, but still returns rows 2, 3 (both of them), and 4:
In [208]: df.loc[0:4, :]
Out[208]: 
   data
2     0
3     1
3     2
4     3

# slice is are outside the index, so empty DataFrame is returned
In [209]: df.loc[13:15, :]
Out[209]: 
Empty DataFrame
Columns: [data]
Index: []
```

On the other hand, if the index is not monotonic, then both slice bounds must be
*unique* members of the index.

``` python
In [210]: df = pd.DataFrame(index=[2, 3, 1, 4, 3, 5],
   .....:                   columns=['data'], data=list(range(6)))
   .....: 

In [211]: df.index.is_monotonic_increasing
Out[211]: False

# OK because 2 and 4 are in the index
In [212]: df.loc[2:4, :]
Out[212]: 
   data
2     0
3     1
1     2
4     3
```

``` python
# 0 is not in the index
In [9]: df.loc[0:4, :]
KeyError: 0

# 3 is not a unique label
In [11]: df.loc[2:3, :]
KeyError: 'Cannot get right slice bound for non-unique label: 3'
```

``Index.is_monotonic_increasing`` and ``Index.is_monotonic_decreasing`` only check that
an index is weakly monotonic. To check for strict monotonicity, you can combine one of those with
the [``is_unique()``](https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.Index.is_unique.html#pandas.Index.is_unique) attribute.

``` python
In [213]: weakly_monotonic = pd.Index(['a', 'b', 'c', 'c'])

In [214]: weakly_monotonic
Out[214]: Index(['a', 'b', 'c', 'c'], dtype='object')

In [215]: weakly_monotonic.is_monotonic_increasing
Out[215]: True

In [216]: weakly_monotonic.is_monotonic_increasing & weakly_monotonic.is_unique
Out[216]: False
```

### Endpoints are inclusive

Compared with standard Python sequence slicing in which the slice endpoint is
not inclusive, label-based slicing in pandas **is inclusive**. The primary
reason for this is that it is often not possible to easily determine the
“successor” or next element after a particular label in an index. For example,
consider the following ``Series``:

``` python
In [217]: s = pd.Series(np.random.randn(6), index=list('abcdef'))

In [218]: s
Out[218]: 
a    0.301379
b    1.240445
c   -0.846068
d   -0.043312
e   -1.658747
f   -0.819549
dtype: float64
```

Suppose we wished to slice from ``c`` to ``e``, using integers this would be
accomplished as such:

``` python
In [219]: s[2:5]
Out[219]: 
c   -0.846068
d   -0.043312
e   -1.658747
dtype: float64
```

However, if you only had ``c`` and ``e``, determining the next element in the
index can be somewhat complicated. For example, the following does not work:

``` python
s.loc['c':'e' + 1]
```

A very common use case is to limit a time series to start and end at two
specific dates. To enable this, we made the design choice to make label-based
slicing include both endpoints:

``` python
In [220]: s.loc['c':'e']
Out[220]: 
c   -0.846068
d   -0.043312
e   -1.658747
dtype: float64
```

This is most definitely a “practicality beats purity” sort of thing, but it is
something to watch out for if you expect label-based slicing to behave exactly
in the way that standard Python integer slicing works.

### Indexing potentially changes underlying Series dtype

The different indexing operation can potentially change the dtype of a ``Series``.

``` python
In [221]: series1 = pd.Series([1, 2, 3])

In [222]: series1.dtype
Out[222]: dtype('int64')

In [223]: res = series1.reindex([0, 4])

In [224]: res.dtype
Out[224]: dtype('float64')

In [225]: res
Out[225]: 
0    1.0
4    NaN
dtype: float64
```

``` python
In [226]: series2 = pd.Series([True])

In [227]: series2.dtype
Out[227]: dtype('bool')

In [228]: res = series2.reindex_like(series1)

In [229]: res.dtype
Out[229]: dtype('O')

In [230]: res
Out[230]: 
0    True
1     NaN
2     NaN
dtype: object
```

This is because the (re)indexing operations above silently inserts ``NaNs`` and the ``dtype``
changes accordingly.  This can cause some issues when using ``numpy`` ``ufuncs``
such as ``numpy.logical_and``.

See the [this old issue](https://github.com/pydata/pandas/issues/2388) for a more
detailed discussion.
