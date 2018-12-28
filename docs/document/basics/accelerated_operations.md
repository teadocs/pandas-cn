# 加速操作

pandas has support for accelerating certain types of binary numerical and boolean operations using the numexpr library and the ``bottleneck`` libraries.  
pandas 支持对特定的通过使用 numexpr库和``bottleneck`` 库，对特定的二进制数和布尔操作进行加速。

These libraries are especially useful when dealing with large data sets, and provide large speedups. numexpr uses smart chunking, caching, and multiple cores. ``bottleneck`` is a set of specialized cython routines that are especially fast when dealing with arrays that have ``nans``.  
这些库在处理大数据集时非常有用，并且能够极大地加速运算。numexpr使用切块、缓存、与多核等手段。``bottleneck``是一个专用的cython API，它在处理包含 nan 的数组时速度很快。

Here is a sample (using 100 column x 100,000 row ``DataFrames``):  
请看实例（使用10万行，100列的 DataFrame）：

Operation 操作 | 版本0.11.0 (ms 毫秒) | Prior Version 前版 (ms) | Ratio to Prior 比例
---|---|---|---
df1 > df2 | 13.32 | 125.35 | 0.1063
df1 * df2 | 21.71 | 36.63 | 0.5928
df1 + df2 | 22.04 | 36.50 | 0.6039

You are highly encouraged to install both libraries. See the section [Recommended Dependencies](http://pandas.pydata.org/pandas-docs/stable/install.html#install-recommended-dependencies) for more installation info.  
强烈建议你安装这两个库。更多信息，参见[Recommended Dependencies](http://pandas.pydata.org/pandas-docs/stable/install.html#install-recommended-dependencies)

These are both enabled to be used by default, you can control this by setting the options:  
默认情况下，这两个库都是激活的，你可以通过下列设置来更改

*New in version 0.20.0*.

```python
pd.set_option('compute.use_bottleneck', False)
pd.set_option('compute.use_numexpr', False)
```
