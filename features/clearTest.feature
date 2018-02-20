Feature: Clear Test Feature
  As a deployer
  I want clear a test environment and use the last code
  So that the environment is clear

  Scenario Outline: Clear one test environment
    Given Now is <timestamp>
      And There are tags on previous releases on environment: <environment>
    When I execute the command feature-deployer <command>
    Then It downloads the last version of main branch
      And It cleans previous release test tags on same the environment
      And It creates the tag <gitTestTag>
      And It uploads the created tag to server

    Examples:
      | timestamp | environment | command | gitTestTag |
      | 15174000000001010 | qa | clear-test qa | test_qa_2018-01-31-12-00_master |
      | 15174891223842020 | qa | ct qa | test_qa_2018-02-01-12-45_master |
      | 15174000000001012 | qa-alfa | clear-test qa-alfa | test_qa-alfa_2018-01-31-12-00_master |

  Scenario Outline: Clear test environment on multiple projects
    Given Now is <timestamp>
      And There are tags on previous releases on environment: <environment>
    When I execute the command feature-deployer <command>
    Then It uses directory of <project>
      And It downloads the last version of main branch
      And It cleans previous release test tags on same the environment
      And It creates the tag <gitTestTag>
      And It uploads the created tag to server
      And It repeats of clear test the steps on <projectTwo>

    Examples:
      | timestamp | environment | command | gitTestTag | project | projectTwo |
      | 1517400000000 | qa2 | -p scup-care -p scup-care-email clear-test SCARE-1011 qa2 | test_qa2_2018-01-31-12-00_master | scup-care | scup-care-email |
      | 1517489122384 | qa2 | -p scup-care ct SCARE-1012 qa2 --project scup-billing | test_qa2_2018-02-01-12-45_master | scup-care | scup-billing |
      | 1517400000000 | qa2-alfa | --project scup-care ct SCARE-1013 qa2-alfa --project scup-care-front | test_qa2-alfa_2018-01-31-12-00_master | scup-care | scup-care-front |
