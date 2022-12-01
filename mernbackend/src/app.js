const express = require("express");
const app = express();
const sessions = require('express-session')
const path = require("path")

var bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


require("./db/conn");
const Register = require("./models/newCollection");

const { url } = require("inspector");

const port = process.env.port || 3000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");


app.use(express.json());
app.use(express.urlencoded({ extended: false }));



app.use(sessions({
    resave: true,
    saveUninitialized: true,
    secret: 'secretpassword',
}))
app.use((req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
});


app.use(express.static(static_path));
app.set("view engine", "ejs");
app.set("views", template_path);



app.get("/", (req, res) => {
    if (req.session.email) {
        res.redirect("/login")

    }
    else {
        res.render("index")
    }

});
// app.get("/index",(req,res) =>{
//     // res changed to redirect
//     res.redirect("index")
// });

// login check
let useremail;
app.post("/index", async (req, res) => {
    try {
        const yourname=req.body.yourname;
        const email = req.body.email;
        const password = req.body.password;

        useremail = await Register.findOne({ email: email })
        if (useremail.password === password) {

            req.session.email = req.body.email
            console.log("session created")
            console.log(useremail.yourname)
            res.redirect("/login")



        } else {
            res.send("password are not matching")
        }

    } catch (error) {
        res.status(400).send("invalid email")

    }


})

app.get('/login', (req, res) => {
    
    if (req.session.email) {

        res.status(201).render('login', { users: useremail.yourname})
    } else {
        res.redirect('/')
    }

})

app.get("/register", (req, res) => {
    res.render("register");

})




// create a new user in database
app.post("/register", async (req, res) => {
    try {
        const password = req.body.password
        const cpassword = req.body.confirmpassword
        if (password === cpassword) {
            let registerEmployee = new Register({
                yourname: req.body.yourname,
                email: req.body.email,
                password: password,
                confirmpassword: cpassword
            }

            )
            const registered = await registerEmployee.save();
            res.status(201).render("index")
        } else {
            res.send("password are not matching")
        }

       
    } catch (error) {


        res.send("error ");
    }
}
)



app.get('/logout1', (req, res) => {
    
    req.session.destroy()
    console.log('session deleted');
    res.redirect('/')
    res.end()
})

// admin section statrs from here
// app.get("/adminsignin", (req, res) => {
//     res.render("adminsignin");

// })

app.get("/adminsignin", (req, res) => {
    if (req.session.email) {
        res.redirect("/adminhome")

    }
    else {
        res.render("adminsignin")
    }

});



app.get("/adminlogout",(req, res)=>{
    req.session.destroy()
    console.log('session deleted');
    res.redirect("/adminsignin")
    res.end()
   
}





)
const user = {
    email: 'anooptk3@gmail.com',
    passwd: '1'
}


app.post('/adminpage', (req, res) => {

    if (req.body.email === user.email && req.body.password === user.passwd) {
        req.session.email = req.body.email
        console.log("session created")
        console.log(req.sessionID);

        Register.find({}, (err, allDetails) => {
            if (err) {
                console.log(err)
            }
            else {
                res.render("adminhome", { details:allDetails })
            }
        })

    }
    else {
        res.render("adminsignin", { check: "check email & pasword" })
    }

})


//for deleting data
//delete
app.post("/delete",(req,res)=>{
    var myquery = { email:req.body.deleteemail}
    console.log(myquery.email)
    const deleteResult = Register.deleteOne(myquery,(err , obj)=>{
    // console.dir(deleteResult.deletedCount);
        if (err){
        console.log("hai")
        }
        else
        {
          console.log("  deleted successfully");
          res.redirect('/adminhome')
    
    // res.end()
    // res.render("adminhome")
    
        }
      })
      // console.log(req.body.deleteemail)
    })

    //load admin page for routing
  

  
    //insert

    app.post("/insert", async (req, res) => {
        try {
            
            // const cpassword = req.body.confirmpassword
            // if (password ) {
                let registerEmployee = new Register({
                    yourname: req.body.insertname,
                    email: req.body.insertemail,
                     password : req.body.insertpassword
                    

                })
    
                
                const registered = await registerEmployee.save();
                console.log(req.body.insertname)
                console.log(req.body.insertemail)
                console.log(req.body.password)
                
                res.redirect("/adminhome")
            // } else {
            //     res.send("password are not matching")
            // }
    
           
        } catch (error) {
    
    
            res.send("error ");
            // res.status(201).redirect("/adminhome")
        }
    })
      
   

    app.get("/adminhome",(req,res)=>{

        Register.find({},(err,allDetails)=>{
          if(err){
            console.log(err)
          }else{
    
            res.render("adminhome", { details: allDetails })
          }
        })
      })





    app.post("/search", (req, res) => {
    let search =req.body.name
    Register.find({yourname:search},(err,data)=>{
        if(err){
            console.log(error)

        }
        else{
            res.render("search1",{details:data})
        }
    })
    })




  
app.post('/update', async(req,res)=>{
    try{
  
  
      const result = await Register.updateMany({email:req.body.updateemail},{
  
        $set: { yourname: req.body.updatename, email: req.body.updateemail, password: req.body.updatepassword }
      })
      console.log(result)
      console.log(req.body.updateemail)
      console.log(req.body.updatename)
  
      res.redirect('/adminhome')
      
    }catch(error){
      console.log(error.message);
    }
  
  })

 

app.listen(port, () => {

    console.log(`server is running at port no${port}`);

}
)