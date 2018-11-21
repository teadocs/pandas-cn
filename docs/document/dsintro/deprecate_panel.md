# 弃用面板(Deprecate Panel)

Over the last few years, pandas has increased in both breadth and depth, with new features, datatype support, and manipulation routines. As a result, supporting efficient indexing and functional routines for ``Series, DataFrame`` and Panel has contributed to an increasingly fragmented and difficult-to-understand codebase.

The 3-D structure of a ``Panel`` is much less common for many types of data analysis, than the 1-D of the ``Series`` or the 2-D of the ``DataFrame``. Going forward it makes sense for pandas to focus on these areas exclusively.

Oftentimes, one can simply use a MultiIndex ``DataFrame`` for easily working with higher dimensional data.

In addition, the ``xarray`` package was built from the ground up, specifically in order to support the multi-dimensional analysis that is one of Panel s main usecases. [Here is a link to the xarray panel-transition documentation](http://xarray.pydata.org/en/stable/pandas.html#panel-transition).

```python
In [147]: p = tm.makePanel()

In [148]: p
Out[148]: 
<class 'pandas.core.panel.Panel'>
Dimensions: 3 (items) x 30 (major_axis) x 4 (minor_axis)
Items axis: ItemA to ItemC
Major_axis axis: 2000-01-03 00:00:00 to 2000-02-11 00:00:00
Minor_axis axis: A to D
```

Convert to a MultiIndex DataFrame.

```python
In [149]: p.to_frame()
Out[149]: 
                     ItemA     ItemB     ItemC
major      minor                              
2000-01-03 A     -0.390201 -1.624062 -0.605044
           B      1.562443  0.483103  0.583129
           C     -1.085663  0.768159 -0.273458
           D      0.136235 -0.021763 -0.700648
2000-01-04 A      1.207122 -0.758514  0.878404
           B      0.763264  0.061495 -0.876690
           C     -1.114738  0.225441 -0.335117
           D      0.886313 -0.047152 -1.166607
2000-01-05 A      0.178690 -0.560859 -0.921485
           B      0.162027  0.240767 -1.919354
           C     -0.058216  0.543294 -0.476268
           D     -1.350722  0.088472 -0.367236
2000-01-06 A     -1.004168 -0.589005 -0.200312
           B     -0.902704  0.782413 -0.572707
           C     -0.486768  0.771931 -1.765602
           D     -0.886348 -0.857435  1.296674
2000-01-07 A     -1.377627 -1.070678  0.522423
           B      1.106010  0.628462 -1.736484
           C      1.685148 -0.968145  0.578223
           D     -1.013316 -2.503786  0.641385
2000-01-10 A      0.499281 -1.681101  0.722511
           B     -0.199234 -0.880627 -1.335113
           C      0.112572 -1.176383  0.242697
           D      1.920906 -1.058041 -0.779432
2000-01-11 A     -1.405256  0.403776 -1.702486
           B      0.458265  0.777575 -1.244471
           C     -1.495309 -3.192716  0.208129
           D     -0.388231 -0.657981  0.602456
2000-01-12 A      0.162565  0.609862 -0.709535
           B      0.491048 -0.779367  0.347339
...                    ...       ...       ...
2000-02-02 C     -0.303961 -0.463752 -0.288962
           D      0.104050  1.116086  0.506445
2000-02-03 A     -2.338595 -0.581967 -0.801820
           B     -0.557697 -0.033731 -0.176382
           C      0.625555 -0.055289  0.875359
           D      0.174068 -0.443915  1.626369
2000-02-04 A     -0.374279 -1.233862 -0.915751
           B      0.381353 -1.108761 -1.970108
           C     -0.059268 -0.360853 -0.614618
           D     -0.439461 -0.200491  0.429518
2000-02-07 A     -2.359958 -3.520876 -0.288156
           B      1.337122 -0.314399 -1.044208
           C      0.249698  0.728197  0.565375
           D     -0.741343  1.092633  0.013910
2000-02-08 A     -1.157886  0.516870 -1.199945
           B     -1.531095 -0.860626 -0.821179
           C      1.103949  1.326768  0.068184
           D     -0.079673 -1.675194 -0.458272
2000-02-09 A     -0.551865  0.343125 -0.072869
           B      1.331458  0.370397 -1.914267
           C     -1.087532  0.208927  0.788871
           D     -0.922875  0.437234 -1.531004
2000-02-10 A      1.592673  2.137827 -1.828740
           B     -0.571329 -1.761442 -0.826439
           C      1.998044  0.292058 -0.280343
           D      0.303638  0.388254 -0.500569
2000-02-11 A      1.559318  0.452429 -1.716981
           B     -0.026671 -0.899454  0.124808
           C     -0.244548 -2.019610  0.931536
           D     -0.917368  0.479630  0.870690

[120 rows x 3 columns]
```

Alternatively, one can convert to an xarray DataArray.

```python
In [150]: p.to_xarray()
Out[150]: 
<xarray.DataArray (items: 3, major_axis: 30, minor_axis: 4)>
array([[[-0.390201,  1.562443, -1.085663,  0.136235],
        [ 1.207122,  0.763264, -1.114738,  0.886313],
        ..., 
        [ 1.592673, -0.571329,  1.998044,  0.303638],
        [ 1.559318, -0.026671, -0.244548, -0.917368]],

       [[-1.624062,  0.483103,  0.768159, -0.021763],
        [-0.758514,  0.061495,  0.225441, -0.047152],
        ..., 
        [ 2.137827, -1.761442,  0.292058,  0.388254],
        [ 0.452429, -0.899454, -2.01961 ,  0.47963 ]],

       [[-0.605044,  0.583129, -0.273458, -0.700648],
        [ 0.878404, -0.87669 , -0.335117, -1.166607],
        ..., 
        [-1.82874 , -0.826439, -0.280343, -0.500569],
        [-1.716981,  0.124808,  0.931536,  0.87069 ]]])
Coordinates:
  * items       (items) object 'ItemA' 'ItemB' 'ItemC'
  * major_axis  (major_axis) datetime64[ns] 2000-01-03 2000-01-04 2000-01-05 ...
  * minor_axis  (minor_axis) object 'A' 'B' 'C' 'D'
```

You can see the full-documentation for the [xarray package](http://xarray.pydata.org/en/stable/).