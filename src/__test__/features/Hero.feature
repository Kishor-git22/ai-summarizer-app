Feature: Hero Component
  The Hero section should display the project branding, titles, and a GitHub button.

  Background:
    Given the Hero component is rendered

  Scenario: Display brand logo
    Then the brand logo should be visible
    And the logo should have an alt text equal to the project name
    And the logo should not be draggable

  Scenario: Display GitHub button
    Then a button labeled "Github" should be visible
    And the button should have the title "View Source Code"
    When the user clicks the GitHub button
    Then it should open the project GitHub link in a new tab

  Scenario: Display Hero title
    Then the Hero title should include the left title text
    And the Hero title should include the right title text in gradient color

  Scenario: Display Hero subtitle
    Then the Hero subtitle should include the left subtitle text
    And the Hero subtitle should display the project name highlighted in gradient color
    And the Hero subtitle should include the right subtitle text
