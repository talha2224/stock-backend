const { Card } = require("../models/card.model");

// Create a new card
const createCard = async (req, res) => {
    try {
        const { userId, name, cardNumber, month, year, expiry, cvv } = req.body;
        if (!userId || !name || !cardNumber || !month || !year || !expiry || !cvv) {
            return res.status(400).json({ message: 'All fields are required', code: 400 });
        }

        // Create a new card
        const newCard = new Card({userId,name,cardNumber,month,year,expiry,cvv,});

        // Save the card to the database
        await newCard.save();
        return res.status(201).json({ data: newCard, message: 'Card created successfully', code: 201 });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error', code: 500 });
    }
};


const getAllCardsByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const cards = await Card.find({ userId });
        return res.status(200).json({ data: cards, code: 200 });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error', code: 500 });
    }
};

const getCardById = async (req, res) => {
    try {
        const cardId = req.params.id;
        const card = await Card.findById(cardId);
        if (!card) {
            return res.status(404).json({ message: 'Card not found', code: 404 });
        }
        return res.status(200).json({ data: card, code: 200 });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error', code: 500 });
    }
};

const updateCardById = async (req, res) => {
    try {
        const cardId = req.params.id;
        const updatedCard = await Card.findByIdAndUpdate(cardId,{ ...req.body },{ new: true, runValidators: true });
        if (!updatedCard) {
            return res.status(404).json({ message: 'Card not found', code: 404 });
        }
        return res.status(200).json({ data: updatedCard, code: 200 });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error', code: 500 });
    }
};

const deleteCardById = async (req, res) => {
    try {
        const cardId = req.params.id;
        const deletedCard = await Card.findByIdAndDelete(cardId);
        if (!deletedCard) {
            return res.status(404).json({ message: 'Card not found', code: 404 });
        }
        return res.status(200).json({ message: 'Card deleted successfully', code: 200 });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error', code: 500 });
    }
};

module.exports = {
    getAllCardsByUserId,
    getCardById,
    updateCardById,
    deleteCardById,
    createCard
};
