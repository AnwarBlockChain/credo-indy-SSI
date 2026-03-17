// const mongoose = require('mongoose')
import mongoose from 'mongoose'

 const connect = async () => {
    try {
        const db = await mongoose.connect("mongodb+srv://anwarpluton:VMfEfEQymYL4ssZt@cluster0.q7gvt.mongodb.net/Credo");

        console.log(`DB connected: ${db.connection.host} `);
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1); // Exit if connection fails
    }
};

export { connect };
                                     