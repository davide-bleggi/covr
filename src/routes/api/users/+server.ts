// import {connectToDatabase} from "$lib/db/sequelize";
// import {User} from "$lib/db/schemas";
//
// export async function GET() {
//     try {
//         await connectToDatabase();
//         console.log(users)
//         return new Response(JSON.stringify(users), {
//             status: 200,
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         });
//     } catch (error) {
//         console.error('Error fetching users:', error);
//         return new Response('Error fetching users', { status: 500 });
//     }
// }
