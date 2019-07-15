# 数字格式

Pandas also allows you to set how numbers are displayed in the console. This option is not set through the ``set_options`` API.

Use the ``set_eng_float_format`` function to alter the floating-point formatting of Pandas objects to produce a particular format.

For instance:

```python
In [79]: import numpy as np

In [80]: pd.set_eng_float_format(accuracy=3, use_eng_prefix=True)

In [81]: s = pd.Series(np.random.randn(5), index=['a', 'b', 'c', 'd', 'e'])

In [82]: s/1.e3
Out[82]: 
a   -236.866u
b    846.974u
c   -685.597u
d    609.099u
e   -303.961u
dtype: float64

In [83]: s/1.e6
Out[83]: 
a   -236.866n
b    846.974n
c   -685.597n
d    609.099n
e   -303.961n
dtype: float64
```

To round floats on a case-by-case basis, you can also use [round()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Series.round.html#Pandas.Series.round) and [round()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.DataFrame.round.html#Pandas.DataFrame.round).