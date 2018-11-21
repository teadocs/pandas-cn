# 属性和原始ndarray(s)

pandas objects have a number of attributes enabling you to access the metadata

- **shape**: gives the axis dimensions of the object, consistent with ndarray
- Axis labels
    - **Series**: index (only axis)
    - **DataFrame**: index (rows) and columns
    - **Panel**: items, major_axis, and minor_axis

Note, **these attributes can be safely assigned to!**

```python
In [8]: df[:2]
Out[8]: 
                   A         B        C
2000-01-01  0.048869 -1.360687 -0.47901
2000-01-02 -0.859661 -0.231595 -0.52775

In [9]: df.columns = [x.lower() for x in df.columns]

In [10]: df
Out[10]: 
                   a         b         c
2000-01-01  0.048869 -1.360687 -0.479010
2000-01-02 -0.859661 -0.231595 -0.527750
2000-01-03 -1.296337  0.150680  0.123836
2000-01-04  0.571764  1.555563 -0.823761
2000-01-05  0.535420 -1.032853  1.469725
2000-01-06  1.304124  1.449735  0.203109
2000-01-07 -1.032011  0.969818 -0.962723
2000-01-08  1.382083 -0.938794  0.669142
```