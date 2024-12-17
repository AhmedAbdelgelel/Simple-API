const jwt = require("jsonwebtoken");
const {
  signupSchema,
  loginSchema,
  changePasswordSchema,
} = require("../middlewares/validator");
const User = require("../models/usersModel");
const { doHash, doHashValidation } = require("../utils/hashing");

exports.signUp = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { error, value } = signupSchema.validate({ email, password });
    if (error) {
      return res.status(401).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(401)
        .json({ success: false, message: "User already exists!" });
    }

    const hashedPassword = await doHash(password, 12);

    const newUser = new User({
      email,
      password: hashedPassword,
    });

    const result = await newUser.save();
    result.password = undefined;

    res.status(201).json({
      success: true,
      message: "Your account has been created successfully",
      result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { error, value } = loginSchema.validate({ email, password });
    if (error) {
      return res.status(401).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const existingUser = await User.findOne({ email }).select("+password");
    if (!existingUser) {
      return res.status(401).json({
        success: false,
        message: "User does not exist!",
      });
    }
    const result = await doHashValidation(password, existingUser.password);
    if (!result) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }
    const token = jwt.sign(
      {
        userId: existingUser._id,
        email: existingUser.email,
        verified: existingUser.verified,
      },
      process.env.TOKEN_SECRET,
      { expiresIn: "8h" }
    );
    res
      .cookie("Authorization", "Bearer " + token, {
        expires: new Date(Date.now() + 8 * 36000000),
      })
      .json({
        success: true,
        message: "Logged successfully",
        token,
      });
  } catch (error) {
    console.log(error);
  }
};

exports.logOut = async (req, res) => {
  try {
    res.clearCookie("Authorization").status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to log out" });
  }
};

exports.changePassword = async (req, res) => {
  const { userId } = req.user;
  const { oldPassword, newPassword } = req.body;
  try {
    const { error, value } = changePasswordSchema.validate({
      newPassword,
      oldPassword,
    });
    if (error) {
      return res.status(401).json({
        success: false,
        message: "You must provide new & old passwords",
      });
    }
    const existingUser = await User.findOne({ _id: userId }).select(
      "+password"
    );
    if (!existingUser) {
      return res
        .status(401)
        .json({ success: false, message: "User does not exists!" });
    }
    const result = await doHashValidation(oldPassword, existingUser.password);
    if (!result) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials!",
      });
    }
    const hashedPassword = await doHash(newPassword, 12);
    existingUser.password = hashedPassword;
    await existingUser.save();
    return res
      .status(200)
      .json({ success: true, message: "Password updated!" });
  } catch (error) {
    console.log(error);
  }
};
