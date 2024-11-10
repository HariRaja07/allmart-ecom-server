const User = require("../models/userSchema");
const jwt = require("jsonwebtoken");

const authUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const token = jwt.sign(user._id, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    //Set JWT as HTTP-Only Cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(200).json({
      status: "success",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } else {
    res.status(400).json({
      status: "fail",
      message: "Invalid email or password",
    });
  }
};

const RegisterUser = async (req, res) => {
  const { name, email, password } = req.body;

  const UserExists = await User.findOne({ email });

  if (UserExists) {
    return res.status(404).json({
      status: "fail",
      message: "User already exists",
    });
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    const token = jwt.sign(user._id, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    //Set JWT as HTTP-Only Cookie
    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(200).json({
      status: "success",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } else {
    res.status(400).json({
      status: "fail",
      message: "Invalid user data",
    });
  }
};

const logoutUser = async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expiresIn: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully" });
};

const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json({
      status: "success",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } else {
    res.status(400).json({
      status: "fail",
      message: "User Not Found",
    });
  }
};

const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const UpdatedUser = await user.save();

    res.status(200).json({
      status: "success",
      data: {
        _id: UpdatedUser._id,
        name: UpdatedUser.name,
        email: UpdatedUser.email,
        isAdmin: UpdatedUser.isAdmin,
      },
    });
  } else {
    res.status(400).json({
      status: "fail",
      message: "User Not Found",
    });
  }
};

const getUser = async (req, res) => {
  const user = await User.find({});

  if (user) {
    res.status(200).json({ status: "success", data: user });
  } else {
    res.status(400).json({
      status: "fail",
      message: "User Not Found",
    });
  }
};

const getUserByID = async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.status(200).json({ status: "success", data: user });
  } else {
    res.status(400).json({
      status: "fail",
      message: "User Not Found",
    });
  }
};

const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      return res.status(400).json({
        status: "fail",
        message: "Cannot delete admin user",
      });
    }
    await User.deleteOne({ _id: user._id });
    res.status(200).json({ message: "User Deletes" });
  } else {
    res.status(400).json({
      status: "fail",
      message: "User Not Found",
    });
  }
};

const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();

    res.status(200).json({
      status: "success",
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      },
    });
  } else {
    res.status(400).json({
      status: "fail",
      message: "User Not Found",
    });
  }
};

export {
  authUser,
  RegisterUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUser,
  deleteUser,
  getUserByID,
  updateUser,
};
