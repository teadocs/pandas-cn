# 方法总结

Method | Description
---|---
[cat()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.cat.html#pandas.Series.str.cat) | Concatenate strings
[split()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.split.html#pandas.Series.str.split) | Split strings on delimiter
[rsplit()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.rsplit.html#pandas.Series.str.rsplit) | Split strings on delimiter working from the end of the string
[get()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.get.html#pandas.Series.str.get) | Index into each element (retrieve i-th element)
[join()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.join.html#pandas.Series.str.join) | Join strings in each element of the Series with passed separator
[get_dummies()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.get_dummies.html#pandas.Series.str.get_dummies) | Split strings on the delimiter returning DataFrame of dummy variables
[contains()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.contains.html#pandas.Series.str.contains) | Return boolean array if each string contains pattern/regex
[replace()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.replace.html#pandas.Series.str.replace) | Replace occurrences of pattern/regex/string with some other string or the return value of a callable given the occurrence
[repeat()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.repeat.html#pandas.Series.str.repeat) | Duplicate values (s.str.repeat(3) equivalent to x * 3)
[pad()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.pad.html#pandas.Series.str.pad) | Add whitespace to left, right, or both sides of strings
[center()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.center.html#pandas.Series.str.center) | Equivalent to str.center
[ljust()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.ljust.html#pandas.Series.str.ljust) | Equivalent to str.ljust
[rjust()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.rjust.html#pandas.Series.str.rjust) | Equivalent to str.rjust
[zfill()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.zfill.html#pandas.Series.str.zfill) | Equivalent to str.zfill
[wrap()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.wrap.html#pandas.Series.str.wrap) | Split long strings into lines with length less than a given width
[slice()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.slice.html#pandas.Series.str.slice) | Slice each string in the Series
[slice_replace()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.slice_replace.html#pandas.Series.str.slice_replace) | Replace slice in each string with passed value
[count()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.count.html#pandas.Series.str.count) | Count occurrences of pattern
[startswith()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.startswith.html#pandas.Series.str.startswith) | Equivalent to str.startswith(pat) for each element
[endswith()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.endswith.html#pandas.Series.str.endswith) | Equivalent to str.endswith(pat) for each element
[findall()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.findall.html#pandas.Series.str.findall) | Compute list of all occurrences of pattern/regex for each string
[match()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.match.html#pandas.Series.str.match) | Call re.match on each element, returning matched groups as list
[extract()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.extract.html#pandas.Series.str.extract) | Call re.search on each element, returning DataFrame with one row for each element and one column for each regex capture group
[extractall()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.extractall.html#pandas.Series.str.extractall) | Call re.findall on each element, returning DataFrame with one row for each match and one column for each regex capture group
[len()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.len.html#pandas.Series.str.len) | Compute string lengths
[strip()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.strip.html#pandas.Series.str.strip) | Equivalent to str.strip
[rstrip()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.rstrip.html#pandas.Series.str.rstrip) | Equivalent to str.rstrip
[lstrip()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.lstrip.html#pandas.Series.str.lstrip) | Equivalent to str.lstrip
[partition()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.partition.html#pandas.Series.str.partition) | Equivalent to str.partition
[rpartition()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.rpartition.html#pandas.Series.str.rpartition) | Equivalent to str.rpartition
[lower()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.lower.html#pandas.Series.str.lower) | Equivalent to str.lower
[upper()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.upper.html#pandas.Series.str.upper) | Equivalent to str.upper
[find()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.find.html#pandas.Series.str.find) | Equivalent to str.find
[rfind()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.rfind.html#pandas.Series.str.rfind) | Equivalent to str.rfind
[index()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.index.html#pandas.Series.str.index) | Equivalent to str.index
[rindex()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.rindex.html#pandas.Series.str.rindex) | Equivalent to str.rindex
[capitalize()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.capitalize.html#pandas.Series.str.capitalize) | Equivalent to str.capitalize
[swapcase()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.swapcase.html#pandas.Series.str.swapcase) | Equivalent to str.swapcase
[normalize()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.normalize.html#pandas.Series.str.normalize) | Return Unicode normal form. Equivalent to unicodedata.normalize
[translate()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.translate.html#pandas.Series.str.translate) | Equivalent to str.translate
[isalnum()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.isalnum.html#pandas.Series.str.isalnum) | Equivalent to str.isalnum
[isalpha()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.isalpha.html#pandas.Series.str.isalpha) | Equivalent to str.isalpha
[isdigit()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.isdigit.html#pandas.Series.str.isdigit) | Equivalent to str.isdigit
[isspace()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.isspace.html#pandas.Series.str.isspace) | Equivalent to str.isspace
[islower()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.islower.html#pandas.Series.str.islower) | Equivalent to str.islower
[isupper()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.isupper.html#pandas.Series.str.isupper) | Equivalent to str.isupper
[istitle()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.istitle.html#pandas.Series.str.istitle) | Equivalent to str.istitle
[isnumeric()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.isnumeric.html#pandas.Series.str.isnumeric) | Equivalent to str.isnumeric
[isdecimal()](http://pandas.pydata.org/pandas-docs/stable/generated/pandas.Series.str.isdecimal.html#pandas.Series.str.isdecimal) | Equivalent to str.isdecimal