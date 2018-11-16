# 给文档做贡献

Contributing to the documentation benefits everyone who uses pandas. We encourage you to help us improve the documentation, and you don’t have to be an expert on pandas to do so! In fact, there are sections of the docs that are worse off after being written by experts. If something in the docs doesn’t make sense to you, updating the relevant section after you figure it out is a great way to ensure it will help the next person.

Documentation:

- About the pandas documentation
- How to build the pandas documentation
    - Requirements
    - Building the documentation
    - Building master branch documentation

## About the pandas documentation

The documentation is written in **reStructuredText**, which is almost like writing in plain English, and built using [Sphinx](http://sphinx.pocoo.org/). The Sphinx Documentation has an excellent [introduction to reST](http://sphinx.pocoo.org/rest.html). Review the Sphinx docs to perform more complex changes to the documentation as well.

Some other important things to know about the docs:

- The pandas documentation consists of two parts: the docstrings in the code itself and the docs in this folder pandas/doc/.

The docstrings provide a clear explanation of the usage of the individual functions, while the documentation in this folder consists of tutorial-like overviews per topic together with some other information (what’s new, installation, etc).

- The docstrings follow a pandas convention, based on the Numpy Docstring Standard. Follow the pandas docstring guide for detailed instructions on how to write a correct docstring.

pandas docstring guide
About docstrings and standards
Writing a docstring
Sharing Docstrings

- The tutorials make heavy use of the ipython directive sphinx extension. This directive lets you put code in the documentation which will be run during the doc build. For example:

```python
.. ipython:: python

    x = 2
    x**3
```

will be rendered as:

```python
In [1]: x = 2

In [2]: x**3
Out[2]: 8
```

Almost all code examples in the docs are run (and the output saved) during the doc build. This approach means that code examples will always be up to date, but it does make the doc building a bit more complex.

- Our API documentation in doc/source/api.rst houses the auto-generated documentation from the docstrings. For classes, there are a few subtleties around controlling which methods and attributes have pages auto-generated.

We have two autosummary templates for classes.

1. _templates/autosummary/class.rst. Use this when you want to automatically generate a page for every public method and attribute on the class. The Attributes and Methods sections will be automatically added to the class’ rendered documentation by numpydoc. See DataFrame for an example.

1. _templates/autosummary/class_without_autosummary. Use this when you want to pick a subset of methods / attributes to auto-generate pages for. When using this template, you should include an Attributes and Methods section in the class docstring. See CategoricalIndex for an example.

Every method should be included in a toctree in api.rst, else Sphinx will emit a warning.

**Note**：The .rst files are used to automatically generate Markdown and HTML versions of the docs. For this reason, please do not edit CONTRIBUTING.md directly, but instead make any changes to doc/source/contributing.rst. Then, to generate CONTRIBUTING.md, use [pandoc](http://johnmacfarlane.net/pandoc/) with the following command:

```sh
pandoc doc/source/contributing.rst -t markdown_github > CONTRIBUTING.md
```

The utility script scripts/validate_docstrings.py can be used to get a csv summary of the API documentation. And also validate common errors in the docstring of a specific class, function or method. The summary also compares the list of methods documented in doc/source/api.rst (which is used to generate the [API Reference](http://pandas.pydata.org/pandas-docs/stable/api.html) page) and the actual public methods. This will identify methods documented in doc/source/api.rst that are not actually class methods, and existing methods that are not documented in doc/source/api.rst.

## How to build the pandas documentation

### Requirements

First, you need to have a development environment to be able to build pandas (see the docs on creating a development environment above).

### Building the documentation

So how do you build the docs? Navigate to your local pandas/doc/ directory in the console and run:

```sh
python make.py html
```

Then you can find the HTML output in the folder pandas/doc/build/html/.

The first time you build the docs, it will take quite a while because it has to run all the code examples and build all the generated docstring pages. In subsequent evocations, sphinx will try to only build the pages that have been modified.

If you want to do a full clean build, do:

```sh
python make.py clean
python make.py html
```

You can tell make.py to compile only a single section of the docs, greatly reducing the turn-around time for checking your changes.

```sh
# omit autosummary and API section
python make.py clean
python make.py --no-api

# compile the docs with only a single
# section, that which is in indexing.rst
python make.py clean
python make.py --single indexing

# compile the reference docs for a single function
python make.py clean
python make.py --single DataFrame.join
```

For comparison, a full documentation build may take 15 minutes, but a single section may take 15 seconds. Subsequent builds, which only process portions you have changed, will be faster.

You can also specify to use multiple cores to speed up the documentation build:

```sh
python make.py html --num-jobs 4
```

Open the following file in a web browser to see the full documentation you just built:

```sh
pandas/docs/build/html/index.html
```

And you’ll have the satisfaction of seeing your new and improved documentation!

### Building master branch documentation

When pull requests are merged into the pandas master branch, the main parts of the documentation are also built by Travis-CI. These docs are then hosted [here](http://pandas-docs.github.io/pandas-docs-travis), see also the [Continuous Integration](http://pandas.pydata.org/pandas-docs/stable/contributing.html#contributing-ci) section.