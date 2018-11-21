# Pandas 数据结构

我们将首先快速，非全面地概述 pandas 中的基本数据结构，以帮助您入门。关于数据类型，索引和轴标记/对齐的基本行为适用于所有对象。首先，导入NumPy并将pandas加载到命名空间中：

```python
In [1]: import numpy as np

In [2]: import pandas as pd
```

Here is a basic tenet to keep in mind: **data alignment is intrinsic**. The link between labels and data will not be broken unless done so explicitly by you.

We’ll give a brief intro to the data structures, then consider all of the broad categories of functionality and methods in separate sections.