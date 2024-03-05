import mysql from 'mysql2/promise'

const config = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  port: 3306,
  database: 'moviedb'
}

const connection = await mysql.createConnection(config)

export class MovieModel {
  static getAll = async ({ genre }) => {
    if (genre) {
      const lowerCaseGenre = genre.toLowerCase()

      const [genres] = await connection.query(
        'SELECT id, name FROM genre WHERE LOWER(name) = ?;', [lowerCaseGenre]
      )

      if (genre.lenght === 0) return []

      const [{ id }] = genres

      const [movies] = await connection.query(
        'SELECT BIN_TO_UUID(m.id) Id, title, year, director, duration, poster, rate FROM movie m ' +
        'INNER JOIN movie_genre ON movie_id = m.id ' +
        'AND genre_id = ?;', [id]
      )

      if (movies.length === 0) return null

      return movies
    }
  }

  static async getById ({ id }) {
    const [movies] = await connection.query(
      'SELECT BIN_TO_UUID(id) Id, title, year, director, duration, poster, rate FROM movie WHERE id = UUID_TO_BIN(?);', id
    )

    if (movies.length === 0) return null

    return movies
  }

  static async create ({ input }) {
    const {
      title,
      year,
      duration,
      director,
      rate,
      poster
    } = input

    const [uuidResult] = await connection.query('SELECT UUID() uuid;')
    const [{ uuid }] = uuidResult

    try {
      await connection.query(`INSERT INTO movie (id, title, year, director, duration, poster, rate)
      VALUES (UUID_TO_BIN("${uuid}"), ?, ?, ?, ?, ?, ?);`, [title, year, director, duration, poster, rate])
    } catch (e) {
      throw new Error('Error creating movie: ', e.getMessage())
      // Enviar la traza a un servicio interno
      // sendLog(e)
    }

    const [movie] = await connection.query(
      `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id 
        FROM movie WHERE id = UUID_TO_BIN(?);`, [uuid]
    )

    if (movie.length === 0) return null

    return movie
  }

  static async delete ({ id }) {
    // Ejercicio: crear delete
  }

  static async update ({ id, input }) {
    // Ejercicio crear update
  }
}
