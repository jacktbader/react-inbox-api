const express = require('express')
const router = express.Router()
const db = require('../../lib/db')
const { serializeMessages, serializeMessage } = require('./serializers')

router.get('/messages', (req, res, next) => {
  const messages = db.messages.findAll()
  res.json(serializeMessages(req, messages))
})

router.get('/messages/:id', (req, res, next) => {
  const message = db.messages.find(req.params.id)
  res.json(serializeMessage(req, message, true))
})

router.post('/messages', (req, res, next) => {
  const message = db.messages.insert({
    recipient_id: req.body.recipient_id,
    subject: req.body.subject,
    content: req.body.content,
    read: false,
    starred: false,
    labels: [],
  })
  res.json(serializeMessage(req, message, true))
})

router.patch('/messages', (req, res, next) => {
  console.log(JSON.stringify(req.body, null, 2))
  db.messages.findAll(req.body.messageIds).forEach(message => {
    commands[req.body.command](message, req.body)
  })
  res.status(200)
  res.end()
})

const commands = {
  star (message, cmd) {
    message.starred = cmd.star
  },

  delete (message, cmd) {
    db.messages.delete(message.id)
  },

  read (message, cmd) {
    message.read = cmd.read
  },

  addLabel (message, cmd) {
    if (!message.labels.includes(cmd.label)) {
      message.labels.push(cmd.label)
    }
  },

  removeLabel (message, cmd) {
    if (message.labels.includes(cmd.label)) {
      message.labels.splice(message.labels.indexOf(cmd.label, 1))
    }
  },
}

module.exports = router
