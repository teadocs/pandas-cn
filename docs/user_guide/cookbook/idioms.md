# 风格(Idioms)

These are some neat Pandas ``idioms``

[if-then/if-then-else on one column, and assignment to another one or more columns](http://stackoverflow.com/questions/17128302/python-Pandas-idiom-for-if-then-else):

```python
In [1]: df = pd.DataFrame(
   ...:      {'AAA' : [4,5,6,7], 'BBB' : [10,20,30,40],'CCC' : [100,50,-30,-50]}); df
   ...: 
Out[1]: 
   AAA  BBB  CCC
0    4   10  100
1    5   20   50
2    6   30  -30
3    7   40  -50
```

## if-then…

An if-then on one column

```python
In [2]: df.loc[df.AAA >= 5,'BBB'] = -1; df
Out[2]: 
   AAA  BBB  CCC
0    4   10  100
1    5   -1   50
2    6   -1  -30
3    7   -1  -50
```

An if-then with assignment to 2 columns:

```python
In [3]: df.loc[df.AAA >= 5,['BBB','CCC']] = 555; df
Out[3]: 
   AAA  BBB  CCC
0    4   10  100
1    5  555  555
2    6  555  555
3    7  555  555
```

Add another line with different logic, to do the -else

```python
In [4]: df.loc[df.AAA < 5,['BBB','CCC']] = 2000; df
Out[4]: 
   AAA   BBB   CCC
0    4  2000  2000
1    5   555   555
2    6   555   555
3    7   555   555
```

Or use Pandas where after you’ve set up a mask

```python
In [5]: df_mask = pd.DataFrame({'AAA' : [True] * 4, 'BBB' : [False] * 4,'CCC' : [True,False] * 2})

In [6]: df.where(df_mask,-1000)
Out[6]: 
   AAA   BBB   CCC
0    4 -1000  2000
1    5 -1000 -1000
2    6 -1000   555
3    7 -1000 -1000
```

[if-then-else using numpy’s where()](http://stackoverflow.com/questions/19913659/Pandas-conditional-creation-of-a-series-dataframe-column)

```python
In [7]: df = pd.DataFrame(
   ...:      {'AAA' : [4,5,6,7], 'BBB' : [10,20,30,40],'CCC' : [100,50,-30,-50]}); df
   ...: 
Out[7]: 
   AAA  BBB  CCC
0    4   10  100
1    5   20   50
2    6   30  -30
3    7   40  -50

In [8]: df['logic'] = np.where(df['AAA'] > 5,'high','low'); df
Out[8]: 
   AAA  BBB  CCC logic
0    4   10  100   low
1    5   20   50   low
2    6   30  -30  high
3    7   40  -50  high
```

## Splitting

[Split a frame with a boolean criterion](http://stackoverflow.com/questions/14957116/how-to-split-a-dataframe-according-to-a-boolean-criterion)

```python
In [9]: df = pd.DataFrame(
   ...:      {'AAA' : [4,5,6,7], 'BBB' : [10,20,30,40],'CCC' : [100,50,-30,-50]}); df
   ...: 
Out[9]: 
   AAA  BBB  CCC
0    4   10  100
1    5   20   50
2    6   30  -30
3    7   40  -50

In [10]: dflow = df[df.AAA <= 5]; dflow
Out[10]: 
   AAA  BBB  CCC
0    4   10  100
1    5   20   50

In [11]: dfhigh = df[df.AAA > 5]; dfhigh
Out[11]: 
   AAA  BBB  CCC
2    6   30  -30
3    7   40  -50
```

## Building Criteria

[Select with multi-column criteria](http://stackoverflow.com/questions/15315452/selecting-with-complex-criteria-from-Pandas-dataframe)

```python
In [12]: df = pd.DataFrame(
   ....:      {'AAA' : [4,5,6,7], 'BBB' : [10,20,30,40],'CCC' : [100,50,-30,-50]}); df
   ....: 
Out[12]: 
   AAA  BBB  CCC
0    4   10  100
1    5   20   50
2    6   30  -30
3    7   40  -50
```

…and (without assignment returns a Series)

```python
In [13]: newseries = df.loc[(df['BBB'] < 25) & (df['CCC'] >= -40), 'AAA']; newseries
Out[13]: 
0    4
1    5
Name: AAA, dtype: int64
```

…or (without assignment returns a Series)

```python
In [14]: newseries = df.loc[(df['BBB'] > 25) | (df['CCC'] >= -40), 'AAA']; newseries;
```

…or (with assignment modifies the DataFrame.)

```python
In [15]: df.loc[(df['BBB'] > 25) | (df['CCC'] >= 75), 'AAA'] = 0.1; df
Out[15]: 
   AAA  BBB  CCC
0  0.1   10  100
1  5.0   20   50
2  0.1   30  -30
3  0.1   40  -50
```

[Select rows with data closest to certain value using argsort](http://stackoverflow.com/questions/17758023/return-rows-in-a-dataframe-closest-to-a-user-defined-number)

```python
In [16]: df = pd.DataFrame(
   ....:      {'AAA' : [4,5,6,7], 'BBB' : [10,20,30,40],'CCC' : [100,50,-30,-50]}); df
   ....: 
Out[16]: 
   AAA  BBB  CCC
0    4   10  100
1    5   20   50
2    6   30  -30
3    7   40  -50

In [17]: aValue = 43.0

In [18]: df.loc[(df.CCC-aValue).abs().argsort()]
Out[18]: 
   AAA  BBB  CCC
1    5   20   50
0    4   10  100
2    6   30  -30
3    7   40  -50
```

[Dynamically reduce a list of criteria using a binary operators](http://stackoverflow.com/questions/21058254/Pandas-boolean-operation-in-a-python-list/21058331)

```python
In [19]: df = pd.DataFrame(
   ....:      {'AAA' : [4,5,6,7], 'BBB' : [10,20,30,40],'CCC' : [100,50,-30,-50]}); df
   ....: 
Out[19]: 
   AAA  BBB  CCC
0    4   10  100
1    5   20   50
2    6   30  -30
3    7   40  -50

In [20]: Crit1 = df.AAA <= 5.5

In [21]: Crit2 = df.BBB == 10.0

In [22]: Crit3 = df.CCC > -40.0
```

One could hard code:

```python
In [23]: AllCrit = Crit1 & Crit2 & Crit3
```

…Or it can be done with a list of dynamically built criteria

```python
In [24]: CritList = [Crit1,Crit2,Crit3]

In [25]: AllCrit = functools.reduce(lambda x,y: x & y, CritList)

In [26]: df[AllCrit]
Out[26]: 
   AAA  BBB  CCC
0    4   10  100
```