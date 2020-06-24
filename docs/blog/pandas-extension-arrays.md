---
sidebarDepth: 3
sidebar: auto
meta:
  - name: keywords
    content: Pandas,扩展数组
  - name: description
    content: 在过去的几个版本中，可扩展性是 Pandas 一直在关注的一个主题。这篇文章介绍了 Pandas 扩展数组接口：它背后的动机以及它如何影响作为 Pandas 用户的你。最后，我们来看看扩展数组如何塑造 Pandas 的未来。
---

# Pandas 的扩展数组

**发布于：** 2019年1月4日星期五

**英文原文地址：** [https://dev.pandas.io/pandas-blog/pandas-extension-arrays.html](https://dev.pandas.io/pandas-blog/pandas-extension-arrays.html)

在过去的几个版本中，可扩展性是 Pandas 一直在关注的一个主题。这篇文章介绍了 Pandas 扩展数组接口：它背后的动机以及它如何影响作为 Pandas 用户的你。最后，我们来看看扩展数组如何塑造 Pandas 的未来。

扩展数组是 pandas 0.24.0 中的一个变更点。请参阅 [whatsnew](http://pandas.pydata.org/pandas-docs/version/0.24/whatsnew/v0.24.0.html) 以获取完整的更改日志。

## 动机

Pandas 是建立在 NumPy 之上开发的。您可以粗略地将 Series 理解为 NumPy 数组的包装器，将 DataFrame 定义为具有共享索引的 Series 的集合。由于几个原因，这并不完全正确，但我想专注于 “围绕NumPy数组的包装器” 部分。说 “围绕类似数组的对象包装” 更为正确。

Pandas主要使用NumPy的内置数据表示; 我们已将它限制在某些地方并将其扩展到其他地方。例如，Pandas 的早期用户非常关心 NumPy 不支持的时区感知日期时间的问题。所以 Pandas 在内部定义了一个 ``DatetimeTZ`` dtype（模仿NumPy dtype），并允许你在 ``Index``，``Series`` 中使用该 dtype，并在 ``DataFrame`` 中使用该列。 该dtype 带有 tzinfo，但本身并不是有效的 NumPy dtype。

作为另一个例子，考虑 ``Categorical``。这实际上由两个数组成：一个用于 ``categories``，另一个用于 ``codes``。但它可以像任何其他列一样存储在 ``DataFrame`` 中。

添加的每种扩展类型 Pandas 本身都很有用，但是维护成本很高。代码库的大部分需要知道如何处理 NumPy 数组或其他类型的特殊数组。这使得向 Pandas 添加新的扩展类型非常困难。

Anaconda 公司有一个客户，他经常用IP地址处理数据集。他们想知道向 Pandas 添加一个 [IPArray](https://github.com/pandas-dev/pandas/issues/18767) 类型是否有意义。最后，我们认为它没有通过 Pandas 本身的成本考量的要求，不过我们有兴趣为 Pandas 的第三方扩展定义一个接口。Pandas 中将允许任何实现此接口的对象。我可以在 Pandas 之外写 [cyberpandas](https://cyberpandas.readthedocs.io/)，但感觉就像使用 Pandas 内置的任何其他 dtype 一样方便。

## 当前状态

从 Pandas 0.24.0 开始，所有 pandas的内部扩展数组（Categorical，Datetime with Timezone，Period，Interval 和 Sparse）现在都构建在ExtensionArray 接口之上。用户不会注意到其产生的变化。但你会注意到的主要是在更少的地方将数据转换为 ``对象（object）`` dtype，这意味着你的代码运行得更快，你的类型会更稳定。这包括以 ``Series`` 方式存储 ``Period`` 和 ``Interval`` 数据（之前已转换为对象 dtype ）。

此外，我们将能够相对轻松地添加新的扩展数组。例如，0.24.0 版本（可选）解决了一个最长期存在的痛点：丢失值将 integer-dtype 值转换为 float。

``` python
>>> int_ser = pd.Series([1, 2], index=[0, 2])
>>> int_ser
0    1
2    2
dtype: int64

>>> int_ser.reindex([0, 1, 2])
0    1.0
1    NaN
2    2.0
dtype: float64
```

使用新的 [IntegerArray](http://pandas.pydata.org/pandas-docs/version/0.24/reference/api/pandas.arrays.IntegerArray.html) 和 可为空值的整数dtypes，我们可以原生地表示具有缺失值的整数数据。

``` python
>>> int_ser = pd.Series([1, 2], index=[0, 2], dtype=pd.Int64Dtype())
>>> int_ser
0    1
2    2
dtype: Int64

>>> int_ser.reindex([0, 1, 2])
0      1
1    NaN
2      2
dtype: Int64
```

有一点它会稍微改变你应该如何访问 Series 或 Index 中存储的原始（未标记）数组，这有时是很有用的。也许您调用的方法仅适用于NumPy数组，或者您可能希望禁用自动对齐。

在过去，您可能会听到 “使用 ``.values`` 从 ``Series`` 或 ``DataFrame`` 中提取 NumPy 数组 ” 之类的内容。如果它是一个很好的建议，他们会告诉你这不完全正确，因为有一些例外。我想深入研究这些例外情况。

``.values`` 的根本问题在于它有两个目的：

1. 提取支持 ``Series``、``Index`` 或 ``DataFrame`` 的数组。
1. 将 ``Series``、``Index`` 或 ``DataFrame`` 转换为 NumPy 数组。

如上所述，支持 ``Series`` 或 ``Index`` 的 “数组” 可能不是 NumPy 数组，它可能是扩展数组（来自pandas或第三方库）。例如，考虑一个``Categorical``，

``` python
>>> cat = pd.Categorical(['a', 'b', 'a'], categories=['a', 'b', 'c'])
>>> ser = pd.Series(cat)
>>> ser
0    a
1    b
2    a
dtype: category
Categories (3, object): [a, b, c]

>>> ser.values
[a, b, a]
Categories (3, object): [a, b, c]
```

在这种情况下，``.values`` 是一个分类，而不是 NumPy 数组。 对于 period-dtype 数据，``.values`` 返回 ``Period`` 对象的 NumPy 数组，创建起来很昂贵。对于时区感知数据，``.value`` 转换为UTC并删除时区信息。这些惊喜（不同类型，或昂贵或有损转换）源于试图将这些扩展数组装入 NumPy 数组。 但扩展数组的整个点是用于表示 NumPy 无法原生表示的数据。

为了解决 ``.values`` 问题，我们将其角色分为两个专用方法：

1. 使用 ``.array`` 获取对底层数据的零拷贝引用
1. 使用 ``.to_numpy()`` 来获得一个（可能是昂贵的，有损的）NumPy数据数组。

所以用我们的分类示例：

``` python
>>> ser.array
[a, b, a]
Categories (3, object): [a, b, c]

>>> ser.to_numpy()
array(['a', 'b', 'a'], dtype=object)
```

总结一下：

-  ``.array`` 将永远是一个 ExtensionArray ，并且始终是一个返回数据的零拷贝引用。
- ``.to_numpy()`` 总是一个NumPy数组，所以你可以可靠地调用特定于 ndarray 的方法。

你不应该再需要 ``.values`` 了。

## 可能的未来发展方向

Extension Arrays 开启了一些令人兴奋的机会。目前，pandas使用NumPy数组中的Python对象表示字符串数据，这很慢。像 [Apache Arrow](https://arrow.apache.org/) 这样的库为可变长度字符串提供原生支持，而 [Fletcher](https://github.com/xhochy/fletcher)库 为 Arrow数组提供了pandas扩展数组。 它将允许 [GeoPandas](https://github.com/geopandas/geopandas) 更有效地存储几何数据。 Pandas（或第三方库）将能够支持嵌套数据，包含单位的数据，地理数据，GPU阵列。 密切关注 [Pandas生态系统](http://pandas.pydata.org/pandas-docs/stable/ecosystem.html#extension-data-types) 页面，该页面将跟踪第三方扩展数组。这是Pandas发展有史以来的一个激动人心的时刻。

## 其他想法

我想强调这是一个接口，而不是具体的数组实现。我们不会在 Pandas 中重新实现NumPy。相反，这是一种采用任何类似数组的数据结构（一个或多个 NumPy 数组，一个Apache 箭头数组，一个 CuPy 数组）并将其放在 DataFrame 中的方法。我认为让 Pandas 摆脱数组这个结构本身，转而考虑更高级别的表格数据，这对项目来说是一个健康的发展。

这与 NumPy 的 [array_ufunc](https://docs.scipy.org/doc/numpy-1.13.0/neps/ufunc-overrides.html) 协议和 [NEP-18](https://www.numpy.org/neps/nep-0018-array-function-protocol.html) 完美配合。您将能够在不受 NumPy 内存支持的对象上使用熟悉的 NumPy API。

## 升级

这些新的好东西都可以在最近发布的 Pandas 0.24 版本中找到。

conda:

``` bash
conda install -c conda-forge pandas
```

pip:

``` bash
pip install --upgrade pandas
```

与往常一样，我们很高兴能够收到发给[邮件列表](https://mail.python.org/mailman/listinfo/pandas-dev)的邮件，以及[@pandas-dev](https://twitter.com/pandas_dev)或[问题跟踪器](https://github.com/pandas-dev/pandas/issues)的反馈。

感谢 Pandas 社区中的许多贡献者，维护者和[机构合作伙伴](https://github.com/pandas-dev/pandas-governance/blob/master/people.md)。
