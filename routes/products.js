const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Product = require('../models/Product');

// @route   GET api/products
// @desc    Get all products for a user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const products = await Product.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/products
// @desc    Create a product
// @access  Private
router.post('/', [auth, [
    check('title', 'Title is required').not().isEmpty(),
    check('price', 'Price is required').not().isEmpty(),
    check('category', 'Category is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const newProduct = new Product({
            user: req.user.id,
            title: req.body.title,
            price: req.body.price,
            taxes: req.body.taxes || 0,
            ads: req.body.ads || 0,
            discount: req.body.discount || 0,
            total: req.body.total,
            category: req.body.category
        });

        const product = await newProduct.save();
        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/products/:id
// @desc    Update a product
// @access  Private
router.put('/:id', auth, async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Make sure user owns product
        if (product.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        product = await Product.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        res.json(product);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/products/:id
// @desc    Delete a product
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Make sure user owns product
        if (product.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await product.remove();
        res.json({ message: 'Product removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router; 