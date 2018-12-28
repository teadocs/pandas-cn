# 属性和原始ndarray(s)

pandas objects have a number of attributes enabling you to access the metadata  
pandas对象拥有一系列的属性，使得你能够访问元数据

- **shape**: gives the axis dimensions of the object, consistent with ndarray  
           ：返回对象的维度深度，与ndarray一致
- Axis labels  
- 维度标签
    - **Series**: index (only axis)  
                ：索引（仅有的维度）
    - **DataFrame**: index (rows) and columns  
                   ：索引（行）和列
    - **Panel**: items, major_axis, and minor_axis  
               ：项目，主维度于副维度(译者：自0.20.0起被废弃)

Note, **these attributes can be safely assigned to!**  
注：以上的属性都可以被安全赋值

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

To get the actual data inside a data structure, one need only access the **values** property:  
通过访问**values**属性来获得数据结构中的实际值：

```python
In [11]: s.values
Out[11]: array([-1.9339,  0.3773,  0.7341,  2.1416, -0.0112])

In [12]: df.values
Out[12]: 
array([[ 0.0489, -1.3607, -0.479 ],
       [-0.8597, -0.2316, -0.5278],
       [-1.2963,  0.1507,  0.1238],
       [ 0.5718,  1.5556, -0.8238],
       [ 0.5354, -1.0329,  1.4697],
       [ 1.3041,  1.4497,  0.2031],
       [-1.032 ,  0.9698, -0.9627],
       [ 1.3821, -0.9388,  0.6691]])

In [13]: wp.values
Out[13]: 
array([[[-0.4336, -0.2736,  0.6804, -0.3084],
        [-0.2761, -1.8212, -1.9936, -1.9274],
        [-2.0279,  1.625 ,  0.5511,  3.0593],
        [ 0.4553, -0.0307,  0.9357,  1.0612],
        [-2.1079,  0.1999,  0.3236, -0.6416]],

       [[-0.5875,  0.0539,  0.1949, -0.382 ],
        [ 0.3186,  2.0891, -0.7283, -0.0903],
        [-0.7482,  1.3189, -2.0298,  0.7927],
        [ 0.461 , -0.5427, -0.3054, -0.4792],
        [ 0.095 , -0.2701, -0.7071, -0.7739]]])
```

If a DataFrame or Panel contains homogeneously-typed data, the ndarray can actually be modified in-place, and the changes will be reflected in the data structure. For heterogeneous data (e.g. some of the DataFrame’s columns are not all the same dtype), this will not be the case. The values attribute itself, unlike the axis labels, cannot be assigned to.  
如果一个数据表或者面板只包含同质数据，ndarray可以在原地更改，并且更改将会反映到数据结构上。对于异质数据（如：一些数据表的列并不是同样的dtype），则不能。不同于维度标签，values属性本身不能被赋值。

**Note：** When working with heterogeneous data, the dtype of the resulting ndarray will be chosen to accommodate all of the data involved. For example, if strings are involved, the result will be of object dtype. If there are only floats and integers, the resulting array will be of float dtype.
**注意：**当操作异质数据的时候，结果的ndarray的dtype将会自动选择一个数据类型，使得它可以容纳所有的数据。例如，如果包含字符串，结果就将是object类型。如果只有浮点与整型，那么结果将会使用浮点类型。
