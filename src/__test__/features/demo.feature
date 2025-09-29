Feature: Article Summarization

  Scenario: Viewing the initial page
    Then I should see the input field with placeholder "Paste the Article Link"
    And I should see a submit button with text "Summarize Article"

  Scenario: Submitting an invalid URL
    When I enter "not-a-valid-url" in the input field
    And I click the submit button
    Then I should see an error message about invalid URL
    And no API call should be made
    
  Scenario: Submitting a valid URL
    Given the API is available
    When I enter "https://example.com/article" in the input field
    And I click the submit button
    Then I should see a loading indicator
    And an API call should be made to summarize the article
    When the summary is loaded
    Then I should see the article summary
    And I should see a success message
    And the article should be added to my history