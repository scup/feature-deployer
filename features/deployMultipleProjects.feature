Feature: Deploy Feature on Projects
  As a deployer
  I want to deploy the current code of one or more projects to an environment
  So that the feature is avaiable to use

  Scenario Outline: I am root folder, for one project (like scup-care, and children are scup-care-front, scup-care ...)
    Given Now is <timestamp>
    When I execute the command feature-deployer <command>
    Then It uses directory of <project>
      And It switches to main branch
      And It downloads the last version of the code
      And Create the tag <gitTag>
      And Upload the created tag to server

    Examples:
      | timestamp | command | gitTag | project |
      | 1517400000000 | --project scup-care deploy rc | release_rc_201801311200 | scup-care |
      | 1517489122384 | dprod -p scup-care-front | release_prod_201802011245 | scup-care-front |

  Scenario Outline: I am root folder for multiple projects (like scup-care, and children are scup-care-front, scup-care ...)
    Given Now is <timestamp>
    When I execute the command feature-deployer <command>
    Then It uses directory of <project>
      And It switches to main branch
      And It downloads the last version of the code
      And Create the tag <gitTag>
      And Upload the created tag to server
      And Repeat the steps above on <projectTwo> with tag <gitTag>

    Examples:
      | timestamp | command | gitTag | project | projectTwo |
      | 1517400000000 | -p scup-care deploy rc --project scup-care-front | release_rc_201801311200 | scup-care | scup-care-front |
      | 1517489122384 | --project scup-care-front dprod -p scup-care | release_prod_201802011245 | scup-care-front | scup-care |
