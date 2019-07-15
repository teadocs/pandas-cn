# 在Python/IPython环境中设置启动选项

Using startup scripts for the python/ipython environment to import Pandas and set options makes working with Pandas more efficient. To do this, create a .py or .ipy script in the startup directory of the desired profile. An example where the startup folder is in a default ipython profile can be found at:

```sh
$IPYTHONDIR/profile_default/startup
```

More information can be found in the [ipython documentation](http://ipython.org/ipython-doc/stable/interactive/tutorial.html#startup-files). An example startup script for Pandas is displayed below:

```python
import Pandas as pd
pd.set_option('display.max_rows', 999)
pd.set_option('precision', 5)
```