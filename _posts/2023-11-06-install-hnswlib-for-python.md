---
layout: post
title: Deal with hnswlib installation error (unsupported argument 'native')
authors:
- eunki
---

### Background

Today, I tried to install `hnswlib 0.7.0` via poetry (a python package manager), but met this error:

```
...
clang: error: unsupported argument 'native' to option '-march='
      error: command '/usr/bin/clang' failed with exit code 1
      [end of output]
  
  note: This error originates from a subprocess, and is likely not a problem with pip.
  ERROR: Failed building wheel for hnswlib
Failed to build hnswlib
ERROR: Could not build wheels for hnswlib, which is required to install pyproject.toml-based projects
```

### Solution that worked for me

Drawing from [this reply from AhmadBakdash](https://github.com/pypa/packaging-problems/issues/648#issuecomment-1564437323), I tried to set an installation option like this and it worked:

```shell
export HNSWLIB_NO_NATIVE=1
poetry add hnswlib@latest
```

I think this will work for pip as well, as long as the reason of error is same.

