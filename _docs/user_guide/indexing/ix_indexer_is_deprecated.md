# IX索引器已弃用

<div class="warning-warp">
<b>警告</b></p>Starting in 0.20.0, the <code>.ix</code> indexer is deprecated, in favor of the more strict <code>.iloc</code> and <code>.loc</code> indexers.</p>
</div>

``.ix`` offers a lot of magic on the inference of what the user wants to do. To wit, ``.ix`` can decide to index positionally OR via labels depending on the data type of the index. This has caused quite a bit of user confusion over the years.

The recommended methods of indexing are:

- ``.loc`` if you want to label index.
- ``.iloc`` if you want to positionally index.

```python
In [97]: dfd = pd.DataFrame({'A': [1, 2, 3],
   ....:                     'B': [4, 5, 6]},
   ....:                    index=list('abc'))
   ....: 

In [98]: dfd
Out[98]: 
   A  B
a  1  4
b  2  5
c  3  6
```

Previous behavior, where you wish to get the 0th and the 2nd elements from the index in the ‘A’ column.

```python
In [3]: dfd.ix[[0, 2], 'A']
Out[3]:
a    1
c    3
Name: A, dtype: int64
```

Using ``.loc.`` Here we will select the appropriate indexes from the index, then use label indexing.

```python
In [99]: dfd.loc[dfd.index[[0, 2]], 'A']
Out[99]: 
a    1
c    3
Name: A, dtype: int64
```

This can also be expressed using ``.iloc``, by explicitly getting locations on the indexers, and using *positional* indexing to select things.

```python
In [100]: dfd.iloc[[0, 2], dfd.columns.get_loc('A')]
Out[100]: 
a    1
c    3
Name: A, dtype: int64
```

For getting multiple indexers, using ``.get_indexer``:

```python
In [101]: dfd.iloc[[0, 2], dfd.columns.get_indexer(['A', 'B'])]
Out[101]: 
   A  B
a  1  4
c  3  6
```
