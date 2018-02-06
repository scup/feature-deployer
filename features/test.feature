Feature: Test Feature
  As a deployer
  I want to test a feature on a test environment
  So that the feature is avaiable on a environment

  Scenario Outline: Send a branch to test on a project
    Given Now is <timestamp>
    When I execute the command feature-deployer <command>
    Then It downloads the last version of main branch
      And It switches to last version of branch
      And It merges with main branch
      And It cleans previous release tags
      And It creates the tag <gitTestTag>
      And It uploads the created tag to server
      And It switches to main branch
      And It deletes locally the branch

    Examples:
      | timestamp | command | gitTestTag |
      | 1517400000000 | test SCARE-1010 qa | test_qa_201801311200_SCARE-1010 |
      | 1517489122384 | t SCARE-1010 qa | test_qa_201802011245_SCARE-1010 |
      | 1517400000000 | teste SCARE-1012 qa-alfa | test_qa-alfa_201801311200_SCARE-1012 |

  Scenario Outline: Send a branch to test on multiple projects
    Given Now is <timestamp>
    When I execute the command feature-deployer <command>
    Then It uses directory of <project>
      And It downloads the last version of main branch
      And It switches to last version of branch
      And It merges with main branch
      And It cleans previous release tags
      And It creates the tag <gitTestTag>
      And It uploads the created tag to server
      And It switches to main branch
      And It deletes locally the branch
      And It repeats of testing the steps on <projectTwo>

    Examples:
      | timestamp | command | gitTestTag | project | projectTwo |
      | 1517400000000 | -p scup-care -p scup-care-email test SCARE-1010 qa | test_qa_201801311200_SCARE-1010 | scup-care | scup-care-email |
      | 1517489122384 | -p scup-care t SCARE-1010 qa --project scup-billing | test_qa_201802011245_SCARE-1010 | scup-care | scup-billing |
      | 1517400000000 | --project scup-care teste SCARE-1012 qa-alfa --project scup-care-front | test_qa-alfa_201801311200_SCARE-1012 | scup-care | scup-care-front |
