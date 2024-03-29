const verifyToken = require("../middlewares/verifyToken");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const userRouter = require("express").Router();

userRouter.get("/find/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            throw new Error("No such user");
        }
        const { password, ...safeInfo } = user._doc;
        return res.status(200).json(safeInfo);
    } catch (error) {
        return res.status(500).json(error.message);
    }
});

userRouter.get("/findAll", async (req, res) => {
    try {
        const users = await User.find({});
        if (!users) {
            throw new Error("No users");
        }
        const safeInfoFromUsers = users.map((user) => {
            const { password, ...safeInfo } = user._doc;
            return safeInfo;
        });
        return res.status(200).json(safeInfoFromUsers);
    } catch (error) {
        return res.status(500).json(error.message);
    }
});

userRouter.put("/updateUser/:userId", verifyToken, async (req, res) => {
    if (req.params.userId !== req.user.id) {
        return res.status(403).json({ msg: "You can update only your own profile" });
    }

    // if the userid is the same as the logged user id...
    try {
        if (req.body.password) {
            req.body = await bcrypt.hash(req.body.password, 10);
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.userId, { $set: req.body }, { new: true });
        return res.status(200).json(updatedUser);
    } catch (error) {
        return res.status(500).json(error.message);
    }
});

userRouter.delete("/deleteUser/:userId", verifyToken, async (req, res) => {
    if (req.params.userId !== req.user.id) {
        return res.status(403).json({ msg: "You can delete only your own profile" });
    }

    // if the userid is the same as the logged user id...
    try {
        await User.findByIdAndDelete(req.params.userId);
        return res.status(200).json({ msg: "Successfully deleted" });
    } catch (error) {
        return res.status(500).json(error.message);
    }
});

module.exports = userRouter;
