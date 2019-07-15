# 重复数据

If you want to identify and remove duplicate rows in a DataFrame, there are two methods that will help: ``duplicated`` and ``drop_duplicates``. Each takes as an argument the columns to use to identify duplicated rows.

- ``duplicated`` returns a boolean vector whose length is the number of rows, and which indicates whether a row is duplicated.
- ``drop_duplicates`` removes duplicate rows.

By default, the first observed row of a duplicate set is considered unique, but each method has a ``keep`` parameter to specify targets to be kept.

- ``keep='first'`` (default): mark / drop duplicates except for the first occurrence.
- ``keep='last'``: mark / drop duplicates except for the last occurrence.
- ``keep=False``: mark / drop all duplicates.

```python
In [268]: df2 = pd.DataFrame({'a': ['one', 'one', 'two', 'two', 'two', 'three', 'four'],
   .....:                     'b': ['x', 'y', 'x', 'y', 'x', 'x', 'x'],
   .....:                     'c': np.random.randn(7)})
   .....: 

In [269]: df2
Out[269]: 
       a  b         c
0    one  x -1.067137
1    one  y  0.309500
2    two  x -0.211056
3    two  y -1.842023
4    two  x -0.390820
5  three  x -1.964475
6   four  x  1.298329

In [270]: df2.duplicated('a')
Out[270]: 
0    False
1     True
2    False
3     True
4     True
5    False
6    False
dtype: bool

In [271]: df2.duplicated('a', keep='last')
Out[271]: 
0     True
1    False
2     True
3     True
4    False
5    False
6    False
dtype: bool

In [272]: df2.duplicated('a', keep=False)
Out[272]: 
0     True
1     True
2     True
3     True
4     True
5    False
6    False
dtype: bool

In [273]: df2.drop_duplicates('a')
Out[273]: 
       a  b         c
0    one  x -1.067137
2    two  x -0.211056
5  three  x -1.964475
6   four  x  1.298329

In [274]: df2.drop_duplicates('a', keep='last')
Out[274]: 
       a  b         c
1    one  y  0.309500
4    two  x -0.390820
5  three  x -1.964475
6   four  x  1.298329

In [275]: df2.drop_duplicates('a', keep=False)
Out[275]: 
       a  b         c
5  three  x -1.964475
6   four  x  1.298329
```

Also, you can pass a list of columns to identify duplications.

```python
In [276]: df2.duplicated(['a', 'b'])
Out[276]: 
0    False
1    False
2    False
3    False
4     True
5    False
6    False
dtype: bool

In [277]: df2.drop_duplicates(['a', 'b'])
Out[277]: 
       a  b         c
0    one  x -1.067137
1    one  y  0.309500
2    two  x -0.211056
3    two  y -1.842023
5  three  x -1.964475
6   four  x  1.298329
```

To drop duplicates by index value, use ``Index.duplicated`` then perform slicing. The same set of options are available for the ``keep`` parameter.

```python
In [278]: df3 = pd.DataFrame({'a': np.arange(6),
   .....:                     'b': np.random.randn(6)},
   .....:                    index=['a', 'a', 'b', 'c', 'b', 'a'])
   .....: 

In [279]: df3
Out[279]: 
   a         b
a  0  1.440455
a  1  2.456086
b  2  1.038402
c  3 -0.894409
b  4  0.683536
a  5  3.082764

In [280]: df3.index.duplicated()
Out[280]: array([False,  True, False, False,  True,  True], dtype=bool)

In [281]: df3[~df3.index.duplicated()]
Out[281]: 
   a         b
a  0  1.440455
b  2  1.038402
c  3 -0.894409

In [282]: df3[~df3.index.duplicated(keep='last')]
Out[282]: 
   a         b
c  3 -0.894409
b  4  0.683536
a  5  3.082764

In [283]: df3[~df3.index.duplicated(keep=False)]
Out[283]: 
   a         b
c  3 -0.894409
```