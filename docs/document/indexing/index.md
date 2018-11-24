# Pandas 索引和数据选择器

The axis labeling information in pandas objects serves many purposes:

- Identifies data (i.e. provides *metadata*) using known indicators, important for analysis, visualization, and interactive console display.
- Enables automatic and explicit data alignment.
- Allows intuitive getting and setting of subsets of the data set.

In this section, we will focus on the final point: namely, how to slice, dice, and generally get and set subsets of pandas objects. The primary focus will be on Series and DataFrame as they have received more development attention in this area.

**Note**: The Python and NumPy indexing operators [] and attribute operator . provide quick and easy access to pandas data structures across a wide range of use cases. This makes interactive work intuitive, as there’s little new to learn if you already know how to deal with Python dictionaries and NumPy arrays. However, since the type of the data to be accessed isn’t known in advance, directly using standard operators has some optimization limits. For production code, we recommended that you take advantage of the optimized pandas data access methods exposed in this chapter.

<div class="warning-warp">
<b>警告</b><p>Whether a copy or a reference is returned for a setting operation, may depend on the context. This is sometimes called chained assignment and should be avoided. See Returning a View versus Copy.</p>
</div>

<div class="warning-warp">
<b>警告</b><p>Warning Indexing on an integer-based Index with floats has been clarified in 0.18.0, for a summary of the changes, see <a href="http://pandas.pydata.org/pandas-docs/stable/whatsnew.html#whatsnew-0180-float-indexers">here</a>.</p>
</div>

See the [MultiIndex / Advanced Indexing](http://pandas.pydata.org/pandas-docs/stable/advanced.html#advanced) for ``MultiIndex`` and more advanced indexing documentation.

See the [cookbook](http://pandas.pydata.org/pandas-docs/stable/cookbook.html#cookbook-selection) for some advanced strategies.