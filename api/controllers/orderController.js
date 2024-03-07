const orderSchema = require("../model/orderSchema")
const userSchema = require("../model/userSchema")
var nodemailer = require('nodemailer');

const sentIt = (req, res, to, orderbyName, product, vendor, type) => {
    orderSchema.findOne({orderBy : orderbyName})
    .sort({"createAt" : "asc"})
    .populate("orderBy")
    .populate("product")
    .populate("owner")
    .populate("agent")
    .then(data => {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'swift.secure.deliver@gmail.com',
              pass: 'vnmv onnd lfjx ybmo',
            }
        });

        if(type == "user"){
            var mailOptions = {
                to: data.orderBy.email,
                subject: 'Swift Order Notification',
                html: `
                    <h1>Dear ${data.orderBy.firstname},</h1> </br> 
                    <h3>You have successfully order a <strong style="color:green;text-decoration:underline">${data.product.name}</strong> and Paid <strong style="color:green;text-decoration:underline">${data.product.price}</strong>. </h3> </br>
                    <h3>Thank you for checking our website.</h3>
                    <h3>Our Delivery Agent is on the way to pick up your order, Your product will be deliver swiftly</h3></br>
                    <p>Warm regards,</p>
                    <p>${data.orderBy.firstname},</>
        
                `,
            };
        }

        if(type == "agent"){
            var mailOptions = {
                to: to,
                subject: 'Swift Order Notification',
                html: `
                    <h1>Dear ${data.agent.firstname},</h1> </br> 
                    <h3>We have an active order waiting for you to be pick up at <strong style="color:green;text-decoration:underline">${data.owner.address}</strong> and Product Name is <strong style="color:green;text-decoration:underline">${data.product.name}</strong>. </h3> </br>
                    <h3>Our user is currently waiting for their order, Please pick up the product as soon as possible.</h3>
                    <h3>Call the vendor to this number <strong style="color:green;text-decoration:underline">${data.owner.phone}</strong>, and show him this email notification</h3></br>
                    <p>Warm regards,</p>
                    <p>${data.agent.firstname},</>
        
                `,
            };
        }

        if(type == "vendor"){
            var mailOptions = {
                to: data.owner.email,
                subject: 'Swift Order Notification',
                html: `
                    <h1>Dear ${data.owner.firstname},</h1> </br> 
                    <h3>An order has being placed on one of the product you listed on our platform, Product name is <strong style="color:green;text-decoration:underline">${data.product.name}</strong> order by <strong style="color:green;text-decoration:underline">${data.orderBy.firstname}</strong>. </h3> </br>
                    <h3>Our Agent is currently on the way to pick the product from your store, Agent name is ${data.agent.firstname}, Please let the product be available before the agent arrives for swift deliver.</h3>
                    <h3>Call the Agent to this number <strong style="color:green;text-decoration:underline">${data.agent.phone}</strong>, if the agent takes long to arrive</h3></br>
                    <p>Warm regards,</p>
                    <p>${data.agent.firstname},</>
        
                `,
            };
        }
        
    
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(error)
            }else{
                console.log(info.response)
            }
        });
    })
    .catch(err => {
        console.log(err)
    })

}


const createOrder = (req, res) => {

    const order = new orderSchema({
        orderBy : req.body.orderBy,
        owner : req.body.owner,
        product : req.body.product,
    })

    order.save()
    .then(data => {
        res.status(200).json({
            message : "order created successfully",
            data,
        })
        sentIt(req, res, "",  req.body.orderBy,  req.body.product,  req.body.owner, "user" )
        sentIt(req, res, "",  req.body.orderBy,  req.body.product,  req.body.owner, "vendor" )
    })
    .catch( err => {
        res.status(500).json({
            message: err
        })
    })
      

}

const getAllOrder = (req, res) => {
    orderSchema.find()
    .sort({"createdAt" : "desc"})
    .populate("product")
    .populate("owner")
    .populate("orderBy")
    .then(data => {
         res.status(200).json({
             message : "All orders fetched successfully",
             data
         })
    })
    .catch(err => {
     res.status(500).json({
         error : err
     })
    })
}

const getOrderByOrderBy = (req, res) => {
    orderSchema.find({orderBy : req.body.orderBy})
    .sort({"createdAt" : "desc"})
    .populate("product")
    .populate("owner")
    .populate("orderBy")
    .then(data => {
         res.status(200).json({
             message : "orders by orderby fetched successfully",
             data
         })
    })
    .catch(err => {
     res.status(500).json({
         error : err
     })
    })
}

const cancelOrder = (req, res) => {
    orderSchema.findByIdAndUpdate(req.body.id, {"status" : "cancel"})
    .then(data => {
         res.status(200).json({
             message : "Order is cancel",   
             data
         })
    })
    .catch(err => {
     res.status(500).json({
         error : err
     })
    })
}

const getOrderByVendor = (req, res) => {
    orderSchema.find({owner : req.body.owner})
    .sort({"createdAt" : "desc"})
    .populate("product")
    .populate("owner")
    .populate("orderBy")
    .then(data => {
         res.status(200).json({
             message : "orders by owner fetched successfully",
             data
         })
    })
    .catch(err => {
     res.status(500).json({
         error : err
     })
    })
}


module.exports = {
    createOrder,
    getAllOrder,
    getOrderByOrderBy,
    cancelOrder,
    getOrderByVendor,
}