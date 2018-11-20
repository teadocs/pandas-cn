# 多重索引(MultiIndexing)

The [multindexing](http://pandas.pydata.org/pandas-docs/stable/advanced.html#advanced-hierarchical) docs.

[Creating a multi-index from a labeled frame](http://stackoverflow.com/questions/14916358/reshaping-dataframes-in-pandas-based-on-column-labels)

```python
In [53]: df = pd.DataFrame({'row' : [0,1,2],
   ....:                    'One_X' : [1.1,1.1,1.1],
   ....:                    'One_Y' : [1.2,1.2,1.2],
   ....:                    'Two_X' : [1.11,1.11,1.11],
   ....:                    'Two_Y' : [1.22,1.22,1.22]}); df
   ....: 
Out[53]: 
   row  One_X  One_Y  Two_X  Two_Y
0    0    1.1    1.2   1.11   1.22
1    1    1.1    1.2   1.11   1.22
2    2    1.1    1.2   1.11   1.22

# As Labelled Index
In [54]: df = df.set_index('row');df
Out[54]: 
     One_X  One_Y  Two_X  Two_Y
row                            
0      1.1    1.2   1.11   1.22
1      1.1    1.2   1.11   1.22
2      1.1    1.2   1.11   1.22

# With Hierarchical Columns
In [55]: df.columns = pd.MultiIndex.from_tuples([tuple(c.split('_')) for c in df.columns]);df
Out[55]: 
     One        Two      
       X    Y     X     Y
row                      
0    1.1  1.2  1.11  1.22
1    1.1  1.2  1.11  1.22
2    1.1  1.2  1.11  1.22

# Now stack & Reset
In [56]: df = df.stack(0).reset_index(1);df
Out[56]: 
    level_1     X     Y
row                    
0       One  1.10  1.20
0       Two  1.11  1.22
1       One  1.10  1.20
1       Two  1.11  1.22
2       One  1.10  1.20
2       Two  1.11  1.22

# And fix the labels (Notice the label 'level_1' got added automatically)
In [57]: df.columns = ['Sample','All_X','All_Y'];df
Out[57]: 
    Sample  All_X  All_Y
row                     
0      One   1.10   1.20
0      Two   1.11   1.22
1      One   1.10   1.20
1      Two   1.11   1.22
2      One   1.10   1.20
2      Two   1.11   1.22
```

## Arithmetic

[Performing arithmetic with a multi-index that needs broadcasting](http://stackoverflow.com/questions/19501510/divide-entire-pandas-multiindex-dataframe-by-dataframe-variable/19502176#19502176)

```python
In [58]: cols = pd.MultiIndex.from_tuples([ (x,y) for x in ['A','B','C'] for y in ['O','I']])

In [59]: df = pd.DataFrame(np.random.randn(2,6),index=['n','m'],columns=cols); df
Out[59]: 
          A                   B                   C          
          O         I         O         I         O         I
n  1.920906 -0.388231 -2.314394  0.665508  0.402562  0.399555
m -1.765956  0.850423  0.388054  0.992312  0.744086 -0.739776

In [60]: df = df.div(df['C'],level=1); df
Out[60]: 
          A                   B              C     
          O         I         O         I    O    I
n  4.771702 -0.971660 -5.749162  1.665625  1.0  1.0
m -2.373321 -1.149568  0.521518 -1.341367  1.0  1.0
```

## Slicing

[Slicing a multi-index with xs](http://stackoverflow.com/questions/12590131/how-to-slice-multindex-columns-in-pandas-dataframes)

```python
In [61]: coords = [('AA','one'),('AA','six'),('BB','one'),('BB','two'),('BB','six')]

In [62]: index = pd.MultiIndex.from_tuples(coords)

In [63]: df = pd.DataFrame([11,22,33,44,55],index,['MyData']); df
Out[63]: 
        MyData
AA one      11
   six      22
BB one      33
   two      44
   six      55
```

To take the cross section of the 1st level and 1st axis the index:

```python
In [64]: df.xs('BB',level=0,axis=0)  #Note : level and axis are optional, and default to zero
Out[64]: 
     MyData
one      33
two      44
six      55
```

…and now the 2nd level of the 1st axis.

```python
In [65]: df.xs('six',level=1,axis=0)
Out[65]: 
    MyData
AA      22
BB      55
```

[Slicing a multi-index with xs, method #2](http://stackoverflow.com/questions/14964493/multiindex-based-indexing-in-pandas)

```python
In [66]: index = list(itertools.product(['Ada','Quinn','Violet'],['Comp','Math','Sci']))

In [67]: headr = list(itertools.product(['Exams','Labs'],['I','II']))

In [68]: indx = pd.MultiIndex.from_tuples(index,names=['Student','Course'])

In [69]: cols = pd.MultiIndex.from_tuples(headr) #Notice these are un-named

In [70]: data = [[70+x+y+(x*y)%3 for x in range(4)] for y in range(9)]

In [71]: df = pd.DataFrame(data,indx,cols); df
Out[71]: 
               Exams     Labs    
                   I  II    I  II
Student Course                   
Ada     Comp      70  71   72  73
        Math      71  73   75  74
        Sci       72  75   75  75
Quinn   Comp      73  74   75  76
        Math      74  76   78  77
        Sci       75  78   78  78
Violet  Comp      76  77   78  79
        Math      77  79   81  80
        Sci       78  81   81  81

In [72]: All = slice(None)

In [73]: df.loc['Violet']
Out[73]: 
       Exams     Labs    
           I  II    I  II
Course                   
Comp      76  77   78  79
Math      77  79   81  80
Sci       78  81   81  81

In [74]: df.loc[(All,'Math'),All]
Out[74]: 
               Exams     Labs    
                   I  II    I  II
Student Course                   
Ada     Math      71  73   75  74
Quinn   Math      74  76   78  77
Violet  Math      77  79   81  80

In [75]: df.loc[(slice('Ada','Quinn'),'Math'),All]
Out[75]: 
               Exams     Labs    
                   I  II    I  II
Student Course                   
Ada     Math      71  73   75  74
Quinn   Math      74  76   78  77

In [76]: df.loc[(All,'Math'),('Exams')]
Out[76]: 
                 I  II
Student Course        
Ada     Math    71  73
Quinn   Math    74  76
Violet  Math    77  79

In [77]: df.loc[(All,'Math'),(All,'II')]
Out[77]: 
               Exams Labs
                  II   II
Student Course           
Ada     Math      73   74
Quinn   Math      76   77
Violet  Math      79   80
```

[Setting portions of a multi-index with xs](http://stackoverflow.com/questions/19319432/pandas-selecting-a-lower-level-in-a-dataframe-to-do-a-ffill)

## Sorting

[Sort by specific column or an ordered list of columns, with a multi-index](http://stackoverflow.com/questions/14733871/mutli-index-sorting-in-pandas)

```python
In [78]: df.sort_values(by=('Labs', 'II'), ascending=False)
Out[78]: 
               Exams     Labs    
                   I  II    I  II
Student Course                   
Violet  Sci       78  81   81  81
        Math      77  79   81  80
        Comp      76  77   78  79
Quinn   Sci       75  78   78  78
        Math      74  76   78  77
        Comp      73  74   75  76
Ada     Sci       72  75   75  75
        Math      71  73   75  74
        Comp      70  71   72  73
```

[Partial Selection, the need for sortedness;](https://github.com/pandas-dev/pandas/issues/2995)

## Levels

[Prepending a level to a multiindex](http://stackoverflow.com/questions/14744068/prepend-a-level-to-a-pandas-multiindex)

[Flatten Hierarchical columns](http://stackoverflow.com/questions/14507794/python-pandas-how-to-flatten-a-hierarchical-index-in-columns)

