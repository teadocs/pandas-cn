# 给代码做贡献

目录：

- Code standards
    - C (cpplint)
    - Python (PEP8)
    - Backwards Compatibility
- Testing With Continuous Integration
- Test-driven development/code writing
    - Writing tests
    - Transitioning to pytest
    - Using pytest
- Running the test suite
- Running the performance test suite
- Documenting your code

## Code standards

Writing good code is not just about what you write. It is also about how you write it. During Continuous Integration testing, several tools will be run to check your code for stylistic errors. Generating any warnings will cause the test to fail. Thus, good style is a requirement for submitting code to pandas.

In addition, because a lot of people use our library, it is important that we do not make sudden changes to the code that could have the potential to break a lot of user code as a result, that is, we need it to be as backwards compatible as possible to avoid mass breakages.

Additional standards are outlined on the [code style wiki page](https://github.com/pandas-dev/pandas/wiki/Code-Style-and-Conventions).

## C (cpplint)

pandas uses the [Google](https://google.github.io/styleguide/cppguide.html) standard. Google provides an open source style checker called cpplint, but we use a fork of it that can be found [here](https://github.com/cpplint/cpplint). Here are some of the more common ``cpplint`` issues:

- we restrict line-length to 80 characters to promote readability
- every header file must include a header guard to avoid name collisions if re-included

[Continuous Integration](http://pandas.pydata.org/pandas-docs/stable/contributing.html#contributing-ci) will run the [cpplint](https://pypi.org/project/cpplint) tool and report any stylistic errors in your code. Therefore, it is helpful before submitting code to run the check yourself:

```sh
cpplint --extensions=c,h --headers=h --filter=-readability/casting,-runtime/int,-build/include_subdir modified-c-file
```

You can also run this command on an entire directory if necessary:

```sh
cpplint --extensions=c,h --headers=h --filter=-readability/casting,-runtime/int,-build/include_subdir --recursive modified-c-directory
```

To make your commits compliant with this standard, you can install the [ClangFormat](http://clang.llvm.org/docs/ClangFormat.html) tool, which can be downloaded [here](http://llvm.org/builds/). To configure, in your home directory, run the following command:

```sh
clang-format style=google -dump-config  > .clang-format
```

Then modify the file to ensure that any indentation width parameters are at least four. Once configured, you can run the tool as follows:

```sh
clang-format modified-c-file
```

This will output what your file will look like if the changes are made, and to apply them, run the following command:

```sh
clang-format -i modified-c-file
```

To run the tool on an entire directory, you can run the following analogous commands:

```sh
clang-format modified-c-directory/*.c modified-c-directory/*.h
clang-format -i modified-c-directory/*.c modified-c-directory/*.h
```

Do note that this tool is best-effort, meaning that it will try to correct as many errors as possible, but it may not correct all of them. Thus, it is recommended that you run cpplint to double check and make any other style fixes manually.


## Python (PEP8)

pandas uses the [PEP8](http://www.python.org/dev/peps/pep-0008/) standard. There are several tools to ensure you abide by this standard. Here are some of the more common PEP8 issues:

- we restrict line-length to 79 characters to promote readability
- passing arguments should have spaces after commas, e.g. foo(arg1, arg2, kw1='bar')

[Continuous Integration](http://pandas.pydata.org/pandas-docs/stable/contributing.html#contributing-ci) will run the [flake8](https://pypi.org/project/flake8) tool and report any stylistic errors in your code. Therefore, it is helpful before submitting code to run the check yourself on the diff:

```sh
git diff master -u -- "*.py" | flake8 --diff
```

This command will catch any stylistic errors in your changes specifically, but be beware it may not catch all of them. For example, if you delete the only usage of an imported function, it is stylistically incorrect to import an unused function. However, style-checking the diff will not catch this because the actual import is not part of the diff. Thus, for completeness, you should run this command, though it will take longer:

```sh
git diff master --name-only -- "*.py" | grep "pandas/" | xargs -r flake8
```

Note that on OSX, the -r flag is not available, so you have to omit it and run this slightly modified command:

```sh
git diff master --name-only -- "*.py" | grep "pandas/" | xargs flake8
```

Note that on Windows, these commands are unfortunately not possible because commands like grep and xargs are not available natively. To imitate the behavior with the commands above, you should run:

```sh
git diff master --name-only -- "*.py"
```

This will list all of the Python files that have been modified. The only ones that matter during linting are any whose directory filepath begins with “pandas.” For each filepath, copy and paste it after the flake8 command as shown below:

``flake8 <python-filepath>``

Alternatively, you can install the grep and xargs commands via the [MinGW](http://www.mingw.org/) toolchain, and it will allow you to run the commands above.

## Backwards Compatibility

Please try to maintain backward compatibility. pandas has lots of users with lots of existing code, so don’t break it if at all possible. If you think breakage is required, clearly state why as part of the pull request. Also, be careful when changing method signatures and add deprecation warnings where needed. Also, add the deprecated sphinx directive to the deprecated functions or methods.

If a function with the same arguments as the one being deprecated exist, you can use the ``pandas.util._decorators.deprecate``:

```python
from pandas.util._decorators import deprecate

deprecate('old_func', 'new_func', '0.21.0')
```

Otherwise, you need to do it manually:

```python
def old_func():
    """Summary of the function.

    .. deprecated:: 0.21.0
       Use new_func instead.
    """
    warnings.warn('Use new_func instead.', FutureWarning, stacklevel=2)
    new_func()
```

## Testing With Continuous Integration

The pandas test suite will run automatically on [Travis-CI](https://travis-ci.org/), Appveyor, and [Circle CI](https://circleci.com/) continuous integration services, once your pull request is submitted. However, if you wish to run the test suite on a branch prior to submitting the pull request, then the continuous integration services need to be hooked to your GitHub repository. Instructions are here for [Travis-CI](http://about.travis-ci.org/docs/user/getting-started/), [Appveyor](https://www.appveyor.com/docs/), and [CircleCI](https://circleci.com/).

A pull-request will be considered for merging when you have an all ‘green’ build. If any tests are failing, then you will get a red ‘X’, where you can click through to see the individual failed tests. This is an example of a green build.

![details](/static/images/ci.png)

**Note**：Each time you push to your fork, a new run of the tests will be triggered on the CI. Appveyor will auto-cancel any non-currently-running tests for that same pull-request. You can enable the auto-cancel feature for Travis-CI here and for CircleCI here.

## Test-driven development/code writing

pandas is serious about testing and strongly encourages contributors to embrace [test-driven development (TDD)](http://en.wikipedia.org/wiki/Test-driven_development). This development process “relies on the repetition of a very short development cycle: first the developer writes an (initially failing) automated test case that defines a desired improvement or new function, then produces the minimum amount of code to pass that test.” So, before actually writing any code, you should write your tests. Often the test can be taken from the original GitHub issue. However, it is always worth considering additional use cases and writing corresponding tests.

Adding tests is one of the most common requests after code is pushed to pandas. Therefore, it is worth getting in the habit of writing tests ahead of time so this is never an issue.

Like many packages, pandas uses [pytest](http://doc.pytest.org/en/latest/) and the convenient extensions in [numpy.testing](http://docs.scipy.org/doc/numpy/reference/routines.testing.html).

**Note**：The earliest supported pytest version is 3.1.0.

## Writing tests

All tests should go into the ``tests`` subdirectory of the specific package. This folder contains many current examples of tests, and we suggest looking to these for inspiration. If your test requires working with files or network connectivity, there is more information on the [testing page](https://github.com/pandas-dev/pandas/wiki/Testing) of the wiki.

The ``pandas.util.testing`` module has many special ``assert`` functions that make it easier to make statements about whether Series or DataFrame objects are equivalent. The easiest way to verify that your code is correct is to explicitly construct the result you expect, then compare the actual result to the expected correct result:

```python
def test_pivot(self):
    data = {
        'index' : ['A', 'B', 'C', 'C', 'B', 'A'],
        'columns' : ['One', 'One', 'One', 'Two', 'Two', 'Two'],
        'values' : [1., 2., 3., 3., 2., 1.]
    }

    frame = DataFrame(data)
    pivoted = frame.pivot(index='index', columns='columns', values='values')

    expected = DataFrame({
        'One' : {'A' : 1., 'B' : 2., 'C' : 3.},
        'Two' : {'A' : 1., 'B' : 2., 'C' : 3.}
    })

    assert_frame_equal(pivoted, expected)
```

## Transitioning to pytest

pandas existing test structure is mostly classed based, meaning that you will typically find tests wrapped in a class.

```python
class TestReallyCoolFeature(object):
    ....
```

Going forward, we are moving to a more functional style using the pytest framework, which offers a richer testing framework that will facilitate testing and developing. Thus, instead of writing test classes, we will write test functions like this:

```python
def test_really_cool_feature():
    ....
```

## Using pytest

Here is an example of a self-contained set of tests that illustrate multiple features that we like to use.

- functional style: tests are like test_* and only take arguments that are either fixtures or parameters
- pytest.mark can be used to set metadata on test functions, e.g. skip or xfail.
- using parametrize: allow testing of multiple cases
- to set a mark on a parameter, pytest.param(..., marks=...) syntax should be used
- fixture, code for object construction, on a per-test basis
- using bare assert for scalars and truth-testing
- tm.assert_series_equal (and its counter part tm.assert_frame_equal), for pandas object comparisons.
- the typical pattern of constructing an expected and comparing versus the result

We would name this file test_cool_feature.py and put in an appropriate place in the ``pandas/tests/`` structure.

```python
import pytest
import numpy as np
import pandas as pd
from pandas.util import testing as tm

@pytest.mark.parametrize('dtype', ['int8', 'int16', 'int32', 'int64'])
def test_dtypes(dtype):
    assert str(np.dtype(dtype)) == dtype

@pytest.mark.parametrize('dtype', ['float32',
    pytest.param('int16', marks=pytest.mark.skip),
    pytest.param('int32',
                 marks=pytest.mark.xfail(reason='to show how it works'))])
def test_mark(dtype):
    assert str(np.dtype(dtype)) == 'float32'

@pytest.fixture
def series():
    return pd.Series([1, 2, 3])

@pytest.fixture(params=['int8', 'int16', 'int32', 'int64'])
def dtype(request):
    return request.param

def test_series(series, dtype):
    result = series.astype(dtype)
    assert result.dtype == dtype

    expected = pd.Series([1, 2, 3], dtype=dtype)
    tm.assert_series_equal(result, expected)
```

A test run of this yields

```
((pandas) bash-3.2$ pytest  test_cool_feature.py  -v
=========================== test session starts ===========================
platform darwin -- Python 3.6.2, pytest-3.2.1, py-1.4.31, pluggy-0.4.0
collected 11 items

tester.py::test_dtypes[int8] PASSED
tester.py::test_dtypes[int16] PASSED
tester.py::test_dtypes[int32] PASSED
tester.py::test_dtypes[int64] PASSED
tester.py::test_mark[float32] PASSED
tester.py::test_mark[int16] SKIPPED
tester.py::test_mark[int32] xfail
tester.py::test_series[int8] PASSED
tester.py::test_series[int16] PASSED
tester.py::test_series[int32] PASSED
tester.py::test_series[int64] PASSED
```

Tests that we have ``parametrized`` are now accessible via the test name, for example we could run these with -k int8 to sub-select only those tests which match ``int8``.

```
((pandas) bash-3.2$ pytest  test_cool_feature.py  -v -k int8
=========================== test session starts ===========================
platform darwin -- Python 3.6.2, pytest-3.2.1, py-1.4.31, pluggy-0.4.0
collected 11 items

test_cool_feature.py::test_dtypes[int8] PASSED
test_cool_feature.py::test_series[int8] PASSED
```

## Running the test suite

The tests can then be run directly inside your Git clone (without having to install pandas) by typing:

```sh
pytest pandas
```

The tests suite is exhaustive and takes around 20 minutes to run. Often it is worth running only a subset of tests first around your changes before running the entire suite.

The easiest way to do this is with:

```sh
pytest pandas/path/to/test.py -k regex_matching_test_name
```

Or with one of the following constructs:

```sh
pytest pandas/tests/[test-module].py
pytest pandas/tests/[test-module].py::[TestClass]
pytest pandas/tests/[test-module].py::[TestClass]::[test_method]
```

Using [pytest-xdist](https://pypi.org/project/pytest-xdist), one can speed up local testing on multicore machines. To use this feature, you will need to install pytest-xdist via:

```sh
pip install pytest-xdist
```

Two scripts are provided to assist with this. These scripts distribute testing across 4 threads.

On Unix variants, one can type:

```sh
test_fast.sh
```

On Windows, one can type:

```sh
test_fast.bat
```

This can significantly reduce the time it takes to locally run tests before submitting a pull request.

For more, see the [pytest](http://doc.pytest.org/en/latest/) documentation.

*New in version 0.20.0.*

Furthermore one can run

```sh
pd.test()
```

with an imported pandas to run tests similarly.

## Running the performance test suite

Performance matters and it is worth considering whether your code has introduced performance regressions. pandas is in the process of migrating to asv benchmarks to enable easy monitoring of the performance of critical pandas operations. These benchmarks are all found in the pandas/asv_bench directory. asv supports both python2 and python3.

To use all features of asv, you will need either conda or virtualenv. For more details please check the asv installation webpage.

To install asv:

```sh
pip install git+https://github.com/spacetelescope/asv
```

If you need to run a benchmark, change your directory to asv_bench/ and run:

```sh
asv continuous -f 1.1 upstream/master HEAD
```

You can replace HEAD with the name of the branch you are working on, and report benchmarks that changed by more than 10%. The command uses conda by default for creating the benchmark environments. If you want to use virtualenv instead, write:

```sh
asv continuous -f 1.1 -E virtualenv upstream/master HEAD
```

The -E ``virtualenv`` option should be added to all asv commands that run benchmarks. The default value is defined in ``asv.conf.json``.

Running the full test suite can take up to one hour and use up to 3GB of RAM. Usually it is sufficient to paste only a subset of the results into the pull request to show that the committed changes do not cause unexpected performance regressions. You can run specific benchmarks using the -b flag, which takes a regular expression. For example, this will only run tests from a ``pandas/asv_bench/benchmarks/groupby.py`` file:

```sh
asv continuous -f 1.1 upstream/master HEAD -b ^groupby
```

If you want to only run a specific group of tests from a file, you can do it using . as a separator. For example:

```sh
asv continuous -f 1.1 upstream/master HEAD -b groupby.GroupByMethods
```

will only run the GroupByMethods benchmark defined in groupby.py.

You can also run the benchmark suite using the version of pandas already installed in your current Python environment. This can be useful if you do not have virtualenv or conda, or are using the setup.py develop approach discussed above; for the in-place build you need to set PYTHONPATH, e.g. PYTHONPATH="$PWD/.." asv [remaining arguments]. You can run benchmarks using an existing Python environment by:

```sh
asv run -e -E existing
```

or, to use a specific Python interpreter,:

```sh
asv run -e -E existing:python3.5
```

This will display stderr from the benchmarks, and use your local python that comes from your $PATH.

Information on how to write a benchmark and how to use asv can be found in the [asv documentation](https://asv.readthedocs.io/en/latest/writing_benchmarks.html).

## Documenting your code

Changes should be reflected in the release notes located in ``doc/source/whatsnew/vx.y.z.txt``. This file contains an ongoing change log for each release. Add an entry to this file to document your fix, enhancement or (unavoidable) breaking change. Make sure to include the GitHub issue number when adding your entry (using :issue:`1234` where 1234 is the issue/pull request number).

If your code is an enhancement, it is most likely necessary to add usage examples to the existing documentation. This can be done following the section regarding documentation [above](http://pandas.pydata.org/pandas-docs/stable/contributing.html#contributing-documentation). Further, to let users know when this feature was added, the versionadded directive is used. The sphinx syntax for that is:

```python
.. versionadded:: 0.21.0
```

This will put the text *New in version 0.21.0* wherever you put the sphinx directive. This should also be put in the docstring when adding a new function or method ([example](https://github.com/pandas-dev/pandas/blob/v0.20.2/pandas/core/frame.py#L1495)) or a new keyword argument ([example](https://github.com/pandas-dev/pandas/blob/v0.20.2/pandas/core/generic.py#L568)).