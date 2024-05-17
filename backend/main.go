package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strings"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	Email      string `json:"email"`
	Password   string `json:"password"`
	ActiveUser bool   `json:"activeuser"`
	Message    string `json:"message"`
}

var db *sql.DB

func main() {
	var err error
	// Connecting to the database https://www.calhoun.io/connecting-to-a-postgresql-database-with-gos-database-sql-package/
	db, err = sql.Open("postgres", "user=postgres password=postgres dbname=usersdb host=db port=5432 sslmode=disable")
	if err != nil {
		panic(err)
	}

	// Logging the port that the backend starts on
	log.Println("Starting server on :8080")

	// Setting up routing with mux https://pkg.go.dev/github.com/gorilla/mux
	router := mux.NewRouter()
	router.HandleFunc("/signup", SignupHandler).Methods("POST")
	router.HandleFunc("/login", LoginHandler).Methods("POST")
	router.HandleFunc("/logout", LogoutHandler).Methods("POST")

	// Handling CORS https://stackoverflow.com/questions/43232463/cors-request-with-golang-backend-doesnt-works
	corsOptions := handlers.CORS(
		handlers.AllowedOrigins([]string{"http://localhost:3000"}), // Allowing the frontend domain
		handlers.AllowedMethods([]string{"POST"}),                  // Methods allowed for CORS (only using post methods here)
		handlers.AllowedHeaders([]string{"Content-Type"}),
	)

	// Applying CORS middleware to router
	http.ListenAndServe(":8080", corsOptions(router))
}

func SignupHandler(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var user User
	// Storing decoded info from JSON data into user variable
	err := decoder.Decode(&user)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Hashing the user's password
	hashedPassword, err := HashPassword(user.Password)
	if err != nil {
		http.Error(w, "Failed to hash password", http.StatusInternalServerError)
		return
	}

	// https://go.dev/doc/database/querying
	// Inserting email, hashed password, and activeUser = false into users table
	_, err = db.Exec("INSERT INTO users(email, password, activeUser) VALUES($1, $2, $3)", user.Email, hashedPassword, false)
	if err != nil {
		// Checking if the error message mentions duplicate keys
		if strings.Contains(err.Error(), "duplicate key") {
			http.Error(w, "User already exists", http.StatusConflict)
		} else {
			http.Error(w, "Failed to create user", http.StatusInternalServerError)
		}
		return
	}

	user.Message = "User created successfully"
	// Encoding the updated user struct and sending it as the response
	json.NewEncoder(w).Encode(user)
}

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var user User
	// Storing decoded info from JSON data into user variable
	err := decoder.Decode(&user)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	var hashedPassword string
	// Saving value of password field into hashedPassword for given email
	err = db.QueryRow("SELECT password FROM users WHERE email = $1", user.Email).Scan(&hashedPassword)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "User not found", http.StatusNotFound)
			return
		}
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	// Verifying the user's entered password against the hashed password in the db
	if !CheckPasswordHash(user.Password, hashedPassword) {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	// Changing the value of "activeUser" in the db to true for the logged-in user
	_, err = db.Exec("UPDATE users SET activeUser = true WHERE email = $1", user.Email)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Update the activeUser field in the user struct
	user.ActiveUser = true
	user.Message = "Logged in successfully"

	// Encoding the updated user struct and sending it as the response
	json.NewEncoder(w).Encode(user)
}

func LogoutHandler(w http.ResponseWriter, r *http.Request) {
	decoder := json.NewDecoder(r.Body)
	var user User
	// Storing decoded info from JSON data into user variable
	err := decoder.Decode(&user)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Changing the value of "activeUser" in the db to false for user with the given email
	_, err = db.Exec("UPDATE users SET activeUser = false WHERE email = $1", user.Email)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	user.Message = "Logged out successfully"
	// Encoding the updated user struct and sending it as the response
	json.NewEncoder(w).Encode(user)
}

// HashPassword hashes the given password using bcrypt.
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

// CheckPasswordHash compares the hashed password with the plain text password.
func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}
