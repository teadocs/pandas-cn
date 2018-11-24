# 表格架构显示

*New in version 0.20.0*.

``DataFrame`` and ``Series`` will publish a Table Schema representation by default. False by default, this can be enabled globally with the ``display.html.table_schema`` option:

```python
In [92]: pd.set_option('display.html.table_schema', True)
```

Only ``'display.max_rows'`` are serialized and published.   