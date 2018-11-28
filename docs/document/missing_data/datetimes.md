# 日期时间

For datetime64[ns] types, ``NaT`` represents missing values. This is a pseudo-native sentinel value that can be represented by NumPy in a singular dtype (datetime64[ns]). pandas objects provide intercompatibility between ``NaT`` and ``NaN``.

```python
In [14]: df2 = df.copy()

In [15]: df2['timestamp'] = pd.Timestamp('20120101')

In [16]: df2
Out[16]: 
        one       two     three four   five  timestamp
a -0.166778  0.501113 -0.355322  bar  False 2012-01-01
c -0.337890  0.580967  0.983801  bar  False 2012-01-01
e  0.057802  0.761948 -0.712964  bar   True 2012-01-01
f -0.443160 -0.974602  1.047704  bar  False 2012-01-01
h -0.717852 -1.053898 -0.019369  bar  False 2012-01-01

In [17]: df2.loc[['a','c','h'],['one','timestamp']] = np.nan

In [18]: df2
Out[18]: 
        one       two     three four   five  timestamp
a       NaN  0.501113 -0.355322  bar  False        NaT
c       NaN  0.580967  0.983801  bar  False        NaT
e  0.057802  0.761948 -0.712964  bar   True 2012-01-01
f -0.443160 -0.974602  1.047704  bar  False 2012-01-01
h       NaN -1.053898 -0.019369  bar  False        NaT

In [19]: df2.get_dtype_counts()
Out[19]: 
float64           3
object            1
bool              1
datetime64[ns]    1
dtype: int64
```