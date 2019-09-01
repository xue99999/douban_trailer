const {controller, get, post} = require('../lib/decorator')
const {
    getAllMovies,
    getMovieDetail,
} = require('../service/movie')

@controller('/api/v0/movies')
export class movieController {
    @get('/')
    async getMovies(ctx, next) {
        const {type, year} = ctx.params
        const movies = await getAllMovies(type, year)
    
        ctx.body = {
            success: true,
            data: movies
        }
    }

    @get('/:id')
    async getMovieDetail(ctx, next) {
        const id = ctx.params.id
        const movie = await getMovieDetail(id)

        ctx.body = {
            success: true,
            data: movie
        }
    }
}