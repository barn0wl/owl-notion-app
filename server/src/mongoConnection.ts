import mongoose, { ConnectOptions } from "mongoose";
import dotenv from "dotenv";


dotenv.config()
const dbName = 'owl-tasks-app'
const uri = `mongodb+srv://yohannzoh:${process.env.MONGO_USER_PASSW}@cluster0.znrk3dv.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster0`

const clientOptions: ConnectOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } }

export const connectToMongo = async () => {
    try {
        // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
        await mongoose.connect(uri, clientOptions);
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
      } catch(error) {
        console.log(error)
      }
    }