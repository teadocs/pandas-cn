# 返回视图与副本

When setting values in a pandas object, care must be taken to avoid what is called ``chained indexing``. Here is an example.

```python
In [339]: dfmi = pd.DataFrame([list('abcd'),
   .....:                      list('efgh'),
   .....:                      list('ijkl'),
   .....:                      list('mnop')],
   .....:                     columns=pd.MultiIndex.from_product([['one','two'],
   .....:                                                         ['first','second']]))
   .....: 

In [340]: dfmi
Out[340]: 
    one          two       
  first second first second
0     a      b     c      d
1     e      f     g      h
2     i      j     k      l
3     m      n     o      p
```

Compare these two access methods:

```python
In [341]: dfmi['one']['second']
Out[341]: 
0    b
1    f
2    j
3    n
Name: second, dtype: object
```

```python
In [342]: dfmi.loc[:,('one','second')]
Out[342]: 
0    b
1    f
2    j
3    n
Name: (one, second), dtype: object
```

These both yield the same results, so which should you use? It is instructive to understand the order of operations on these and why method 2 (``.loc``) is much preferred over method 1 (chained ``[]``).

``dfmi['one']`` selects the first level of the columns and returns a DataFrame that is singly-indexed. Then another Python operation ``dfmi_with_one['second']`` selects the series indexed by ``'second'``. This is indicated by the variable ``dfmi_with_one`` because pandas sees these operations as separate events. e.g. separate calls to ``__getitem__``, so it has to treat them as linear operations, they happen one after another.

Contrast this to ``df.loc[:,('one','second')]`` which passes a nested tuple of ``(slice(None),('one','second'))`` to a single call to ``__getitem__``. This allows pandas to deal with this as a single entity. Furthermore this order of operations can be significantly faster, and allows one to index both axes if so desired.

## Why does assignment fail when using chained indexing?

The problem in the previous section is just a performance issue. What’s up with the ``SettingWithCopy`` warning? We don’t **usually** throw warnings around when you do something that might cost a few extra milliseconds!

But it turns out that assigning to the product of chained indexing has inherently unpredictable results. To see this, think about how the Python interpreter executes this code:

```python
dfmi.loc[:,('one','second')] = value
# becomes
dfmi.loc.__setitem__((slice(None), ('one', 'second')), value)
```

But this code is handled differently:

```python
dfmi['one']['second'] = value
# becomes
dfmi.__getitem__('one').__setitem__('second', value)
```

See that ``__getitem__`` in there? Outside of simple cases, it’s very hard to predict whether it will return a view or a copy (it depends on the memory layout of the array, about which pandas makes no guarantees), and therefore whether the ``__setitem__`` will modify dfmi or a temporary object that gets thrown out immediately afterward. **That’s** what ``SettingWithCopy`` is warning you about!

**Note**: You may be wondering whether we should be concerned about the loc property in the first example. But ``dfmi.loc`` is guaranteed to be ``dfmi`` itself with modified indexing behavior, so ``dfmi.loc.__getitem__`` / ``dfmi.loc.__setitem__`` operate on ``dfmi`` directly. Of course, ``dfmi.loc.__getitem__(idx)`` may be a view or a copy of ``dfmi``.

Sometimes a ``SettingWithCopy`` warning will arise at times when there’s no obvious chained indexing going on. These are the bugs that ``SettingWithCopy`` is designed to catch! Pandas is probably trying to warn you that you’ve done this:

```python
def do_something(df):
   foo = df[['bar', 'baz']]  # Is foo a view? A copy? Nobody knows!
   # ... many lines here ...
   foo['quux'] = value       # We don't know whether this will modify df or not!
   return foo
```

Yikes!

## Evaluation order matters

When you use chained indexing, the order and type of the indexing operation partially determine whether the result is a slice into the original object, or a copy of the slice.

Pandas has the ``SettingWithCopyWarning`` because assigning to a copy of a slice is frequently not intentional, but a mistake caused by chained indexing returning a copy where a slice was expected.

If you would like pandas to be more or less trusting about assignment to a chained indexing expression, you can set the [option](http://pandas.pydata.org/pandas-docs/stable/options.html#options) ``mode.chained_assignment`` to one of these values:

- ``'warn'``, the default, means a ``SettingWithCopyWarning`` is printed.
- ``'raise'`` means pandas will raise a ``SettingWithCopyException`` you have to deal with.
- ``None`` will suppress the warnings entirely.

```python
In [343]: dfb = pd.DataFrame({'a' : ['one', 'one', 'two',
   .....:                            'three', 'two', 'one', 'six'],
   .....:                     'c' : np.arange(7)})
   .....: 

# This will show the SettingWithCopyWarning
# but the frame values will be set
In [344]: dfb['c'][dfb.a.str.startswith('o')] = 42
```

This however is operating on a copy and will not work.

```python
>>> pd.set_option('mode.chained_assignment','warn')
>>> dfb[dfb.a.str.startswith('o')]['c'] = 42
Traceback (most recent call last)
     ...
SettingWithCopyWarning:
     A value is trying to be set on a copy of a slice from a DataFrame.
     Try using .loc[row_index,col_indexer] = value instead
```

A chained assignment can also crop up in setting in a mixed dtype frame.

**Note**: These setting rules apply to all of ``.loc/.iloc``.

This is the correct access method:

```python
In [345]: dfc = pd.DataFrame({'A':['aaa','bbb','ccc'],'B':[1,2,3]})

In [346]: dfc.loc[0,'A'] = 11

In [347]: dfc
Out[347]: 
     A  B
0   11  1
1  bbb  2
2  ccc  3
```

This can work at times, but it is not guaranteed to, and therefore should be avoided:

```python
In [348]: dfc = dfc.copy()

In [349]: dfc['A'][0] = 111

In [350]: dfc
Out[350]: 
     A  B
0  111  1
1  bbb  2
2  ccc  3
```

This will **not** work at all, and so should be avoided:

```python
>>> pd.set_option('mode.chained_assignment','raise')
>>> dfc.loc[0]['A'] = 1111
Traceback (most recent call last)
     ...
SettingWithCopyException:
     A value is trying to be set on a copy of a slice from a DataFrame.
     Try using .loc[row_index,col_indexer] = value instead
```

<div class="warning-warp">
<b>警告</b><p>The chained assignment warnings / exceptions are aiming to inform the user of a possibly invalid assignment. There may be false positives; situations where a chained assignment is inadvertently reported.</p>
</div>