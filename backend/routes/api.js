// /backend/routes/api.js - Finalized Routes
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const bookingController = require('../controllers/bookingController');
const chatbotController = require('../controllers/chatbotController');

// --- Admin Routes ---
router.post('/admin/shows', adminController.createShow);
router.get('/admin/shows', adminController.listAllShows);
router.get('/admin/bookings', bookingController.listAllBookingsAdmin); // Admin Booking View

// --- User/Public Routes ---
router.get('/shows', bookingController.listAvailableShows);
router.post('/book', bookingController.createBooking);
router.get('/bookings/:userId', bookingController.listUserBookings); // User Booking Status

// --- Chatbot Route ---
router.post('/chat', chatbotController.chatWithGroq);

module.exports = router;