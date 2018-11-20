# 创建示例数据

To create a dataframe from every combination of some given values, like R’s expand.grid() function, we can create a dict where the keys are column names and the values are lists of the data values:

```python
In [195]: def expand_grid(data_dict):
   .....:    rows = itertools.product(*data_dict.values())
   .....:    return pd.DataFrame.from_records(rows, columns=data_dict.keys())
   .....: 

In [196]: df = expand_grid(
   .....:    {'height': [60, 70],
   .....:     'weight': [100, 140, 180],
   .....:     'sex': ['Male', 'Female']})
   .....: 

In [197]: df
Out[197]: 
    height  weight     sex
0       60     100    Male
1       60     100  Female
2       60     140    Male
3       60     140  Female
4       60     180    Male
5       60     180  Female
6       70     100    Male
7       70     100  Female
8       70     140    Male
9       70     140  Female
10      70     180    Male
11      70     180  Female
```