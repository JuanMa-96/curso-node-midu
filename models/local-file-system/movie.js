import { readJSON } from '../../utils.js'
import { randomUUID } from 'node:crypto'

const movies = readJSON('./movies.json')

export class MovieModel {
  static getAll = async ({ genre }) => {
    if (genre) {
      return movies.filter(
        movie => movie.genre.some(g => g.toLowerCase() === genre.toLocaleLowerCase())
      )
    }
    return movies
  }

  static async getById ({ id }) {
    const movie = movies.find(movie => movie.id === id)
    return movie
  }

  static async create ({ input }) {
    const newMovie = {
      id: randomUUID(),
      ...input
    }

    return newMovie
  }

  static async delete ({ id }) {
    const movieIndex = movies.findIndex(movie => movie.id === id)
    if (movieIndex === -1) {
      return false
    }
    movies.splice(movieIndex, 1)
    return true
  }

  static async update ({ id, input }) {
    const indexMovie = movies.findIndex(movie => movie.id === id)

    if (indexMovie < 0) {
      return false
    }

    const updatedMovie = {
      ...movies[indexMovie],
      ...input
    }

    return updatedMovie
  }
}
