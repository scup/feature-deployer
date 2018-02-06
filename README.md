# Feature Deployer

Feature Deployer is an automated tool to improve the deploy flow.

## Installing
```
npm install -g scup/feature-deployer
```

## The flow

### 1. Development
An developer generates a branch from `master`, for instance, the branch `SCARE-1212` (Generally it will correspond to an issue on JIRA).

When he finishes the job and the code review is done, an PR to branch `master` should be opened. The url to open a PR is like this one [https://bitbucket.org/scup/scup-care-front/pull-requests/new?source=SCARE-1212&t=1](https://bitbucket.org/scup/scup-care-front/pull-requests/new?source=SCARE-1212&t=1).
> The developer can execute the code review by generating, small PR to the feature branch, or with the branch to master, **but** just the QAs should merge branch into master.

### 1. Test
