# 面板(Series)

**Warning:** In 0.20.0, Panel is deprecated and will be removed in a future version. See the section [Deprecate Panel](http://pandas.pydata.org/pandas-docs/stable/dsintro.html#dsintro-deprecate-panel).

Panel is a somewhat less-used, but still important container for 3-dimensional data. The term panel data is derived from econometrics and is partially responsible for the name pandas: pan(el)-da(ta)-s. The names for the 3 axes are intended to give some semantic meaning to describing operations involving panel data and, in particular, econometric analysis of panel data. However, for the strict purposes of slicing and dicing a collection of DataFrame objects, you may find the axis names slightly arbitrary:

- items: axis 0, each item corresponds to a DataFrame contained inside
- major_axis: axis 1, it is the index (rows) of each of the DataFrames
- minor_axis: axis 2, it is the columns of each of the DataFrames

Construction of Panels works about like you would expect:

## From 3D ndarray with optional axis labels

```python
In [121]: wp = pd.Panel(np.random.randn(2, 5, 4), items=['Item1', 'Item2'],
   .....:               major_axis=pd.date_range('1/1/2000', periods=5),
   .....:               minor_axis=['A', 'B', 'C', 'D'])
   .....: 

In [122]: wp
Out[122]: 
<class 'pandas.core.panel.Panel'>
Dimensions: 2 (items) x 5 (major_axis) x 4 (minor_axis)
Items axis: Item1 to Item2
Major_axis axis: 2000-01-01 00:00:00 to 2000-01-05 00:00:00
Minor_axis axis: A to D
```

## From dict of DataFrame objects

```python
In [123]: data = {'Item1' : pd.DataFrame(np.random.randn(4, 3)),
   .....:         'Item2' : pd.DataFrame(np.random.randn(4, 2))}
   .....: 

In [124]: pd.Panel(data)
Out[124]: 
<class 'pandas.core.panel.Panel'>
Dimensions: 2 (items) x 4 (major_axis) x 3 (minor_axis)
Items axis: Item1 to Item2
Major_axis axis: 0 to 3
Minor_axis axis: 0 to 2
```

Note that the values in the dict need only be **convertible to DataFrame**. Thus, they can be any of the other valid inputs to DataFrame as per above.

One helpful factory method is ``Panel.from_dict``, which takes a dictionary of DataFrames as above, and the following named parameters:

Parameter | Default | Description
---|---|---
intersect | False | drops elements whose indices do not align
orient | items | use ``minor`` to use DataFrames’ columns as panel items 

For example, compare to the construction above:

```python
In [125]: pd.Panel.from_dict(data, orient='minor')
Out[125]: 
<class 'pandas.core.panel.Panel'>
Dimensions: 3 (items) x 4 (major_axis) x 2 (minor_axis)
Items axis: 0 to 2
Major_axis axis: 0 to 3
Minor_axis axis: Item1 to Item2
```

Orient is especially useful for mixed-type DataFrames. If you pass a dict of DataFrame objects with mixed-type columns, all of the data will get upcasted to ``dtype=object`` unless you pass ``orient='minor'``:

```python
In [126]: df = pd.DataFrame({'a': ['foo', 'bar', 'baz'],
   .....:                    'b': np.random.randn(3)})
   .....: 

In [127]: df
Out[127]: 
     a         b
0  foo -0.308853
1  bar -0.681087
2  baz  0.377953

In [128]: data = {'item1': df, 'item2': df}

In [129]: panel = pd.Panel.from_dict(data, orient='minor')

In [130]: panel['a']
Out[130]: 
  item1 item2
0   foo   foo
1   bar   bar
2   baz   baz

In [131]: panel['b']
Out[131]: 
      item1     item2
0 -0.308853 -0.308853
1 -0.681087 -0.681087
2  0.377953  0.377953

In [132]: panel['b'].dtypes
Out[132]: 
item1    float64
item2    float64
dtype: object
```

**Note:** Panel, being less commonly used than Series and DataFrame, has been slightly neglected feature-wise. A number of methods and options available in DataFrame are not available in Panel.

## From DataFrame using to_panel method

to_panel converts a DataFrame with a two-level index to a Panel.

```python
In [133]: midx = pd.MultiIndex(levels=[['one', 'two'], ['x','y']], labels=[[1,1,0,0],[1,0,1,0]])

In [134]: df = pd.DataFrame({'A' : [1, 2, 3, 4], 'B': [5, 6, 7, 8]}, index=midx)

In [135]: df.to_panel()
Out[135]: 
<class 'pandas.core.panel.Panel'>
Dimensions: 2 (items) x 2 (major_axis) x 2 (minor_axis)
Items axis: A to B
Major_axis axis: one to two
Minor_axis axis: x to y
```

## Item selection / addition / deletion

Similar to DataFrame functioning as a dict of Series, Panel is like a dict of DataFrames:

```python
In [136]: wp['Item1']
Out[136]: 
                   A         B         C         D
2000-01-01  1.588931  0.476720  0.473424 -0.242861
2000-01-02 -0.014805 -0.284319  0.650776 -1.461665
2000-01-03 -1.137707 -0.891060 -0.693921  1.613616
2000-01-04  0.464000  0.227371 -0.496922  0.306389
2000-01-05 -2.290613 -1.134623 -1.561819 -0.260838

In [137]: wp['Item3'] = wp['Item1'] / wp['Item2']
```

The API for insertion and deletion is the same as for DataFrame. And as with DataFrame, if the item is a valid Python identifier, you can access it as an attribute and tab-complete it in IPython.

## Transposing

A Panel can be rearranged using its transpose method (which does not make a copy by default unless the data are heterogeneous):

```python
In [138]: wp.transpose(2, 0, 1)
Out[138]: 
<class 'pandas.core.panel.Panel'>
Dimensions: 4 (items) x 3 (major_axis) x 5 (minor_axis)
Items axis: A to D
Major_axis axis: Item1 to Item3
Minor_axis axis: 2000-01-01 00:00:00 to 2000-01-05 00:00:00
```

## Indexing / Selection

Operation | Syntax | Result
---|---|---
Select item | wp[item] | DataFrame
Get slice at major_axis label | wp.major_xs(val) | DataFrame
Get slice at minor_axis label | wp.minor_xs(val) | DataFrame

For example, using the earlier example data, we could do:

```python
In [139]: wp['Item1']
Out[139]: 
                   A         B         C         D
2000-01-01  1.588931  0.476720  0.473424 -0.242861
2000-01-02 -0.014805 -0.284319  0.650776 -1.461665
2000-01-03 -1.137707 -0.891060 -0.693921  1.613616
2000-01-04  0.464000  0.227371 -0.496922  0.306389
2000-01-05 -2.290613 -1.134623 -1.561819 -0.260838

In [140]: wp.major_xs(wp.major_axis[2])
Out[140]: 
      Item1     Item2     Item3
A -1.137707  0.800193 -1.421791
B -0.891060  0.782098 -1.139320
C -0.693921 -1.069094  0.649074
D  1.613616 -1.099248 -1.467927

In [141]: wp.minor_axis
Out[141]: Index(['A', 'B', 'C', 'D'], dtype='object')

In [142]: wp.minor_xs('C')
Out[142]: 
               Item1     Item2     Item3
2000-01-01  0.473424 -0.902937 -0.524316
2000-01-02  0.650776 -1.144073 -0.568824
2000-01-03 -0.693921 -1.069094  0.649074
2000-01-04 -0.496922  0.661084 -0.751678
2000-01-05 -1.561819 -1.056652  1.478083
```

## Squeezing

Another way to change the dimensionality of an object is to ``squeeze`` a 1-len object, similar to ``wp['Item1']``.

```python
In [143]: wp.reindex(items=['Item1']).squeeze()
Out[143]: 
                   A         B         C         D
2000-01-01  1.588931  0.476720  0.473424 -0.242861
2000-01-02 -0.014805 -0.284319  0.650776 -1.461665
2000-01-03 -1.137707 -0.891060 -0.693921  1.613616
2000-01-04  0.464000  0.227371 -0.496922  0.306389
2000-01-05 -2.290613 -1.134623 -1.561819 -0.260838

In [144]: wp.reindex(items=['Item1'], minor=['B']).squeeze()
Out[144]: 
2000-01-01    0.476720
2000-01-02   -0.284319
2000-01-03   -0.891060
2000-01-04    0.227371
2000-01-05   -1.134623
Freq: D, Name: B, dtype: float64
```

## Conversion to DataFrame

A Panel can be represented in 2D form as a hierarchically indexed DataFrame. See the section [hierarchical indexing](http://pandas.pydata.org/pandas-docs/stable/advanced.html#advanced-hierarchical) for more on this. To convert a Panel to a DataFrame, use the ``to_frame`` method:

```python
In [145]: panel = pd.Panel(np.random.randn(3, 5, 4), items=['one', 'two', 'three'],
   .....:                  major_axis=pd.date_range('1/1/2000', periods=5),
   .....:                  minor_axis=['a', 'b', 'c', 'd'])
   .....: 

In [146]: panel.to_frame()
Out[146]: 
                       one       two     three
major      minor                              
2000-01-01 a      0.493672  1.219492 -1.290493
           b     -2.461467  0.062297  0.787872
           c     -1.553902 -0.110388  1.515707
           d      2.015523 -1.184357 -0.276487
2000-01-02 a     -1.833722 -0.558081 -0.223762
           b      1.771740  0.077849  1.397431
           c     -0.670027  0.629498  1.503874
           d      0.049307 -1.035260 -0.478905
2000-01-03 a     -0.521493 -0.438229 -0.135950
           b     -3.201750  0.503703 -0.730327
           c      0.792716  0.413086 -0.033277
           d      0.146111 -1.139050  0.281151
2000-01-04 a      1.903247  0.660342 -1.298915
           b     -0.747169  0.464794 -2.819487
           c     -0.309038 -0.309337 -0.851985
           d      0.393876 -0.649593 -1.106952
2000-01-05 a      1.861468  0.683758 -0.937731
           b      0.936527 -0.643834 -1.537770
           c      1.255746  0.421287  0.555759
           d     -2.655452  1.032814 -2.277282
```
