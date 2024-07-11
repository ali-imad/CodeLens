# Frontend Testing Plan

## 1. ProblemDescription Component

### Unit Tests

- Render the component with a mock problem prop
- Verify the problem title is displayed correctly
- Check if the difficulty is rendered with the correct color
- Ensure the code snippet is displayed properly
- Test the function renaming for student role
- Verify different displays for student and instructor roles

### Integration Tests

- Test the component within a parent component that passes problem data
- Verify the component updates correctly when the problem prop changes

## 2. ProblemsPage Component

### Unit Tests

- Render the component and check initial state
- Mock axios get request and test successful data fetching
- Test error handling when the API request fails
- Verify correct number of problem cards are rendered
- Check if the problem cards display correct information
- Test different displays for student and instructor roles

### Integration Tests

- Test navigation to individual problem pages when clicking on a problem card
- Verify the component integrates correctly with the React Router

## 3. ProfilePage Component

### Unit Tests

- Render the component and check if ProfileCard is rendered
- Verify that user data is correctly passed to ProfileCard
- Test if localStorage data is correctly retrieved and used

### Integration Tests

- Test the integration of ProfileCard within ProfilePage
- Verify that user stats are correctly displayed

## 4. DescriptionInput Component

### Unit Tests

- Render the component with default props
- Test input change in textarea
- Test form submission with non-empty input
- Test form submission with empty input
- Verify "Submit" button is disabled when isLoading is true
- Check if Spinner is displayed when isLoading is true

### Integration Tests

- Test interaction with parent component (onSubmit callback)

## 5. Header Component

### Unit Tests

- Render component with isLoggedIn=false
- Render component with isLoggedIn=true
- Test "Random Problem" button click
- Verify correct links are displayed for different user roles
- Test logout button functionality

### Integration Tests

- Test navigation using React Router links
- Verify image loading and fallback to default avatar
- Test interaction with localStorage for profile image

## 6. Pagination Component

### Unit Tests

- Render component with various prop combinations
- Test page number buttons rendering
- Verify current page highlighting
- Test previous and next button functionality
- Check edge cases (first page, last page)

### Integration Tests

- Test interaction with parent component (paginate callback)

## 7. PolicyPopup Component

### Unit Tests

- Render component and verify content
- Test close button functionality

### Integration Tests

- Verify integration with parent component (onClose callback)

## 8. ProblemStatusIcon Component

### Unit Tests

- Render component with different status props
- Verify correct icon and color for each status

## 9. AddProblemModal Component

### Unit Tests

- Render component with default props
- Test form input changes
- Verify difficulty dropdown functionality
- Test adding and removing test cases
- Check form submission with valid/invalid data

### Integration Tests

- Test interaction with parent component (onClose and onProblemAdded callbacks)
- Verify API call on form submission

## 10. Dashboard Component

### Unit Tests

- Render component with mock problem data
- Test loading states
- Verify problem status fetching and display
- Check description submission functionality

### Integration Tests

- Test integration with ProblemDescription and Feedback components
- Verify API calls for problem fetching and attempt submission

## 11. Feedback Component

### Unit Tests

- Render component with mock attempt data
- Test "Annotate" button functionality
- Verify display of test case results
- Check overall result display

### Integration Tests

- Test integration with Dashboard component
- Verify API call for code annotation

## 12. ProfileCard Component

### Unit Tests

- Render component with mock user data
- Test image upload functionality
- Verify stats display
- Check loading state during image upload

### Integration Tests

- Test integration with parent component
- Verify API calls for image upload and fetching

## General Testing Considerations

1. Accessibility Testing

   - Use tools like jest-axe for automated accessibility checks
   - Verify keyboard navigation and screen reader compatibility

2. Responsive Design Testing

   - Test components at various screen sizes
   - Verify layout changes and component responsiveness

3. Error Handling

   - Test error states in API calls
   - Verify error message display

4. Performance Testing

   - Use React DevTools Profiler to identify performance bottlenecks
   - Test rendering performance with large datasets (where applicable)

5. Cross-browser Testing

   - Verify component functionality across major browsers

6. State Management Testing

   - Test state updates and side effects
   - Verify correct prop drilling or context usage

7. Mocking

   - Use Jest mocks for API calls, localStorage, and other external dependencies

8. Snapshot Testing

   - Create snapshots for stable components to detect unintended changes

9. Event Handling

   - Test user interactions (clicks, inputs, etc.)
   - Verify correct event propagation and bubbling

10. Security Testing
    - Test for XSS vulnerabilities in user inputs
    - Verify secure handling of sensitive data

Tools and Libraries:

- Jest and React Testing Library for unit and integration tests
- Cypress for end-to-end testing
- Storybook for component development and visual testing
- Axe-core for accessibility testing

## 4. General Frontend Tests

### Responsive Design Tests

- Test all components on various screen sizes
- Verify layout changes and responsiveness

### Cross-browser Testing

- Test on major browsers (Chrome, Firefox, Safari, Edge)
- Verify consistent appearance and functionality across browsers

### State Management Tests

- Verify correct state updates in components
- Test state persistence where applicable (e.g., between route changes)

### Error Handling

- Test error boundaries
- Verify graceful degradation when API calls fail

### User Interaction Tests

- Test all clickable elements and forms
- Verify correct behavior for user inputs

### Route Testing

- Test all defined routes
- Verify correct components are rendered for each route
- Test navigation between routes
