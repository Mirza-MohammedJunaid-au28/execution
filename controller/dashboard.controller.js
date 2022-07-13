function renderDashboard(req,res){
    if(req.session.isLoggedIn == true){
        return res.render("dashboard.handlebars")
    }
    
    return res.redirect("/")
}

async function submitTask(req,res){
    try{
        if(! req.session.isLoggedIn){
            return res.status(401).render('errors/unauthorized')
        }
        return res.status(200).send({error :false, msg : "Authorized"})
    }
    catch(err){
        console.log("Dashboard Controller Error : ",err);
        return res.status(500).render('errors/something')
    }
}

module.exports = { renderDashboard, submitTask }