# 序列(Series)

[Series](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.html#pandas.Series) is a one-dimensional labeled array capable of holding any data type (integers, strings, floating point numbers, Python objects, etc.). The axis labels are collectively referred to as the **index**. The basic method to create a Series is to call:

```python
>>> s = pd.Series(data, index=index)
```

Here, ``data`` can be many different things:

- a Python dict
- an ndarray
- a scalar value (like 5)

The passed **index** is a list of axis labels. Thus, this separates into a few cases depending on what data is:

**From ndarray**

If data is an ndarray, **index** must be the same length as **data**. If no index is passed, one will be created having values [0, ..., len(data) - 1].

```python
In [3]: s = pd.Series(np.random.randn(5), index=['a', 'b', 'c', 'd', 'e'])

In [4]: s
Out[4]: 
a    0.4691
b   -0.2829
c   -1.5091
d   -1.1356
e    1.2121
dtype: float64

In [5]: s.index
Out[5]: Index(['a', 'b', 'c', 'd', 'e'], dtype='object')

In [6]: pd.Series(np.random.randn(5))
Out[6]: 
0   -0.1732
1    0.1192
2   -1.0442
3   -0.8618
4   -2.1046
dtype: float64
```

**Note：** pandas supports non-unique index values. If an operation that does not support duplicate index values is attempted, an exception will be raised at that time. The reason for being lazy is nearly all performance-based (there are many instances in computations, like parts of GroupBy, where the index is not used).

**From dict**

Series can be instantiated from dicts:

```python
In [7]: d = {'b' : 1, 'a' : 0, 'c' : 2}

In [8]: pd.Series(d)
Out[8]: 
b    1
a    0
c    2
dtype: int64
```

**Note：** When the data is a dict, and an index is not passed, the Series index will be ordered by the dict’s insertion order, if you’re using Python version >= 3.6 and Pandas version >= 0.23.
If you’re using Python < 3.6 or Pandas < 0.23, and an index is not passed, the Series index will be the lexically ordered list of dict keys.

In the example above, if you were on a Python version lower than 3.6 or a Pandas version lower than 0.23, the ``Series`` would be ordered by the lexical order of the dict keys (i.e. ``['a', 'b', 'c']`` rather than ``['b', 'a', 'c']``).

If an index is passed, the values in data corresponding to the labels in the index will be pulled out.

```python
In [9]: d = {'a' : 0., 'b' : 1., 'c' : 2.}

In [10]: pd.Series(d)
Out[10]: 
a    0.0
b    1.0
c    2.0
dtype: float64

In [11]: pd.Series(d, index=['b', 'c', 'd', 'a'])
Out[11]: 
b    1.0
c    2.0
d    NaN
a    0.0
dtype: float64
```

**Note：** NaN (not a number) is the standard missing data marker used in pandas.

**From scalar value**

If data is a scalar value, an index must be provided. The value will be repeated to match the length of index.

```python
In [12]: pd.Series(5., index=['a', 'b', 'c', 'd', 'e'])
Out[12]: 
a    5.0
b    5.0
c    5.0
d    5.0
e    5.0
dtype: float64
```

## Series is ndarray-like

``Series`` acts very similarly to a ``ndarray``, and is a valid argument to most NumPy functions. However, operations such as slicing will also slice the index.

```python
In [13]: s[0]
Out[13]: 0.46911229990718628

In [14]: s[:3]
Out[14]: 
a    0.4691
b   -0.2829
c   -1.5091
dtype: float64

In [15]: s[s > s.median()]
Out[15]: 
a    0.4691
e    1.2121
dtype: float64

In [16]: s[[4, 3, 1]]
Out[16]: 
e    1.2121
d   -1.1356
b   -0.2829
dtype: float64

In [17]: np.exp(s)
Out[17]: 
a    1.5986
b    0.7536
c    0.2211
d    0.3212
e    3.3606
dtype: float64
```

We will address array-based indexing in a separate [section](http://pandas.pydata.org/pandas-docs/stable/indexing.html#indexing).

## Series is dict-like

A Series is like a fixed-size dict in that you can get and set values by index label:

```python
In [18]: s['a']
Out[18]: 0.46911229990718628

In [19]: s['e'] = 12.

In [20]: s
Out[20]: 
a     0.4691
b    -0.2829
c    -1.5091
d    -1.1356
e    12.0000
dtype: float64

In [21]: 'e' in s
Out[21]: True

In [22]: 'f' in s
Out[22]: False
```

If a label is not contained, an exception is raised:

```python
>>> s['f']
KeyError: 'f'
```

Using the ``get`` method, a missing label will return None or specified default:

```python
In [23]: s.get('f')

In [24]: s.get('f', np.nan)
Out[24]: nan
```

See also the [section on attribute access](http://pandas.pydata.org/pandas-docs/stable/indexing.html#indexing-attribute-access).

## Vectorized operations and label alignment with Series

When working with raw NumPy arrays, looping through value-by-value is usually not necessary. The same is true when working with Series in pandas. Series can also be passed into most NumPy methods expecting an ndarray.

```python
In [25]: s + s
Out[25]: 
a     0.9382
b    -0.5657
c    -3.0181
d    -2.2713
e    24.0000
dtype: float64

In [26]: s * 2
Out[26]: 
a     0.9382
b    -0.5657
c    -3.0181
d    -2.2713
e    24.0000
dtype: float64

In [27]: np.exp(s)
Out[27]: 
a         1.5986
b         0.7536
c         0.2211
d         0.3212
e    162754.7914
dtype: float64
```

A key difference between Series and ndarray is that operations between Series automatically align the data based on label. Thus, you can write computations without giving consideration to whether the Series involved have the same labels.

```python
In [28]: s[1:] + s[:-1]
Out[28]: 
a       NaN
b   -0.5657
c   -3.0181
d   -2.2713
e       NaN
dtype: float64
```

The result of an operation between unaligned Series will have the union of the indexes involved. If a label is not found in one Series or the other, the result will be marked as missing NaN. Being able to write code without doing any explicit data alignment grants immense freedom and flexibility in interactive data analysis and research. The integrated data alignment features of the pandas data structures set pandas apart from the majority of related tools for working with labeled data.

**Note:** In general, we chose to make the default result of operations between differently indexed objects yield the union of the indexes in order to avoid loss of information. Having an index label, though the data is missing, is typically important information as part of a computation. You of course have the option of dropping labels with missing data via the **dropna** function.

## Name attribute

Series can also have a name attribute:

```python
In [29]: s = pd.Series(np.random.randn(5), name='something')

In [30]: s
Out[30]: 
0   -0.4949
1    1.0718
2    0.7216
3   -0.7068
4   -1.0396
Name: something, dtype: float64

In [31]: s.name
Out[31]: 'something'
```

The Series ``name`` will be assigned automatically in many cases, in particular when taking 1D slices of DataFrame as you will see below.

*New in version 0.18.0*.

You can rename a Series with the [pandas.Series.rename()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.rename.html#pandas.Series.rename) method.

```python
In [32]: s2 = s.rename("different")

In [33]: s2.name
Out[33]: 'different'
```

Note that s and s2 refer to different objects.