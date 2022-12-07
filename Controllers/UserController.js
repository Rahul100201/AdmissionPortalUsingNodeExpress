const UserModel = require('../models/User')
const CourseModel = require('../models/Course')
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const CheckUserAuth = require('../middleware/auth')


class UserController {
    static Home = async (req, res) => {
        try {
            res.render('home.ejs', { message: req.flash('error') })
        } catch (err) {
            console.log(err)
        }
    }
    static Dashboard = async (req, res) => {
        try {
            const { _id, name, email } = req.data1;
            const btech = await CourseModel.findOne({ user_id: _id, course: 'B.tech' });
            const mtech = await CourseModel.findOne({ user_id: _id, course: 'M.tech' });
            const bca = await CourseModel.findOne({ user_id: _id, course: 'BCA' });
            const mba = await CourseModel.findOne({ user_id: _id, course: 'MBA' });
            res.render('admin/dashboard', { n: name, e: email, id: _id, b: btech, m: mtech, c: bca, a: mba })
        } catch (err) {
            console.log(err)
        }

    }
    static Verify_login = async (req, res) => {

        try {
            const { email, password } = req.body;
            //console.log(email,password)
            if (email && password) {
                const user = await UserModel.findOne({ email: email })
                //console.log(user.password)
                if (user != null) {
                    const isMatched = await bcrypt.compare(password, user.password)
                    if ((user.email === email) && isMatched) {
                        if (user.role == 'user') {
                            //verifytoken
                            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '100m' });
                            // console.log(token)
                            res.cookie('token', token)
                            res.redirect('/dashboard')
                        }
                        if (user.role == 'admin') {
                            //verifytoken
                            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '100m' });
                            // console.log(token)
                            res.cookie('token', token)
                            res.redirect('/admin/dashboard')
                        }

                    } else {
                        req.flash('error', 'Email & Password in invalid !!')
                        return res.redirect('/')
                    }
                } else {
                    req.flash('error', 'You are not registered user !!')
                    return res.redirect('/')

                }
            } else {
                req.flash('error', 'All Fields Required !!')
                return res.redirect('/')
            }
        } catch (err) {
            console.log(err)
        }
    }
    static Register = async (req, res) => {
        const { name, email, password, confirmpassword } = req.body;
        // console.log(name,email,password,confirmpassword)
        const user = await UserModel.findOne({ email: email })
        if (user) {
            req.flash('error', 'Email is already exists!!')
            return res.redirect('/')
        } else {
            if (name && email && password && confirmpassword) {
                if (password == confirmpassword) {
                    try {
                        const hashpassword = await bcrypt.hash(password, 10)
                        const result = await UserModel({
                            name: name,
                            email: email,
                            password: hashpassword
                        })
                        await result.save()
                        req.flash('error', 'Register Successful,Please Login !!!!')
                        return res.redirect('/')
                    } catch (err) {
                        console.log(err)
                    }
                } else {
                    req.flash('error', 'Password and confirm password does not match !!!')
                    return res.redirect('/')
                }
            } else {
                req.flash('error', 'All fields are require !!!')
                return res.redirect('/')
            }
        }
    }
    static Logout = async (req, res) => {
        try {
            res.clearCookie('token')
            res.redirect('/')
        } catch (err) {
            console.log(err)
        }
    }
    static Profile = async (req, res) => {
        const { email,old_password, new_password, re_enterpassword } = req.body
       //console.log(old_password, new_password, re_enterpassword)
       if (email && old_password) {
        const user = await UserModel.findOne({ email: email })
        // console.log(user.password)
        const isMatched = await bcrypt.compare(old_password, user.password)
        // console.log(isMatched)
        if(isMatched && user.password){
            const hashpassword = await bcrypt.hash(new_password, 10)
            const updateData = await UserModel.findByIdAndUpdate(req.params.id, {
                password: hashpassword
            })
            await updateData.save()
            return res.redirect('/dashboard')
        }
       }
    }
    static About = async (req, res) => {
        try {
            res.render('admin/about')
        } catch (error) {
            console.log(error)
        }
    }
    static Contact = async (req, res) => {
        try {
            res.render('admin/contact')
        } catch (error) {
            console.log(error)

        }
    }
    static Course = async (req, res) => {
        const { user_id, name, email, mobile, address, gender, college, branch, course } = req.body
        // console.log(name,email,mobile,address,gender,college,branch,course)

        try {
            const data = await CourseModel({
                user_id: user_id,
                name: name,
                email: email,
                mobile: mobile,
                address: address,
                gender: gender,
                college: college,
                branch: branch,
                course: course
            })
            await data.save()
            return res.redirect('/dashboard')
        } catch (err) {
            console.log(err)
        }
    }
    static AppliedCourses = async (req, res) => {
        const { email } = req.data1
        const data = await CourseModel.find({ email:email })
        //console.log(data)
        res.render('applied_courses', { d: data })
          
    }
    static View = async (req, res) => {
        try {
            // const { _id } = req.data1
            const data = await CourseModel.findById(req.params.id)
            //console.log(data)
            res.render('view_detail', { d: data })
            
        } catch (error) {
            console.log(error)
        }
    }
    static Update_course = async (req, res) => {
        // console.log(req.body)
        // console.log(req.params.id)
        try {
            const data = await CourseModel.findByIdAndUpdate(req.params.id, {
                name: req.body.name,
                email: req.body.email,
                mobile: req.body.mobile,
                address: req.body.address,
                gender: req.body.gender,
                college: req.body.college,
                branch: req.body.branch,
                course: req.body.course

            })
            await data.save()
            res.redirect('/appliedcourses')
        } catch (err) {
            console.log(err)
        }
    }
    static CallBack = async (req, res) => {
        try { 
            // console.log(req.user.displayName)
            const checkuser = await UserModel.findOne({email:req.user.emails[0].value}) 
            if(checkuser){
                if (checkuser.role == 'user') {
                    //verifytoken
                    const token = jwt.sign({ userId: checkuser._id }, process.env.JWT_SECRET_KEY, { expiresIn: '100m' });
                    // console.log(token)
                    res.cookie('token', token)
                    res.redirect('/dashboard')
                }
            }else{
                const result = await UserModel({
                name: req.user.displayName,
                email: req.user.emails[0].value,
                
            })
            await result.save()
            const user = await UserModel.findOne({ email:req.user.emails[0].value})
            if (user.role == 'user') {
                //verifytoken
                const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '100m' });
                // console.log(token)
                res.cookie('token', token)
                res.redirect('/dashboard')
            }
            }
            
        } catch (error) {
            console.log(error)

        }
    }
}

module.exports = UserController


