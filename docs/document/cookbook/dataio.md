# 数据输入输出(dataio)

[Performance comparison of SQL vs HDF5](http://stackoverflow.com/questions/16628329/hdf5-and-sqlite-concurrency-compression-i-o-performance)

## CSV

The [CSV](http://pandas.pydata.org/pandas-docs/stable/io.html#io-read-csv-table) docs

[read_csv in action](http://wesmckinney.com/blog/update-on-upcoming-pandas-v0-10-new-file-parser-other-performance-wins/)

[appending to a csv](http://stackoverflow.com/questions/17134942/pandas-dataframe-output-end-of-csv)

[Reading a csv chunk-by-chunk](http://stackoverflow.com/questions/11622652/large-persistent-dataframe-in-pandas/12193309#12193309)

[Reading only certain rows of a csv chunk-by-chunk](http://stackoverflow.com/questions/19674212/pandas-data-frame-select-rows-and-clear-memory)

[Reading the first few lines of a frame](http://stackoverflow.com/questions/15008970/way-to-read-first-few-lines-for-pandas-dataframe)

Reading a file that is compressed but not by ``gzip/bz2`` (the native compressed formats which ``read_csv`` understands). This example shows a ``WinZipped`` file, but is a general application of opening the file within a context manager and using that handle to read. [See here](http://stackoverflow.com/questions/17789907/pandas-convert-winzipped-csv-file-to-data-frame)

[Inferring dtypes from a file](http://stackoverflow.com/questions/15555005/get-inferred-dataframe-types-iteratively-using-chunksize)

[Dealing with bad lines](http://github.com/pandas-dev/pandas/issues/2886)

[Dealing with bad lines II](http://nipunbatra.github.io/2013/06/reading-unclean-data-csv-using-pandas/)

[Reading CSV with Unix timestamps and converting to local timezone](http://nipunbatra.github.io/2013/06/pandas-reading-csv-with-unix-timestamps-and-converting-to-local-timezone/)

[Write a multi-row index CSV without writing duplicates](http://stackoverflow.com/questions/17349574/pandas-write-multiindex-rows-with-to-csv)

### Reading multiple files to create a single DataFrame

The best way to combine multiple files into a single DataFrame is to read the individual frames one by one, put all of the individual frames into a list, and then combine the frames in the list using pd.concat():

```python
In [159]: for i in range(3):
   .....:     data = pd.DataFrame(np.random.randn(10, 4))
   .....:     data.to_csv('file_{}.csv'.format(i))
   .....: 

In [160]: files = ['file_0.csv', 'file_1.csv', 'file_2.csv']

In [161]: result = pd.concat([pd.read_csv(f) for f in files], ignore_index=True)
```

You can use the same approach to read all files matching a pattern. Here is an example using glob:

```python
In [162]: import glob

In [163]: files = glob.glob('file_*.csv')

In [164]: result = pd.concat([pd.read_csv(f) for f in files], ignore_index=True)
```

Finally, this strategy will work with the other pd.read_*(...) functions described in the io docs.

### Parsing date components in multi-columns

Parsing date components in multi-columns is faster with a format

```python
In [30]: i = pd.date_range('20000101',periods=10000)

In [31]: df = pd.DataFrame(dict(year = i.year, month = i.month, day = i.day))

In [32]: df.head()
Out[32]:
   day  month  year
0    1      1  2000
1    2      1  2000
2    3      1  2000
3    4      1  2000
4    5      1  2000

In [33]: %timeit pd.to_datetime(df.year*10000+df.month*100+df.day,format='%Y%m%d')
100 loops, best of 3: 7.08 ms per loop

# simulate combinging into a string, then parsing
In [34]: ds = df.apply(lambda x: "%04d%02d%02d" % (x['year'],x['month'],x['day']),axis=1)

In [35]: ds.head()
Out[35]:
0    20000101
1    20000102
2    20000103
3    20000104
4    20000105
dtype: object

In [36]: %timeit pd.to_datetime(ds)
1 loops, best of 3: 488 ms per loop
```

### Skip row between header and data

```python
In [165]: data = """;;;;
   .....:  ;;;;
   .....:  ;;;;
   .....:  ;;;;
   .....:  ;;;;
   .....:  ;;;;
   .....: ;;;;
   .....:  ;;;;
   .....:  ;;;;
   .....: ;;;;
   .....: date;Param1;Param2;Param4;Param5
   .....:     ;m²;°C;m²;m
   .....: ;;;;
   .....: 01.01.1990 00:00;1;1;2;3
   .....: 01.01.1990 01:00;5;3;4;5
   .....: 01.01.1990 02:00;9;5;6;7
   .....: 01.01.1990 03:00;13;7;8;9
   .....: 01.01.1990 04:00;17;9;10;11
   .....: 01.01.1990 05:00;21;11;12;13
   .....: """
   .....: 
```

### Option 1: pass rows explicitly to skiprows

```python
In [166]: pd.read_csv(StringIO(data), sep=';', skiprows=[11,12],
   .....:         index_col=0, parse_dates=True, header=10)
   .....: 
Out[166]: 
                     Param1  Param2  Param4  Param5
date                                               
1990-01-01 00:00:00       1       1       2       3
1990-01-01 01:00:00       5       3       4       5
1990-01-01 02:00:00       9       5       6       7
1990-01-01 03:00:00      13       7       8       9
1990-01-01 04:00:00      17       9      10      11
1990-01-01 05:00:00      21      11      12      13
```

### Option 2: read column names and then data

```python
In [167]: pd.read_csv(StringIO(data), sep=';', header=10, nrows=10).columns
Out[167]: Index(['date', 'Param1', 'Param2', 'Param4', 'Param5'], dtype='object')

In [168]: columns = pd.read_csv(StringIO(data), sep=';', header=10, nrows=10).columns

In [169]: pd.read_csv(StringIO(data), sep=';', index_col=0,
   .....:             header=12, parse_dates=True, names=columns)
   .....: 
Out[169]: 
                     Param1  Param2  Param4  Param5
date                                               
1990-01-01 00:00:00       1       1       2       3
1990-01-01 01:00:00       5       3       4       5
1990-01-01 02:00:00       9       5       6       7
1990-01-01 03:00:00      13       7       8       9
1990-01-01 04:00:00      17       9      10      11
1990-01-01 05:00:00      21      11      12      13
```

## SQL

The [SQL](http://pandas.pydata.org/pandas-docs/stable/io.html#io-sql) docs

[Reading from databases with SQL](http://stackoverflow.com/questions/10065051/python-pandas-and-databases-like-mysql)

## Excel

The [Excel](http://pandas.pydata.org/pandas-docs/stable/io.html#io-excel) docs

[Reading from a filelike handle](http://stackoverflow.com/questions/15588713/sheets-of-excel-workbook-from-a-url-into-a-pandas-dataframe)

[Modifying formatting in XlsxWriter output](http://pbpython.com/improve-pandas-excel-output.html)

## HTML

[Reading HTML tables from a server that cannot handle the default request header](http://stackoverflow.com/a/18939272/564538)

## HDFStore

The [HDFStores](http://pandas.pydata.org/pandas-docs/stable/io.html#io-hdf5) docs

[Simple Queries with a Timestamp Index](http://stackoverflow.com/questions/13926089/selecting-columns-from-pandas-hdfstore-table)

[Managing heterogeneous data using a linked multiple table hierarchy](http://github.com/pandas-dev/pandas/issues/3032)

[Merging on-disk tables with millions of rows](http://stackoverflow.com/questions/14614512/merging-two-tables-with-millions-of-rows-in-python/14617925#14617925)

[Avoiding inconsistencies when writing to a store from multiple processes/threads](http://stackoverflow.com/a/29014295/2858145)

De-duplicating a large store by chunks, essentially a recursive reduction operation. Shows a function for taking in data from csv file and creating a store by chunks, with date parsing as well. See here

[Creating a store chunk-by-chunk from a csv file](http://stackoverflow.com/questions/20428355/appending-column-to-frame-of-hdf-file-in-pandas/20428786#20428786)

[Appending to a store, while creating a unique index](http://stackoverflow.com/questions/16997048/how-does-one-append-large-amounts-of-data-to-a-pandas-hdfstore-and-get-a-natural/16999397#16999397)

[Large Data work flows](http://stackoverflow.com/questions/14262433/large-data-work-flows-using-pandas)

[Reading in a sequence of files, then providing a global unique index to a store while appending](http://stackoverflow.com/questions/16997048/how-does-one-append-large-amounts-of-data-to-a-pandas-hdfstore-and-get-a-natural)

[Groupby on a HDFStore with low group density](http://stackoverflow.com/questions/15798209/pandas-group-by-query-on-large-data-in-hdfstore)

[Groupby on a HDFStore with high group density](http://stackoverflow.com/questions/25459982/trouble-with-grouby-on-millions-of-keys-on-a-chunked-file-in-python-pandas/25471765#25471765)

[Hierarchical queries on a HDFStore](http://stackoverflow.com/questions/22777284/improve-query-performance-from-a-large-hdfstore-table-with-pandas/22820780#22820780)

[Counting with a HDFStore](http://stackoverflow.com/questions/20497897/converting-dict-of-dicts-into-pandas-dataframe-memory-issues)

[Troubleshoot HDFStore exceptions](http://stackoverflow.com/questions/15488809/how-to-trouble-shoot-hdfstore-exception-cannot-find-the-correct-atom-type)

[Setting min_itemsize with strings](http://stackoverflow.com/questions/15988871/hdfstore-appendstring-dataframe-fails-when-string-column-contents-are-longer)

[Using ptrepack to create a completely-sorted-index on a store](http://stackoverflow.com/questions/17893370/ptrepack-sortby-needs-full-index)

Storing Attributes to a group node

```python
In [170]: df = pd.DataFrame(np.random.randn(8,3))

In [171]: store = pd.HDFStore('test.h5')

In [172]: store.put('df',df)

# you can store an arbitrary Python object via pickle
In [173]: store.get_storer('df').attrs.my_attribute = dict(A = 10)

In [174]: store.get_storer('df').attrs.my_attribute
Out[174]: {'A': 10}
```

## Binary Files

pandas readily accepts NumPy record arrays, if you need to read in a binary file consisting of an array of C structs. For example, given this C program in a file called main.c compiled with gcc main.c -std=gnu99 on a 64-bit machine,

```c
#include <stdio.h>
#include <stdint.h>

typedef struct _Data
{
    int32_t count;
    double avg;
    float scale;
} Data;

int main(int argc, const char *argv[])
{
    size_t n = 10;
    Data d[n];

    for (int i = 0; i < n; ++i)
    {
        d[i].count = i;
        d[i].avg = i + 1.0;
        d[i].scale = (float) i + 2.0f;
    }

    FILE *file = fopen("binary.dat", "wb");
    fwrite(&d, sizeof(Data), n, file);
    fclose(file);

    return 0;
}
```

the following Python code will read the binary file 'binary.dat' into a pandas DataFrame, where each element of the struct corresponds to a column in the frame:

```python
names = 'count', 'avg', 'scale'

# note that the offsets are larger than the size of the type because of
# struct padding
offsets = 0, 8, 16
formats = 'i4', 'f8', 'f4'
dt = np.dtype({'names': names, 'offsets': offsets, 'formats': formats},
              align=True)
df = pd.DataFrame(np.fromfile('binary.dat', dt))
```

**Note**：The offsets of the structure elements may be different depending on the architecture of the machine on which the file was created. Using a raw binary file format like this for general data storage is not recommended, as it is not cross platform. We recommended either HDF5 or msgpack, both of which are supported by pandas’ IO facilities.
