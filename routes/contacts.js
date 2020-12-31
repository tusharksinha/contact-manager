const express = require('express');
const { check, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

//@Route POST /api/contacts
//@desc Create a contact
//@access Private

router.post(
  '/',
  [auth, [check('name', 'Name is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, phone, type } = req.body;
    try {
      const newContact = new Contact({
        name,
        email,
        phone,
        type,
        user: req.user.id,
      });

      const contact = await newContact.save();

      res.status(201).json({ contact });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ msg: 'Oops! Something went wrong' });
    }
  }
);

//@Route GET /api/contacts
//@desc Get contacts
//@access Private
router.get('/', auth, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({
      created: -1,
    });
    res.status(200).json({ contacts });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: 'Oops! Something went wrong' });
  }
});

//@Route PUT /api/contacts
//@desc Login user
//@access Private
router.put('/:id', auth, async (req, res) => {
  const { name, email, phone, type } = req.body;
  //Build Contact Object

  const contactFields = {};
  if (name) contactFields.name = name;
  if (email) contactFields.email = email;
  if (phone) contactFields.phone = phone;
  if (type) contactFields.type = type;

  try {
    let contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ msg: 'Contact not found' });
    if (contact.user.toString() !== req.user.id)
      return res.status(401).json({ msg: 'Not authorized to update' });

    contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { $set: contactFields },
      { new: true }
    );

    res.status(200).json({ contact });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: 'Oops! Something went wrong' });
  }
});

//@Route DELETE /api/contacts
//@desc Delete contact
//@access Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ msg: 'Contact not found!' });
    if (contact.user.toString() !== req.user.id)
      return res.status(404).json({ msg: 'Not authorized to delete' });

    await Contact.findByIdAndRemove(req.params.id);
    res.status(200).json({ msg: 'Contact deleted' });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: 'Oops! Something went wrong' });
  }
});

module.exports = router;
