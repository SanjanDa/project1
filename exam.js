// exam.js
const express = require('express');
const router = express.Router();
const questions = require('../data/questions.json');

router.get('/subjects', (req, res) => {
    const subjects = Object.keys(questions);
    res.json({ subjects });
});

router.get('/topics', (req, res) => {
    const { subject } = req.query;
    const topics = subject ? Object.keys(questions[subject]) : [];
    res.json({ topics });
});

router.get('/subtopics', (req, res) => {
    const { topic } = req.query;
    const subtopics = topic ? Object.keys(questions[topic]) : [];
    res.json({ subtopics });
});

router.get('/questions', (req, res) => {
    const { subject, topic, subtopic, numQuestions } = req.query;
    const selectedQuestions = questions[subject][topic][subtopic]
        .sort(() => 0.5 - Math.random())
        .slice(0, numQuestions);
    res.json({ questions: selectedQuestions });
});

module.exports = router;
