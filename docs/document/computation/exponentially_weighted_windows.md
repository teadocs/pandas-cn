# 窗口函数指数加权

A related set of functions are exponentially weighted versions of several of the above statistics. A similar interface to ``.rolling`` and ``.expanding`` is accessed through the ``.ewm`` method to receive an **EWM** object. A number of expanding EW (exponentially weighted) methods are provided:

Function | Description
---|---
[mean()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.core.window.EWM.mean.html#pandas.core.window.EWM.mean) | EW moving average
[var()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.core.window.EWM.var.html#pandas.core.window.EWM.var) | EW moving variance
[std()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.core.window.EWM.std.html#pandas.core.window.EWM.std) | EW moving standard deviation
[corr()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.core.window.EWM.corr.html#pandas.core.window.EWM.corr) | EW moving correlation
[cov()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.core.window.EWM.cov.html#pandas.core.window.EWM.cov) | EW moving covariance

In general, a weighted moving average is calculated as

![公式1](/static/images/formula1.png)

where x(t) is the input, y(t) is the result and the w(i) are the weights.

The EW functions support two variants of exponential weights. The default, ``adjust=True``, uses the weights w(i)=(1−α)^i which gives

![公式2](/static/images/formula2.png)

When ``adjust = False`` is specified, moving averages are calculated as

![公式3](/static/images/formula3.png)

which is equivalent to using weights

![公式4](/static/images/formula4.png)

**Note**: These equations are sometimes written in terms of α′=1−α, e.g.

yt=α′yt−1+(1−α′)xt.

The difference between the above two variants arises because we are dealing with series which have finite history. Consider a series of infinite history:

![公式5](/static/images/formula5.png)

Noting that the denominator is a geometric series with initial term equal to 1 and a ratio of 1−α we have

![公式6](/static/images/formula6.png)

which shows the equivalence of the above two variants for infinite series. When ``adjust=True`` we have y0=x0 and from the last representation above we have yt=αxt+(1−α)yt−1, therefore there is an assumption that x0 is not an ordinary value but rather an exponentially weighted moment of the infinite series up to that point.

One must have 0<α≤1, and while since version 0.18.0 it has been possible to pass α directly, it’s often easier to think about either the **span**, **center of mass (com)** or **half-life** of an EW moment:

![公式7](/static/images/formula7.png)

One must specify precisely one of **span**, **center of mass**, **half-life** and **alpha** to the EW functions:

- **Span** corresponds to what is commonly called an “N-day EW moving average”.
- **Center of mass** has a more physical interpretation and can be thought of in terms of span: c=(s−1)/2.
- **Half-life** is the period of time for the exponential weight to reduce to one half.
- **Alpha** specifies the smoothing factor directly.

Here is an example for a univariate time series:

```python
In [107]: s.plot(style='k--')
Out[107]: <matplotlib.axes._subplots.AxesSubplot at 0x7f210fbff908>

In [108]: s.ewm(span=20).mean().plot(style='k')
Out[108]: <matplotlib.axes._subplots.AxesSubplot at 0x7f210fbff908>
```

![ewam示例](/static/images/ewma_ex.png)

EWM has a ``min_periods`` argument, which has the same meaning it does for all the ``.expanding`` and ``.rolling`` methods: no output values will be set until at least ``min_periods`` non-null values are encountered in the (expanding) window.

EWM also has an ``ignore_na`` argument, which determines how intermediate null values affect the calculation of the weights. When ``ignore_na=False`` (the default), weights are calculated based on absolute positions, so that intermediate null values affect the result. When ``ignore_na=True``, weights are calculated by ignoring intermediate null values. For example, assuming ``adjust=True``, if ``ignore_na=False``, the weighted average of ``3``, ``NaN``, ``5`` would be calculated as

![公式8](/static/images/formula8.png)

Whereas if ignore_na=True, the weighted average would be calculated as

![公式9](/static/images/formula9.png)

The **var()**, **std()**, and **cov()** functions have a ``bias`` argument, specifying whether the result should contain biased or unbiased statistics. For example, if ``bias=True``, ``ewmvar(x)`` is calculated as ``ewmvar(x) = ewma(x**2) - ewma(x)**2``; whereas if ``bias=False`` (the default), the biased variance statistics are scaled by debiasing factors

![公式10](/static/images/formula10.png)

(For wi=1, this reduces to the usual N/(N−1) factor, with N=t+1.) See [Weighted Sample Variance](http://en.wikipedia.org/wiki/Weighted_arithmetic_mean#Weighted_sample_variance) on Wikipedia for further details.