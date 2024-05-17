# Login Form - CTC Assessment

## A Containerized Webapp with Basic Login Functionality
This project is a simple web application build with a React Frontend with Material UI components, and Golang Backend with a PostgreSQL database, containerized with Docker. The application allows a user to sign up, log in, and log out. The user will be presented various error messages if any conflicts arise, such as trying to sign up with incorrect credentials, credentials that don't exist in the database, trying to sign up with duplicate emails, and more.

## Built With / Technologies Used
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-%230081CB.svg?style=for-the-badge&logo=mui&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23F7DF1E.svg?style=for-the-badge&logo=javascript&logoColor=black)
![Go](https://img.shields.io/badge/go-%2300ADD8.svg?style=for-the-badge&logo=go&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)
![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)
![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white)

## Password Encryption

To enhance the security of user credentials, the application implements password hashing and verification using the bcrypt package in the Golang backend.

### Password Hashing

- During the sign-up process, user passwords are hashed using bcrypt before being stored in the PostgreSQL database. This ensures that plain text passwords are never saved directly in the database.

### Password Verification

- During the login process, the entered password is verified against the stored hashed password using bcrypt. This ensures that the credentials provided by the user match the securely stored hash.

These changes ensure that user passwords are securely managed, providing an additional layer of security to the application.

## How to Use

### Signing Up
1. From the landing page, simply click on `CREATE AN ACCOUNT` and enter a valid email address and password. If a user has already signed up with that email address, you will not be able to recreate one.
   **NOTE** that the user will need to enter a valid email address (validated with regex) and a password with at least 4 characters to submit the form.

### Logging In
2. From the landing page, simply click on `LOG INTO EXISTING ACCOUNT` and enter the correct email and password combination. You will need to create a user first if that email has not been registered yet.
   **NOTE** that the user will need to enter a valid email address (validated with regex) and a password with at least 4 characters to submit the form.

### Logging Out
3. From the user dashboard, simply click on the `LOGOUT` button. You will then be redirected back to the landing page.

## Running the Application
Start by cloning the repository to your local machine. Open your Terminal and run the following command:

```
git clone https://github.com/adelhelj/LoginFormCTC.git
```

Navigate to the project directory:

```
cd LoginFormCTC
```

The best way to run this project is by building the docker container. Before running the application, ensure Docker Desktop is installed and running on your machine. 

From the root directory, run the following command in the Terminal:

```
docker-compose up --build
```

This will build the frontend and backend, set up the PostgresSQL database and create the users table based on `init.sql`, as well as install all necessary packages and dependencies.

Once Docker compose finishes running, you will see the following in the console:
```
frontend-1  | Compiled successfully!
frontend-1  | 
frontend-1  | You can now view my-react-app in the browser.
frontend-1  | 
frontend-1  |   Local:            http://localhost:3000
frontend-1  |   On Your Network:  http://<your-machine-ip>:3000
frontend-1  | 
frontend-1  | Note that the development build is not optimized.
frontend-1  | To create a production build, use npm run build.
```
You will now be able to access the application on http://localhost:3000

## Testing
A Postman Collection is included in the repository, called `LoginForm.postman_collection.json`. 

1. Download the Postman Collection
2. In Postman Desktop application, navigate to `Collections`
3. Click on `Import` and choose the downloaded `.json` file
4. Right click / double-finger tap on the imported collection and click on `Run collection`
5. [Optional] set the delay to 500ms
6. Check the box next to `Persist responses for a session`
7. Click on `Run LoginForm`

The tests will run and the results will be displayed, along with the JSON responses of each call.

### Signing Up - New User
This test passes in a user email and password to the `/signup` endpoint that does not already exist in the database. The the call should be succesful, returning a JSON response with the user's email, password, activeuser (which should be **false**), and a success message `"User created successfully"`. Additionally, a status code of 200 indicates that the request has succeeded.

### Logging In - Existing User, Correct Credentials
This test passes in a user email and password to the `/login` that does exist in the database, and is the correct combination. The call should be successful, returning a JSON response with the user's email, password, activeuser (which should be **true**), and a success message `"Logged in successfully"`. Additionally, a status code of 200 indicates that the request has succeeded.

### Logging Out
This test passes in a user email and password to the `/logout` endpoint. The call should be successful, returning a JSON response with the user's email, password, activeuser (which should be **false**), and a success message `"Logged out successfully"`. Additionally, a status code of 200 indicates that the request has succeeded.

### Signing Up - Existing User
This test passes in a user email and password to the `/signup` endpoint that already exists in the database. The the call should fail, returning a JSON response of `"User already exists\n"`. Additionally, a status code of 409 indicates that the request has failed due to a conflict - in this case, the conflict is that there is already an existing key/email with that value in the database.

### Logging In - Existing User, Wrong Credentials
This test passes in a valid user email but incorrect password to the `/login` endpoint. The the call should fail, returning a JSON response of `"Invalid credentials\n"`. Additionally, a status code of 401 indicates that the request has failed due to unauthorization.

### Logging In - Non-Existent User
This test passes in a user email that does not currently exist in the database and a password to the `/login` endpoint. The the call should fail, returning a JSON response of `"User not found\n"`. Additionally, a status code of 404 indicates that the request has failed due to the resource (email) not being found.

## Acknowledgements and References
As a new user of Golang, documentation was referenced to debug, familiarize myself with the language's syntax, best and common practices, as well as popular libraries/packages for handing database connections, HTTP requests, and more. The following are some referenced libraries, documentation, blogs, and forums for this project:

##### Go Documentation
- https://go.dev/doc/database/querying
- https://go.dev/doc/database/open-handle
- https://go.dev/doc/tutorial/database-access
- https://go.dev/src/net/http/status.go
- https://pkg.go.dev/github.com/rs/cors
- https://pkg.go.dev/database/sql
- https://pkg.go.dev/github.com/gorilla/mux
- https://pkg.go.dev/strings
- https://pkg.go.dev/log

##### Stack Overflow
- https://stackoverflow.com/questions/43232463/cors-request-with-golang-backend-doesnt-works
- https://stackoverflow.com/questions/16512009/how-to-extract-the-post-arguments-in-go-server
- https://stackoverflow.com/questions/15672556/handling-json-post-request-in-go

##### Other
- https://www.calhoun.io/inserting-records-into-a-postgresql-database-with-gos-database-sql-package/
- https://benhoyt.com/writings/go-routing/

The React frontend was built with Create React App 
`npx create-react-app my-app`

The Go backend was built with
`go mod init`
