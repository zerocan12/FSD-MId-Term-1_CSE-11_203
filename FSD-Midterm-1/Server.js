import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

let books = [];

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "API is working successfully"
    });
});

app.get("/api/books", (req, res) => {
    res.status(200).json({
        success: true,
        count: books.length,
        data: books
    });
});

app.get("/api/books/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid book ID"
        });
    }

    const book = books.find(book => book.id === id);

    if (!book) {
        return res.status(404).json({
            success: false,
            message: "Book not found"
        });
    }

    res.status(200).json({
        success: true,
        data: book
    });
});

app.post("/api/books", (req, res) => {
    const { id, title, author, category, quantity, available } = req.body;

    if (
        !Number.isInteger(id) ||
        !title?.trim() ||
        !author?.trim() ||
        !category?.trim() ||
        !Number.isInteger(quantity) ||
        !Number.isInteger(available) ||
        quantity < 0 ||
        available < 0 ||
        available > quantity
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid or missing book details"
        });
    }

    const existingBook = books.find(book => book.id === id);

    if (existingBook) {
        return res.status(409).json({
            success: false,
            message: "Book already exists"
        });
    }

    const newBook = {
        id,
        title: title.trim(),
        author: author.trim(),
        category: category.trim(),
        quantity,
        available
    };

    books.push(newBook);

    res.status(201).json({
        success: true,
        message: "Book added successfully",
        data: newBook
    });
});

app.put("/api/books/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid book ID"
        });
    }

    const bookIndex = books.findIndex(book => book.id === id);

    if (bookIndex === -1) {
        return res.status(404).json({
            success: false,
            message: "Book not found"
        });
    }

    const { title, author, category, quantity, available } = req.body;

    if (
        !title?.trim() ||
        !author?.trim() ||
        !category?.trim() ||
        !Number.isInteger(quantity) ||
        !Number.isInteger(available) ||
        quantity < 0 ||
        available < 0 ||
        available > quantity
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid or missing book details"
        });
    }

    const updatedBook = {
        id,
        title: title.trim(),
        author: author.trim(),
        category: category.trim(),
        quantity,
        available
    };

    books[bookIndex] = updatedBook;

    res.status(200).json({
        success: true,
        message: "Book updated successfully",
        data: updatedBook
    });
});

app.delete("/api/books/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid book ID"
        });
    }

    const bookIndex = books.findIndex(book => book.id === id);

    if (bookIndex === -1) {
        return res.status(404).json({
            success: false,
            message: "Book not found"
        });
    }

    const deletedBook = books.splice(bookIndex, 1);

    res.status(200).json({
        success: true,
        message: "Book deleted successfully",
        data: deletedBook[0]
    });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

app.use((err, req, res, next) => {
    console.error(err);

    res.status(err.status || 500).json({
        success: false,
        message: err.status === 400
            ? "Invalid JSON body"
            : "Internal server error"
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});