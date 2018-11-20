# 轴别名(Aliasing Axis Names)

To globally provide aliases for axis names, one can define these 2 functions:

```python
In [189]: def set_axis_alias(cls, axis, alias):
   .....:    if axis not in cls._AXIS_NUMBERS:
   .....:       raise Exception("invalid axis [%s] for alias [%s]" % (axis, alias))
   .....:    cls._AXIS_ALIASES[alias] = axis
   .....: 
```

```python
In [190]: def clear_axis_alias(cls, axis, alias):
   .....:    if axis not in cls._AXIS_NUMBERS:
   .....:       raise Exception("invalid axis [%s] for alias [%s]" % (axis, alias))
   .....:    cls._AXIS_ALIASES.pop(alias,None)
   .....: 
```

```python
In [191]: set_axis_alias(pd.DataFrame,'columns', 'myaxis2')

In [192]: df2 = pd.DataFrame(np.random.randn(3,2),columns=['c1','c2'],index=['i1','i2','i3'])

In [193]: df2.sum(axis='myaxis2')
Out[193]: 
i1    0.745167
i2   -0.176251
i3    0.014354
dtype: float64

In [194]: clear_axis_alias(pd.DataFrame,'columns', 'myaxis2')
```