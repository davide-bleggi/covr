import { User } from '$lib/db/schemas';
import { connectToDatabase } from '$lib/db/sequelize';

(async () => {

	await connectToDatabase();

	// Create a user
	const user = await User.create({ name: "John Doe", email: "johndoe@example.com" });
	console.log("User created:", user.toJSON());

	// Fetch all users
	const users = await User.findAll();
	console.log("All users:", users.map((u) => u.toJSON()));
})();

console.log('working');
