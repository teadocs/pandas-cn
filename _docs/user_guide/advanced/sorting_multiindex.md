# 对多索引进行排序

For MultiIndex-ed objects to be indexed and sliced effectively, they need to be sorted. As with any index, you can use ``sort_index``.

```python
In [88]: import random; random.shuffle(tuples)

In [89]: s = pd.Series(np.random.randn(8), index=pd.MultiIndex.from_tuples(tuples))

In [90]: s
Out[90]: 
baz  one    0.206053
foo  two   -0.251905
     one   -2.213588
baz  two    1.063327
qux  two    1.266143
bar  two    0.299368
     one   -0.863838
qux  one    0.408204
dtype: float64

In [91]: s.sort_index()
Out[91]: 
bar  one   -0.863838
     two    0.299368
baz  one    0.206053
     two    1.063327
foo  one   -2.213588
     two   -0.251905
qux  one    0.408204
     two    1.266143
dtype: float64

In [92]: s.sort_index(level=0)
Out[92]: 
bar  one   -0.863838
     two    0.299368
baz  one    0.206053
     two    1.063327
foo  one   -2.213588
     two   -0.251905
qux  one    0.408204
     two    1.266143
dtype: float64

In [93]: s.sort_index(level=1)
Out[93]: 
bar  one   -0.863838
baz  one    0.206053
foo  one   -2.213588
qux  one    0.408204
bar  two    0.299368
baz  two    1.063327
foo  two   -0.251905
qux  two    1.266143
dtype: float64
```

You may also pass a level name to ``sort_index`` if the MultiIndex levels are named.

```python
In [94]: s.index.set_names(['L1', 'L2'], inplace=True)

In [95]: s.sort_index(level='L1')
Out[95]: 
L1   L2 
bar  one   -0.863838
     two    0.299368
baz  one    0.206053
     two    1.063327
foo  one   -2.213588
     two   -0.251905
qux  one    0.408204
     two    1.266143
dtype: float64

In [96]: s.sort_index(level='L2')
Out[96]: 
L1   L2 
bar  one   -0.863838
baz  one    0.206053
foo  one   -2.213588
qux  one    0.408204
bar  two    0.299368
baz  two    1.063327
foo  two   -0.251905
qux  two    1.266143
dtype: float64
```

On higher dimensional objects, you can sort any of the other axes by level if they have a ``MultiIndex``:

```python
In [97]: df.T.sort_index(level=1, axis=1)
Out[97]: 
        one      zero       one      zero
          x         x         y         y
0  0.600178  2.410179  1.519970  0.132885
1  0.274230  1.450520 -0.493662 -0.023688
```

Indexing will work even if the data are not sorted, but will be rather inefficient (and show a ``PerformanceWarning``). It will also return a copy of the data rather than a view:

```python
In [98]: dfm = pd.DataFrame({'jim': [0, 0, 1, 1],
   ....:                     'joe': ['x', 'x', 'z', 'y'],
   ....:                     'jolie': np.random.rand(4)})
   ....: 

In [99]: dfm = dfm.set_index(['jim', 'joe'])

In [100]: dfm
Out[100]: 
            jolie
jim joe          
0   x    0.490671
    x    0.120248
1   z    0.537020
    y    0.110968
In [4]: dfm.loc[(1, 'z')]
```

```python
PerformanceWarning: indexing past lexsort depth may impact performance.

Out[4]:
           jolie
jim joe
1   z    0.64094
```

Furthermore if you try to index something that is not fully lexsorted, this can raise:

```python
In [5]: dfm.loc[(0,'y'):(1, 'z')]
UnsortedIndexError: 'Key length (2) was greater than MultiIndex lexsort depth (1)'
```

The ``is_lexsorted()`` method on an ``Index`` show if the index is sorted, and the ``lexsort_depth`` property returns the sort depth:

```python
In [101]: dfm.index.is_lexsorted()
Out[101]: False

In [102]: dfm.index.lexsort_depth
Out[102]: 1
```

```python
In [103]: dfm = dfm.sort_index()

In [104]: dfm
Out[104]: 
            jolie
jim joe          
0   x    0.490671
    x    0.120248
1   y    0.110968
    z    0.537020

In [105]: dfm.index.is_lexsorted()
Out[105]: True

In [106]: dfm.index.lexsort_depth
Out[106]: 2
```

And now selection works as expected.

```python
In [107]: dfm.loc[(0,'y'):(1, 'z')]
Out[107]: 
            jolie
jim joe          
1   y    0.110968
    z    0.537020
```