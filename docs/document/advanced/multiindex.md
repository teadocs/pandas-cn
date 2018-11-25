# 分层索引(多索引)

Hierarchical / Multi-level indexing is very exciting as it opens the door to some quite sophisticated data analysis and manipulation, especially for working with higher dimensional data. In essence, it enables you to store and manipulate data with an arbitrary number of dimensions in lower dimensional data structures like Series (1d) and DataFrame (2d).

In this section, we will show what exactly we mean by “hierarchical” indexing and how it integrates with all of the pandas indexing functionality described above and in prior sections. Later, when discussing [group by](http://pandas.pydata.org/pandas-docs/stable/groupby.html#groupby) and [pivoting and reshaping data](http://pandas.pydata.org/pandas-docs/stable/reshaping.html#reshaping), we’ll show non-trivial applications to illustrate how it aids in structuring data for analysis.

See the [cookbook]((/document/cookbook/index.html) ) for some advanced strategies.

## Creating a MultiIndex (hierarchical index) object

The ``MultiIndex`` object is the hierarchical analogue of the standard ``Index`` object which typically stores the axis labels in pandas objects. You can think of ``MultiIndex`` as an array of tuples where each tuple is unique. A ``MultiIndex`` can be created from a list of arrays (using MultiIndex.from_arrays), an array of tuples (using ``MultiIndex.from_tuples``), or a crossed set of iterables (using ``MultiIndex.from_product``). The Index constructor will attempt to return a ``MultiIndex`` when it is passed a list of tuples. The following examples demonstrate different ways to initialize MultiIndexes.

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

When you want every pairing of the elements in two iterables, it can be easier to use the ``MultiIndex.from_product`` function:

```python
In [8]: iterables = [['bar', 'baz', 'foo', 'qux'], ['one', 'two']]

In [9]: pd.MultiIndex.from_product(iterables, names=['first', 'second'])
Out[9]: 
MultiIndex(levels=[['bar', 'baz', 'foo', 'qux'], ['one', 'two']],
           labels=[[0, 0, 1, 1, 2, 2, 3, 3], [0, 1, 0, 1, 0, 1, 0, 1]],
           names=['first', 'second'])
```

As a convenience, you can pass a list of arrays directly into Series or DataFrame to construct a MultiIndex automatically:

```python
In [10]: arrays = [np.array(['bar', 'bar', 'baz', 'baz', 'foo', 'foo', 'qux', 'qux']),
   ....:           np.array(['one', 'two', 'one', 'two', 'one', 'two', 'one', 'two'])]
   ....: 

In [11]: s = pd.Series(np.random.randn(8), index=arrays)

In [12]: s
Out[12]: 
bar  one   -0.861849
     two   -2.104569
baz  one   -0.494929
     two    1.071804
foo  one    0.721555
     two   -0.706771
qux  one   -1.039575
     two    0.271860
dtype: float64

In [13]: df = pd.DataFrame(np.random.randn(8, 4), index=arrays)

In [14]: df
Out[14]: 
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

All of the ``MultiIndex`` constructors accept a ``names`` argument which stores string names for the levels themselves. If no names are provided, ``None`` will be assigned:

```python
In [15]: df.index.names
Out[15]: FrozenList([None, None])
```

This index can back any axis of a pandas object, and the number of **levels** of the index is up to you:

```python
In [16]: df = pd.DataFrame(np.random.randn(3, 8), index=['A', 'B', 'C'], columns=index)

In [17]: df
Out[17]: 
first        bar                 baz                 foo                 qux          
second       one       two       one       two       one       two       one       two
A       0.895717  0.805244 -1.206412  2.565646  1.431256  1.340309 -1.170299 -0.226169
B       0.410835  0.813850  0.132003 -0.827317 -0.076467 -1.187678  1.130127 -1.436737
C      -1.413681  1.607920  1.024180  0.569605  0.875906 -2.211372  0.974466 -2.006747

In [18]: pd.DataFrame(np.random.randn(6, 6), index=index[:6], columns=index[:6])
Out[18]: 
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

We’ve “sparsified” the higher levels of the indexes to make the console output a bit easier on the eyes. Note that how the index is displayed can be controlled using the ``multi_sparse`` option in ``pandas.set_options()``:

```python
In [19]: with pd.option_context('display.multi_sparse', False):
   ....:     df
   ....: 
```

It’s worth keeping in mind that there’s nothing preventing you from using tuples as atomic labels on an axis:

```python
In [20]: pd.Series(np.random.randn(8), index=tuples)
Out[20]: 
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

The reason that the ``MultiIndex`` matters is that it can allow you to do grouping, selection, and reshaping operations as we will describe below and in subsequent areas of the documentation. As you will see in later sections, you can find yourself working with hierarchically-indexed data without creating a ``MultiIndex`` explicitly yourself. However, when loading data from a file, you may wish to generate your own ``MultiIndex`` when preparing the data set.

## Reconstructing the level labels

The method ``get_level_values`` will return a vector of the labels for each location at a particular level:

```python
In [21]: index.get_level_values(0)
Out[21]: Index(['bar', 'bar', 'baz', 'baz', 'foo', 'foo', 'qux', 'qux'], dtype='object', name='first')

In [22]: index.get_level_values('second')
Out[22]: Index(['one', 'two', 'one', 'two', 'one', 'two', 'one', 'two'], dtype='object', name='second')
```

## Basic indexing on axis with MultiIndex

One of the important features of hierarchical indexing is that you can select data by a “partial” label identifying a subgroup in the data. **Partial** selection “drops” levels of the hierarchical index in the result in a completely analogous way to selecting a column in a regular DataFrame:

```python
In [23]: df['bar']
Out[23]: 
second       one       two
A       0.895717  0.805244
B       0.410835  0.813850
C      -1.413681  1.607920

In [24]: df['bar', 'one']
Out[24]: 
A    0.895717
B    0.410835
C   -1.413681
Name: (bar, one), dtype: float64

In [25]: df['bar']['one']
Out[25]: 
A    0.895717
B    0.410835
C   -1.413681
Name: one, dtype: float64

In [26]: s['qux']
Out[26]: 
one   -1.039575
two    0.271860
dtype: float64
```

See [Cross-section with hierarchical index](http://pandas.pydata.org/pandas-docs/stable/advanced.html#advanced-xs) for how to select on a deeper level.

## Defined Levels

The repr of a ``MultiIndex`` shows all the defined levels of an index, even if the they are not actually used. When slicing an index, you may notice this. For example:

```python
In [27]: df.columns  # original MultiIndex
Out[27]: 
MultiIndex(levels=[['bar', 'baz', 'foo', 'qux'], ['one', 'two']],
           labels=[[0, 0, 1, 1, 2, 2, 3, 3], [0, 1, 0, 1, 0, 1, 0, 1]],
           names=['first', 'second'])

In [28]: df[['foo','qux']].columns  # sliced
Out[28]: 
MultiIndex(levels=[['bar', 'baz', 'foo', 'qux'], ['one', 'two']],
           labels=[[2, 2, 3, 3], [0, 1, 0, 1]],
           names=['first', 'second'])
```

This is done to avoid a recomputation of the levels in order to make slicing highly performant. If you want to see only the used levels, you can use the [MultiIndex.get_level_values()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.MultiIndex.get_level_values.html#pandas.MultiIndex.get_level_values) method.

```python
In [29]: df[['foo','qux']].columns.values
Out[29]: array([('foo', 'one'), ('foo', 'two'), ('qux', 'one'), ('qux', 'two')], dtype=object)

# for a specific level
In [30]: df[['foo','qux']].columns.get_level_values(0)
Out[30]: Index(['foo', 'foo', 'qux', 'qux'], dtype='object', name='first')
```

To reconstruct the ``MultiIndex`` with only the used levels, the ``remove_unused_levels`` method may be used.

*New in version 0.20.0*.

```python
In [31]: df[['foo','qux']].columns.remove_unused_levels()
Out[31]: 
MultiIndex(levels=[['foo', 'qux'], ['one', 'two']],
           labels=[[0, 0, 1, 1], [0, 1, 0, 1]],
           names=['first', 'second'])
```

## Data alignment and using ``reindex``

Operations between differently-indexed objects having ``MultiIndex`` on the axes will work as you expect; data alignment will work the same as an Index of tuples:

```python
In [32]: s + s[:-2]
Out[32]: 
bar  one   -1.723698
     two   -4.209138
baz  one   -0.989859
     two    2.143608
foo  one    1.443110
     two   -1.413542
qux  one         NaN
     two         NaN
dtype: float64

In [33]: s + s[::2]
Out[33]: 
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

``reindex`` can be called with another ``MultiIndex``, or even a list or array of tuples:

```python
In [34]: s.reindex(index[:3])
Out[34]: 
first  second
bar    one      -0.861849
       two      -2.104569
baz    one      -0.494929
dtype: float64

In [35]: s.reindex([('foo', 'two'), ('bar', 'one'), ('qux', 'one'), ('baz', 'one')])
Out[35]: 
foo  two   -0.706771
bar  one   -0.861849
qux  one   -1.039575
baz  one   -0.494929
dtype: float64
```