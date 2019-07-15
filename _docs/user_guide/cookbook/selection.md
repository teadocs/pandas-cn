# 选择器(Selection)

## DataFrames

The [indexing](http://Pandas.pydata.org/Pandas-docs/stable/indexing.html#indexing) docs.

[Using both row labels and value conditionals](http://stackoverflow.com/questions/14725068/Pandas-using-row-labels-in-boolean-indexing)

```python
In [27]: df = pd.DataFrame(
   ....:      {'AAA' : [4,5,6,7], 'BBB' : [10,20,30,40],'CCC' : [100,50,-30,-50]}); df
   ....: 
Out[27]: 
   AAA  BBB  CCC
0    4   10  100
1    5   20   50
2    6   30  -30
3    7   40  -50

In [28]: df[(df.AAA <= 6) & (df.index.isin([0,2,4]))]
Out[28]: 
   AAA  BBB  CCC
0    4   10  100
2    6   30  -30
```

[Use loc for label-oriented slicing and iloc positional slicing](https://github.com/Pandas-dev/Pandas/issues/2904)

```python
In [29]: data = {'AAA' : [4,5,6,7], 'BBB' : [10,20,30,40],'CCC' : [100,50,-30,-50]}

In [30]: df = pd.DataFrame(data=data,index=['foo','bar','boo','kar']); df
Out[30]: 
     AAA  BBB  CCC
foo    4   10  100
bar    5   20   50
boo    6   30  -30
kar    7   40  -50
```

There are 2 explicit slicing methods, with a third general case

1. Positional-oriented (Python slicing style : exclusive of end)
1. Label-oriented (Non-Python slicing style : inclusive of end)
1. General (Either slicing style : depends on if the slice contains labels or positions)

```python
In [31]: df.loc['bar':'kar'] #Label
Out[31]: 
     AAA  BBB  CCC
bar    5   20   50
boo    6   30  -30
kar    7   40  -50

# Generic
In [32]: df.iloc[0:3]
Out[32]: 
     AAA  BBB  CCC
foo    4   10  100
bar    5   20   50
boo    6   30  -30

In [33]: df.loc['bar':'kar']
Out[33]: 
     AAA  BBB  CCC
bar    5   20   50
boo    6   30  -30
kar    7   40  -50
```

Ambiguity arises when an index consists of integers with a non-zero start or non-unit increment.

```python
In [34]: df2 = pd.DataFrame(data=data,index=[1,2,3,4]); #Note index starts at 1.

In [35]: df2.iloc[1:3] #Position-oriented
Out[35]: 
   AAA  BBB  CCC
2    5   20   50
3    6   30  -30

In [36]: df2.loc[1:3] #Label-oriented
Out[36]: 
   AAA  BBB  CCC
1    4   10  100
2    5   20   50
3    6   30  -30
```

[Using inverse operator (~) to take the complement of a mask](http://stackoverflow.com/questions/14986510/picking-out-elements-based-on-complement-of-indices-in-python-Pandas)

```python
In [37]: df = pd.DataFrame(
   ....:      {'AAA' : [4,5,6,7], 'BBB' : [10,20,30,40], 'CCC' : [100,50,-30,-50]}); df
   ....: 
Out[37]: 
   AAA  BBB  CCC
0    4   10  100
1    5   20   50
2    6   30  -30
3    7   40  -50

In [38]: df[~((df.AAA <= 6) & (df.index.isin([0,2,4])))]
Out[38]: 
   AAA  BBB  CCC
1    5   20   50
3    7   40  -50
```

## Panels

[Extend a panel frame by transposing, adding a new dimension, and transposing back to the original dimensions](http://stackoverflow.com/questions/15364050/extending-a-Pandas-panel-frame-along-the-minor-axis)

```python
In [39]: rng = pd.date_range('1/1/2013',periods=100,freq='D')

In [40]: data = np.random.randn(100, 4)

In [41]: cols = ['A','B','C','D']

In [42]: df1, df2, df3 = pd.DataFrame(data, rng, cols), pd.DataFrame(data, rng, cols), pd.DataFrame(data, rng, cols)

In [43]: pf = pd.Panel({'df1':df1,'df2':df2,'df3':df3});pf
Out[43]: 
<class 'Pandas.core.panel.Panel'>
Dimensions: 3 (items) x 100 (major_axis) x 4 (minor_axis)
Items axis: df1 to df3
Major_axis axis: 2013-01-01 00:00:00 to 2013-04-10 00:00:00
Minor_axis axis: A to D

In [44]: pf.loc[:,:,'F'] = pd.DataFrame(data, rng, cols);pf
Out[44]: 
<class 'Pandas.core.panel.Panel'>
Dimensions: 3 (items) x 100 (major_axis) x 5 (minor_axis)
Items axis: df1 to df3
Major_axis axis: 2013-01-01 00:00:00 to 2013-04-10 00:00:00
Minor_axis axis: A to F
```

[Mask a panel by using np.where and then reconstructing the panel with the new masked values](http://stackoverflow.com/questions/14650341/boolean-mask-in-Pandas-panel)

## New Columns

[Efficiently and dynamically creating new columns using applymap](http://stackoverflow.com/questions/16575868/efficiently-creating-additional-columns-in-a-Pandas-dataframe-using-map)

```python
In [45]: df = pd.DataFrame(
   ....:      {'AAA' : [1,2,1,3], 'BBB' : [1,1,2,2], 'CCC' : [2,1,3,1]}); df
   ....: 
Out[45]: 
   AAA  BBB  CCC
0    1    1    2
1    2    1    1
2    1    2    3
3    3    2    1

In [46]: source_cols = df.columns # or some subset would work too.

In [47]: new_cols = [str(x) + "_cat" for x in source_cols]

In [48]: categories = {1 : 'Alpha', 2 : 'Beta', 3 : 'Charlie' }

In [49]: df[new_cols] = df[source_cols].applymap(categories.get);df
Out[49]: 
   AAA  BBB  CCC  AAA_cat BBB_cat  CCC_cat
0    1    1    2    Alpha   Alpha     Beta
1    2    1    1     Beta   Alpha    Alpha
2    1    2    3    Alpha    Beta  Charlie
3    3    2    1  Charlie    Beta    Alpha
```

[Keep other columns when using min() with groupby](http://stackoverflow.com/questions/23394476/keep-other-columns-when-using-min-with-groupby)

```python
In [50]: df = pd.DataFrame(
   ....:      {'AAA' : [1,1,1,2,2,2,3,3], 'BBB' : [2,1,3,4,5,1,2,3]}); df
   ....: 
Out[50]: 
   AAA  BBB
0    1    2
1    1    1
2    1    3
3    2    4
4    2    5
5    2    1
6    3    2
7    3    3
```

Method 1 : idxmin() to get the index of the mins

```python
In [51]: df.loc[df.groupby("AAA")["BBB"].idxmin()]
Out[51]: 
   AAA  BBB
1    1    1
5    2    1
6    3    2
```

Method 2 : sort then take first of each

```python
In [52]: df.sort_values(by="BBB").groupby("AAA", as_index=False).first()
Out[52]: 
   AAA  BBB
0    1    1
1    2    1
2    3    2
```

Notice the same results, with the exception of the index.