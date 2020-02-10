db.createUser(
    {
        user : "grace",
        pwd : "12345",
        roles : [
            {
                role : "readWrite",
                db : "ebook-api"            
            }        
        ]    
    }
)