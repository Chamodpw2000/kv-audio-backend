import Product from "../models/products.js"
import { isItAdmin } from "./userController.js"

export function AddProduct(req, res) {


  console.log(req.body);
  
  


  if (req.user == null) {
    res.status(401).json({
      message: "Please login and try again"
    })
    return
  }
  if (req.user.role != "admin") {
    res.status(403).json({
      message: "You are not authorized to perform this action"
    })
    return
  }


  const data = req.body;
  const newProduct = new Product(data);
  newProduct.save()
    .then(() => {
      res.json({ message: "Product added successfully" });
    })
    .catch((error) => {
      res.status(500).json({ error: "Product addition failed", error });
    });
}


export async function GetProducts(req, res) {


  try {

    if (!isItAdmin(req)) {
      const products = await Product.find({ availability: true })
      res.status(200).json(products)
    } else {
      const products = await Product.find()
      res.status(200).json(products)
    }



  } catch (e) {

    res.status(200).json({ message: "Fail to add product" })


  }

}


export async function UpdateProduct(req,res){

  const key = req.params.key
  const data = req.body

  try{
    if(!isItAdmin(req)){res.status(403).json({message:"You are not autharized to do this action"})}
    else{
      await Product.updateOne({key:key},data)
      res.status(200).json({message:"Product Updated Successfully"})
    }
  }catch{

    res.status(400).json({message:"Error Updating Product"})
  }
}


export async function DeleteProduct(req,res){
  try{
    if(isItAdmin(req)){
      const key = req.params.key;
      await Product.findOneAndDelete({key:key})
      res.status(200).json({message:"Product Deleted Sucessfully"})


  }else{
    res.status(403).json({message:"You are not Authorized to do this action"})
  
  return;
  }

}catch{

  res.json({message:"Error Deleting Product"})

  }
}



