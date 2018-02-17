# Feature Deployer

Feature Deployer is an automated tool to improve the deploy flow.

## Installing

On syntax parameters wrapped by `[]` are optional, wrapped by `<>` are required, and suffixed by `*` can be written more than once.
```
npm install -g scup/feature-deployer
```

## The flow

### 1. Development
#### 1.1 Feature
An developer generates a branch from `master`, for instance, the branch `SCARE-1212` (Generally it will correspond to an issue on JIRA).

When he finishes the job and the code review is done, an PR to branch `master` should be opened. The url to open a PR is like this one [https://bitbucket.org/scup/scup-care-front/pull-requests/new?source=SCARE-1212&t=1](https://bitbucket.org/scup/scup-care-front/pull-requests/new?source=SCARE-1212&t=1).

> The developer can execute the code review by generating, smalls PR to the feature branch like `SCARE-1212-firstThingofTask`, or with the **branch directly** to master, **but** just the QAs should merge branch into master.

#### 1.2 HOTFIX (take care, read carefully)
When a hotfix needs to happen, branch of `master` generating you hotfix branch, for instance `hotfix-query-timeline`, execute the fix and upload a tag `release_production_hotfix_query-timeline`. And the CI will deploy it!

Then open a PR to **master** branch and talk to some people to review it and merge into master.

> Our convention is, `release_<environment>_<hotfixdescription>`, the CI deploys based on `release_<environment>_*`, and when this document was written just **production** and **rc** are the environments 


### 2. Test
In order to test a branch (feature, enhacements, bugs, etc....), a test release tag should be generated. Now the **feature-deployer** appears.

The syntax is `feature-deployer test|t <branch> <environment> [--project <projectName>]*`

#### Examples
* Send the branch `SCARE-1212` to **qa** on **scup-care-front**

    1. if you are on **scup-care/scup-care-front** folder execute:
		```	
        ~/scup-care/scup-care-front/$ feature-deployer test SCARE-1212 qa
		```        

    2. if you are on **scup-care** folder execute:
		```	
        ~/scup-care/$ feature-deployer test SCARE-1212 qa --project scup-care-front
		```

* Send the branch `SCARE-1212` to **qa** on **scup-care-front**, **scup-care-email** and **scup-care**(back)

	* You **should** be on root folder **scup-care** folder execute:
		```	
        ~/scup-care/$ feature-deployer t SCARE-1212 qa -p scup-care-front -p scup-care-email -p scup-care
		```
        
> `t` is alias to **test** and `-p` is alias to **--project**

### 3. Deploy to RC and PROD

After testing and branch is approved, merge it into master (Use the PR opened, or open a PR), then use **feature-deployer**

the syntax is
`feature-deployer deploy <environment> [deployDescription] [--project <projectName>]*`, in order to facilitate you can use `feature-deployer deploy-rc [deployDescription] [--project <projectName>]*` for **RC** and `feature-deployer deploy-prod <release> [--project <projectName>]*` for **production**.

> Note that on production deploy there is not parameter **[deployDescription]** and instead of there is parameter **release**, which is required... This happens because deploys to **production** should come from a previous tested release on **RC**


* Deploy current **master** code to **RC**

	1. on an **specific project** `feature-deployer drc niceFeature` this will generate the release tag `release_rc_<currentDate>_niceFeature`
	>`drc` is alias to `deploy-rc`
	>

	2. on **root folder**, in order to deploy more than a project, `feature-deployer drc niceFeature -p scup-care-front -p scup-care` this will generate the release tag `release_rc_<currentDate>_niceFeature`, on **scup-care-front** and **scup-care** projects.

* Deploy a release to **master** code to **production**

	1. on an **specific project** `feature-deployer dprod release_rc_2018-01-31-12-00_niceFeature` this will generate the release tag `release_production_<currentDate>_niceFeature`
	>`dprod` is alias to `deploy-production`
	>

	2. on **root folder**, in order to deploy more than a project, `feature-deployer dprod release_rc_2018-01-31-12-00_niceFeature -p scup-care-front -p scup-care` this will generate the release tag `release_production_<currentDate>_niceFeature`, on **scup-care-front** and **scup-care** projects.

## The older feature deployer
Was renamed to `old-feature-deployer`
