# query()方法

[DataFrame](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.html#pandas.DataFrame) objects have a [query()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.query.html#pandas.DataFrame.query) method that allows selection using an expression.

You can get the value of the frame where column b has values between the values of columns a and c. For example:

```python
In [202]: n = 10

In [203]: df = pd.DataFrame(np.random.rand(n, 3), columns=list('abc'))

In [204]: df
Out[204]: 
          a         b         c
0  0.438921  0.118680  0.863670
1  0.138138  0.577363  0.686602
2  0.595307  0.564592  0.520630
3  0.913052  0.926075  0.616184
4  0.078718  0.854477  0.898725
5  0.076404  0.523211  0.591538
6  0.792342  0.216974  0.564056
7  0.397890  0.454131  0.915716
8  0.074315  0.437913  0.019794
9  0.559209  0.502065  0.026437

# pure python
In [205]: df[(df.a < df.b) & (df.b < df.c)]
Out[205]: 
          a         b         c
1  0.138138  0.577363  0.686602
4  0.078718  0.854477  0.898725
5  0.076404  0.523211  0.591538
7  0.397890  0.454131  0.915716

# query
In [206]: df.query('(a < b) & (b < c)')
Out[206]: 
          a         b         c
1  0.138138  0.577363  0.686602
4  0.078718  0.854477  0.898725
5  0.076404  0.523211  0.591538
7  0.397890  0.454131  0.915716
```

Do the same thing but fall back on a named index if there is no column with the name ``a``.

```python
In [207]: df = pd.DataFrame(np.random.randint(n / 2, size=(n, 2)), columns=list('bc'))

In [208]: df.index.name = 'a'

In [209]: df
Out[209]: 
   b  c
a      
0  0  4
1  0  1
2  3  4
3  4  3
4  1  4
5  0  3
6  0  1
7  3  4
8  2  3
9  1  1

In [210]: df.query('a < b and b < c')
Out[210]: 
   b  c
a      
2  3  4
```

If instead you don’t want to or cannot name your index, you can use the name index in your query expression:

```python
In [211]: df = pd.DataFrame(np.random.randint(n, size=(n, 2)), columns=list('bc'))

In [212]: df
Out[212]: 
   b  c
0  3  1
1  3  0
2  5  6
3  5  2
4  7  4
5  0  1
6  2  5
7  0  1
8  6  0
9  7  9

In [213]: df.query('index < b < c')
Out[213]: 
   b  c
2  5  6
```

**Note**: If the name of your index overlaps with a column name, the column name is given precedence. For example,

```python
In [214]: df = pd.DataFrame({'a': np.random.randint(5, size=5)})

In [215]: df.index.name = 'a'

In [216]: df.query('a > 2') # uses the column 'a', not the index
Out[216]: 
   a
a   
1  3
3  3
```

You can still use the index in a query expression by using the special identifier ‘index’:

```python
In [217]: df.query('index > 2')
Out[217]: 
   a
a   
3  3
4  2
```

If for some reason you have a column named index, then you can refer to the index as ilevel_0 as well, but at this point you should consider renaming your columns to something less ambiguous.

## MultiIndex query() Syntax

You can also use the levels of a DataFrame with a [MultiIndex](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.MultiIndex.html#pandas.MultiIndex) as if they were columns in the frame:

```python
In [218]: n = 10

In [219]: colors = np.random.choice(['red', 'green'], size=n)

In [220]: foods = np.random.choice(['eggs', 'ham'], size=n)

In [221]: colors
Out[221]: 
array(['red', 'red', 'red', 'green', 'green', 'green', 'green', 'green',
       'green', 'green'],
      dtype='<U5')

In [222]: foods
Out[222]: 
array(['ham', 'ham', 'eggs', 'eggs', 'eggs', 'ham', 'ham', 'eggs', 'eggs',
       'eggs'],
      dtype='<U4')

In [223]: index = pd.MultiIndex.from_arrays([colors, foods], names=['color', 'food'])

In [224]: df = pd.DataFrame(np.random.randn(n, 2), index=index)

In [225]: df
Out[225]: 
                   0         1
color food                    
red   ham   0.194889 -0.381994
      ham   0.318587  2.089075
      eggs -0.728293 -0.090255
green eggs -0.748199  1.318931
      eggs -2.029766  0.792652
      ham   0.461007 -0.542749
      ham  -0.305384 -0.479195
      eggs  0.095031 -0.270099
      eggs -0.707140 -0.773882
      eggs  0.229453  0.304418

In [226]: df.query('color == "red"')
Out[226]: 
                   0         1
color food                    
red   ham   0.194889 -0.381994
      ham   0.318587  2.089075
      eggs -0.728293 -0.090255
```

If the levels of the ``MultiIndex`` are unnamed, you can refer to them using special names:

```python
In [227]: df.index.names = [None, None]

In [228]: df
Out[228]: 
                   0         1
red   ham   0.194889 -0.381994
      ham   0.318587  2.089075
      eggs -0.728293 -0.090255
green eggs -0.748199  1.318931
      eggs -2.029766  0.792652
      ham   0.461007 -0.542749
      ham  -0.305384 -0.479195
      eggs  0.095031 -0.270099
      eggs -0.707140 -0.773882
      eggs  0.229453  0.304418

In [229]: df.query('ilevel_0 == "red"')
Out[229]: 
                 0         1
red ham   0.194889 -0.381994
    ham   0.318587  2.089075
    eggs -0.728293 -0.090255
```

The convention is ``ilevel_0``, which means “index level 0” for the 0th level of the ``index``.

## query() Use Cases

A use case for [query()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.query.html#pandas.DataFrame.query) is when you have a collection of [DataFrame](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.html#pandas.DataFrame) objects that have a subset of column names (or index levels/names) in common. You can pass the same query to both frames without having to specify which frame you’re interested in querying

```python
In [230]: df = pd.DataFrame(np.random.rand(n, 3), columns=list('abc'))

In [231]: df
Out[231]: 
          a         b         c
0  0.224283  0.736107  0.139168
1  0.302827  0.657803  0.713897
2  0.611185  0.136624  0.984960
3  0.195246  0.123436  0.627712
4  0.618673  0.371660  0.047902
5  0.480088  0.062993  0.185760
6  0.568018  0.483467  0.445289
7  0.309040  0.274580  0.587101
8  0.258993  0.477769  0.370255
9  0.550459  0.840870  0.304611

In [232]: df2 = pd.DataFrame(np.random.rand(n + 2, 3), columns=df.columns)

In [233]: df2
Out[233]: 
           a         b         c
0   0.357579  0.229800  0.596001
1   0.309059  0.957923  0.965663
2   0.123102  0.336914  0.318616
3   0.526506  0.323321  0.860813
4   0.518736  0.486514  0.384724
5   0.190804  0.505723  0.614533
6   0.891939  0.623977  0.676639
7   0.480559  0.378528  0.460858
8   0.420223  0.136404  0.141295
9   0.732206  0.419540  0.604675
10  0.604466  0.848974  0.896165
11  0.589168  0.920046  0.732716

In [234]: expr = '0.0 <= a <= c <= 0.5'

In [235]: map(lambda frame: frame.query(expr), [df, df2])
Out[235]: <map at 0x7f20f7b679e8>
```

## query() Python versus pandas Syntax Comparison

Full numpy-like syntax:

```python
In [236]: df = pd.DataFrame(np.random.randint(n, size=(n, 3)), columns=list('abc'))

In [237]: df
Out[237]: 
   a  b  c
0  7  8  9
1  1  0  7
2  2  7  2
3  6  2  2
4  2  6  3
5  3  8  2
6  1  7  2
7  5  1  5
8  9  8  0
9  1  5  0

In [238]: df.query('(a < b) & (b < c)')
Out[238]: 
   a  b  c
0  7  8  9

In [239]: df[(df.a < df.b) & (df.b < df.c)]
Out[239]: 
   a  b  c
0  7  8  9
```

Slightly nicer by removing the parentheses (by binding making comparison operators bind tighter than & and |).

```python
In [240]: df.query('a < b & b < c')
Out[240]: 
   a  b  c
0  7  8  9
```

Use English instead of symbols:

```python
In [241]: df.query('a < b and b < c')
Out[241]: 
   a  b  c
0  7  8  9
```

Pretty close to how you might write it on paper:

```python
In [242]: df.query('a < b < c')
Out[242]: 
   a  b  c
0  7  8  9
```

## The in and not in operators

[query()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.DataFrame.query.html#pandas.DataFrame.query) also supports special use of Python’s in and not in comparison operators, providing a succinct syntax for calling the ``isin`` method of a ``Series`` or ``DataFrame``.

```python
# get all rows where columns "a" and "b" have overlapping values
In [243]: df = pd.DataFrame({'a': list('aabbccddeeff'), 'b': list('aaaabbbbcccc'),
   .....:                    'c': np.random.randint(5, size=12),
   .....:                    'd': np.random.randint(9, size=12)})
   .....: 

In [244]: df
Out[244]: 
    a  b  c  d
0   a  a  2  6
1   a  a  4  7
2   b  a  1  6
3   b  a  2  1
4   c  b  3  6
5   c  b  0  2
6   d  b  3  3
7   d  b  2  1
8   e  c  4  3
9   e  c  2  0
10  f  c  0  6
11  f  c  1  2

In [245]: df.query('a in b')
Out[245]: 
   a  b  c  d
0  a  a  2  6
1  a  a  4  7
2  b  a  1  6
3  b  a  2  1
4  c  b  3  6
5  c  b  0  2

# How you'd do it in pure Python
In [246]: df[df.a.isin(df.b)]
Out[246]: 
   a  b  c  d
0  a  a  2  6
1  a  a  4  7
2  b  a  1  6
3  b  a  2  1
4  c  b  3  6
5  c  b  0  2

In [247]: df.query('a not in b')
Out[247]: 
    a  b  c  d
6   d  b  3  3
7   d  b  2  1
8   e  c  4  3
9   e  c  2  0
10  f  c  0  6
11  f  c  1  2

# pure Python
In [248]: df[~df.a.isin(df.b)]
Out[248]: 
    a  b  c  d
6   d  b  3  3
7   d  b  2  1
8   e  c  4  3
9   e  c  2  0
10  f  c  0  6
11  f  c  1  2
```

You can combine this with other expressions for very succinct queries:

```python
# rows where cols a and b have overlapping values and col c's values are less than col d's
In [249]: df.query('a in b and c < d')
Out[249]: 
   a  b  c  d
0  a  a  2  6
1  a  a  4  7
2  b  a  1  6
4  c  b  3  6
5  c  b  0  2

# pure Python
In [250]: df[df.b.isin(df.a) & (df.c < df.d)]
Out[250]: 
    a  b  c  d
0   a  a  2  6
1   a  a  4  7
2   b  a  1  6
4   c  b  3  6
5   c  b  0  2
10  f  c  0  6
11  f  c  1  2
```

**Note**: Note that ``in`` and ``not in`` are evaluated in Python, since ``numexpr`` has no equivalent of this operation. However, **only the** ``in/not`` in **expression itself** is evaluated in vanilla Python. For example, in the expression

```python
df.query('a in b + c + d')
```

``(b + c + d)`` is evaluated by ``numexpr`` and then the ``in`` operation is evaluated in plain Python. In general, any operations that can be evaluated using ``numexpr`` will be.

## Special use of the == operator with list objects

Comparing a ``list`` of values to a column using ==/!= works similarly to ``in/not in``.

```python
In [251]: df.query('b == ["a", "b", "c"]')
Out[251]: 
    a  b  c  d
0   a  a  2  6
1   a  a  4  7
2   b  a  1  6
3   b  a  2  1
4   c  b  3  6
5   c  b  0  2
6   d  b  3  3
7   d  b  2  1
8   e  c  4  3
9   e  c  2  0
10  f  c  0  6
11  f  c  1  2

# pure Python
In [252]: df[df.b.isin(["a", "b", "c"])]
Out[252]: 
    a  b  c  d
0   a  a  2  6
1   a  a  4  7
2   b  a  1  6
3   b  a  2  1
4   c  b  3  6
5   c  b  0  2
6   d  b  3  3
7   d  b  2  1
8   e  c  4  3
9   e  c  2  0
10  f  c  0  6
11  f  c  1  2

In [253]: df.query('c == [1, 2]')
Out[253]: 
    a  b  c  d
0   a  a  2  6
2   b  a  1  6
3   b  a  2  1
7   d  b  2  1
9   e  c  2  0
11  f  c  1  2

In [254]: df.query('c != [1, 2]')
Out[254]: 
    a  b  c  d
1   a  a  4  7
4   c  b  3  6
5   c  b  0  2
6   d  b  3  3
8   e  c  4  3
10  f  c  0  6

# using in/not in
In [255]: df.query('[1, 2] in c')
Out[255]: 
    a  b  c  d
0   a  a  2  6
2   b  a  1  6
3   b  a  2  1
7   d  b  2  1
9   e  c  2  0
11  f  c  1  2

In [256]: df.query('[1, 2] not in c')
Out[256]: 
    a  b  c  d
1   a  a  4  7
4   c  b  3  6
5   c  b  0  2
6   d  b  3  3
8   e  c  4  3
10  f  c  0  6

# pure Python
In [257]: df[df.c.isin([1, 2])]
Out[257]: 
    a  b  c  d
0   a  a  2  6
2   b  a  1  6
3   b  a  2  1
7   d  b  2  1
9   e  c  2  0
11  f  c  1  2
```

## Boolean Operators

You can negate boolean expressions with the word ``not`` or the ``~`` operator.

```python
In [258]: df = pd.DataFrame(np.random.rand(n, 3), columns=list('abc'))

In [259]: df['bools'] = np.random.rand(len(df)) > 0.5

In [260]: df.query('~bools')
Out[260]: 
          a         b         c  bools
2  0.697753  0.212799  0.329209  False
7  0.275396  0.691034  0.826619  False
8  0.190649  0.558748  0.262467  False

In [261]: df.query('not bools')
Out[261]: 
          a         b         c  bools
2  0.697753  0.212799  0.329209  False
7  0.275396  0.691034  0.826619  False
8  0.190649  0.558748  0.262467  False

In [262]: df.query('not bools') == df[~df.bools]
Out[262]: 
      a     b     c  bools
2  True  True  True   True
7  True  True  True   True
8  True  True  True   True
```

Of course, expressions can be arbitrarily complex too:

```python
# short query syntax
In [263]: shorter = df.query('a < b < c and (not bools) or bools > 2')

# equivalent in pure Python
In [264]: longer = df[(df.a < df.b) & (df.b < df.c) & (~df.bools) | (df.bools > 2)]

In [265]: shorter
Out[265]: 
          a         b         c  bools
7  0.275396  0.691034  0.826619  False

In [266]: longer
Out[266]: 
          a         b         c  bools
7  0.275396  0.691034  0.826619  False

In [267]: shorter == longer
Out[267]: 
      a     b     c  bools
7  True  True  True   True
```

## Performance of query()

``DataFrame.query()`` using ``numexpr`` is slightly faster than Python for large frames.

![pandas速度对比](/static/images/query-perf.png)

**Note**: You will only see the performance benefits of using the numexpr engine with DataFrame.query() if your frame has more than approximately 200,000 rows.

![pandas速度对比2](/static/images/query-perf-small.png)

This plot was created using a ``DataFrame`` with 3 columns each containing floating point values generated using ``numpy.random.randn()``.