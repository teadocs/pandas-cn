# 拆分和替换字符串

Methods like ``split`` return a Series of lists:

```python
In [15]: s2 = pd.Series(['a_b_c', 'c_d_e', np.nan, 'f_g_h'])

In [16]: s2.str.split('_')
Out[16]: 
0    [a, b, c]
1    [c, d, e]
2          NaN
3    [f, g, h]
dtype: object
```

Elements in the split lists can be accessed using ``get`` or ``[]`` notation:

```python
In [17]: s2.str.split('_').str.get(1)
Out[17]: 
0      b
1      d
2    NaN
3      g
dtype: object

In [18]: s2.str.split('_').str[1]
Out[18]: 
0      b
1      d
2    NaN
3      g
dtype: object
```

It is easy to expand this to return a DataFrame using ``expand``.

```python
In [19]: s2.str.split('_', expand=True)
Out[19]: 
     0    1    2
0    a    b    c
1    c    d    e
2  NaN  NaN  NaN
3    f    g    h
```

It is also possible to limit the number of splits:

```python
In [20]: s2.str.split('_', expand=True, n=1)
Out[20]: 
     0    1
0    a  b_c
1    c  d_e
2  NaN  NaN
3    f  g_h
```

``rsplit`` is similar to ``split`` except it works in the reverse direction, i.e., from the end of the string to the beginning of the string:

```python
In [21]: s2.str.rsplit('_', expand=True, n=1)
Out[21]: 
     0    1
0  a_b    c
1  c_d    e
2  NaN  NaN
3  f_g    h
```

``replace`` by default replaces [regular expressions](https://docs.python.org/3/library/re.html):

```python
In [22]: s3 = pd.Series(['A', 'B', 'C', 'Aaba', 'Baca',
   ....:                '', np.nan, 'CABA', 'dog', 'cat'])
   ....: 

In [23]: s3
Out[23]: 
0       A
1       B
2       C
3    Aaba
4    Baca
5        
6     NaN
7    CABA
8     dog
9     cat
dtype: object

In [24]: s3.str.replace('^.a|dog', 'XX-XX ', case=False)
Out[24]: 
0           A
1           B
2           C
3    XX-XX ba
4    XX-XX ca
5            
6         NaN
7    XX-XX BA
8      XX-XX 
9     XX-XX t
dtype: object
```

Some caution must be taken to keep regular expressions in mind! For example, the following code will cause trouble because of the regular expression meaning of $:

```python
# Consider the following badly formatted financial data
In [25]: dollars = pd.Series(['12', '-$10', '$10,000'])

# This does what you'd naively expect:
In [26]: dollars.str.replace('$', '')
Out[26]: 
0        12
1       -10
2    10,000
dtype: object

# But this doesn't:
In [27]: dollars.str.replace('-$', '-')
Out[27]: 
0         12
1       -$10
2    $10,000
dtype: object

# We need to escape the special character (for >1 len patterns)
In [28]: dollars.str.replace(r'-\$', '-')
Out[28]: 
0         12
1        -10
2    $10,000
dtype: object
```

*New in version 0.23.0*.

If you do want literal replacement of a string (equivalent to [str.replace()](https://docs.python.org/3/library/stdtypes.html#str.replace)), you can set the optional regex parameter to ``False``, rather than escaping each character. In this case both pat and repl must be strings:

```python
# These lines are equivalent
In [29]: dollars.str.replace(r'-\$', '-')
Out[29]: 
0         12
1        -10
2    $10,000
dtype: object

In [30]: dollars.str.replace('-$', '-', regex=False)
Out[30]: 
0         12
1        -10
2    $10,000
dtype: object
```

*New in version 0.20.0*.

The ``replace`` method can also take a callable as replacement. It is called on every ``pat`` using [re.sub()](https://docs.python.org/3/library/re.html#re.sub). The callable should expect one positional argument (a regex object) and return a string.

```python
# Reverse every lowercase alphabetic word
In [31]: pat = r'[a-z]+'

In [32]: repl = lambda m: m.group(0)[::-1]

In [33]: pd.Series(['foo 123', 'bar baz', np.nan]).str.replace(pat, repl)
Out[33]: 
0    oof 123
1    rab zab
2        NaN
dtype: object

# Using regex groups
In [34]: pat = r"(?P<one>\w+) (?P<two>\w+) (?P<three>\w+)"

In [35]: repl = lambda m: m.group('two').swapcase()

In [36]: pd.Series(['Foo Bar Baz', np.nan]).str.replace(pat, repl)
Out[36]: 
0    bAR
1    NaN
dtype: object
```

*New in version 0.20.0*.

The ``replace`` method also accepts a compiled regular expression object from [re.compile()](https://docs.python.org/3/library/re.html#re.compile) as a pattern. All flags should be included in the compiled regular expression object.

```python
In [37]: import re

In [38]: regex_pat = re.compile(r'^.a|dog', flags=re.IGNORECASE)

In [39]: s3.str.replace(regex_pat, 'XX-XX ')
Out[39]: 
0           A
1           B
2           C
3    XX-XX ba
4    XX-XX ca
5            
6         NaN
7    XX-XX BA
8      XX-XX 
9     XX-XX t
dtype: object
```

Including a ``flags`` argument when calling ``replace`` with a compiled regular expression object will raise a ``ValueError``.

```python
In [40]: s3.str.replace(regex_pat, 'XX-XX ', flags=re.IGNORECASE)
---------------------------------------------------------------------------
ValueError: case and flags cannot be set when pat is a compiled regex
```