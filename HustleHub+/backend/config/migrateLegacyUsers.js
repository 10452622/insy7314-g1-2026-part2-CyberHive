const fs = require("fs");
const path = require("path");
const User = require("../models/User");

const usersFilePath = path.join(__dirname, "../data/users.json");

async function migrateLegacyUsers() {
    if (!fs.existsSync(usersFilePath)) return;

    const legacyUsers = JSON.parse(fs.readFileSync(usersFilePath, "utf8"));
    let migratedCount = 0;

    for (const user of legacyUsers) {
        if (!user.id || !user.email || !user.password) continue;

        const existingUser = await User.findOne({
            $or: [{ _id: user.id }, { email: user.email.toLowerCase() }]
        });
        if (existingUser) continue;

        await User.create({
            _id: user.id,
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            username: user.username || "",
            email: user.email.toLowerCase(),
            password: user.password,
            role: user.role,
            resetPasswordToken: user.resetPasswordToken,
            resetPasswordExpires: user.resetPasswordExpires
        });
        migratedCount += 1;
    }

    if (migratedCount) console.log(`Imported ${migratedCount} legacy users into MongoDB.`);
}

module.exports = migrateLegacyUsers;