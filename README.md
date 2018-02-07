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
`feature-deployer deploy <environment> [description] [--project <projectName>]*`, in order to facilitate you can use `feature-deployer deploy-rc [description] [--project <projectName>]*` for **RC** and `feature-deployer deploy-prod [description] [--project <projectName>]*` for **production**.


* Deploy current **master** code to **RC**
	1. 
