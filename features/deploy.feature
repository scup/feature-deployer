Feature: To Test Feature
  As a deployer
  I want to deploy the current code to an environment
  So that the feature is avaiable to use

  Scenario Outline: I am in a git folder
    Given Now is <timestamp>
    When I execute the command <command> to deploy
    Then It downloads the last version of the code
      And It switches to branch
      And Create the tag <gitTag>
      And Upload the created tag to server

    Examples:
      | timestamp | command | gitTag |
      | 1517400000000 | deploy rc | release_rc_2018_01_31_12_00 |
      | 1517400000000 | deploy rc description | release_rc_2018_01_31_12_00_description |
      | 1517489122000 | deploy-rc | release_rc_2018_02_01_12_45 |
      | 1517489122384 | deploy staging | release_staging_2018_02_01_12_45 |
      | 1517489122384 | deploy-prod description | release_prod_2018_02_01_12_45_description |
