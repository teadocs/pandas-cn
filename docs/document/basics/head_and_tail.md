# Head 和 Tail

To view a small sample of a Series or DataFrame object, use the head() and tail() methods. The default number of elements to display is five, but you may pass a custom number.

```python
In [5]: long_series = pd.Series(np.random.randn(1000))

In [6]: long_series.head()
Out[6]: 
0    0.229453
1    0.304418
2    0.736135
3   -0.859631
4   -0.424100
dtype: float64

In [7]: long_series.tail(3)
Out[7]: 
997   -0.351587
998    1.136249
999   -0.448789
dtype: float64
```
