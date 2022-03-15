const { Router } = require('express');
const Order = require('../models/Order');
const pool = require('../utils/pool');

module.exports = Router()
  .post('/', async (req, res) => {
    const order = await Order.insert(req.body);
    res.json(order);
  })

  .get('/:id', async (req, res) => {
    const order = await Order.getById(req.params.id);
    res.json(order);
  })

  .get('/', async (req, res) => {
    const orders = await Order.getAll();
    res.json(orders);
  })

  .patch('/:id', async (req, res) => {
    const { id } = req.params;
    const orders = await Order.updateById(id, req.body);

    res.json(orders);
  })

  .delete('/:id', async (req, res) => {
    const order = await Order.deleteById(req.params.id);
    res.json(order);
  });
