const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./db');
connectDB();

// Add body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


const Port=5000;
const authRoutes = require('./user/auth');
const heroRoutes = require('./routes/heroRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const projectRoutes = require('./routes/projectRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');

app.use('/',authRoutes);
app.use('/api/hero', heroRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/users', userRoutes);
app.use('/api/blogs', blogRoutes);



app.listen(Port, () => {
    console.log(`Server is running on port ${Port}`);
});
