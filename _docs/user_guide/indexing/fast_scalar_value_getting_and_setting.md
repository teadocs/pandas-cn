# 快速获取和设置标量的值

Since indexing with ``[]`` must handle a lot of cases (single-label access, slicing, boolean indexing, etc.), it has a bit of overhead in order to figure out what you’re asking for. If you only want to access a scalar value, the fastest way is to use the ``at`` and ``iat`` methods, which are implemented on all of the data structures.

Similarly to ``loc``, ``at`` provides label based scalar lookups, while, ``iat`` provides **integer** based lookups analogously to ``iloc``

```python
In [140]: s.iat[5]
Out[140]: 5

In [141]: df.at[dates[5], 'A']
Out[141]: -0.67368970808837059

In [142]: df.iat[3, 0]
Out[142]: 0.72155516224436689
```

You can also set using these same indexers.

```python
In [143]: df.at[dates[5], 'E'] = 7

In [144]: df.iat[3, 0] = 7
```

``at`` may enlarge the object in-place as above if the indexer is missing.

```python
In [145]: df.at[dates[-1]+1, 0] = 7

In [146]: df
Out[146]: 
                   A         B         C         D    E    0
2000-01-01  0.469112 -0.282863 -1.509059 -1.135632  NaN  NaN
2000-01-02  1.212112 -0.173215  0.119209 -1.044236  NaN  NaN
2000-01-03 -0.861849 -2.104569 -0.494929  1.071804  NaN  NaN
2000-01-04  7.000000 -0.706771 -1.039575  0.271860  NaN  NaN
2000-01-05 -0.424972  0.567020  0.276232 -1.087401  NaN  NaN
2000-01-06 -0.673690  0.113648 -1.478427  0.524988  7.0  NaN
2000-01-07  0.404705  0.577046 -1.715002 -1.039268  NaN  NaN
2000-01-08 -0.370647 -1.157892 -1.344312  0.844885  NaN  NaN
2000-01-09       NaN       NaN       NaN       NaN  NaN  7.0
```