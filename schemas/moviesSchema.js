import z from 'zod'

const listaGeneros = ['Action', 'Adventure', 'Drama', 'Comedy', 'Fantasy', 'Thriller', 'Horror', 'Sci-fi', 'Crime']
const movieSchema = z.object({
  title: z.string({
    invalid_type_error: 'Movie Title must be a string',
    required_error: 'Movie Title is required.'
  }),
  year: z.number().int().positive().min(1900).max(2024),
  director: z.string({
    invalid_type_error: 'Movie Director must be a string',
    required_error: 'Movie Director is required'
  }),
  duration: z.number().int().positive().max(200),
  rate: z.number().min(1).max(10).default(5),
  poster: z.string().url({
    message: 'Poster must be a valid URL'
  }),
  genre: z.array(
    z.enum(listaGeneros)
  )
})

export function validateMovie (object) {
  // Devuelve un objeto resolve y te dice si hubo un error o si hay datos
  return movieSchema.safeParse(object)
}

export function validatePartialMovie (object) {
  // Hace que todas y cada una de las propiedades se vuelvan opcionales
  // Si estan en el PATCH, las valida, sino las ignora
  return movieSchema.partial().safeParse(object)
}
