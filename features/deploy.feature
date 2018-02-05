Feature: Deploy Feature
  As a deployer
  I want to deploy the current code to an environment
  So that the feature is avaiable to use

  Scenario Outline: I am on a project folder (i.e: scup-care-front, scup-care)
    Given Now is <timestamp>
    When I execute the command feature-deployer <command>
    Then It switches to main branch
      And It downloads the last version of the code
      And Create the tag <gitTag>
      And Upload the created tag to server

    Examples:
      | timestamp | command | gitTag |
      | 1517400000000 | deploy rc | release_rc_201801311200 |
      | 1517489122384 | deploy staging | release_staging_201802011245 |
      | 1517400000000 | d rc deployDescription | release_rc_201801311200_deployDescription |
      | 1517489122000 | drc | release_rc_201802011245 |
      | 1517489122384 | deploy-rc deployDescription | release_rc_201802011245_deployDescription |
      | 1517489122384 | deploy-prod deployDescription | release_prod_201802011245_deployDescription |
      | 1517489122384 | dprod deployDescription | release_prod_201802011245_deployDescription |
