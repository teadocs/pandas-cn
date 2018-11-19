# Idioms

These are some neat pandas ``idioms``

[if-then/if-then-else on one column, and assignment to another one or more columns](http://stackoverflow.com/questions/17128302/python-pandas-idiom-for-if-then-else):

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

