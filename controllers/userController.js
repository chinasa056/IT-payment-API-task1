const userModel = require('../models/user');
const bcrypt = require('bcrypt');

exports.registerUser = async (req, res) => {
  try {
      const { fullName, email, password, confirmPassword } = req.body

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: 'Password does not match'
      })
    };

    const existingEmail = await userModel.find({ email: email.toLowerCase() });

    if (existingEmail) {
      return res.status(400).json({
        message: `user with email: ${email} already exist`
      })
    };

    const saltedRound = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, saltedRound);

    const user = new userModel({
      fullName,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      message: 'Account registered successfully',
      data: user
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Error registering user',
      error: error.message
    })
  }
};