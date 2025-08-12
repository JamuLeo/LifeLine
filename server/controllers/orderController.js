import Campaign from "../models/Campaign.js";
import Order from "../models/Order.js";
import stripe from "stripe";


// place Order COD : /api/order/cod
export const placeOrderCOD = async (req, res)=>{
    try {
        const userId = req.userId; 
        const { items, address } =req.body;
        if(!address || items.length === 0){
            return res.json({success: false, message :"Invalide data"})
        }
        
        let amount = await items.reduce(async (acc, item)=>{
            const campaign = await Campaign.findById(item.campaign);
            return (await acc) + campaign.offerPrice * item.quantity;
        }, 0)

        
        amount += Math.floor(amount * 0.02);

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "COD",
        });

        return res.json({success: true, message: "Order Placed Successfully"})
    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}


// place Order Stripe : /api/order/stripe
export const placeOrderStripe = async (req, res)=>{
    try {
        const userId = req.userId; 
        const { items, address } =req.body;
        const { origin } = req.headers;

        if(!address || items.length === 0){
            return res.json({success: false, message :"Invalide data"})
        }

        let campaignData = [];
        
        let amount = await items.reduce(async (acc, item)=>{
            const campaign = await Campaign.findById(item.campaign);
            campaignData.push({
                name: campaign.name,
                price: campaign.offerPrice,
                quantity: item.quantity,
            });
            return (await acc) + campaign.offerPrice * item.quantity;
        }, 0)

        
        amount += Math.floor(amount * 0.02);

        const order = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "Online",
        });

        // stripe Gateway Initialize
        const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

        // create line item for stripe 
        const line_items = campaignData.map((item)=>{
            return{
                price_data : {
                    currency: "LKR",
                    campaign_Data:{
                        name: item.name,

                    },
                    unit_amount: Math.floor(item.price + item.price * 0.02) * 100
                },
                quantity: item.quantity,
            }
        })

        // create session 
        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${origin}/loader?next=my-donation`,
            cancel_url: `${origin}/cart`,
            metadata:{
                orderId: order._id.toString(),
                userId,
            }
        })

        return res.json({success: true, url: session.url });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}



// Get Order by User ID : /api/order/user
export const getUserOrder = async (req, res)=>{
    try {
        const userId = req.userId; // get from JWT middleware
        const orders = await Order.find({
            userId,
            $or: [{paymentType : "COD"}, {isPaid: true}]
        }).populate("items.campaign address").sort({createdAt: -1});
        res.json({ success: true, orders});
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

//Get All Orders ( for admin) : /api/order/admin
export const getAllOrder = async (req, res)=>{
    try {
        const orders = await Order.find({
            $or: [{paymentType : "COD"}, {isPaid: true}]
        }).populate("items.campaign address").sort({createdAt: -1});
        res.json({ success: true, orders});
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}