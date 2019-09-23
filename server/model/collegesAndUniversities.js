const mongoose = require('../db/db');
const defaultSchemaOptions = require('../public/defaultSchemaOptions');
const Schema = mongoose.Schema;

collegesAndUniversities = new Schema({ // 学校
        data: { // 学校json
            type: Array,
            required: true
        },
        ...defaultSchemaOptions
    });
module.exports = mongoose.model('collegesAndUniversities', collegesAndUniversities, 'colleges_and_universities');
