const { findByIdAndUpdate } = require("../models/Course")
const CourseModel = require("../models/Course")
const UserModel = require("../models/User")
const bcrypt = require("bcrypt")

class AdminController {
    static Dasboard = async (req, res) => {
        const { _id, name, email } = req.data1;

        res.render('Admins/dashboard', { n: name, e: email, id: _id })
    }
    static UserDetails = async (req, res) => {
        try {
            const { _id, name, email } = req.data1
            const data = await UserModel.find()
            res.render('Admins/user_details', { n: name, e: email, id: _id, d: data })
        } catch (error) {
            console.log(error)
        }

    }
    static ViewDetails = async (req, res) => {
        const { _id, name, email } = req.data1
        const data = await UserModel.findById(req.params.id)
        //console.log(data)
        res.render('Admins/view_details', { n: name, e: email, id: _id, d: data })
    }
    static UpdateUserDetails = async (req, res) => {
        //    console.log(req.body)
        //    console.log(req.params.id)
        const { name, email, password } = req.body;
        try {
            const hashpassword = await bcrypt.hash(password, 10)
            const updateData = await UserModel.findByIdAndUpdate(req.params.id, {
                name: name,
                email: email,
                password: hashpassword

            })
            await updateData.save()
            return res.redirect('/admin/user_details')
        } catch (err) {
            console.log(err)
        }
    }
    static DeleteUserDetails = async (req, res) => {
        try {
            const data = await UserModel.findByIdAndDelete(req.params.id, {
            })
            await data.delete()
            res.redirect('/admin/user_details')
        } catch (err) {
            console.log(err)
        }
    }
    static RegistrationDetails = async (req, res) => {
        const { _id, name, email } = req.data1
        const data = await CourseModel.find()
        res.render('Admins/registratioin_details', { n: name, e: email, id: _id, d: data })
    }
    static ViewRegistrationDetails = async (req, res) => {
        const { _id, name, email } = req.data1
        const data = await CourseModel.findById(req.params.id)
        res.render('Admins/view_registrationdetails', { n: name, e: email, id: _id, d: data })

    }
    static DeleteRegistrationDetails = async (req, res) => {


        try {
            const DeleteData = await CourseModel.findByIdAndDelete(req.params.id, {
            })
            await DeleteData.delete()
            return res.redirect('/admin/registration_details')
        } catch (err) {
            console.log(err)
        }
    }
    static AdminProfile = async (req, res) => {
        try {

            const { _id, name, email } = req.data1
            res.render('Admins/admin_profile', { n: name, e: email, id: _id })
        } catch (error) {

        }
    }
    static UpdateStatus = async(req, res) => {
        try {
            const{ status, comment } = req.body
            // console.log(status)
            // console.log(comment)
            const result = await CourseModel.findByIdAndUpdate(req.params.id,{
                status:status,
                comment:comment
            })
           await result.save()
            // console.log(data)
            res.redirect('/admin/registration_details')
        } catch(error) {
            console.log(error)
        }

    }


}

module.exports = AdminController