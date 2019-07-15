# IO工具(文本，CSV，HDF5，…)

Pandas 的 I/O API 是一组顶级的读取器函数，可以像 [Pandas.read_csv()](https://Pandas.pydata.org/Pandas-docs/stable/reference/api/Pandas.read_csv.html#Pandas.read_csv) 一样访问它们，它们通常返回一个Pandas对象。相应的写入器函数是对象方法，可以像 [DataFrame.to_csv()](https://Pandas.pydata.org/Pandas-docs/stable/reference/api/Pandas.DataFrame.to_csv.html#Pandas.DataFrame.to_csv) 一样访问它们。下表列出了可用的读取器和写入器。

Format Type | Data Description | Reader | Writer
---|---|---|---
text | CSV | read_csv | to_csv
text | JSON | read_json | to_json
text | HTML | read_html | to_html
text | Local clipboard | read_clipboard | to_clipboard
binary | MS Excel | read_excel | to_excel
binary | HDF5 Format | read_hdf | to_hdf
binary | Feather Format | read_feather | to_feather
binary | Parquet Format | read_parquet | to_parquet
binary | Msgpack | read_msgpack | to_msgpack
binary | Stata | read_stata | to_stata
binary | SAS | read_sas |  
binary | Python Pickle Format | read_pickle | to_pickle
SQL | SQL | read_sql | to_sql
SQL | Google Big Query | read_gbq | to_gbq

[以下](https://Pandas.pydata.org/Pandas-docs/stable/user_guide/io.html#io-perf)是其中一些IO方法的非正式性能比较。

**注意：** 对于使用StringIO类的示例，请确保根据您的Python版本进行导入，例如，对于Python2，从StringIO导入StringIO，对于Python3，从io导入StringIO。