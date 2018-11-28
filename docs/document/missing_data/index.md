# Pandas 处理丢失的数据

In this section, we will discuss missing (also referred to as NA) values in pandas.

**Note**: The choice of using NaN internally to denote missing data was largely for simplicity and performance reasons. It differs from the MaskedArray approach of, for example, scikits.timeseries. We are hopeful that NumPy will soon be able to provide a native NA type solution (similar to R) performant enough to be used in pandas.

See the [cookbook](/document/cookbook/index.html) for some advanced strategies.