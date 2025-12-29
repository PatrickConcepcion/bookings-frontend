### Setup Instructions

1. Clone the repository
2. Run npm install
3. Run npm run dev

### Features Implemented

1. Zod + Vee-Validate for Frontend Validation
2. Axios for API Integration
3. Unified error handling for backend errors
4. Data Manipulation in Store for API calls to prevent excessive API calls
5.

### Thought Process and Coding Decisions

- I have created the frontend pages for the Login and Register. Since the password reset is not mentioned as a requirement, I may do that last.
- I have decided to implement Zod + Vee-Validate for validation in the frontend. This should help in error handling and in error display. I have also installed a few tools to help with coding such as ESLint and Prettier to make the coding experience better.
- After setting up the validation, I have now installed Axios and Pinia. I have decided to follow this basic rule for handling this. All logic is going to go inside the stores as well since that makes them reusable and I can store responses much easier to their respective store variable whenever needed. Composables will be used for minor reusable functionalities which do not need any storage.
- An issue that I faced with the basic requests with the try and catch is that the errors being sent is raw. There are times especially on 422 errors that I want to get the precise error and then throw it to the ErrorMessage of that specific input field as well. To adhere to the DRY principle, I have decided to create the useFormErrors.ts composable to handle this and promote cleaner implementation.
- I have implemented the API integration for the bookings. One problem that I faced is excessive API calls towards the index api endpoint. To prevent this, I decided to use data manipulation in the store. For example, creating a new booking would take the response of the POST api and store it in the bookings array in the store. This saves excessive API calls which may affect costs in AWS and other platforms when hosted.
-
