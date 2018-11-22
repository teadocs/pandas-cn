# 加速操作

pandas has support for accelerating certain types of binary numerical and boolean operations using the numexpr library and the ``bottleneck`` libraries.

These libraries are especially useful when dealing with large data sets, and provide large speedups. numexpr uses smart chunking, caching, and multiple cores. ``bottleneck`` is a set of specialized cython routines that are especially fast when dealing with arrays that have ``nans``.

Here is a sample (using 100 column x 100,000 row ``DataFrames``):

Operation | 0.11.0 (ms) | Prior Version (ms) | Ratio to Prior
---|---|---|---
df1 > df2 | 13.32 | 125.35 | 0.1063
df1 * df2 | 21.71 | 36.63 | 0.5928
df1 + df2 | 22.04 | 36.50 | 0.6039

You are highly encouraged to install both libraries. See the section [Recommended Dependencies](http://pandas.pydata.org/pandas-docs/stable/install.html#install-recommended-dependencies) for more installation info.

These are both enabled to be used by default, you can control this by setting the options:

*New in version 0.20.0*.

```python
pd.set_option('compute.use_bottleneck', False)
pd.set_option('compute.use_numexpr', False)
```