# 并列

There are several ways to concatenate a ``Series`` or ``Index``, either with itself or others, all based on [cat()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.cat.html#pandas.Series.str.cat), resp. ``Index.str.cat``.

## Concatenating a single Series into a string

The content of a ``Series`` (or ``Index``) can be concatenated:

```python
In [41]: s = pd.Series(['a', 'b', 'c', 'd'])

In [42]: s.str.cat(sep=',')
Out[42]: 'a,b,c,d'
```

If not specified, the keyword ``sep`` for the separator defaults to the empty string, ``sep=''``:

```python
In [43]: s.str.cat()
Out[43]: 'abcd'
```

By default, missing values are ignored. Using ``na_rep``, they can be given a representation:

```python
In [44]: t = pd.Series(['a', 'b', np.nan, 'd'])

In [45]: t.str.cat(sep=',')
Out[45]: 'a,b,d'

In [46]: t.str.cat(sep=',', na_rep='-')
Out[46]: 'a,b,-,d'
```

## Concatenating a Series and something list-like into a Series

The first argument to [cat()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.cat.html#pandas.Series.str.cat) can be a list-like object, provided that it matches the length of the calling ``Series`` (or ``Index``).

```python
In [47]: s.str.cat(['A', 'B', 'C', 'D'])
Out[47]: 
0    aA
1    bB
2    cC
3    dD
dtype: object
```

Missing values on either side will result in missing values in the result as well, unless ``na_rep`` is specified:

```python
In [48]: s.str.cat(t)
Out[48]: 
0     aa
1     bb
2    NaN
3     dd
dtype: object

In [49]: s.str.cat(t, na_rep='-')
Out[49]: 
0    aa
1    bb
2    c-
3    dd
dtype: object
```

## Concatenating a Series and something array-like into a Series

*New in version 0.23.0*.

The parameter ``others`` can also be two-dimensional. In this case, the number or rows must match the lengths of the calling ``Series`` (or ``Index``).

```python
In [50]: d = pd.concat([t, s], axis=1)

In [51]: s
Out[51]: 
0    a
1    b
2    c
3    d
dtype: object

In [52]: d
Out[52]: 
     0  1
0    a  a
1    b  b
2  NaN  c
3    d  d

In [53]: s.str.cat(d, na_rep='-')
Out[53]: 
0    aaa
1    bbb
2    c-c
3    ddd
dtype: object
```

## Concatenating a Series and an indexed object into a Series, with alignment

*New in version 0.23.0*.

For concatenation with a ``Series`` or ``DataFrame``, it is possible to align the indexes before concatenation by setting the ``join-keyword``.

```python
In [54]: u = pd.Series(['b', 'd', 'a', 'c'], index=[1, 3, 0, 2])

In [55]: s
Out[55]: 
0    a
1    b
2    c
3    d
dtype: object

In [56]: u
Out[56]: 
1    b
3    d
0    a
2    c
dtype: object

In [57]: s.str.cat(u)
Out[57]: 
0    ab
1    bd
2    ca
3    dc
dtype: object

In [58]: s.str.cat(u, join='left')
Out[58]: 
0    aa
1    bb
2    cc
3    dd
dtype: object
```

<div class="warning-warp">
<b>警告</b>
<p>
If the <code>join</code> keyword is not passed, the method <a href="http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.cat.html#pandas.Series.str.cat">cat()</a> will currently fall back to the behavior before version 0.23.0 (i.e. no alignment), but a <code>FutureWarning</code> will be raised if any of the involved indexes differ, since this default will change to <code>join='left'</code> in a future version.
</p>
</div>

The usual options are available for ``join`` (one of ``'left'``, ``'outer'``, ``'inner'``, ``'right'``). In particular, alignment also means that the different lengths do not need to coincide anymore. 

```python
In [59]: v = pd.Series(['z', 'a', 'b', 'd', 'e'], index=[-1, 0, 1, 3, 4])

In [60]: s
Out[60]: 
0    a
1    b
2    c
3    d
dtype: object

In [61]: v
Out[61]: 
-1    z
 0    a
 1    b
 3    d
 4    e
dtype: object

In [62]: s.str.cat(v, join='left', na_rep='-')
Out[62]: 
0    aa
1    bb
2    c-
3    dd
dtype: object

In [63]: s.str.cat(v, join='outer', na_rep='-')
Out[63]: 
-1    -z
 0    aa
 1    bb
 2    c-
 3    dd
 4    -e
dtype: object
```

The same alignment can be used when ``others`` is a ``DataFrame``:

```python
In [64]: f = d.loc[[3, 2, 1, 0], :]

In [65]: s
Out[65]: 
0    a
1    b
2    c
3    d
dtype: object

In [66]: f
Out[66]: 
     0  1
3    d  d
2  NaN  c
1    b  b
0    a  a

In [67]: s.str.cat(f, join='left', na_rep='-')
Out[67]: 
0    aaa
1    bbb
2    c-c
3    ddd
dtype: object
```

## Concatenating a Series and many objects into a Series

All one-dimensional list-likes can be arbitrarily combined in a list-like container (including iterators, dict-views, etc.):

```python
In [68]: s
Out[68]: 
0    a
1    b
2    c
3    d
dtype: object

In [69]: u
Out[69]: 
1    b
3    d
0    a
2    c
dtype: object

In [70]: s.str.cat([u, pd.Index(u.values), ['A', 'B', 'C', 'D'], map(str, u.index)], na_rep='-')
Out[70]: 
0    abbA1
1    bddB3
2    caaC0
3    dccD2
dtype: object
```

All elements must match in length to the calling ``Series`` (or Index), except those having an index if ``join`` is not None:

```python
In [71]: v
Out[71]: 
-1    z
 0    a
 1    b
 3    d
 4    e
dtype: object

In [72]: s.str.cat([u, v, ['A', 'B', 'C', 'D']], join='outer', na_rep='-')
Out[72]: 
-1    --z-
 0    aaaA
 1    bbbB
 2    cc-C
 3    dddD
 4    --e-
dtype: object
```

If using ``join='right'`` on a list of ``others`` that contains different indexes, the union of these indexes will be used as the basis for the final concatenation:

```python
In [73]: u.loc[[3]]
Out[73]: 
3    d
dtype: object

In [74]: v.loc[[-1, 0]]
Out[74]: 
-1    z
 0    a
dtype: object

In [75]: s.str.cat([u.loc[[3]], v.loc[[-1, 0]]], join='right', na_rep='-')
Out[75]: 
-1    --z
 0    a-a
 3    dd-
dtype: object
```