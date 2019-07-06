# 索引的不同选择

有许多用户请求增加更明确的基于位置的索引。Pandas现在支持三种类型的多轴索引。

- .loc主要是基于标签的，但是也可以与布尔数组一起使用。允许输入:
    - 一个单标签,如：5 或者 'a' （注意，5 被解释为标签索引。而不是基于整数的位置索引）。
    - 一个形如 ['a', 'b', 'c'] 的标签列表或数组。
    - 一个形如 'a':'f' 的切片对象（注意，这里和Python的切片不同，左右都是闭区间）
    - 一个布尔数组
    - 一个可调用的函数，带有一个参数(Series、DataFrame或Panel)，返回有效地索引输出(上面的一个)。
      
    
    *0.18.1版本新特性*

参见 [Selection by Label](http://Pandas.pydata.org/Pandas-docs/stable/indexing.html#indexing-label) 查看更多。
    
- .iloc主要是基于整数位置的（取值范围为0到轴长度-1）, 但是也可以和布尔数组组一起使用。 如果请求的索引越界，iloc将抛出IndexError，除非切片索引器允许索引越界。(这符合Python/NumPy切片语义)。允许输入:
    - 一个整数。如：5。
    -  一个形如 [4, 3, 0] 的整数列表或数组
    - 一个形如 1:7 的切片对象
    - 一个布尔数组
    - 一个可调用的函数，带有一个参数(Series、DataFrame或Panel)，返回有效地索引输出(上面的一个)。
        *0.18.1版本新特性*

    参见 [Selection by Position](http://Pandas.pydata.org/Pandas-docs/stable/indexing.html#indexing-integer), [Advanced Indexing](http://Pandas.pydata.org/Pandas-docs/stable/advanced.html#advanced) 和 [Advanced Hierarchical](http://Pandas.pydata.org/Pandas-docs/stable/advanced.html#advanced-advanced-hierarchical) 查看更多。

    - ``.loc``, ``.iloc``, 甚至 ``[]`` 索引都可以接受一个 ``callable`` 作为索引器。 参见 [Selection By Callable](http://Pandas.pydata.org/Pandas-docs/stable/indexing.html#indexing-callable)。

使用以下符号（使用`.loc`举例，但是下面的例子同样适用于`.iloc`）可以从支持多轴选择的对象中获取值。任何轴访问器都可以是空切片符`:`，不需要考虑详细范围的坐标轴可以假设为`:`。例如：`p.loc['a']`相当于`p.loc['a', :, :]`。

| Object Type | Indexers                                        |
| ----------- | ----------------------------------------------- |
| Series      | s.loc[indexer]                                  |
| DataFrame   | df.loc[row_indexer,column_indexer]              |
| Panel       | p.loc[item_indexer,major_indexer,minor_indexer] |