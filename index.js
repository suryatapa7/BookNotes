import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
import pkg from "pg";


const {Pool}= pkg;


dotenv.config();

const app = express();
app.set('view engine', 'ejs');
const port = process.env.PORT || 5000;

const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: "postgres",
  protocol: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
 
});

sequelize.sync()
.then( () => {
  console.log("Database connected")
})
.catch((err) => {
console.log(err) 
});

const db = new Pool({
  connectionString: process.env.DB_URL,
  ssl: { rejectUnauthorized: false } 
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Normalization function
const normalizeString = (str) => {
    return str.replace(/\s+/g, '').replace(/\.+/g, '').toLowerCase();
};

// Function to generate search items
const fetchBook = async (searchQuery) => {
  const bookRecords = [];
  const query = `${searchQuery}`;
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=AIzaSyBjgoIIarTmDpWJcvsEpGNz5Zs5mLFxNKo`;

  try {
    const response = await axios.get(url);
    const items = response.data.items || [];

    for (const bookInfo of items) {
      const title = bookInfo?.volumeInfo?.title || 'Unknown Title';
      const authors = bookInfo?.volumeInfo?.authors;
      const author = authors && authors.length > 0 ? authors[0] : 'Unknown Author';

      const coverUrl = bookInfo?.volumeInfo?.imageLinks?.thumbnail || '/images/no-image.jpg';

      // Check if a review exists for this book and author
      const reviewResult = await db.query(`
        SELECT id, rating FROM reviews
        WHERE books_id IN (
          SELECT id FROM books_read WHERE title = $1 AND author = $2
        )
        ORDER BY rating DESC
      `, [title, author]);

      // Update the logic to check for normalized matches
      const reviewExists = reviewResult.rows.length > 0;

      if (reviewExists) {
        const review = reviewResult.rows[0];
        bookRecords.push({
          title,
          author,
          coverUrl,
          reviewExists,
          rating: review.rating,
          createdAt: review.created_at
        });
      } else {
        bookRecords.push({ title, author, coverUrl, reviewExists });
      }
    }
  } catch (error) {
    console.error(`Error fetching data for query ${searchQuery}: ${error}`);
  }

  return bookRecords;
};


// Search route
app.get("/search", async (req, res) => {
  const query = req.query.query;
  const searchResults = await fetchBook(query);
  
  // Normalize user input for comparison
  const normalizedQuery = normalizeString(query);
  const resultsToDisplay = searchResults.map(record => {
    return {
      ...record,
      normalizedAuthor: normalizeString(record.author),
      normalizedTitle: normalizeString(record.title)
    };
  });

  // Use the normalizedQuery to filter the results
  const filteredResults = resultsToDisplay.filter(result => {
    return result.normalizedTitle.includes(normalizedQuery) || result.normalizedAuthor.includes(normalizedQuery);
  });

  res.render("partials/header.ejs", { bookRecords: filteredResults ,   normalizeString: normalizeString });
});

// Function to generate book cover
const fetchCoverUrl = async (title, author) => {
  const query = `${title} ${author}`;
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=AIzaSyBjgoIIarTmDpWJcvsEpGNz5Zs5mLFxNKo`;

  try {
    const response = await axios.get(url);
    const items = response.data.items || [];
    if (items.length > 0) {
      const coverUrl = items[0].volumeInfo.imageLinks?.thumbnail || '/images/no-image.jpg';
      console.log('coverUrl:', coverUrl);
      return coverUrl;
    } else {
      return '/images/no-image.jpg';
    }
  } catch (error) {
    console.error(`Error fetching cover for ${title} by ${author}: ${error}`);
    return '/images/no-image.jpg';
  }
};

// Favorite books
app.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT id, title, author, read_date FROM books_read WHERE cover_url IS NULL LIMIT 2');
    const updatedBooks = [];
    
    for (const book of result.rows) {
      const coverUrl = await fetchCoverUrl(book.title, book.author);
      if (coverUrl) {
        await db.query('UPDATE books_read SET cover_url = $1 WHERE id = $2', [coverUrl, book.id]);
        console.log(`Updated cover for ${book.title} by ${book.author}`);
      } else {
        console.log(`No cover found for ${book.title} by ${book.author}`);
      }
    
      updatedBooks.push({
        id: book.id,
        title: book.title,
        author: book.author,
        cover_url: coverUrl,
        readDate: book.readDate
      });
    }
    
    const allBooksResult = await db.query('SELECT id, title , author, cover_url, read_date FROM books_read LIMIT 2');
    
    const combinedBooks = allBooksResult.rows.map(book => {
      const updatedBook = updatedBooks.find(b => b.id === book.id);
      return {
        ...book,
        cover_url: updatedBook ? updatedBook.cover_url : book.cover_url
      };
    });
    
    console.log('Combined Books:', combinedBooks); 
    res.render('index.ejs', { bookData: combinedBooks });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving books');
  }
});



