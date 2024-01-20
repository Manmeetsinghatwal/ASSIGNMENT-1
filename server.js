/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: ________John Paul Alvarez______________ Student ID: _____187724216_________ Date: ______01/19/2024__________
*  Cyclic Link: ___________________aaaaaaaaa____________________________________________
*
********************************************************************************/

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;
const MoviesDB = require("./modules/moviesDB.js");

app.use(cors());
app.use(express.json());

const db = new MoviesDB();

app.get('/', (req, res) => {
    res.json({ message: 'API Listening' });
});

app.post('/api/movies', async (req, res) => {
    try {
        const newMovie = await db.addNewMovie(req.body);
        res.status(201).json(newMovie);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/movies', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) || 10;
        const title = req.query.title || '';

        const movies = await db.getAllMovies(page, perPage, title);

        res.json(movies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/api/movies/:id', async (req, res) => {
    try {
        const movieId = req.params.id;
        const movie = await db.getMovieById(movieId);
        if (!movie) {
            res.status(404).json({ error: 'Movie not found' });
        } else {
            res.json(movie);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/api/movies/:id', async (req, res) => {
    try {
        const movieId = req.params.id;
        const updatedData = req.body;

        const result = await db.updateMovieById(updatedData, movieId);

        if (result.nModified === 1) {
            res.json({ message: 'Movie updated successfully' });
        } else {
            res.status(404).json({ error: 'Movie not found or not updated' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/api/movies/:id', async (req, res) => {
    try {
        const movieId = req.params.id;

        const result = await db.deleteMovieById(movieId);

        if (result.deletedCount === 1) {
            res.json({ message: 'Movie deleted successfully' });
        } else {
            res.status(404).json({ error: 'Movie not found or not deleted' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

db.initialize(process.env.MONGODB_CONN_STRING).then(() => {
    app.listen(port, () => {
        console.log(`server listening on: ${port}`);
    });
}).catch((err) => {
    console.log(err);
});


/*
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
*/
