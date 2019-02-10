// libs
import path from 'path'
import getOr from 'lodash/fp/getOr'
import filter from 'lodash/fp/filter'
import reduce from 'lodash/fp/reduce'
import uniqueId from 'lodash/fp/uniqueId'
import multer from 'multer'

// src
import { createFBData, makeUID } from '../utils'

const staticPath = path.join(__dirname, '../../../images')

function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png/
    // Check ext
    const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase(),
    )
    // Check mime
    const mimetype = filetypes.test(file.mimetype)

    if (mimetype && extname) {
        return cb(null, true)
    } else {
        cb('Error: Images Only!')
    }
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, staticPath)
    },
    filename: (req, file, cb) => {
        console.log('request: ', file)
        cb(null, makeUID() + file.originalname)
    },
})

function uploadAvatar(req, res) {
    const upload = multer({
        storage: storage,
        limits: {
            fileSize: 1000000000, //size of u file
        },
        fileFilter: (req, file, cb) => {
            checkFileType(file, cb)
        },
    }).single('image')

    return upload(req, res, err => {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            console.log('error: ', err)
            return res.status(200).json({
                status: 500,
                data: {
                    message: 'Storage System Error Occured while uploading',
                },
            })
        } else if (err) {
            // An unknown error occurred when uploading.
            console.log('error: ', err)
            return res.status(200).json({
                status: 500,
                data: { message: err },
            })
        }

        const { headers, file, protocol } = req
        const path =
            protocol + '://' + headers.host + '/images/' + file.filename
        // Everything went fine.
        return res.status(200).json({ status: 200, data: { path } })
    })
}

export default {
    uploadAvatar,
}
