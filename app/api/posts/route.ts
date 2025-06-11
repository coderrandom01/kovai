import connectMongoose from '../../../utils/connectMongo'
import addListingModel from '../../../models/postModel'
export async function GET(){
    try{
        await connectMongoose()
         const postData = await addListingModel.find({})
         return Response.json(postData)
    }catch(e : any){
        return Response.json({message: e.message})
    }

}