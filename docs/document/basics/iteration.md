# 迭代

The behavior of basic iteration over pandas objects depends on the type. When iterating over a Series, it is regarded as array-like, and basic iteration produces the values. Other data structures, like DataFrame and Panel, follow the dict-like convention of iterating over the “keys” of the objects.

In short, basic iteration (``for i in object``) produces:

- **Series**: values
- **DataFrame**: column labels
- **Panel**: item labels

Thus, for example, iterating over a DataFrame gives you the column names:

```python
In [261]: df = pd.DataFrame({'col1' : np.random.randn(3), 'col2' : np.random.randn(3)},
   .....:                   index=['a', 'b', 'c'])
   .....: 

In [262]: for col in df:
   .....:     print(col)
   .....: 
col1
col2
```

Pandas objects also have the dict-like [iteritems()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.iteritems.html#pandas.DataFrame.iteritems) method to iterate over the (key, value) pairs.

To iterate over the rows of a DataFrame, you can use the following methods:

- [iterrows()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.iterrows.html#pandas.DataFrame.iterrows): Iterate over the rows of a DataFrame as (index, Series) pairs. This converts the rows to Series objects, which can change the dtypes and has some performance implications.
- [itertuples()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.itertuples.html#pandas.DataFrame.itertuples): Iterate over the rows of a DataFrame as namedtuples of the values. This is a lot faster than [iterrows()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.iterrows.html#pandas.DataFrame.iterrows), and is in most cases preferable to use to iterate over the values of a DataFrame.

<div class="warning-warp">
<b>警告</b><p> Iterating through pandas objects is generally <b>slow</b>. In many cases, iterating manually over the rows is not needed and can be avoided with one of the following approaches:</p>
<ul>
    <li>
        Look for a vectorized solution: many operations can be performed using built-in methods or NumPy functions, (boolean) indexing, …
    </li>
    <li>
        When you have a function that cannot work on the full DataFrame/Series at once, it is better to use <a href="http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.apply.html#pandas.DataFrame.apply">apply()</a> instead of iterating over the values. See the docs on <a href="http://pandas.pydata.org/pandas-docs/stable/basics.html#basics-apply" >function application</a>.
    </li>
    <li>
        If you need to do iterative manipulations on the values but performance is important, consider writing the inner loop with cython or numba. See the <a href="http://pandas.pydata.org/pandas-docs/stable/enhancingperf.html#enhancingperf">enhancing performance</a> section for some examples of this approach.
    </li>
</ul>
</div>

<div class="warning-warp">
<b>警告</b><p> You should never modify something you are iterating over. This is not guaranteed to work in all cases. Depending on the data types, the iterator returns a copy and not a view, and writing to it will have no effect! </p>
<p> For example, in the following case setting the value has no effect:</p>
<pre class="prettyprint language-python">
<code class="hljs">
In [263]: df = pd.DataFrame({'a': [1, 2, 3], 'b': ['a', 'b', 'c']})

In [264]: for index, row in df.iterrows():
   .....:     row['a'] = 10
   .....: 

In [265]: df
Out[265]: 
   a  b
0  1  a
1  2  b
2  3  c
</code>
</pre>
</div>

## iteritems

Consistent with the dict-like interface, [iteritems()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.iteritems.html#pandas.DataFrame.iteritems) iterates through key-value pairs:

- **Series**: (index, scalar value) pairs
- **DataFrame**: (column, Series) pairs
- **Panel**: (item, DataFrame) pairs

For example:

```python
In [266]: for item, frame in wp.iteritems():
   .....:     print(item)
   .....:     print(frame)
   .....: 
Item1
                   A         B         C         D
2000-01-01 -0.433567 -0.273610  0.680433 -0.308450
2000-01-02 -0.276099 -1.821168 -1.993606 -1.927385
2000-01-03 -2.027924  1.624972  0.551135  3.059267
2000-01-04  0.455264 -0.030740  0.935716  1.061192
2000-01-05 -2.107852  0.199905  0.323586 -0.641630
Item2
                   A         B         C         D
2000-01-01 -0.587514  0.053897  0.194889 -0.381994
2000-01-02  0.318587  2.089075 -0.728293 -0.090255
2000-01-03 -0.748199  1.318931 -2.029766  0.792652
2000-01-04  0.461007 -0.542749 -0.305384 -0.479195
2000-01-05  0.095031 -0.270099 -0.707140 -0.773882
```

## iterrows

[iterrows()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.iterrows.html#pandas.DataFrame.iterrows) allows you to iterate through the rows of a DataFrame as Series objects. It returns an iterator yielding each index value along with a Series containing the data in each row:

```python
In [267]: for row_index, row in df.iterrows():
   .....:     print('%s\n%s' % (row_index, row))
   .....: 
0
a    1
b    a
Name: 0, dtype: object
1
a    2
b    b
Name: 1, dtype: object
2
a    3
b    c
Name: 2, dtype: object
```

**Note**: Because [iterrows()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.iterrows.html#pandas.DataFrame.iterrows) returns a Series for each row, it does **not** preserve dtypes across the rows (dtypes are preserved across columns for DataFrames). For example,

```python
In [268]: df_orig = pd.DataFrame([[1, 1.5]], columns=['int', 'float'])

In [269]: df_orig.dtypes
Out[269]: 
int        int64
float    float64
dtype: object

In [270]: row = next(df_orig.iterrows())[1]

In [271]: row
Out[271]: 
int      1.0
float    1.5
Name: 0, dtype: float64
```

All values in ``row``, returned as a Series, are now upcasted to floats, also the original integer value in column x:

```python
In [272]: row['int'].dtype
Out[272]: dtype('float64')

In [273]: df_orig['int'].dtype
Out[273]: dtype('int64')
```

To preserve dtypes while iterating over the rows, it is better to use [itertuples()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.itertuples.html#pandas.DataFrame.itertuples) which returns namedtuples of the values and which is generally much faster than [iterrows()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.iterrows.html#pandas.DataFrame.iterrows).

For instance, a contrived way to transpose the DataFrame would be:

```python
In [274]: df2 = pd.DataFrame({'x': [1, 2, 3], 'y': [4, 5, 6]})

In [275]: print(df2)
   x  y
0  1  4
1  2  5
2  3  6

In [276]: print(df2.T)
   0  1  2
x  1  2  3
y  4  5  6

In [277]: df2_t = pd.DataFrame(dict((idx,values) for idx, values in df2.iterrows()))

In [278]: print(df2_t)
   0  1  2
x  1  2  3
y  4  5  6
```

## itertuples

The [itertuples()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.itertuples.html#pandas.DataFrame.itertuples) method will return an iterator yielding a namedtuple for each row in the DataFrame. The first element of the tuple will be the row’s corresponding index value, while the remaining values are the row values.

For instance:

```python
In [279]: for row in df.itertuples():
   .....:     print(row)
   .....: 
Pandas(Index=0, a=1, b='a')
Pandas(Index=1, a=2, b='b')
Pandas(Index=2, a=3, b='c')
```

This method does not convert the row to a Series object; it merely returns the values inside a namedtuple. Therefore, [itertuples()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.itertuples.html#pandas.DataFrame.itertuples) preserves the data type of the values and is generally faster as [iterrows()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.iterrows.html#pandas.DataFrame.iterrows).

**Note**: The column names will be renamed to positional names if they are invalid Python identifiers, repeated, or start with an underscore. With a large number of columns (>255), regular tuples are returned.