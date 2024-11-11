const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res, next) => {
    try {
        res.json({
            'message': "successful"
        });
    } catch (error) {
        next(error); 
    }
});

app.post('/api', (req, res, next) => {
    try {
        const { token } = req.body;
        if (!token) throw new Error("Token is missing");

        //yaha firebase pr check
        
        res.json({
            "message": "Alert has been sent"
        });
    } catch (error) {
        next(error);
    }
});


app.use((error, req, res, next) => {
    console.error(error.stack);
    res.status(500).json({
        error: 'An unexpected error occurred',
        message: error.message
    });
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
