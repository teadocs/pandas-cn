# 方法总览

Method方法 | 描述 | Description
---|---|---
[cat()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.cat.html#pandas.Series.str.cat) | 拼接字符串 | Concatenate strings
[split()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.split.html#pandas.Series.str.split) | 基于分隔符切分字符串 | Split strings on delimiter
[rsplit()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.rsplit.html#pandas.Series.str.rsplit) | 基于分隔符，逆向切分字符串 | Split strings on delimiter working from the end of the string
[get()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.get.html#pandas.Series.str.get) | 索引每一个元素（返回第i个元素） | Index into each element (retrieve i-th element)
[join()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.join.html#pandas.Series.str.join) | 使用传入的分隔符依次拼接每一个元素 | Join strings in each element of the Series with passed separator
[get_dummies()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.get_dummies.html#pandas.Series.str.get_dummies) | 用分隔符切分字符串，并返回一个含有哑变量的数据表 | Split strings on the delimiter returning DataFrame of dummy variables
[contains()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.contains.html#pandas.Series.str.contains) | 返回一个布尔矩阵表明是每个元素包含字符串或正则表达式 | Return boolean array if each string contains pattern/regex
[replace()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.replace.html#pandas.Series.str.replace) | 将匹配到的子串或正则表达式替换为另外的字符串，或者一个可调用对象的返回值 | Replace occurrences of pattern/regex/string with some other string or the return value of a callable given the occurrence
[repeat()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.repeat.html#pandas.Series.str.repeat) | 值复制（s.str.repeat(3)等价于x * 3） | Duplicate values (s.str.repeat(3) equivalent to x * 3)
[pad()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.pad.html#pandas.Series.str.pad) | 将白空格插入到字符串的左、右或者两端 | Add whitespace to left, right, or both sides of strings
[center()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.center.html#pandas.Series.str.center) | 等价于``str.center`` | Equivalent to str.center
[ljust()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.ljust.html#pandas.Series.str.ljust) | 等价于``str.ljust`` | Equivalent to str.ljust
[rjust()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.rjust.html#pandas.Series.str.rjust) | 等价于``str.rjust`` | Equivalent to str.rjust
[zfill()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.zfill.html#pandas.Series.str.zfill) | 等价于``str.zfill`` | Equivalent to str.zfill
[wrap()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.wrap.html#pandas.Series.str.wrap) | 将长字符串转换为 | Split long strings into lines with length less than a given width
[slice()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.slice.html#pandas.Series.str.slice) | 将序列中的每一个字符串切片 | Slice each string in the Series
[slice_replace()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.slice_replace.html#pandas.Series.str.slice_replace) | 用传入的值替换每一个字串中的切片 | Replace slice in each string with passed value
[count()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.count.html#pandas.Series.str.count) | 对出现符合的规则进行计数 | Count occurrences of pattern
[startswith()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.startswith.html#pandas.Series.str.startswith) | 等价于``str.startswith(pat)`` | Equivalent to str.startswith(pat) for each element
[endswith()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.endswith.html#pandas.Series.str.endswith) | 等价于 ``str.endswith(pat)`` | Equivalent to str.endswith(pat) for each element
[findall()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.findall.html#pandas.Series.str.findall) | 返回每一个字串中出现的所有满足样式或正则的匹配 | Compute list of all occurrences of pattern/regex for each string
[match()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.match.html#pandas.Series.str.match) | 对每一个元素调用 ``re.match``，并以列表形式返回匹配到的组 | Call re.match on each element, returning matched groups as list
[extract()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.extract.html#pandas.Series.str.extract) | 对每一个元素调用 ``re.search``, 并以数据表的形式返回。行对应原有的一个元素，列对应所有捕获的组 | Call re.search on each element, returning DataFrame with one row for each element and one column for each regex capture group
[extractall()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.extractall.html#pandas.Series.str.extractall) | 对每一个元素调用 ``re.findall``, 并以数据表的形式返回。行对应原有的一个元素，列对应所有捕获的组| Call re.findall on each element, returning DataFrame with one row for each match and one column for each regex capture group
[len()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.len.html#pandas.Series.str.len) | 计算字符串长度 | Compute string lengths
[strip()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.strip.html#pandas.Series.str.strip) | 等价于``str.strip`` | Equivalent to str.strip
[rstrip()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.rstrip.html#pandas.Series.str.rstrip) | 等价于``str.rstrip`` | Equivalent to str.rstrip
[lstrip()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.lstrip.html#pandas.Series.str.lstrip) | 等价于``str.lstrip``  | Equivalent to str.lstrip
[partition()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.partition.html#pandas.Series.str.partition) | 等价于 ``str.partition`` | Equivalent to str.partition
[rpartition()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.rpartition.html#pandas.Series.str.rpartition) | 等价于 ``str.rpartition`` | Equivalent to str.rpartition
[lower()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.lower.html#pandas.Series.str.lower) | 等价于 ``str.lower`` | Equivalent to str.lower
[upper()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.upper.html#pandas.Series.str.upper) | 等价于 ``str.upper``  | Equivalent to str.upper
[find()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.find.html#pandas.Series.str.find) | 等价于 ``str.find``  | Equivalent to str.find
[rfind()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.rfind.html#pandas.Series.str.rfind) | 等价于 ``str.rfind``   | Equivalent to str.rfind
[index()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.index.html#pandas.Series.str.index) | 等价于 ``str.index``   | Equivalent to str.index
[rindex()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.rindex.html#pandas.Series.str.rindex) | 等价于 ``str.rindex``   | Equivalent to str.rindex
[capitalize()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.capitalize.html#pandas.Series.str.capitalize) | 等价于 ``str.capitalize``   | Equivalent to str.capitalize
[swapcase()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.swapcase.html#pandas.Series.str.swapcase) | 等价于 ``str.swapcase`` | Equivalent to str.swapcase
[normalize()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.normalize.html#pandas.Series.str.normalize) | 返回Unicode 标注格式。等价于 unicodedata.normalize | Return Unicode normal form. Equivalent to unicodedata.normalize
[translate()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.translate.html#pandas.Series.str.translate) | 等价于 ``str.translate``  | Equivalent to str.translate
[isalnum()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.isalnum.html#pandas.Series.str.isalnum) | 等价于 ``str.isalnum``  | Equivalent to str.isalnum
[isalpha()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.isalpha.html#pandas.Series.str.isalpha) | 等价于 ``str.isalpha``  | Equivalent to str.isalpha
[isdigit()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.isdigit.html#pandas.Series.str.isdigit) | 等价于 ``str.isdigit``  | Equivalent to str.isdigit
[isspace()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.isspace.html#pandas.Series.str.isspace) | 等价于 ``str.isspace``  | Equivalent to str.isspace
[islower()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.islower.html#pandas.Series.str.islower) | 等价于 ``str.islower``  | Equivalent to str.islower
[isupper()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.isupper.html#pandas.Series.str.isupper) | 等价于 ``str.isupper``  | Equivalent to str.isupper
[istitle()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.istitle.html#pandas.Series.str.istitle) | 等价于 ``str.istitle``  | Equivalent to str.istitle
[isnumeric()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.isnumeric.html#pandas.Series.str.isnumeric) | 等价于 ``str.isnumeric``  | Equivalent to str.isnumeric
[isdecimal()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.isdecimal.html#pandas.Series.str.isdecimal) | 等价于 ``str.isdecimal``  | Equivalent to str.isdecimal
