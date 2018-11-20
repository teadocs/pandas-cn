# 合并(Merge)

The [Concat](http://pandas.pydata.org/pandas-docs/stable/merging.html#merging-concatenation) docs. The [Join](http://pandas.pydata.org/pandas-docs/stable/merging.html#merging-join) docs.

[Append two dataframes with overlapping index (emulate R rbind)](http://stackoverflow.com/questions/14988480/pandas-version-of-rbind)

```python
In [149]: rng = pd.date_range('2000-01-01', periods=6)

In [150]: df1 = pd.DataFrame(np.random.randn(6, 3), index=rng, columns=['A', 'B', 'C'])

In [151]: df2 = df1.copy()
```

Depending on df construction, ignore_index may be needed

```python
In [152]: df = df1.append(df2,ignore_index=True); df
Out[152]: 
           A         B         C
0  -0.480676 -1.305282 -0.212846
1   1.979901  0.363112 -0.275732
2  -1.433852  0.580237 -0.013672
3   1.776623 -0.803467  0.521517
4  -0.302508 -0.442948 -0.395768
5  -0.249024 -0.031510  2.413751
6  -0.480676 -1.305282 -0.212846
7   1.979901  0.363112 -0.275732
8  -1.433852  0.580237 -0.013672
9   1.776623 -0.803467  0.521517
10 -0.302508 -0.442948 -0.395768
11 -0.249024 -0.031510  2.413751
```

[Self Join of a DataFrame](https://github.com/pandas-dev/pandas/issues/2996)

```python
In [153]: df = pd.DataFrame(data={'Area' : ['A'] * 5 + ['C'] * 2,
   .....:                         'Bins' : [110] * 2 + [160] * 3 + [40] * 2,
   .....:                         'Test_0' : [0, 1, 0, 1, 2, 0, 1],
   .....:                         'Data' : np.random.randn(7)});df
   .....: 
Out[153]: 
  Area  Bins  Test_0      Data
0    A   110       0 -0.378914
1    A   110       1 -1.032527
2    A   160       0 -1.402816
3    A   160       1  0.715333
4    A   160       2 -0.091438
5    C    40       0  1.608418
6    C    40       1  0.753207

In [154]: df['Test_1'] = df['Test_0'] - 1

In [155]: pd.merge(df, df, left_on=['Bins', 'Area','Test_0'], right_on=['Bins', 'Area','Test_1'],suffixes=('_L','_R'))
Out[155]: 
  Area  Bins  Test_0_L    Data_L  Test_1_L  Test_0_R    Data_R  Test_1_R
0    A   110         0 -0.378914        -1         1 -1.032527         0
1    A   160         0 -1.402816        -1         1  0.715333         0
2    A   160         1  0.715333         0         2 -0.091438         1
3    C    40         0  1.608418        -1         1  0.753207         0
```

[How to set the index and join](http://stackoverflow.com/questions/14341805/pandas-merge-pd-merge-how-to-set-the-index-and-join)

[KDB like asof join](http://stackoverflow.com/questions/12322289/kdb-like-asof-join-for-timeseries-data-in-pandas/12336039#12336039)

[Join with a criteria based on the values](http://stackoverflow.com/questions/15581829/how-to-perform-an-inner-or-outer-join-of-dataframes-with-pandas-on-non-simplisti)

[Using searchsorted to merge based on values inside a range](http://stackoverflow.com/questions/25125626/pandas-merge-with-logic/2512764)