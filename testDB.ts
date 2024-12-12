import prisma from './src/lib/prisma';
import { type User } from '@prisma/client';

prisma.user.findMany().then((users:User[]) => {	console.log(users);});
