import express from 'express';
import mongoose from 'mongoose';
const app = express()
import User from "./models/user.js"
app.use (express.json());
mongoose.connect ("mongodb://localhost/app",{
    userNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

app.post('/',async (req,res) => {
const user = new User({ name:"rihab", email: "askririhab06@gmail.com"})
try {
    await user.save();
}
catch (err){
    console.log (err)
}
});

app.listen(8080,() =>
{
    console.log("server running on port 8080")
});