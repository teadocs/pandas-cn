# 绘图(Plotting)

The [Plotting](http://pandas.pydata.org/pandas-docs/stable/visualization.html#visualization) docs.

[Make Matplotlib look like R](http://stackoverflow.com/questions/14349055/making-matplotlib-graphs-look-like-r-by-default)

[Setting x-axis major and minor labels](http://stackoverflow.com/questions/12945971/pandas-timeseries-plot-setting-x-axis-major-and-minor-ticks-and-labels)

[Plotting multiple charts in an ipython notebook](http://stackoverflow.com/questions/16392921/make-more-than-one-chart-in-same-ipython-notebook-cell)

[Creating a multi-line plot](http://stackoverflow.com/questions/16568964/make-a-multiline-plot-from-csv-file-in-matplotlib)

[Plotting a heatmap](http://stackoverflow.com/questions/17050202/plot-timeseries-of-histograms-in-python)

[Annotate a time-series plot](http://stackoverflow.com/questions/11067368/annotate-time-series-plot-in-matplotlib)

[Annotate a time-series plot #2](http://stackoverflow.com/questions/17891493/annotating-points-from-a-pandas-dataframe-in-matplotlib-plot)

[Generate Embedded plots in excel files using Pandas, Vincent and xlsxwriter](https://pandas-xlsxwriter-charts.readthedocs.io/)

[Boxplot for each quartile of a stratifying variable](http://stackoverflow.com/questions/23232989/boxplot-stratified-by-column-in-python-pandas)

```python
In [156]: df = pd.DataFrame(
   .....:      {u'stratifying_var': np.random.uniform(0, 100, 20),
   .....:       u'price': np.random.normal(100, 5, 20)})
   .....: 

In [157]: df[u'quartiles'] = pd.qcut(
   .....:     df[u'stratifying_var'],
   .....:     4,
   .....:     labels=[u'0-25%', u'25-50%', u'50-75%', u'75-100%'])
   .....: 

In [158]: df.boxplot(column=u'price', by=u'quartiles')
Out[158]: <matplotlib.axes._subplots.AxesSubplot at 0x7f210fbc2668>
```

![k线图](/static/images/quartile_boxplot.png)