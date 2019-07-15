# 类似于字典的get()方法

Each of Series, DataFrame, and Panel have a ``get`` method which can return a default value.

```python
In [284]: s = pd.Series([1,2,3], index=['a','b','c'])

In [285]: s.get('a')               # equivalent to s['a']
Out[285]: 1

In [286]: s.get('x', default=-1)
Out[286]: -1
```
