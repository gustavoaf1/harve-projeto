import mysql from "mysql2/promise"

let cachedConnection = null

export async function connectToDatabase() {
  if (cachedConnection) {
    return cachedConnection
  }

  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "senha1",
    database: "harve",
    waitForConnections: true,
  })

  cachedConnection = connection
  return connection
}
