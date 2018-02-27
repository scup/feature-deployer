Feature: Test Feature
  As a deployer
  I want to test a feature on a test environment
  So that the feature is avaiable on a environment

  Scenario Outline: Send a branch to test on a project
    Given Now is <timestamp>
      And There are tags on previous releases on environment: <environment>
    When I execute the command feature-deployer <command>
    Then It downloads the last version of main branch
      And It switches to last version of branch <branchToTest>
      And It merges with main branch
      And It cleans previous release test tags on same the environment
      And It creates the tag <gitTestTag>
      And It uploads the created tag to server
      And It switches to main branch
      And It deletes locally the branch

    Examples:
      | timestamp | branchToTest | environment | command | gitTestTag |
      | 1517400000000 | SCARE-1010 | qa | test SCARE-1010 qa | test_qa_2018-01-31-12-00_SCARE-1010 |
      | 1517489122384 | SCARE-2020 | qa | t SCARE-2020 qa | test_qa_2018-02-01-12-45_SCARE-2020 |
      | 1517400000000 | SCARE-1012 | qa-alfa | test SCARE-1012 qa-alfa | test_qa-alfa_2018-01-31-12-00_SCARE-1012 |

  Scenario Outline: Send a branch to test on multiple projects
    Given Now is <timestamp>
      And There are tags on previous releases on environment: <environment>
    When I execute the command feature-deployer <command>
    Then It uses directory of <project>
      And It downloads the last version of main branch
      And It switches to last version of branch <branchToTest>
      And It merges with main branch
      And It cleans previous release test tags on same the environment
      And It creates the tag <gitTestTag>
      And It uploads the created tag to server
      And It switches to main branch
      And It deletes locally the branch
      And It repeats of testing the steps on <projectTwo>

    Examples:
      | timestamp | branchToTest | environment | command | gitTestTag | project | projectTwo |
      | 1517400000000 | SCARE-1011 | qa2 | -p scup-care -p scup-care-email test SCARE-1011 qa2 | test_qa2_2018-01-31-12-00_SCARE-1011 | scup-care | scup-care-email |
      | 1517489122384 | SCARE-1012 | qa2 | -p scup-care t SCARE-1012 qa2 --project scup-billing | test_qa2_2018-02-01-12-45_SCARE-1012 | scup-care | scup-billing |
      | 1517400000000 | SCARE-1013 | qa2-alfa | --project scup-care test SCARE-1013 qa2-alfa --project scup-care-front | test_qa2-alfa_2018-01-31-12-00_SCARE-1013 | scup-care | scup-care-front |
