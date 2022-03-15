const pool = require('../utils/pool');

module.exports = class Order {
  id;
  product;
  quantity;

  constructor(row) {
    this.id = row.id;
    this.product = row.product;
    this.quantity = row.quantity;
  }

  static async insert({ product, quantity }) {
    try {
      const { rows } = await pool.query(
        'INSERT INTO orders(product, quantity) VALUES ($1, $2) RETURNING *;',
        [product, quantity]
      );
      return new Order(rows[0]);
    } catch (error) {
      console.error(error.message);
    }
  }
  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM orders;');
    return rows.map((row) => new Order(row));
  }

  static async getById(id) {
    try {
      const { rows } = await pool.query('SELECT * FROM orders WHERE id=$1;', [
        id,
      ]);

      if (!rows[0]) return null;

      return new Order(rows[0]);
    } catch (error) {
      console.error(error.message);
      return null;
    }
  }

  static async updateById(id, { product, quantity }) {
    try {
      const { rows } = await pool.query(
        'UPDATE orders SET product=$2, quantity=$3 WHERE id=$1 RETURNING *;',
        [id, product, quantity]
      );

      if (!rows[0]) return null;

      return new Order(rows[0]);
    } catch (error) {
      console.error(error.message);
      return null;
    }
  }

  static async deleteById(id) {
    const { rows } = await pool.query(
      'DELETE FROM orders WHERE id=$1 RETURNING *;',
      [id]
    );

    if (!rows[0]) return null;
    return new Order(rows[0]);
  }
};
