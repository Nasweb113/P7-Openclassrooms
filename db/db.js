//this the hash for the password for 123456

const mockHash = "$2b$10$7IzHUQg2mcYxXlbvqgl4/O/Hdn0LyRib6msKXzYd8VypCg.mlaJXG"


const user1 = { email: "Email@email.com", password:mockHash}
const user2 = { email: "notrealmail@email.com", password:mockHash}
const user3 = { email: "nomail@email.com", password:mockHash}
const users = [user1, user2, user3]

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

module.exports = {users, prisma}