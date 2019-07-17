const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { ObjectId, Mixed} = Schema.Types

const categoryScheme = new Schema({
    name: {
        unique: true,
        type: String,
    },
    movies: [{
        type: ObjectId,
        ref: 'Movie'
    }],
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
})

categoryScheme.pre('save', next => {
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }

    next()
})


mongoose.model('Category', categoryScheme)