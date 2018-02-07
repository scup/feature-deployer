Feature: Deploy Feature
  As a deployer
  I want to deploy the current code to an environmenton a project folder (i.e: scup-care-front, scup-care)
  So that the feature is avaiable to use

  Scenario Outline: Deploy to an environment
    Given Now is <timestamp>
    When I execute the command feature-deployer <command>
      And It switches to last version of main branch
      And It creates the tag <gitTag>
      And It uploads the created tag to server

    Examples:
      | timestamp | command | gitTag |
      | 1517400000000 | deploy rc | release_rc_2018-01-31-12-00 |
      | 1517489122384 | deploy staging | release_staging_2018-02-01-12-45 |
      | 1517400000000 | d staging deployDescription | release_staging_2018-01-31-12-00_deployDescription |
      | 1517489122000 | drc | release_rc_2018-02-01-12-45 |
      | 1517489122384 | deploy-rc deployDescription | release_rc_2018-02-01-12-45_deployDescription |
      | 1517489122384 | drc deployDescription | release_rc_2018-02-01-12-45_deployDescription |

  Scenario Outline: Deploy to production
    Given Now is <timestamp>
    When I execute the command feature-deployer <command>
    Then It switches to the tag release
      And It creates the tag <gitTag>
      And It uploads the created tag to server

    Examples:
      | timestamp | command | gitTag |
      | 1518032461994 | deploy production release_rc_2018-01-31-12-00 | release_production_2018-02-07-19-41 |
      | 1518032461994 | d production release_rc_2018-01-31-12-00_deployDescription | release_production_2018-02-07-19-41_deployDescription |
      | 1518032461994 | dprod release_rc_2018-02-01-12-45 | release_production_2018-02-07-19-41 |
      | 1518032461994 | deploy-production release_rc_2018-02-01-12-45_deployDescription | release_production_2018-02-07-19-41_deployDescription |
      | 1517489122384 | dprod release_rc_2018-01-31-12-00_deployDescription | release_production_2018-02-01-12-45_deployDescription |
