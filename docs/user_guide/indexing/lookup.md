# lookup()方法

Sometimes you want to extract a set of values given a sequence of row labels and column labels, and the ``lookup`` method allows for this and returns a NumPy array. For instance:

```python
In [287]: dflookup = pd.DataFrame(np.random.rand(20,4), columns = ['A','B','C','D'])

In [288]: dflookup.lookup(list(range(0,10,2)), ['B','C','A','B','D'])
Out[288]: array([ 0.3506,  0.4779,  0.4825,  0.9197,  0.5019])
```