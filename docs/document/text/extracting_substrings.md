# 提取子字符串

## Extract first match in each subject (extract)

<div class="warning-warp">
<b>警告</b>
<p>
In version 0.18.0, <code>extract</code> gained the <code>expand</code> argument. When <code>expand=False</code> it returns a <code>Series</code>, <code>Index</code>, or <code>DataFrame</code>, depending on the subject and regular expression pattern (same behavior as pre-0.18.0). When <code>expand=True</code> it always returns a <code>DataFrame</code>, which is more consistent and less confusing from the perspective of a user. <code>expand=True</code> is the default since version 0.23.0.
</p>
</div>

The ``extract`` method accepts a [regular expression](https://docs.python.org/3/library/re.html) with at least one capture group.

Extracting a regular expression with more than one group returns a DataFrame with one column per group.

```python
In [79]: pd.Series(['a1', 'b2', 'c3']).str.extract('([ab])(\d)', expand=False)
Out[79]: 
     0    1
0    a    1
1    b    2
2  NaN  NaN
```

Elements that do not match return a row filled with ``NaN``. Thus, a Series of messy strings can be “converted” into a like-indexed Series or DataFrame of cleaned-up or more useful strings, without necessitating ``get()`` to access tuples or ``re.match`` objects. The dtype of the result is always object, even if no match is found and the result only contains ``NaN``.

Named groups like

```python
In [80]: pd.Series(['a1', 'b2', 'c3']).str.extract('(?P<letter>[ab])(?P<digit>\d)', expand=False)
Out[80]: 
  letter digit
0      a     1
1      b     2
2    NaN   NaN
```

and optional groups like

```python
In [81]: pd.Series(['a1', 'b2', '3']).str.extract('([ab])?(\d)', expand=False)
Out[81]: 
     0  1
0    a  1
1    b  2
2  NaN  3
```

can also be used. Note that any capture group names in the regular expression will be used for column names; otherwise capture group numbers will be used.

Extracting a regular expression with one group returns a DataFrame with one column if ``expand=True``.

```python
In [82]: pd.Series(['a1', 'b2', 'c3']).str.extract('[ab](\d)', expand=True)
Out[82]: 
     0
0    1
1    2
2  NaN
```

It returns a Series if ``expand=False``.

```python
In [83]: pd.Series(['a1', 'b2', 'c3']).str.extract('[ab](\d)', expand=False)
Out[83]: 
0      1
1      2
2    NaN
dtype: object
```

Calling on an Index with a regex with exactly one capture group returns a ``DataFrame`` with one column if ``expand=True``.

```python
In [84]: s = pd.Series(["a1", "b2", "c3"], ["A11", "B22", "C33"])

In [85]: s
Out[85]: 
A11    a1
B22    b2
C33    c3
dtype: object

In [86]: s.index.str.extract("(?P<letter>[a-zA-Z])", expand=True)
Out[86]: 
  letter
0      A
1      B
2      C
```

It returns an ``Index`` if ``expand=False``.

```python
In [87]: s.index.str.extract("(?P<letter>[a-zA-Z])", expand=False)
Out[87]: Index(['A', 'B', 'C'], dtype='object', name='letter')
```

Calling on an ``Index`` with a regex with more than one capture group returns a ``DataFrame`` if ``expand=True``.

```python
In [88]: s.index.str.extract("(?P<letter>[a-zA-Z])([0-9]+)", expand=True)
Out[88]: 
  letter   1
0      A  11
1      B  22
2      C  33
```

It raises ValueError if expand=False.

```python
>>> s.index.str.extract("(?P<letter>[a-zA-Z])([0-9]+)", expand=False)
ValueError: only one regex group is supported with Index
```

The table below summarizes the behavior of ``extract(expand=False)`` (input subject in first column, number of groups in regex in first row)

- | 1 group | >1 group
Index | Index | ValueError
Series | Series | DataFrame

## Extract all matches in each subject (extractall)

*New in version 0.18.0*.

Unlike ``extract`` (which returns only the first match),

```python
In [89]: s = pd.Series(["a1a2", "b1", "c1"], index=["A", "B", "C"])

In [90]: s
Out[90]: 
A    a1a2
B      b1
C      c1
dtype: object

In [91]: two_groups = '(?P<letter>[a-z])(?P<digit>[0-9])'

In [92]: s.str.extract(two_groups, expand=True)
Out[92]: 
  letter digit
A      a     1
B      b     1
C      c     1
```

the ``extractall`` method returns every match. The result of ``extractall is`` always a ``DataFrame`` with a ``MultiIndex`` on its rows. The last level of the ``MultiIndex`` is named ``match`` and indicates the order in the subject.

```python
In [93]: s.str.extractall(two_groups)
Out[93]: 
        letter digit
  match             
A 0          a     1
  1          a     2
B 0          b     1
C 0          c     1
```

When each subject string in the Series has exactly one match,

```python
In [94]: s = pd.Series(['a3', 'b3', 'c2'])

In [95]: s
Out[95]: 
0    a3
1    b3
2    c2
dtype: object
```

then ``extractall(pat).xs(0, level='match')`` gives the same result as ``extract(pat)``.

```python
In [96]: extract_result = s.str.extract(two_groups, expand=True)

In [97]: extract_result
Out[97]: 
  letter digit
0      a     3
1      b     3
2      c     2

In [98]: extractall_result = s.str.extractall(two_groups)

In [99]: extractall_result
Out[99]: 
        letter digit
  match             
0 0          a     3
1 0          b     3
2 0          c     2

In [100]: extractall_result.xs(0, level="match")
Out[100]: 
  letter digit
0      a     3
1      b     3
2      c     2
```

``Index`` also supports ``.str.extractall.`` It returns a ``DataFrame`` which has the same result as a ``Series.str.extractall`` with a default index (starts from 0).

*New in version 0.19.0*.

```python
In [101]: pd.Index(["a1a2", "b1", "c1"]).str.extractall(two_groups)
Out[101]: 
        letter digit
  match             
0 0          a     1
  1          a     2
1 0          b     1
2 0          c     1

In [102]: pd.Series(["a1a2", "b1", "c1"]).str.extractall(two_groups)
Out[102]: 
        letter digit
  match             
0 0          a     1
  1          a     2
1 0          b     1
2 0          c     1
```