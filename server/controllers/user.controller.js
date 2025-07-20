// Api controller function

import { Webhook } from "svix";
import User from "../models/user.models.js";

// http://localhost:3000/api/users/webhooks

const clerkWebhooks = async (req, res) => {
  try {
    // Create a svix instance with clerk webhook secret

    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const {data, type} = req.body;

    switch(type){
        case "user.created":{
            const userData = {
                clerkId: data.id,
                email: data.email_addresses[0].email_address,
                firstname: data.first_name,
                lastname: data.last_name,
                image: data.image_url
            }

            await User.create(userData)
            res.json({})
            break;
        }
        case "user.updated":{

            const userData = {
                email: data.email_addresses[0].email_address,
                firstname: data.first_name,
                lastname: data.last_name,
                image: data.image_url
            }

            await User.findOneAndUpdate({clerkId: data.id}, userData)
            res.json({})

            break;
        }
        case "user.deleted":{

            await User.findOneAndDelete({clerkId: data.id})
            res.json({})

            break;
        }
        default: 
            break;
    }

  } catch (error) {

    console.log(error.message)
    res.json({ success:false, message: error.message })
  }
};

export {clerkWebhooks};
