### Setup Instructions ###

1. Clone the repository
2. Run npm install
3. Run npm run dev

### Features Implemented ###

1. Zod + Vee-Validate for Frontend Validation
2. Axios for API Integration

### Thought Process and Coding Decisions ###

- I have created the frontend pages for the Login and Register. Since the password reset is not mentioned as a requirement, I may do that last. 
- I have decided to implement Zod + Vee-Validate for validation in the frontend. This should help in error handling and in error display. I have also installed a few tools to help with coding such as ESLint and Prettier to make the coding experience better.
- After setting up the validation, I have now installed Axios and Pinia. I have decided to follow this basic rule for handling this. All logic is going to go inside the stores as well since that makes them reusable and I can store responses much easier to their respective store variable whenever needed. Composables will be used for minor reusable functionalities which do not need any storage.