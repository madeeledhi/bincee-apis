// libs

// src
import db from '../../config/sequelize'

/**
 * Get Single Tuple
 * @property {schema: String} Model Name
 * @property {searchParams: Object} Search parameters
 * @returns Tuple: Object
 */
export function findOne(schema, searchParams) {
    const intent = db[schema]
    return intent.findOne({ where: searchParams })
}

/**
 * Add New Tuple
 * @property {schema: String} Model Name
 * @property {buildParams: Object} build parameters
 * @returns Tuple: Object
 */
export function createOne(schema, buildParams) {
    const intent = db[schema]
    return intent.build(buildParams).save()
}

/**
 * Find Tuple By Id
 * @property {schema: String} Model Name
 * @property {id: Number} Model Name
 * @returns Tuple: Object
 */
export function findById(schema, id) {
    const intent = db[schema]
    return intent.findById(id)
}

/**
 * Get All Tuples
 * @property {schema: String} Model Name
 * @property {limit: Number} Rows Limit
 * @returns Tuple: Array<Object>
 */
export function listAll(schema, limit = 50) {
    const intent = db[schema]
    return intent.findAll({ limit })
}

/**
 * Get List of Tuples
 * @property {schema: String} Model Name
 * @property {searchParams: Object} Search Parameters
 * @returns Tuple: Array<Object>
 */
export function findMultiple(schema, searchParams) {
    const intent = db[schema]
    return intent.findAll({ where: searchParams })
}
