const express = require('express')
const router = express.Router()
const AuthRole = require('../middleware/authrole')


const AdminController = require('../Controllers/AdminController')
const UserController=require('../Controllers/UserController')
const CheckUserAuth= require('../middleware/auth')
const passport = require('passport')






//
router.get('/',UserController.Home)
router.post('/verify_login',UserController.Verify_login)
router.post('/register',UserController.Register)
router.get('/dashboard',CheckUserAuth,UserController.Dashboard)
router.get('/logout',CheckUserAuth,UserController.Logout)
router.post('/profile/:id',UserController.Profile)
router.get('/about',CheckUserAuth,UserController.About)
router.get('/contact',CheckUserAuth,UserController.Contact)
router.post('/register_course',UserController.Course)
router.get('/appliedcourses',CheckUserAuth,UserController.AppliedCourses)
router.get('/appliedcourses/view/:id',CheckUserAuth,UserController.View)
router.post('/update_course/:id',CheckUserAuth,UserController.Update_course)
//admincontroller route



router.get('/admin/dashboard',CheckUserAuth,AuthRole('admin'),AdminController.Dasboard) 
router.get('/admin/user_details',CheckUserAuth,AdminController.UserDetails) 
router.get('/admin/registration_details',CheckUserAuth,AdminController.RegistrationDetails) 
router.get('/admin/view_details/:id',CheckUserAuth,AdminController.ViewDetails)
router.get('/admin/registration_details/:id',CheckUserAuth,AdminController.ViewRegistrationDetails) 
router.post('/updateuserdetails/:id',AdminController.UpdateUserDetails)
router.get('/admin/userdelete/:id',AdminController.DeleteUserDetails)
router.get('/admin/deleteregistration/:id',AdminController.DeleteRegistrationDetails)
router.get('/admin/profile',CheckUserAuth,AdminController.AdminProfile)
router.post('/admin/update_status/:id',CheckUserAuth,AdminController.UpdateStatus)

//googlelogin
router.get('/auth/google',passport.authenticate("google",{
    scope:["profile","email"]
}))
router.get('/auth/google/callback',passport.authenticate("google"),UserController.CallBack)







module.exports= router