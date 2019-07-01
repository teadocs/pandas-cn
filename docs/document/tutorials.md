# Pandas 教程

这是许多Pandas教程的指南，主要面向新用户。

## 官方指南

pandas自己的 [10分钟入门pandas](https://www.pypandas.cn/document/10min.html).

更加复杂的教程在 [Cookbook](https://www.pypandas.cn/document/cookbook/index.html).

比较方便的是 [cheat sheet](http://pandas.pydata.org/Pandas_Cheat_Sheet.pdf).

## pandas 指南

这本由 [Julia Evans](http://jvns.ca/)于2015年编写的pandas指南的目的是为您提供一份入门的具体示例。这些都是真实数据的例子，以及其中所包含的所有bug和奇怪之处。

这是0.2版本的链接。有关最新的内容，请参见[pandas-cookbook GitHub repository](http://github.com/jvns/pandas-cookbook)。要运行本教程中的示例，您需要克隆GitHub仓库并运行IPython记事本。参见[如何使用本指南](https://github.com/jvns/pandas-cookbook# How to use-this-cookbook)。

- [A quick tour of the IPython Notebook](http://nbviewer.jupyter.org/github/jvns/pandas-cookbook/blob/v0.2/cookbook/A%20quick%20tour%20of%20IPython%20Notebook.ipynb): 展示了IPython出色的tab补齐功能和魔术方法。
- [Chapter 1](http://nbviewer.jupyter.org/github/jvns/pandas-cookbook/blob/v0.2/cookbook/Chapter%201%20-%20Reading%20from%20a%20CSV.ipynb): 将数据读入到panda中几乎是最简单的事情。即使编码错误!
- [Chapter 2](http://nbviewer.jupyter.org/github/jvns/pandas-cookbook/blob/v0.2/cookbook/Chapter%202%20-%20Selecting%20data%20%26%20finding%20the%20most%20common%20complaint%20type.ipynb): 如何从panda dataframe中选择数据并不十分明显。在这里，我们将解释基本知识(如何获取切片和列)。
- [Chapter 3](http://nbviewer.jupyter.org/github/jvns/pandas-cookbook/blob/v0.2/cookbook/Chapter%203%20-%20Which%20borough%20has%20the%20most%20noise%20complaints%20%28or%2C%20more%20selecting%20data%29.ipynb): 在这里，我们开始认真地进行切分，并学习如何以非常快的速度以复杂的方式过滤数据流。
- [Chapter 4](http://nbviewer.jupyter.org/github/jvns/pandas-cookbook/blob/v0.2/cookbook/Chapter%204%20-%20Find%20out%20on%20which%20weekday%20people%20bike%20the%20most%20with%20groupby%20and%20aggregate.ipynb): Groupby/aggregate是pandas中我最喜欢的东西，我一直在使用它。你可能应该读一读这篇文章。
- [Chapter 5](https://nbviewer.jupyter.org/github/jvns/pandas-cookbook/blob/v0.2/cookbook/Chapter%205%20-%20Combining%20dataframes%20and%20scraping%20Canadian%20weather%20data.ipynb): 在这里你可以看看蒙特利尔的冬天是不是很冷(剧透:是的)。用pandas抓取网页很有趣!在这里，我们组合了数据流。
- [Chapter 6](http://nbviewer.jupyter.org/github/jvns/pandas-cookbook/blob/v0.2/cookbook/Chapter%206%20-%20String%20Operations-%20Which%20month%20was%20the%20snowiest.ipynb): 字符串与pandas的很友好。它有所有这些向量化的字符串操作都是很棒的。我们将把一组包含“Snow”的字符串转换成数字的向量。
- [Chapter 7](http://nbviewer.jupyter.org/github/jvns/pandas-cookbook/blob/v0.2/cookbook/Chapter%207%20-%20Cleaning%20up%20messy%20data.ipynb): 清理乱七八糟的数据从来都不是一件乐事，但对于熊猫来说更容易。
- [Chapter 8](http://nbviewer.jupyter.org/github/jvns/pandas-cookbook/blob/v0.2/cookbook/Chapter%208%20-%20How%20to%20deal%20with%20timestamps.ipynb): 解析Unix时间戳一开始令人困惑，但事实证明它非常简单。
- [Chapter 9](http://nbviewer.jupyter.org/github/jvns/pandas-cookbook/blob/v0.2/cookbook/Chapter%209%20-%20Loading%20data%20from%20SQL%20databases.ipynb): 从SQL数据库读取数据。

## 面向pandas新手的教程

更多资源请访问 [repository](https://bitbucket.org/hrojas/learn-pandas)。

- [01 - Lesson](http://nbviewer.ipython.org/urls/bitbucket.org/hrojas/learn-pandas/raw/master/lessons/01%20-%20Lesson.ipynb): - 导入库 - 创建数据集 - 创建 data frames - 从CSV文件读数据 - 导出数据到CSV文件 - 查找最大值 - 绘图
- [02 - Lesson](http://nbviewer.ipython.org/urls/bitbucket.org/hrojas/learn-pandas/raw/master/lessons/02%20-%20Lesson.ipynb): - 从TXT文件导入/导出数据 - 获取最前/后面的数据 - 描述性统计 - 数据分组/排序
- [03 - Lesson](http://nbviewer.ipython.org/urls/bitbucket.org/hrojas/learn-pandas/raw/master/lessons/03%20-%20Lesson.ipynb): - 创建函数 - 从EXCEL文件导入/导出数据 - 异常值 - Lambda表达式 - 数据切片
- [04 - Lesson](http://nbviewer.ipython.org/urls/bitbucket.org/hrojas/learn-pandas/raw/master/lessons/04%20-%20Lesson.ipynb): - 增加/删除列 - 索引操作
- [05 - Lesson](http://nbviewer.ipython.org/urls/bitbucket.org/hrojas/learn-pandas/raw/master/lessons/05%20-%20Lesson.ipynb): - Stack/Unstack/Transpose函数
- [06 - Lesson](http://nbviewer.ipython.org/urls/bitbucket.org/hrojas/learn-pandas/raw/master/lessons/06%20-%20Lesson.ipynb): - GroupBy函数
- [07 - Lesson](http://nbviewer.ipython.org/urls/bitbucket.org/hrojas/learn-pandas/raw/master/lessons/07%20-%20Lesson.ipynb): - 计算异常值的方法
- [08 - Lesson](http://nbviewer.ipython.org/urls/bitbucket.org/hrojas/learn-pandas/raw/master/lessons/08%20-%20Lesson.ipynb): - 从Microsoft SQL数据库读取
- [09 - Lesson](http://nbviewer.ipython.org/urls/bitbucket.org/hrojas/learn-pandas/raw/master/lessons/09%20-%20Lesson.ipynb): - 导出数据到 CSV/EXCEL/TXT
- [10 - Lesson](http://nbviewer.ipython.org/urls/bitbucket.org/hrojas/learn-pandas/raw/master/lessons/10%20-%20Lesson.ipynb): - 在不同格式之间转换
- [11 - Lesson](http://nbviewer.ipython.org/urls/bitbucket.org/hrojas/learn-pandas/raw/master/lessons/11%20-%20Lesson.ipynb): - 组合来自不同来源的数据

## 用Python进行实际数据分析

本[指南][http://wavedatalab.github.io/datawithpython]全面介绍了使用python数据生态系统和有趣的开放数据集进行数据分析的过程。共有四个部分涵盖选定的主题，如下所示：

- [整理数据](http://wavedatalab.github.io/datawithpython/munge.html)
- [聚合数据](http://wavedatalab.github.io/datawithpython/aggregate.html)
- [可视化数据](http://wavedatalab.github.io/datawithpython/visualize.html)
- [时间序列](http://wavedatalab.github.io/datawithpython/timeseries.html)

## 新用户练习

用真实的数据集和练习练习你的技能。有关更多资源，请访问[GitHub](https://github.com/guipsamora/pandas_exercises)。

- [01 - 获取和了你的数据](https://github.com/guipsamora/pandas_exercises/tree/master/01_Getting_%26_Knowing_Your_Data)
- [02 - 过滤和排序](https://github.com/guipsamora/pandas_exercises/tree/master/02_Filtering_%26_Sorting)
- [03 - 分组](https://github.com/guipsamora/pandas_exercises/tree/master/03_Grouping)
- [04 - Apply](https://github.com/guipsamora/pandas_exercises/tree/master/04_Apply)
- [05 - 合并](https://github.com/guipsamora/pandas_exercises/tree/master/05_Merge)
- [06 - 统计](https://github.com/guipsamora/pandas_exercises/tree/master/06_Stats)
- [07 - 可视化](https://github.com/guipsamora/pandas_exercises/tree/master/07_Visualization)
- [08 - 创建Series 和 DataFrames](https://github.com/guipsamora/pandas_exercises/tree/master/08_Creating_Series_and_DataFrames/Pokemon)
- [09 - 时间序列](https://github.com/guipsamora/pandas_exercises/tree/master/09_Time_Series)
- [10 - 删除](https://github.com/guipsamora/pandas_exercises/tree/master/10_Deleting)

## 比较新的教程

由[Tom Augspurger](https://github.com/TomAugspurger)于2016年编写的教程. 源代码可以在GitHub[TomAugspurger/effective-pandas](https://github.com/TomAugspurger/effective-pandas)找到

- [Modern Pandas](http://tomaugspurger.github.io/modern-1-intro.html)
- [Method Chaining](http://tomaugspurger.github.io/method-chaining.html)
- [Indexes](http://tomaugspurger.github.io/modern-3-indexes.html)
- [Performance](http://tomaugspurger.github.io/modern-4-performance.html)
- [Tidy Data](http://tomaugspurger.github.io/modern-5-tidy.html)
- [Visualization](http://tomaugspurger.github.io/modern-6-visualization.html)
- [Timeseries](http://tomaugspurger.github.io/modern-7-timeseries.html)

## Excel charts with pandas, vincent and xlsxwriter

- [Using Pandas and XlsxWriter to create Excel charts](https://pandas-xlsxwriter-charts.readthedocs.io/)

## Video Tutorials

- [Pandas From The Ground Up](https://www.youtube.com/watch?v=5JnMutdy6Fw) (2015) (2:24) [GitHub repo](https://github.com/brandon-rhodes/pycon-pandas-tutorial)
- [Introduction Into Pandas](https://www.youtube.com/watch?v=-NR-ynQg0YM) (2016) (1:28) [GitHub repo](https://github.com/chendaniely/2016-pydata-carolinas-pandas)
- [Pandas: .head() to .tail()](https://www.youtube.com/watch?v=7vuO9QXDN50) (2016) (1:26) [GitHub repo](https://github.com/TomAugspurger/pydata-chi-h2t)

## Various Tutorials

- [Wes McKinney’s (pandas BDFL) blog](http://blog.wesmckinney.com/)
- [Statistical analysis made easy in Python with SciPy and pandas DataFrames, by Randal Olson](http://www.randalolson.com/2012/08/06/statistical-analysis-made-easy-in-python/)
- [Statistical Data Analysis in Python, tutorial videos, by Christopher Fonnesbeck from SciPy 2013](http://conference.scipy.org/scipy2013/tutorial_detail.php?id=109)
- [Financial analysis in Python, by Thomas Wiecki](http://nbviewer.ipython.org/github/twiecki/financial-analysis-python-tutorial/blob/master/1.%20Pandas%20Basics.ipynb)
- [Intro to pandas data structures, by Greg Reda](http://www.gregreda.com/2013/10/26/intro-to-pandas-data-structures/)
- [Pandas and Python: Top 10, by Manish Amde](http://manishamde.github.io/blog/2013/03/07/pandas-and-python-top-10/)
- [Pandas Tutorial, by Mikhail Semeniuk](http://www.bearrelroll.com/2013/05/python-pandas-tutorial)
- [Pandas DataFrames Tutorial, by Karlijn Willems](http://www.datacamp.com/community/tutorials/pandas-tutorial-dataframe-python)
- [A concise tutorial with real life examples](https://tutswiki.com/pandas-cookbook/chapter1)