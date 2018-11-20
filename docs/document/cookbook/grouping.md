# 分组操作(Grouping)

The [grouping](http://pandas.pydata.org/pandas-docs/stable/groupby.html#groupby) docs.

[Basic grouping with apply](http://stackoverflow.com/questions/15322632/python-pandas-df-groupy-agg-column-reference-in-agg)

Unlike agg, apply’s callable is passed a sub-DataFrame which gives you access to all the columns

```python
In [83]: df = pd.DataFrame({'animal': 'cat dog cat fish dog cat cat'.split(),
   ....:                    'size': list('SSMMMLL'),
   ....:                    'weight': [8, 10, 11, 1, 20, 12, 12],
   ....:                    'adult' : [False] * 5 + [True] * 2}); df
   ....: 
Out[83]: 
  animal size  weight  adult
0    cat    S       8  False
1    dog    S      10  False
2    cat    M      11  False
3   fish    M       1  False
4    dog    M      20  False
5    cat    L      12   True
6    cat    L      12   True

#List the size of the animals with the highest weight.
In [84]: df.groupby('animal').apply(lambda subf: subf['size'][subf['weight'].idxmax()])
Out[84]: 
animal
cat     L
dog     M
fish    M
dtype: object
```

[Using get_group](http://stackoverflow.com/questions/14734533/how-to-access-pandas-groupby-dataframe-by-key)

```python
In [85]: gb = df.groupby(['animal'])

In [86]: gb.get_group('cat')
Out[86]: 
  animal size  weight  adult
0    cat    S       8  False
2    cat    M      11  False
5    cat    L      12   True
6    cat    L      12   True
```

[Apply to different items in a group](http://stackoverflow.com/questions/15262134/apply-different-functions-to-different-items-in-group-object-python-pandas)

```python
In [87]: def GrowUp(x):
   ....:    avg_weight =  sum(x[x['size'] == 'S'].weight * 1.5)
   ....:    avg_weight += sum(x[x['size'] == 'M'].weight * 1.25)
   ....:    avg_weight += sum(x[x['size'] == 'L'].weight)
   ....:    avg_weight /= len(x)
   ....:    return pd.Series(['L',avg_weight,True], index=['size', 'weight', 'adult'])
   ....: 

In [88]: expected_df = gb.apply(GrowUp)

In [89]: expected_df
Out[89]: 
       size   weight  adult
animal                     
cat       L  12.4375   True
dog       L  20.0000   True
fish      L   1.2500   True
```

[Expanding Apply](http://stackoverflow.com/questions/14542145/reductions-down-a-column-in-pandas)

```python
In [90]: S = pd.Series([i / 100.0 for i in range(1,11)])

In [91]: def CumRet(x,y):
   ....:    return x * (1 + y)
   ....: 

In [92]: def Red(x):
   ....:    return functools.reduce(CumRet,x,1.0)
   ....: 

In [93]: S.expanding().apply(Red, raw=True)
Out[93]: 
0    1.010000
1    1.030200
2    1.061106
3    1.103550
4    1.158728
5    1.228251
6    1.314229
7    1.419367
8    1.547110
9    1.701821
dtype: float64
```

[Replacing some values with mean of the rest of a group](http://stackoverflow.com/questions/14760757/replacing-values-with-groupby-means)

```python
In [94]: df = pd.DataFrame({'A' : [1, 1, 2, 2], 'B' : [1, -1, 1, 2]})

In [95]: gb = df.groupby('A')

In [96]: def replace(g):
   ....:    mask = g < 0
   ....:    g.loc[mask] = g[~mask].mean()
   ....:    return g
   ....: 

In [97]: gb.transform(replace)
Out[97]: 
     B
0  1.0
1  1.0
2  1.0
3  2.0
```

[Sort groups by aggregated data](http://stackoverflow.com/questions/14941366/pandas-sort-by-group-aggregate-and-column)

```python
In [98]: df = pd.DataFrame({'code': ['foo', 'bar', 'baz'] * 2,
   ....:                    'data': [0.16, -0.21, 0.33, 0.45, -0.59, 0.62],
   ....:                    'flag': [False, True] * 3})
   ....: 

In [99]: code_groups = df.groupby('code')

In [100]: agg_n_sort_order = code_groups[['data']].transform(sum).sort_values(by='data')

In [101]: sorted_df = df.loc[agg_n_sort_order.index]

In [102]: sorted_df
Out[102]: 
  code  data   flag
1  bar -0.21   True
4  bar -0.59  False
0  foo  0.16  False
3  foo  0.45   True
2  baz  0.33  False
5  baz  0.62   True
```

[Create multiple aggregated columns](http://stackoverflow.com/questions/14897100/create-multiple-columns-in-pandas-aggregation-function)

```python
In [103]: rng = pd.date_range(start="2014-10-07",periods=10,freq='2min')

In [104]: ts = pd.Series(data = list(range(10)), index = rng)

In [105]: def MyCust(x):
   .....:    if len(x) > 2:
   .....:       return x[1] * 1.234
   .....:    return pd.NaT
   .....: 

In [106]: mhc = {'Mean' : np.mean, 'Max' : np.max, 'Custom' : MyCust}

In [107]: ts.resample("5min").apply(mhc)
Out[107]: 
Custom  2014-10-07 00:00:00    1.234
        2014-10-07 00:05:00      NaT
        2014-10-07 00:10:00    7.404
        2014-10-07 00:15:00      NaT
Max     2014-10-07 00:00:00        2
        2014-10-07 00:05:00        4
        2014-10-07 00:10:00        7
        2014-10-07 00:15:00        9
Mean    2014-10-07 00:00:00        1
        2014-10-07 00:05:00      3.5
        2014-10-07 00:10:00        6
        2014-10-07 00:15:00      8.5
dtype: object

In [108]: ts
Out[108]: 
2014-10-07 00:00:00    0
2014-10-07 00:02:00    1
2014-10-07 00:04:00    2
2014-10-07 00:06:00    3
2014-10-07 00:08:00    4
2014-10-07 00:10:00    5
2014-10-07 00:12:00    6
2014-10-07 00:14:00    7
2014-10-07 00:16:00    8
2014-10-07 00:18:00    9
Freq: 2T, dtype: int64
```

[Create a value counts column and reassign back to the DataFrame](http://stackoverflow.com/questions/17709270/i-want-to-create-a-column-of-value-counts-in-my-pandas-dataframe)

```python
In [109]: df = pd.DataFrame({'Color': 'Red Red Red Blue'.split(),
   .....:                    'Value': [100, 150, 50, 50]}); df
   .....: 
Out[109]: 
  Color  Value
0   Red    100
1   Red    150
2   Red     50
3  Blue     50

In [110]: df['Counts'] = df.groupby(['Color']).transform(len)

In [111]: df
Out[111]: 
  Color  Value  Counts
0   Red    100       3
1   Red    150       3
2   Red     50       3
3  Blue     50       1
```

[Shift groups of the values in a column based on the index](http://stackoverflow.com/q/23198053/190597)

```python
In [112]: df = pd.DataFrame(
   .....:    {u'line_race': [10, 10, 8, 10, 10, 8],
   .....:     u'beyer': [99, 102, 103, 103, 88, 100]},
   .....:     index=[u'Last Gunfighter', u'Last Gunfighter', u'Last Gunfighter',
   .....:            u'Paynter', u'Paynter', u'Paynter']); df
   .....: 
Out[112]: 
                 line_race  beyer
Last Gunfighter         10     99
Last Gunfighter         10    102
Last Gunfighter          8    103
Paynter                 10    103
Paynter                 10     88
Paynter                  8    100

In [113]: df['beyer_shifted'] = df.groupby(level=0)['beyer'].shift(1)

In [114]: df
Out[114]: 
                 line_race  beyer  beyer_shifted
Last Gunfighter         10     99            NaN
Last Gunfighter         10    102           99.0
Last Gunfighter          8    103          102.0
Paynter                 10    103            NaN
Paynter                 10     88          103.0
Paynter                  8    100           88.0
```

[Select row with maximum value from each group](http://stackoverflow.com/q/26701849/190597)

```python
In [115]: df = pd.DataFrame({'host':['other','other','that','this','this'],
   .....:                    'service':['mail','web','mail','mail','web'],
   .....:                    'no':[1, 2, 1, 2, 1]}).set_index(['host', 'service'])
   .....: 

In [116]: mask = df.groupby(level=0).agg('idxmax')

In [117]: df_count = df.loc[mask['no']].reset_index()

In [118]: df_count
Out[118]: 
    host service  no
0  other     web   2
1   that    mail   1
2   this    mail   2
```

[Grouping like Python’s itertools.groupby](http://stackoverflow.com/q/29142487/846892)

```python
In [119]: df = pd.DataFrame([0, 1, 0, 1, 1, 1, 0, 1, 1], columns=['A'])

In [120]: df.A.groupby((df.A != df.A.shift()).cumsum()).groups
Out[120]: 
{1: Int64Index([0], dtype='int64'),
 2: Int64Index([1], dtype='int64'),
 3: Int64Index([2], dtype='int64'),
 4: Int64Index([3, 4, 5], dtype='int64'),
 5: Int64Index([6], dtype='int64'),
 6: Int64Index([7, 8], dtype='int64')}

In [121]: df.A.groupby((df.A != df.A.shift()).cumsum()).cumsum()
Out[121]: 
0    0
1    1
2    0
3    1
4    2
5    3
6    0
7    1
8    2
Name: A, dtype: int64
```

## Expanding Data

[Alignment and to-date](http://stackoverflow.com/questions/15489011/python-time-series-alignment-and-to-date-functions)

[Rolling Computation window based on values instead of counts](http://stackoverflow.com/questions/15489011/python-time-series-alignment-and-to-date-functions)

[Rolling Mean by Time Interval](http://stackoverflow.com/questions/15489011/python-time-series-alignment-and-to-date-functions)

## Splitting

[Splitting a frame](http://stackoverflow.com/questions/13353233/best-way-to-split-a-dataframe-given-an-edge/15449992#15449992)

Create a list of dataframes, split using a delineation based on logic included in rows.

```python
In [122]: df = pd.DataFrame(data={'Case' : ['A','A','A','B','A','A','B','A','A'],
   .....:                         'Data' : np.random.randn(9)})
   .....: 

In [123]: dfs = list(zip(*df.groupby((1*(df['Case']=='B')).cumsum().rolling(window=3,min_periods=1).median())))[-1]

In [124]: dfs[0]
Out[124]: 
  Case      Data
0    A  0.174068
1    A -0.439461
2    A -0.741343
3    B -0.079673

In [125]: dfs[1]
Out[125]: 
  Case      Data
4    A -0.922875
5    A  0.303638
6    B -0.917368

In [126]: dfs[2]
Out[126]: 
  Case      Data
7    A -1.624062
8    A -0.758514
```

## Pivot

The [Pivot](http://pandas.pydata.org/pandas-docs/stable/reshaping.html#reshaping-pivot) docs.

[Partial sums and subtotals](http://stackoverflow.com/questions/15570099/pandas-pivot-tables-row-subtotals/15574875#15574875)

```python
In [127]: df = pd.DataFrame(data={'Province' : ['ON','QC','BC','AL','AL','MN','ON'],
   .....:                          'City' : ['Toronto','Montreal','Vancouver','Calgary','Edmonton','Winnipeg','Windsor'],
   .....:                          'Sales' : [13,6,16,8,4,3,1]})
   .....: 

In [128]: table = pd.pivot_table(df,values=['Sales'],index=['Province'],columns=['City'],aggfunc=np.sum,margins=True)

In [129]: table.stack('City')
Out[129]: 
                    Sales
Province City            
AL       All         12.0
         Calgary      8.0
         Edmonton     4.0
BC       All         16.0
         Vancouver   16.0
MN       All          3.0
         Winnipeg     3.0
...                   ...
All      Calgary      8.0
         Edmonton     4.0
         Montreal     6.0
         Toronto     13.0
         Vancouver   16.0
         Windsor      1.0
         Winnipeg     3.0

[20 rows x 1 columns]
```

[Frequency table like plyr in R](http://stackoverflow.com/questions/15589354/frequency-tables-in-pandas-like-plyr-in-r)

```python
In [130]: grades = [48,99,75,80,42,80,72,68,36,78]

In [131]: df = pd.DataFrame( {'ID': ["x%d" % r for r in range(10)],
   .....:                     'Gender' : ['F', 'M', 'F', 'M', 'F', 'M', 'F', 'M', 'M', 'M'],
   .....:                     'ExamYear': ['2007','2007','2007','2008','2008','2008','2008','2009','2009','2009'],
   .....:                     'Class': ['algebra', 'stats', 'bio', 'algebra', 'algebra', 'stats', 'stats', 'algebra', 'bio', 'bio'],
   .....:                     'Participated': ['yes','yes','yes','yes','no','yes','yes','yes','yes','yes'],
   .....:                     'Passed': ['yes' if x > 50 else 'no' for x in grades],
   .....:                     'Employed': [True,True,True,False,False,False,False,True,True,False],
   .....:                     'Grade': grades})
   .....: 

In [132]: df.groupby('ExamYear').agg({'Participated': lambda x: x.value_counts()['yes'],
   .....:                     'Passed': lambda x: sum(x == 'yes'),
   .....:                     'Employed' : lambda x : sum(x),
   .....:                     'Grade' : lambda x : sum(x) / len(x)})
   .....: 
Out[132]: 
          Participated  Passed  Employed      Grade
ExamYear                                           
2007                 3       2         3  74.000000
2008                 3       3         0  68.500000
2009                 3       2         2  60.666667
```

[Plot pandas DataFrame with year over year data](http://stackoverflow.com/questions/30379789/plot-pandas-data-frame-with-year-over-year-data)

To create year and month crosstabulation:

```python
In [133]: df = pd.DataFrame({'value': np.random.randn(36)},
   .....:                   index=pd.date_range('2011-01-01', freq='M', periods=36))
   .....: 

In [134]: pd.pivot_table(df, index=df.index.month, columns=df.index.year,
   .....:                values='value', aggfunc='sum')
   .....: 
Out[134]: 
        2011      2012      2013
1  -0.560859  0.120930  0.516870
2  -0.589005 -0.210518  0.343125
3  -1.070678 -0.931184  2.137827
4  -1.681101  0.240647  0.452429
5   0.403776 -0.027462  0.483103
6   0.609862  0.033113  0.061495
7   0.387936 -0.658418  0.240767
8   1.815066  0.324102  0.782413
9   0.705200 -1.403048  0.628462
10 -0.668049 -0.581967 -0.880627
11  0.242501 -1.233862  0.777575
12  0.313421 -3.520876 -0.779367
```

## Apply

[Rolling Apply to Organize - Turning embedded lists into a multi-index frame](http://stackoverflow.com/questions/17349981/converting-pandas-dataframe-with-categorical-values-into-binary-values)

```python
In [135]: df = pd.DataFrame(data={'A' : [[2,4,8,16],[100,200],[10,20,30]], 'B' : [['a','b','c'],['jj','kk'],['ccc']]},index=['I','II','III'])

In [136]: def SeriesFromSubList(aList):
   .....:    return pd.Series(aList)
   .....: 

In [137]: df_orgz = pd.concat(dict([ (ind,row.apply(SeriesFromSubList)) for ind,row in df.iterrows() ]))
```

[Rolling Apply with a DataFrame returning a Series](http://stackoverflow.com/questions/19121854/using-rolling-apply-on-a-dataframe-object)

Rolling Apply to multiple columns where function calculates a Series before a Scalar from the Series is returned

```python
In [138]: df = pd.DataFrame(data=np.random.randn(2000,2)/10000,
   .....:                   index=pd.date_range('2001-01-01',periods=2000),
   .....:                   columns=['A','B']); df
   .....: 
Out[138]: 
                   A         B
2001-01-01  0.000032 -0.000004
2001-01-02 -0.000001  0.000207
2001-01-03  0.000120 -0.000220
2001-01-04 -0.000083 -0.000165
2001-01-05 -0.000047  0.000156
2001-01-06  0.000027  0.000104
2001-01-07  0.000041 -0.000101
...              ...       ...
2006-06-17 -0.000034  0.000034
2006-06-18  0.000002  0.000166
2006-06-19  0.000023 -0.000081
2006-06-20 -0.000061  0.000012
2006-06-21 -0.000111  0.000027
2006-06-22 -0.000061 -0.000009
2006-06-23  0.000074 -0.000138

[2000 rows x 2 columns]

In [139]: def gm(aDF,Const):
   .....:    v = ((((aDF.A+aDF.B)+1).cumprod())-1)*Const
   .....:    return (aDF.index[0],v.iloc[-1])
   .....: 

In [140]: S = pd.Series(dict([ gm(df.iloc[i:min(i+51,len(df)-1)],5) for i in range(len(df)-50) ])); S
Out[140]: 
2001-01-01   -0.001373
2001-01-02   -0.001705
2001-01-03   -0.002885
2001-01-04   -0.002987
2001-01-05   -0.002384
2001-01-06   -0.004700
2001-01-07   -0.005500
                ...   
2006-04-28   -0.002682
2006-04-29   -0.002436
2006-04-30   -0.002602
2006-05-01   -0.001785
2006-05-02   -0.001799
2006-05-03   -0.000605
2006-05-04   -0.000541
Length: 1950, dtype: float64
```

[Rolling apply with a DataFrame returning a Scalar](http://stackoverflow.com/questions/21040766/python-pandas-rolling-apply-two-column-input-into-function/21045831#21045831)

Rolling Apply to multiple columns where function returns a Scalar (Volume Weighted Average Price)

```python
In [141]: rng = pd.date_range(start = '2014-01-01',periods = 100)

In [142]: df = pd.DataFrame({'Open' : np.random.randn(len(rng)),
   .....:                    'Close' : np.random.randn(len(rng)),
   .....:                    'Volume' : np.random.randint(100,2000,len(rng))}, index=rng); df
   .....: 
Out[142]: 
                Open     Close  Volume
2014-01-01  0.011174 -0.653039    1581
2014-01-02  0.214258  1.314205    1707
2014-01-03 -1.046922 -0.341915    1768
2014-01-04 -0.752902 -1.303586     836
2014-01-05 -0.410793  0.396288     694
2014-01-06  0.648401 -0.548006     796
2014-01-07  0.737320  0.481380     265
...              ...       ...     ...
2014-04-04  0.120378 -2.548128     564
2014-04-05  0.231661  0.223346    1908
2014-04-06  0.952664  1.228841    1090
2014-04-07 -0.176090  0.552784    1813
2014-04-08  1.781318 -0.795389    1103
2014-04-09 -0.753493 -0.018815    1456
2014-04-10 -1.047997  1.138197    1193

[100 rows x 3 columns]

In [143]: def vwap(bars): return ((bars.Close*bars.Volume).sum()/bars.Volume.sum())

In [144]: window = 5

In [145]: s = pd.concat([ (pd.Series(vwap(df.iloc[i:i+window]), index=[df.index[i+window]])) for i in range(len(df)-window) ]);

In [146]: s.round(2)
Out[146]: 
2014-01-06   -0.03
2014-01-07    0.07
2014-01-08   -0.40
2014-01-09   -0.81
2014-01-10   -0.63
2014-01-11   -0.86
2014-01-12   -0.36
              ... 
2014-04-04   -1.27
2014-04-05   -1.36
2014-04-06   -0.73
2014-04-07    0.04
2014-04-08    0.21
2014-04-09    0.07
2014-04-10    0.25
Length: 95, dtype: float64
```