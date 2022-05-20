# Contributing Guidelines

For the sake of keeping our repo clean, below are our agreed upon guidelines for
contributing to Boojo.

## Commit Messages

* Commit subject lines should be informative as to what was changed.
  * Good commit: `front-end/login: fix login failing due to cors`
  * Bad commit: `cors fix`
* Commit messages should be no wider than 72 characters. This is a limitation of
  Git.
  * If you use the command line to commit, you can switch your text editor to
    vim using the command `git config core.editor "vim"` and add the line
    `au FileType gitcommit setlocal tw=72` to your `.vimrc`.
* Commit messages follow the format of:
  * Subject Line
  * Blank Line
  * Message Body
* Prefix all commit messages with the section of the software that was modified.
  If multiple sections were modified, use the prefix for the file/folder that
  the commit focuses the most on.
* End all prefixes with `:`.
* Do not use a `.` at the end of the subject line.
* Message bodies are not always neccessary for small commits such as formatting
  changes, but are required on large commits that change functionality, or fix
  non-trivial bugs.
  Make sure to give a high level overview of what you changed and potentially
  why you changed it.
  If you do it right, you can use this message as the body of your pull request.
* Use of capital letters in the subject line is allowed.

Below is an example of a good commit message:
```
front-end/login: fix login failing due to cors

Due to changes in ab638c4 making CORS more strict, our login began
failing for users that weren't already logged in. This fixes the issue
by moving our backend server to the same TLD as our front-end server.
```

**Protip:** Use `git commit` instead of `git commit -m` or you will suffer.

## When to Commit

One commit should encapsulate one change.
This means that if there are multiple seperate bugs, each bug will get their
own commit.
Likewise, each added feature or discrete change should be a seperate commit.

The reason this is done is to prevent sprawl where multiple changes are squashed
into one commit.
This will make it easier to revert a single commit if the need arises without
having to worry about accidentally reverting other wanted changes.

It is alright for one pull request to have multiple commits.

## Squashing Commits

Often times you will need to amend commits because you missed something,
formatting is off, or there is a bug.
To avoid making micro-commits or unncessarily spreading changes across commits,
you can squash commits.

Here's what to do in these situations:
* There is a mistake in my last commit.
  * 1. Stage your changes and run `git commit --amend`.
    2. If you've already pushed to your repo, use `git push -f` to push.
* There is a mistake in any other commit.
  * 1. Run `git log` and copy the commit hash of the commit you want to fix.
    2. Stage your changes and run `git commit --fixup=<copied hash>`.
    3. Run `git rebase -i --autosquash <copied hash>~1`.
    4. If you have already pushed, push again with `git push -f`.

## Merging a Change into the Repository

1. Fork the repository.
2. Clone your forked repo to your machine.
3. Run `git remote add prod https://github.com/cse-112-sp22-group1/cse112-sp22-group1.git`
4. Before you start making new changes, pull from production with `git pull prod`
5. Checkout a new branch for the change you are working on with `git checkout -b <feature>`
6. When you are done making changes, push this branch to your fork with
   `git push --set-upstream origin <feature>`
7. Open a pull request on the team repo.
   If you wrote good commit messages, you can use their contents for the pull
   request.
8. Two reviewers will check your pull request before merging it into the
   appropriate branch.

## Pull Requests

While pull requests can contain multiple commits, all commits must be related.
Each pull request should implement a closely related set of changes.
