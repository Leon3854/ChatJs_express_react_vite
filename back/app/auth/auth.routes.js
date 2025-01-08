import express from 'express'
import { authUser, deleteUser, registerUser } from './auth.controller.js'


const router = express.Router()

router.route('/login').post(authUser)
router.route('/register').post(registerUser)
router.route('/del').delete(deleteUser)
export default router
