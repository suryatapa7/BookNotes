# Book Notes

This is a personal project to keep track of the books I've read and my thoughts on them. It's a simple web app built with Express and EJS, and uses PostgreSQL for the database.

## Usage

To run the app, clone the repository and install the dependencies with `npm install`. Make sure you have PostgreSQL installed and running on your machine. Create a new database and update the `DATABASE_URL` environment variable in the `.env` file.

Run the app with `npm start`, and open a web browser to `http://localhost:3000`. You should see a list of books, with links to add a new book and edit an existing one. Clicking on a book will take you to a page with more information about the book and a form to add a review.

## Features

* Add a new book with title, author, cover image, and read date
* Edit an existing book
* Add a review for a book with text and rating (1-5)
* View all books and their associated reviews

## Roadmap

* Add user authentication
* Add search functionality
* Add ability to sort books by title, author, or read date
* Add ability to delete books and reviews
* Add ability to import books from a CSV file
* Add ability to export books and reviews to a CSV file
* Add ability to add tags to books
* Add ability to filter books by tags
* Add ability to add a book to a "to-read" list
* Add ability to mark a book as "currently reading"
