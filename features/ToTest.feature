Feature: To Test Feature
  As a deployer
  I want to send a feature to QA
  So that it can be tested

  Background:
    Given the branch SCARY
      And the directory is set to dirname

  Scenario: The Branch And Directory exists
    When I deploy the feature
  # Then the QA branch becomes qa__SCARY
  #     And the feature is not sent to RC
  #     And the feature is not repproved
  #
  # Scenario: Approve
  #   When I approve the feature
  #   Then the QA branch becomes qa__SCARY
  #     And a link is created to RC
  #     And the feature is not repproved
