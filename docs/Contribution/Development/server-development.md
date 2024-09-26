---
sidebar_position: 1
---

# Development process

This page provides an overview of how the Budget Control code is developed.

### Source Code Version Control
Budget Control uses Git to manage code revisions. Each software component has its own repository.

### Branch Names
The default branches for Budget Control and its app repositories are named `main` or `master`. Additionally, there are stable branches for each major release of Budget Control, named `stableX`, where X represents the version number. For example, the stable branch for Budget Control 25 is named `stable25`.

### Target Branches for Contributions
All changes to the source code are made through a pull request into the default branch of a repository.

#### Switch to the default branch and update it
```bash
git checkout main
git pull origin main
```

#### Create a new feature branch
```bash
git checkout -b feature/foo-bar
```

#### Add and commit the changes
```bash
git add file1 file2
git commit --signoff -m 'Add foo bar'
```

#### Push the new commit to the remote repository and open a pull request
```bash
git push origin feature/foo-bar
```

### Bugfixes
If a contribution fixes a bug that affects older Budget Control or app releases, it may qualify for a backport. Backporting a fix means applying the change to an older version of the code. This operation is referred to as cherry-picking in Git.

### Automatic Backport
In many cases, cherry-picking results in a clean application of the patch, and Git can automatically resolve any minor conflicts. In such cases, it’s easiest to let the backport bot handle the backport.

Refer to the bot usage documentation for its commands.

### Manual Backport
More complex changes may require the developer to perform the backport manually. This can be done as follows:

#### Switch to the target branch and update it
```bash
git checkout stable25
git pull origin stable25
```

#### Create a new backport branch
```bash
git checkout -b fix/foo-stable25
```

#### Cherry-pick the change from the commit SHA1 of the change made against the default branch
This may cause conflicts. Resolve them if necessary.
```bash
git cherry-pick abc123
```

#### Push the cherry-picked commit to the remote repository and open a pull request
```bash
git push origin fix/foo-stable25
```

## Bugtracker
Thank you for helping Budget Control by reporting bugs. Before submitting an issue, please read Issue submission guidelines first.

* If the issue is with the Budget Control server or app, report it to the Budget Control repository at [gitHub](https://github.com/BudgetControl/BudgetControl/issues)