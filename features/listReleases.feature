Feature: List Realeases Feature
  As a deployer
  I want list releases in a environment
  So that I can see last releases

  Scenario: List tags on a environment
    Given There are tags on repositories
    When I execute the command feature-deployer list-releases rc
    Then It list tags on that environment of current project

  Scenario: List tags on environments
    Given There are tags on repositories
    When I execute the command feature-deployer list-releases production -p scup-care-front --project scup-care-front
    Then It list tags on that environment on scup-care-front and scup-care
