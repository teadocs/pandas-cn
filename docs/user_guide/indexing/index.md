# Pandas 索引和数据选择器

Pandas对象的轴标签信息有很多用途：

- 使用已知指标标识数据(即提供*元数据*)，这些指标对于分析、可视化和交互式控制台显示非常重要。
- 启用自动和显式数据对齐。
- 允许直观地获取和设置数据集的子集。

在本节中，我们将关注最后一点：即如何切片、分区，以及如何获取和设置panda对象的子集。由于Series和DataFrame在这一领域得到了更多的开发关注，因此它们将是主要的关注点。

**注意**: Python和NumPy索引操作符 [] 和属性操作符 . 可以快速方便地访问Pandas数据结构。 这使得交互式工作更加直观，因为如果你已经知道如何处理Python字典和NumPy数组，那么就没有什么新的东西需要学习。 然而，由于要访问的数据类型事先并不知道，直接使用标准操作符有一些优化限制。对于生产代码，我们建议您利用本章中公开的优化Pandas数据访问方法。

<div class="warning-warp">
<b>警告</b><p>是否为设置操作返回副本或引用，可能取决于上下文。这有时称为链式赋值，应该避免。请参见返回视图与复制。</p>
</div>

<div class="warning-warp">
<b>警告</b><p>0.18.0中澄清了基于整数的带浮点索引的警告索引，有关更改的摘要，请参见<a href="https://pandas.pydata.org/pandas-docs/stable/user_guide/indexing.html#indexing-view-versus-copy">此处</a>。</p>
</div>

请参阅[分层索引/高级索引](http://pandas.pydata.org/pandas-docs/stable/advanced.html#advanced)以了解“分层索引”和更高级的索引文档。

有关一些高级策略，请参阅[指南](http://pandas.pydata.org/pandas-docs/stable/cookbook.html#cookbook#selection)。