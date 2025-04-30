const express = require('express');
const orderService = require('./services/orderService');

// Pure function to create the Express app with middleware
const createApp = () => {
    const app = express();
    app.use(express.json());
    return app;
};

// Pure function to add routes to the app
const addRoutes = (app) => {
    app.get('/', (req, res) => {
        res.json({ message: 'Digital Drive-Through Order Assembly Service' });
    });

    // Add more routes here when needed
    return app;
};

// Pure function to add error handling
const addErrorHandling = (app) => {
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).json({
            error: err.message || 'Something went wrong!'
        });
    });
    return app;
};

// Compose the application
const composeApp = (...fns) => 
    fns.reduce((app, fn) => fn(app), createApp());

// Create the composed application
const app = composeApp(
    addRoutes,
    addErrorHandling
);

// Start the server
const startServer = (port) => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
        console.log('Order assembly service initialized');
    });
};

const PORT = process.env.PORT || 3000;
startServer(PORT); 