Feature: Deploy Feature on Projects
  As a deployer
  I want to deploy the current code of one or more projects to an environment
  So that the feature is avaiable to use

  Scenario Outline: I am root folder, for one project (like scup-care, and children are scup-care-front, scup-care ...)
    Given Now is <timestamp>
    When I execute the command feature-deployer <command>
    Then It uses directory of <project>
    #   And It switches to main branch on <project>
    #   And It downloads the last version of the code of <project>
    #   And Create the tag <gitTag> on <project>
    #   And Upload the created tag to server on <project>

    Examples:
      | timestamp | command | gitTag | project |
      | 1517400000000 | --project scup-care deploy rc  | release_rc_201801311200 | scup-care |
      | 1517489122384 | dprod -p scup-care-front | release_staging_201802011245 | scup-care-front |

  # Scenario Outline: I am root folder for more projects (like scup-care, and children are scup-care-front, scup-care ...)
  #   Given Now is <timestamp>
  #   When I execute the command <command> to deploy
  #   Then It uses directory of <projectOne>
  #     And It switches to main branch on <projectOne>
  #     And It downloads the last version of the code of <projectOne>
  #     And Create the tag <gitTag> on <projectOne>
  #     And Upload the created tag to server on <projectOne>
  #     And Repeat the steps for <projectOne> on <projectTwo>
  #
  #   Examples:
  #     | timestamp | command | gitTag |
  #     | 1517400000000 | --project scup-care --project scup-care-front deploy rc  | release_rc_201801311200 |
  #     | 1517489122384 | deploy staging | release_staging_201802011245 |
