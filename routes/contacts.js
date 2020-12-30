const express = require('express');
const router = express.Router();

//@Route POST /api/contacts
//@desc Create a contact
//@access Private

router.post('/', (req, res) => {
  res.send('Create a conatct');
});

//@Route GET /api/contacts
//@desc Get contacts
//@access Private
router.GET('/', (req, res) => {
  res.send('Get all Contacts');
});

//@Route PUT /api/contacts
//@desc Login user
//@access Private
router.PUT('/:id', (req, res) => {
  res.send('Update a contact');
});

//@Route DELETE /api/contacts
//@desc Delete contact
//@access Private
router.DELETE('/:id', (req, res) => {
  res.send('Delete a contact');
});

module.exports = router;