// Review
app.get('/view', async (req, res) => {
  try {
    const sort = req.query.sort;
    let query = `
      SELECT r.id AS review_id, r.review, r.rating, b.title, b.author, b.cover_url
      FROM reviews r
      JOIN books_read b ON r.books_id = b.id
    `;

    if (sort === 'rating') {
      query += ' ORDER BY r.rating DESC';
    } else if (sort === 'recency') {
      query += ' ORDER BY b.read_date DESC';
    }

    const result = await db.query(query);
    const reviews = result.rows;
    res.render('view.ejs', { reviews, sort });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error retrieving reviews');
  }
});

app.get('/add', (req, res) => {
  res.render('add', { title: 'Add Review' });
});


// Route to add a new review
app.post("/reviews", async (req, res) => {
  const { book_title, review, rating, created_at, author } = req.body;
  let bookId; 
  try {
    // Input validation
    if (!book_title || !review || !author || !created_at || !rating) {
      return res.status(400).send('All fields are required');
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).send('Rating must be between 1 and 5');
    }

    // Check if the book already exists in the books_read table
    const existingBookResult = await db.query(`
      SELECT id
      FROM books_read
      WHERE title = $1 AND author = $2
    `, [book_title, author]);
    if (existingBookResult.rows.length > 0) {
      return res.status(400).send('Book already exists in the database');
    }

    // Check if the book exists in the books_read table
    const bookResult = await db.query(`
      SELECT id
      FROM books_read
      WHERE title = $1 AND author = $2
    `, [book_title, author]);


    if (bookResult.rows.length === 0) {
      // If the book doesn't exist, add it to the books_read table
      const newBookResult = await db.query(`
        INSERT INTO books_read (title, author, read_date)
        VALUES ($1, $2, $3)
        RETURNING id
      `, [book_title, author, created_at]);
      bookId = newBookResult.rows[0].id; // Get the new book ID
    } else {
      // Get the id of the existing book
      bookId = bookResult.rows[0].id;
    }

    // Add the review to the reviews table
    await db.query(`
      INSERT INTO reviews (review, rating, books_id)
      VALUES ($1, $2, $3)
    `, [review, rating, bookId]);

    res.redirect("/view");
  } catch (err) {
    console.log('Error adding review:', err.message);
    res.status(500).send('Error adding review');
  }
});

// Update review route using POST
app.post('/edit', async (req, res) => {
  const reviewId = req.body.updatedItemId;
  const updatedReview = req.body.updatedReview;
  const updatedRating = req.body.updatedRating;
  try {
    await db.query('UPDATE reviews SET review = $1, rating = $2 WHERE id = $3', [updatedReview, updatedRating, reviewId]);
    res.redirect('/view'); 
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Delete review route
app.post('/delete', async (req, res) => {
  const reviewId = req.body.reviewId;
  console.log(reviewId)
  try {
    await db.query('DELETE FROM reviews WHERE id = $1', [reviewId]);
    await db.query('DELETE FROM books_read WHERE id = $1', [reviewId]);
    console.log(`Deleted review with ID: ${reviewId}`);
    res.redirect('/view'); 
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).send('Error deleting review');
  }
});

app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
});



//API
//API KEy: AIzaSyBjgoIIarTmDpWJcvsEpGNz5Zs5mLFxNKo
