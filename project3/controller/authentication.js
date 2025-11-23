import User from "../schema/user.js";

export async function login(request, response) {
  //console.log("/admin/login called", request.body); 
  try {
    const { login_name, password } = request.body;

    if(!login_name || !password){
      return response.status(400).send("Missing username or password");
    }
    //find user
    const user = await User.findOne({ login_name, password }); 
    if(user){
      request.session.user = {
        id: user._id, 
        name: user.first_name, 
        username: user.login_name
      };
      //console.log("session:", request.session);
      return response.status(200).json({ success: true, user: request.session.user, _id: user._id, first_name: user.first_name });
    } else {
      //console.log("failed log in");
      return response.status(400).send("Invalid username or password");
    }
    } catch (err) {
        console.log(err);
        return response.status(400).send("Bad Request");
    }
}

export async function logout(request, response) {
  request.session.destroy((err) => {
    if(err){
      //console.error("Couldn't destroy session", err);
      return response.status(500).send("Error logging out");
    }
    response.clearCookie("connect.sid");
    return response.json({ success:true });
  });
}

export async function register(request, response) {
  //see if a user with that login_name exists already
  if(!request.body){
    //console.log("/user: no request body");
    return response.status(400).send("No request body");
  }  
  //console.log(request.body);

  try {
  const { first_name, last_name, login_name, password, location, occupation, description } = request.body.formData;
  
    //console.log(login_name);
    const user = await User.findOne({ login_name });
    if(user){
      //console.log("Duplicate:", user);
      return response.status(409).json({error: "Username already in use"});
    }
    try{
      const newUser = new User({
        first_name: first_name, 
        last_name: last_name, 
        login_name: login_name, 
        password: password,  //hash!!
        location: location, 
        occupation: occupation, 
        description: description
      });
      const savedUser = await newUser.save();
      if(savedUser){
        request.session.user = {
          id: savedUser._id, 
          name: savedUser.first_name,
          username: savedUser.login_name
        };
        return response.status(200).json({id: savedUser._id, username: savedUser.login_name, first_name: savedUser.first_name});
      }
      return response.status(500).send("Failed to create user");
    } catch (err){ 
      //console.error(err);
      return response.status(500).send("Failed to create user");
    }
  }
  catch(err) {
    return response.status(400).send("Bad Request");
  }
}

export async function getSession(request, response) {
  //console.log("request", request.session);
  if(request.session.user){
    //console.log(request.session.user);
    const user = await User.findById(request.session.user.id); 
    if(user){
      return response.status(200).json({ username: user.login_name, firstName: user.first_name});
    }
  }
  return response.status(401);
}

export function isAuthenicated(request, response, next) {
  if (request.session.user) {
    return next();
  }
  return response.status(401).send();
}





