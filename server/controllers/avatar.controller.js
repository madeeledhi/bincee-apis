// libs
import getOr from 'lodash/fp/getOr'
import filter from 'lodash/fp/filter'
import reduce from 'lodash/fp/reduce'
import uniqueId from 'lodash/fp/uniqueId'
import multer from 'multer'

// src
import { createFBData } from '../utils'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'server/public/images')
    },
    filename: (req, file, cb) => {
        console.log('request: ', file)
        cb(null, uniqueId('') + file.originalname)
    },
})

function uploadAvatar(req, res) {
    const upload = multer({ storage: storage }).single('image')
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
                data: { message: 'System Error Occured while uploading' },
            })
        }
        const { headers, file } = req
        const path = headers.host + '/images/' + file.filename
        // Everything went fine.
        return res.status(200).json({ status: 200, data: { path } })
    })
}

export default {
    uploadAvatar,
}
