import mongoose from 'mongoose';

declare global {
    let mongooseConnection: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    };
}

const globalWithMongoose = global as typeof globalThis & {
    mongooseConnection: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    };
};

if (!globalWithMongoose.mongooseConnection) {
    globalWithMongoose.mongooseConnection = { conn: null, promise: null };
}

async function dbConnect() {
    if (globalWithMongoose.mongooseConnection.conn) {
        return globalWithMongoose.mongooseConnection.conn;
    }

    if (!globalWithMongoose.mongooseConnection.promise) {
        let uri = process.env.MONGODB_URI || '';
        uri = uri.replace(/^["']|["']$/g, '');

        if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
            throw new Error(`Invalid MONGODB_URI: Must start with "mongodb://" or "mongodb+srv://". Did you paste the wrong string in Vercel?`);
        }

        globalWithMongoose.mongooseConnection.promise = mongoose.connect(uri);
    }

    globalWithMongoose.mongooseConnection.conn = await globalWithMongoose.mongooseConnection.promise;
    return globalWithMongoose.mongooseConnection.conn;
}

export default dbConnect;
