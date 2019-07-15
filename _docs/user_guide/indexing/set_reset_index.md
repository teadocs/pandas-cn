# 设置/重置索引

Occasionally you will load or create a data set into a DataFrame and want to add an index after you’ve already done so. There are a couple of different ways.

## Set an index

DataFrame has a [set_index()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.DataFrame.set_index.html#Pandas.DataFrame.set_index) method which takes a column name (for a regular Index) or a list of column names (for a ``MultiIndex``). To create a new, re-indexed DataFrame:

```python
In [324]: data
Out[324]: 
     a    b  c    d
0  bar  one  z  1.0
1  bar  two  y  2.0
2  foo  one  x  3.0
3  foo  two  w  4.0

In [325]: indexed1 = data.set_index('c')

In [326]: indexed1
Out[326]: 
     a    b    d
c               
z  bar  one  1.0
y  bar  two  2.0
x  foo  one  3.0
w  foo  two  4.0

In [327]: indexed2 = data.set_index(['a', 'b'])

In [328]: indexed2
Out[328]: 
         c    d
a   b          
bar one  z  1.0
    two  y  2.0
foo one  x  3.0
    two  w  4.0
```

The ``append`` keyword option allow you to keep the existing index and append the given columns to a MultiIndex:

```python
In [329]: frame = data.set_index('c', drop=False)

In [330]: frame = frame.set_index(['a', 'b'], append=True)

In [331]: frame
Out[331]: 
           c    d
c a   b          
z bar one  z  1.0
y bar two  y  2.0
x foo one  x  3.0
w foo two  w  4.0
```

Other options in ``set_index`` allow you not drop the index columns or to add the index in-place (without creating a new object):

```python
In [332]: data.set_index('c', drop=False)
Out[332]: 
     a    b  c    d
c                  
z  bar  one  z  1.0
y  bar  two  y  2.0
x  foo  one  x  3.0
w  foo  two  w  4.0

In [333]: data.set_index(['a', 'b'], inplace=True)

In [334]: data
Out[334]: 
         c    d
a   b          
bar one  z  1.0
    two  y  2.0
foo one  x  3.0
    two  w  4.0
```

## Reset the index

As a convenience, there is a new function on DataFrame called [reset_index()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.DataFrame.reset_index.html#Pandas.DataFrame.reset_index) which transfers the index values into the DataFrame’s columns and sets a simple integer index. This is the inverse operation of [set_index()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.DataFrame.set_index.html#Pandas.DataFrame.set_index).

```python
In [335]: data
Out[335]: 
         c    d
a   b          
bar one  z  1.0
    two  y  2.0
foo one  x  3.0
    two  w  4.0

In [336]: data.reset_index()
Out[336]: 
     a    b  c    d
0  bar  one  z  1.0
1  bar  two  y  2.0
2  foo  one  x  3.0
3  foo  two  w  4.0
```

The output is more similar to a SQL table or a record array. The names for the columns derived from the index are the ones stored in the ``names`` attribute.

You can use the ``level`` keyword to remove only a portion of the index:

```python
In [337]: frame
Out[337]: 
           c    d
c a   b          
z bar one  z  1.0
y bar two  y  2.0
x foo one  x  3.0
w foo two  w  4.0

In [338]: frame.reset_index(level=1)
Out[338]: 
         a  c    d
c b               
z one  bar  z  1.0
y two  bar  y  2.0
x one  foo  x  3.0
w two  foo  w  4.0
```

``reset_index`` takes an optional parameter drop which if true simply discards the index, instead of putting index values in the DataFrame’s columns.

## Adding an ad hoc index

If you create an index yourself, you can just assign it to the ``index`` field:

```python
data.index = index
```
