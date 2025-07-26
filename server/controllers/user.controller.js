import { Webhook } from "svix";
import User from "../models/user.models.js";
import razorpay from "razorpay";
import transactionModel from "../models/transactionModel.js";

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

// Api controller function to get user available credits data

const userCredits = async (req, res) => {
  try {
    const clerkId = req.clerkId; // Use the clerkId from the authUser middleware

    const user = await User.findOne({ clerkId });

    if (user) {
      res.json({ success: true, credits: user.creditBalance });
    } else {
      res.json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//gateway initalize

const razorpayInstance = new razorpay({
  key_id:"rzp_test_1FLqXEVbVBM641", // replace with your actual API key
  key_secret:"UtYeDzBaefpPGkH8U98qGSlT", // replace with your actual API secret
});

console.log(process.env.CLIPDROP_API);

// apI TO MAKE PAYMENT CREDITS 

// const paymentRazorpay = async(req, res)=>{
//   try {

//     const {clerkId, planId} = req.body
//     const userData = await User.findOne({clerkId})

//     if(!userData || !planId){
//       return res.json({success: false, message: "Invalid Credentials"})
//     }

//     let credits, plan , amount, date 

//     switch(planId){
//       case "Basic":
//         plan = 'Basic'
//         credits = 100
//         amount = 10
//         break;

//       case "Advanced":
//         plan = 'Advanced'
//         credits = 500
//         amount = 50
//         break;

//       case "Business":
//         plan = 'Business'
//         credits = 5000
//         amount = 250
//         break;

//       default:
//         break;
//     }

//     date = Date.now()


//     // creating transaction

//     const transactionData = {
//       clerkId,
//       plan,
//       amount,
//       date,
//       credits
//     }

//     const newTransaction = await transactionModel.create(transactionData)

//     const options = {
//       amount : amount*100,
//       currency: process.env.CURRENCY,
//       receipt: newTransaction._id
//     }

//     await razorpayInstance.orders.create(options,(error, order)=>{
//       if(error){
//         return res.json({success: false, message: error})
//       }

//       res.json({success: true, order})
//     })
    
//   } catch (error) {
//     console.log(error.message);
//     res.json({ success: false, message: error.message });
//   }
// }

const paymentRazorpay = async (req, res) => {
  try {
    const { clerkId, planId } = req.body;
    const userData = await User.findOne({ clerkId });

    if (!userData || !planId) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    let credits, plan, amount;

    switch (planId) {
      case "Basic":
        plan = "Basic";
        credits = 100;
        amount = 10;
        break;
      case "Advanced":
        plan = "Advanced";
        credits = 500;
        amount = 50;
        break;
      case "Business":
        plan = "Business";
        credits = 5000;
        amount = 250;
        break;
      default:
        return res.json({ success: false, message: "Invalid Plan" });
    }

    const date = Date.now();

    const newTransaction = await transactionModel.create({
      clerkId,
      plan,
      amount,
      date,
      credits,
    });

    const options = {
      amount: amount * 100,
      currency: process.env.CURRENCY || "INR",
      receipt: newTransaction._id.toString(),
    };

    // ✅ FIX: No callback, just await
    const order = await razorpayInstance.orders.create(options);

    if (!order) {
      return res.json({ success: false, message: "Failed to create order" });
    }

    res.json({ success: true, order });

  } catch (error) {
    console.error("Razorpay Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};


export {clerkWebhooks, userCredits, razorpayInstance, paymentRazorpay};