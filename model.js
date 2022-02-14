class TokenRepository {
    constructor(dao) {
      this.dao = dao
    }

    createTable() {
      const sql = `
      CREATE TABLE IF NOT EXISTS tokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT,
        txn_hash TEXT,
        method TEXT,
        age TEXT,
        sender TEXT,
        receiver TEXT,
        token_id TEXT)`
      return this.dao.run(sql)
    }

    create(obj) {
        return this.dao.run(
          `INSERT INTO tokens (
            timestamp,
            txn_hash,
            method,
            age,
            sender,
            receiver,
            token_id) VALUES (?,?,?,?,?,?,?)`,
          [obj.timestamp,
          obj.txn_hash,
          obj.method,
          obj.age,
          obj.sender,
          obj.receiver,
          obj.token_id])
      }

    // update(token) {
    //     const { id, timestamp, txn_hash, method,
    //       age, sender, receiver, token_id } = token
    //     return this.dao.run(
    //       `UPDATE tokens SET name = ? WHERE id = ?`,
    //       [name, id]
    //     )
    //   }

    delete(id) {
        return this.dao.run(
          `DELETE FROM tokens WHERE id = ?`,
          [id]
        )
      }

    getById(id) {
        return this.dao.get(
          `SELECT * FROM tokens WHERE id = ?`,
          [id])
      }

    getByReceiverId(receiver) {
        return this.dao.get(
          `SELECT COUNT(*) count FROM tokens WHERE receiver = ?`,
          [receiver])
      }

    getAll() {
        return this.dao.all(`SELECT * FROM tokens`)
      }

    getRecieverTokenCountAll() {
        return this.dao.all(`SELECT receiver, COUNT(*) count FROM tokens
        GROUP BY receiver ORDER BY count(*) DESC`)
      }
  }
  
module.exports = TokenRepository;