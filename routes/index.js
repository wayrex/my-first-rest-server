'use strict'

/**
 * Module dependencies
 */

const
  _ = require('lodash'),
  errors = require('restify-errors')

const Todo = require('../models/todo')

server.post('/todos', function (req, res, next) {
  let data = req.body || {}

  let todo = new Todo(data)
  todo.save(function (err) {
    if(err) {
      log.error(err)
      return next(new errors.InternalError(err.message))
      next()
    }

    res.send(201, todo)
    next()
  })
})

/**
 * List
 */

server.get('/todos', function (req, res, next) {
  Todo.apiQuery(req.params, function(err, docs) {

    if(err) {
      log.error(err)
      return next(new errors.InvalidContentError(err.errors.name))
    }

    res.send(docs)
    next()
  })
})

/**
 * Get
 */

server.get('/todos:todo_id', function (req, res, next) {
  Todo.findOne({ _id: req.params.todo_id}, function (err, doc) {

    if(err) {
      log.error(err)
      return next(new errors.InvalidContentError(err.errors.name))
    }

    res.send(doc)
    next()
  })
})

/**
 * Update
 */

server.put('/todos:todo_id', function (req, res, next) {
  let data = req.body || {}

  if (!data._id) {
    _.extend(data, {
      _id: req.params.tood_id
    })
  }

  Todo.findOne({ _id: req.params.todo_id}, function (err, doc) {

    if (err) {
      log.error(err)
      return next(new errors.InvalidContentError(err.errors.name))
    } else if (!doc) {
      return next(new errors.ResourceNotDoundError('The resource you requested could not be found.'))
    }

    Todo.update({ _id: data._id}, data, function (err) {

      if (err) {
        log.error(err)
        return next(new errors.InvalidContentError(err.errors.name))
      }

      res.send(200, data)
      next()
    })
  })
})

/**
 * Delete
 */
server.del('/todos/:todo_id', function (req, res, next) {
  Todo.remove({ _id: req.params.todo_id }, function (err) {
    if (err) {
      log.error(err)
      return next(new errors.InvalidContentError(err.errors.name))
    }

    res.send(204)
    next()
  })
})
