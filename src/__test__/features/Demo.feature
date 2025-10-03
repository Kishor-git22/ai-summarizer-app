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

  Scenario: Viewing article history
    Given I have previously summarized articles
    When I view the history section
    Then I should see my previously summarized articles
    And each article should show its URL

  Scenario: Copying an article URL to clipboard
    Given I have previously summarized articles
    When I click the copy button for an article
    Then the article URL should be copied to clipboard
    And I should see a confirmation that the URL was copied

  Scenario: Clicking on a history item
    Given I have previously summarized articles
    When I click on an article in history
    Then the article summary should be displayed
    And the input field should be updated with the article URL