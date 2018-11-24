# Unicode格式

<div class="warning-warp">
<b>警告</b><p>Enabling this option will affect the performance for printing of DataFrame and Series (about 2 times slower). Use only when it is actually required.</p>
</div>

Some East Asian countries use Unicode characters whose width corresponds to two Latin characters. If a DataFrame or Series contains these characters, the default output mode may not align them properly.

**Note**: Screen captures are attached for each output to show the actual results.

```python
In [84]: df = pd.DataFrame({u'国籍': ['UK', u'日本'], u'名前': ['Alice', u'しのぶ']})

In [85]: df;
```

![pandas unicode示例](/static/images/option_unicode01.png)

Enabling ``display.unicode.east_asian_width`` allows pandas to check each character’s “East Asian Width” property. These characters can be aligned properly by setting this option to True. However, this will result in longer render times than the standard len function.

```python
In [86]: pd.set_option('display.unicode.east_asian_width', True)

In [87]: df;
```

![pandas unicode示例2](/static/images/option_unicode02.png)

In addition, Unicode characters whose width is “Ambiguous” can either be 1 or 2 characters wide depending on the terminal setting or encoding. The option display.unicode.ambiguous_as_wide can be used to handle the ambiguity.

By default, an “Ambiguous” character’s width, such as “¡” (inverted exclamation) in the example below, is taken to be 1.

```python
In [88]: df = pd.DataFrame({'a': ['xxx', u'¡¡'], 'b': ['yyy', u'¡¡']})

In [89]: df;
```

![pandas unicode示例3](/static/images/option_unicode03.png)

Enabling ``display.unicode.ambiguous_as_wide`` makes pandas interpret these characters’ widths to be 2. (Note that this option will only be effective when ``display.unicode.east_asian_width`` is enabled.)

However, setting this option incorrectly for your terminal will cause these characters to be aligned incorrectly:

```python
In [90]: pd.set_option('display.unicode.ambiguous_as_wide', True)

In [91]: df;
```

![pandas unicode示例3](/static/images/option_unicode04.png)
