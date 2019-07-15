# 方法总览

Method方法 | 描述 | Description
---|---|---
[cat()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Series.str.cat.html#Pandas.Series.str.cat) | 拼接字符串 | Concatenate strings
[split()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Series.str.split.html#Pandas.Series.str.split) | 基于分隔符切分字符串 | Split strings on delimiter
[rsplit()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Series.str.rsplit.html#Pandas.Series.str.rsplit) | 基于分隔符，逆向切分字符串 | Split strings on delimiter working from the end of the string
[get()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Series.str.get.html#Pandas.Series.str.get) | 索引每一个元素（返回第i个元素） | Index into each element (retrieve i-th element)
[join()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Series.str.join.html#Pandas.Series.str.join) | 使用传入的分隔符依次拼接每一个元素 | Join strings in each element of the Series with passed separator
[get_dummies()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Series.str.get_dummies.html#Pandas.Series.str.get_dummies) | 用分隔符切分字符串，并返回一个含有哑变量的数据表 | Split strings on the delimiter returning DataFrame of dummy variables
[contains()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Series.str.contains.html#Pandas.Series.str.contains) | 返回一个布尔矩阵表明是每个元素包含字符串或正则表达式 | Return boolean array if each string contains pattern/regex
[replace()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Series.str.replace.html#Pandas.Series.str.replace) | 将匹配到的子串或正则表达式替换为另外的字符串，或者一个可调用对象的返回值 | Replace occurrences of pattern/regex/string with some other string or the return value of a callable given the occurrence
[repeat()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Series.str.repeat.html#Pandas.Series.str.repeat) | 值复制（s.str.repeat(3)等价于x * 3） | Duplicate values (s.str.repeat(3) equivalent to x * 3)
[pad()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Series.str.pad.html#Pandas.Series.str.pad) | 将白空格插入到字符串的左、右或者两端 | Add whitespace to left, right, or both sides of strings
[center()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Series.str.center.html#Pandas.Series.str.center) | 等价于``str.center`` | Equivalent to str.center
[ljust()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Series.str.ljust.html#Pandas.Series.str.ljust) | 等价于``str.ljust`` | Equivalent to str.ljust
[rjust()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Series.str.rjust.html#Pandas.Series.str.rjust) | 等价于``str.rjust`` | Equivalent to str.rjust
[zfill()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Series.str.zfill.html#Pandas.Series.str.zfill) | 等价于``str.zfill`` | Equivalent to str.zfill
[wrap()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Series.str.wrap.html#Pandas.Series.str.wrap) | 将长字符串转换为 | Split long strings into lines with length less than a given width
[slice()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Series.str.slice.html#Pandas.Series.str.slice) | 将序列中的每一个字符串切片 | Slice each string in the Series
[slice_replace()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Series.str.slice_replace.html#Pandas.Series.str.slice_replace) | 用传入的值替换每一个字串中的切片 | Replace slice in each string with passed value
[count()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Series.str.count.html#Pandas.Series.str.count) | 对出现符合的规则进行计数 | Count occurrences of pattern
[startswith()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Series.str.startswith.html#Pandas.Series.str.startswith) | 等价于``str.startswith(pat)`` | Equivalent to str.startswith(pat) for each element
[endswith()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Series.str.endswith.html#Pandas.Series.str.endswith) | 等价于 ``str.endswith(pat)`` | Equivalent to str.endswith(pat) for each element
[findall()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Series.str.findall.html#Pandas.Series.str.findall) | 返回每一个字串中出现的所有满足样式或正则的匹配 | Compute list of all occurrences of pattern/regex for each string
[match()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Series.str.match.html#Pandas.Series.str.match) | 对每一个元素调用 ``re.match``，并以列表形式返回匹配到的组 | Call re.match on each element, returning matched groups as list
[extract()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Series.str.extract.html#Pandas.Series.str.extract) | 对每一个元素调用 ``re.search``, 并以数据表的形式返回。行对应原有的一个元素，列对应所有捕获的组 | Call re.search on each element, returning DataFrame with one row for each element and one column for each regex capture group
[extractall()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Series.str.extractall.html#Pandas.Series.str.extractall) | 对每一个元素调用 ``re.findall``, 并以数据表的形式返回。行对应原有的一个元素，列对应所有捕获的组| Call re.findall on each element, returning DataFrame with one row for each match and one column for each regex capture group
[len()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Series.str.len.html#Pandas.Series.str.len) | 计算字符串长度 | Compute string lengths
[strip()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Series.str.strip.html#Pandas.Series.str.strip) | 等价于``str.strip`` | Equivalent to str.strip
[rstrip()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Series.str.rstrip.html#Pandas.Series.str.rstrip) | 等价于``str.rstrip`` | Equivalent to str.rstrip
[lstrip()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Series.str.lstrip.html#Pandas.Series.str.lstrip) | 等价于``str.lstrip``  | Equivalent to str.lstrip
[partition()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Series.str.partition.html#Pandas.Series.str.partition) | 等价于 ``str.partition`` | Equivalent to str.partition
[rpartition()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Series.str.rpartition.html#Pandas.Series.str.rpartition) | 等价于 ``str.rpartition`` | Equivalent to str.rpartition
[lower()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Series.str.lower.html#Pandas.Series.str.lower) | 等价于 ``str.lower`` | Equivalent to str.lower
[upper()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Series.str.upper.html#Pandas.Series.str.upper) | 等价于 ``str.upper``  | Equivalent to str.upper
[find()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Series.str.find.html#Pandas.Series.str.find) | 等价于 ``str.find``  | Equivalent to str.find
[rfind()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Series.str.rfind.html#Pandas.Series.str.rfind) | 等价于 ``str.rfind``   | Equivalent to str.rfind
[index()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Series.str.index.html#Pandas.Series.str.index) | 等价于 ``str.index``   | Equivalent to str.index
[rindex()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Series.str.rindex.html#Pandas.Series.str.rindex) | 等价于 ``str.rindex``   | Equivalent to str.rindex
[capitalize()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Series.str.capitalize.html#Pandas.Series.str.capitalize) | 等价于 ``str.capitalize``   | Equivalent to str.capitalize
[swapcase()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Series.str.swapcase.html#Pandas.Series.str.swapcase) | 等价于 ``str.swapcase`` | Equivalent to str.swapcase
[normalize()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Series.str.normalize.html#Pandas.Series.str.normalize) | 返回Unicode 标注格式。等价于 unicodedata.normalize | Return Unicode normal form. Equivalent to unicodedata.normalize
[translate()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Series.str.translate.html#Pandas.Series.str.translate) | 等价于 ``str.translate``  | Equivalent to str.translate
[isalnum()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Series.str.isalnum.html#Pandas.Series.str.isalnum) | 等价于 ``str.isalnum``  | Equivalent to str.isalnum
[isalpha()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Series.str.isalpha.html#Pandas.Series.str.isalpha) | 等价于 ``str.isalpha``  | Equivalent to str.isalpha
[isdigit()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Series.str.isdigit.html#Pandas.Series.str.isdigit) | 等价于 ``str.isdigit``  | Equivalent to str.isdigit
[isspace()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Series.str.isspace.html#Pandas.Series.str.isspace) | 等价于 ``str.isspace``  | Equivalent to str.isspace
[islower()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Series.str.islower.html#Pandas.Series.str.islower) | 等价于 ``str.islower``  | Equivalent to str.islower
[isupper()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Series.str.isupper.html#Pandas.Series.str.isupper) | 等价于 ``str.isupper``  | Equivalent to str.isupper
[istitle()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Series.str.istitle.html#Pandas.Series.str.istitle) | 等价于 ``str.istitle``  | Equivalent to str.istitle
[isnumeric()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Series.str.isnumeric.html#Pandas.Series.str.isnumeric) | 等价于 ``str.isnumeric``  | Equivalent to str.isnumeric
[isdecimal()](http://Pandas.pydata.org/Pandas-docs/stable/generated/Pandas.Series.str.isdecimal.html#Pandas.Series.str.isdecimal) | 等价于 ``str.isdecimal``  | Equivalent to str.isdecimal
