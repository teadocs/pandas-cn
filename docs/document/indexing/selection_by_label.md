# 按标签选择

<div class="warning-warp">  
<b>Warning</b><p>Whether a copy or a reference is returned for a setting operation, may depend on the context. This is sometimes called <code>chained assignment</code> and should be avoided. See <a href="http://pandas.pydata.org/pandas-docs/stable/indexing.html#indexing-view-versus-copy">Returning a View versus Copy</a>.</p>
</div>

<div class="warning-warp">  
<b>Warning</b>
<p><code>.loc</code> is strict when you present slicers that are not compatible (or convertible) with the index type. For example using integers in a <code>DatetimeIndex</code>. These will raise a <code>TypeError</code>.
</p>

<pre class="prettyprint language-python">
<code class="hljs">
In [39]: dfl = pd.DataFrame(np.random.randn(5,4), columns=list('ABCD'), index=pd.date_range('20130101',periods=5))

In [40]: dfl
Out[40]: 
                   A         B         C         D
2013-01-01  1.075770 -0.109050  1.643563 -1.469388
2013-01-02  0.357021 -0.674600 -1.776904 -0.968914
2013-01-03 -1.294524  0.413738  0.276662 -0.472035
2013-01-04 -0.013960 -0.362543 -0.006154 -0.923061
2013-01-05  0.895717  0.805244 -1.206412  2.565646
</code>
</pre>

<pre class="prettyprint language-python">
<code class="hljs">
In [4]: dfl.loc[2:3]
TypeError: cannot do slice indexing on &#60; class &#39;pandas.tseries.index.DatetimeIndex&#39;> with these indexers [2] of &#60; type &#39;int&#39;>
</code>
</pre>

String likes in slicing can be convertible to the type of the index and lead to natural slicing.

<pre class="prettyprint language-python">
<code class="hljs">
In [41]: dfl.loc['20130102':'20130104']
Out[41]: 
                   A         B         C         D
2013-01-02  0.357021 -0.674600 -1.776904 -0.968914
2013-01-03 -1.294524  0.413738  0.276662 -0.472035
2013-01-04 -0.013960 -0.362543 -0.006154 -0.923061
</code>
</pre>
</div>

<div class="warning-warp">  
<b>Warning</b><p>Starting in 0.21.0, pandas will show a <code>FutureWarning</code> if indexing with a list with missing labels. In the future this will raise a <code>KeyError</code>. See <a href="http://pandas.pydata.org/pandas-docs/stable/indexing.html#indexing-deprecate-loc-reindex-listlike">list-like Using loc with missing keys in a list is Deprecated.</a></p>
</div>

pandas provides a suite of methods in order to have **purely label based indexing**. This is a strict inclusion based protocol. Every label asked for must be in the index, or a KeyError will be raised. When slicing, both the start bound **AND** the stop bound are included, if present in the index. Integers are valid labels, but they refer to the label **and not the position**.

The ``.loc`` attribute is the primary access method. The following are valid inputs:

- A single label, e.g. 5 or 'a' (Note that 5 is interpreted as a label of the index. This use is not an integer position along the index.).
- A list or array of labels ['a', 'b', 'c'].
- A slice object with labels 'a':'f' (Note that contrary to usual python slices, both the start and the stop are included, when present in the index! See Slicing with labels.).
- A boolean array.
- A callable, see Selection By Callable.

```python
In [42]: s1 = pd.Series(np.random.randn(6),index=list('abcdef'))

In [43]: s1
Out[43]: 
a    1.431256
b    1.340309
c   -1.170299
d   -0.226169
e    0.410835
f    0.813850
dtype: float64

In [44]: s1.loc['c':]
Out[44]: 
c   -1.170299
d   -0.226169
e    0.410835
f    0.813850
dtype: float64

In [45]: s1.loc['b']
Out[45]: 1.3403088497993827
```

Note that setting works as well:

```python
In [46]: s1.loc['c':] = 0

In [47]: s1
Out[47]: 
a    1.431256
b    1.340309
c    0.000000
d    0.000000
e    0.000000
f    0.000000
dtype: float64
```

With a DataFrame:

```python
In [48]: df1 = pd.DataFrame(np.random.randn(6,4),
   ....:                    index=list('abcdef'),
   ....:                    columns=list('ABCD'))
   ....: 

In [49]: df1
Out[49]: 
          A         B         C         D
a  0.132003 -0.827317 -0.076467 -1.187678
b  1.130127 -1.436737 -1.413681  1.607920
c  1.024180  0.569605  0.875906 -2.211372
d  0.974466 -2.006747 -0.410001 -0.078638
e  0.545952 -1.219217 -1.226825  0.769804
f -1.281247 -0.727707 -0.121306 -0.097883

In [50]: df1.loc[['a', 'b', 'd'], :]
Out[50]: 
          A         B         C         D
a  0.132003 -0.827317 -0.076467 -1.187678
b  1.130127 -1.436737 -1.413681  1.607920
d  0.974466 -2.006747 -0.410001 -0.078638
```

Accessing via label slices:

```python
In [51]: df1.loc['d':, 'A':'C']
Out[51]: 
          A         B         C
d  0.974466 -2.006747 -0.410001
e  0.545952 -1.219217 -1.226825
f -1.281247 -0.727707 -0.121306
```

For getting a cross section using a label (equivalent to ``df.xs('a')``):

```python
In [52]: df1.loc['a']
Out[52]: 
A    0.132003
B   -0.827317
C   -0.076467
D   -1.187678
Name: a, dtype: float64
```

For getting values with a boolean array:

```python
In [53]: df1.loc['a'] > 0
Out[53]: 
A     True
B    False
C    False
D    False
Name: a, dtype: bool

In [54]: df1.loc[:, df1.loc['a'] > 0]
Out[54]: 
          A
a  0.132003
b  1.130127
c  1.024180
d  0.974466
e  0.545952
f -1.281247
```

For getting a value explicitly (equivalent to deprecated ``df.get_value('a','A')``):

```python
# this is also equivalent to ``df1.at['a','A']``
In [55]: df1.loc['a', 'A']
Out[55]: 0.13200317033032932
```

## Slicing with labels

When using ``.loc`` with slices, if both the start and the stop *labels* are present in the index, then elements located between the two (including them) are returned:

```python
In [56]: s = pd.Series(list('abcde'), index=[0,3,2,5,4])

In [57]: s.loc[3:5]
Out[57]: 
3    b
2    c
5    d
dtype: object
```

If at least one of the two is absent, but the index is sorted, and can be compared against start and stop labels, then slicing will still work as expected, by selecting labels which rank between the two:

```python
In [58]: s.sort_index()
Out[58]: 
0    a
2    c
3    b
4    e
5    d
dtype: object

In [59]: s.sort_index().loc[1:6]
Out[59]: 
2    c
3    b
4    e
5    d
dtype: object
```

However, if at least one of the two is absent and the index is not sorted, an error will be raised (since doing otherwise would be computationally expensive, as well as potentially ambiguous for mixed type indexes). For instance, in the above example, ``s.loc[1:6]`` would raise ``KeyError``.

