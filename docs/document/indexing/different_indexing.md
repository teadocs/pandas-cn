# 索引的不同选择

Object selection has had a number of user-requested additions in order to support more explicit location based indexing. Pandas now supports three types of multi-axis indexing.

- .loc is primarily label based, but may also be used with a boolean array. .loc will raise KeyError when the items are not found. Allowed inputs are:
    - A single label, e.g. 5 or 'a' (Note that 5 is interpreted as a label of the index. This use is not an integer position along the index.).
    - A list or array of labels ['a', 'b', 'c'].
    - A slice object with labels 'a':'f' (Note that contrary to usual python slices, both the start and the stop are included, when present in the index! See Slicing with labels.).
    - A boolean array
    - A callable function with one argument (the calling Series, DataFrame or Panel) and that returns valid output for indexing (one of the above).
        *New in version 0.18.1*.

    See more at [Selection by Label](http://pandas.pydata.org/pandas-docs/stable/indexing.html#indexing-label).

- .iloc is primarily integer position based (from 0 to length-1 of the axis), but may also be used with a boolean array. .iloc will raise IndexError if a requested indexer is out-of-bounds, except slice indexers which allow out-of-bounds indexing. (this conforms with Python/NumPy slice semantics). Allowed inputs are:
    - An integer e.g. 5.
    - A list or array of integers [4, 3, 0].
    - A slice object with ints 1:7.
    - A boolean array.
    - A callable function with one argument (the calling Series, DataFrame or Panel) and that returns valid output for indexing (one of the above).
        *New in version 0.18.1*.

    See more at [Selection by Position](http://pandas.pydata.org/pandas-docs/stable/indexing.html#indexing-integer), [Advanced Indexing](http://pandas.pydata.org/pandas-docs/stable/advanced.html#advanced) and [Advanced Hierarchical](http://pandas.pydata.org/pandas-docs/stable/advanced.html#advanced-advanced-hierarchical).

    - ``.loc``, ``.iloc``, and also ``[]`` indexing can accept a ``callable`` as indexer. See more at [Selection By Callable](http://pandas.pydata.org/pandas-docs/stable/indexing.html#indexing-callable).

Getting values from an object with multi-axes selection uses the following notation (using ``.loc`` as an example, but the following applies to ``.iloc`` as well). Any of the axes accessors may be the null slice :. Axes left out of the specification are assumed to be :, e.g. ``p.loc['a']`` is equivalent to ``p.loc['a', :, :]``.

Object Type | Indexers
---|---
Series | s.loc[indexer]
DataFrame | df.loc[row_indexer,column_indexer]
Panel | p.loc[item_indexer,major_indexer,minor_indexer]