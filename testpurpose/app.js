const express=require('express')
const app=express()
const sessions=require('express-session')

app.set('view engine','ejs')

app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.use(sessions({
    resave:true,
    saveUninitialized:true,
    secret:'secretpassword',    
}))
app.use((req, res, next) => {
    res.set("Cache-Control", );
    next();
  });

const user={
 email:'anooptk3@gmail.com',
passwd:'12345'
}
let users="admin";
let port=6400;

//rendering home page
app.get('/',(req,res)=>{
    res.render('login')
})
app.post('/',(req,res)=>{
    if(req.body.email===user.email && req.body.passwd===user.passwd){
        req.session.user = req.body.email;   
        console.log('session created')
        res.redirect('/home')
    }
    else{
        res.render('login',{wrong:"Invalid username or Password"})  
    }
})


app.get('/home',(req,res) => {
    if(req.session.user) {
        res.render('index', { users },)
    }
    else {
        res.redirect('/')
    }


})
app.get('/logout',(req,res)=>{
    req.session.destroy()
        res.redirect('/');
        res.end();

}
)
app.listen(6400,()=> console.log(`server started at port ${port}`)

)