import mongoose from 'mongoose'; 

let isConnected: boolean = false; 

export const connectToDatabase = async () => {
    mongoose.set('strictQuery', true); 
    if(!process.env.MONGO_DB_URL) return console.log('Missing DB URL');

    if(isConnected) {
        return console.log('MongoDB is connected');
    }

    try {
        await mongoose.connect(process.env.MONGO_DB_URL, {
            dbName: 'devstacks'
        })

        isConnected = true; 

    } catch(error) {

    }
}
