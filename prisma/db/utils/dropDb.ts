import { PrismaClient } from '@prisma/client'

/*
    @{baseDbName} is the base database which is defined within the docker compose configuration
    @{dbName} is the database which is defined at the end of the process.env.DATABASE_URL
*/
const baseDbName = "development";
const dbName = "scorm";

process.env.DATABASE_URL=process.env.DATABASE_URL!.replace(/\/[^\/]*$/, `/${baseDbName}`)

const prisma = new PrismaClient()

try {
    await prisma.$executeRawUnsafe(`DROP DATABASE IF EXISTS ${dbName};`);
    console.log(`Successfully deleted "${dbName}" database!`)
} catch (e) {
    console.error(e);
}