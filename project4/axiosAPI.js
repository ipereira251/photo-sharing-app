import axios from "axios";

export const getUserFromUrl = async (url) => {
    if (url === '/') {
      return "Home";
    } 
    if(url === '/login'){
      return "Login";
    }
    if(url === '/register'){
      return "Register";
    }

    const terms = url.split("/");

    if(terms[1]){
      const response = await axios.get(`http://localhost:3001/user/${terms[2]}`, {withCredentials: true});

      if(response.data){
        if(terms[1] === "photos"){
          return `Photos of ${response.data.first_name} ${response.data.last_name}`;
        } else if(terms[1] === "users"){
          return `${response.data.first_name} ${response.data.last_name}`;
        } else if(terms[1] === "comments"){
          return `${response.data.first_name} ${response.data.last_name}'s Comments`;
        } else {
          return "Unknown";
        }
      }
    }

    return "Unknown";
  };

  /*
returns an object with 2 properties which is used to populate the userList display

{
  userList: list of all users in database
  counts: count information for advanced features if turned on, else null
}

*/

export const fetchUserListDisplay = async (advEnabled) => {
    let response = await axios.get('http://localhost:3001/user/list', {withCredentials: true});
    let users = response.data;

    console.log("UserList: Response:", users); 
    console.log("UserList: Fetched users.");

    if (!advEnabled) {
        return {users, counts: null};
    }

    const fetchAllCounts = async () => {
        const arr = await Promise.all(users.map(async (user) => {
            const x = await axios.get(`http://localhost:3001/counts/${user._id}`, {withCredentials: true});
            return x.data;
        }));
    
        return arr.flat();
    };
      
    let counts = await fetchAllCounts();
    return {users, counts};
};

export const fetchUserInfo = async (userId) => {
    let response = await axios.get(`http://localhost:3001/user/${userId}`, {withCredentials: true});
    return response.data;
  };

export const fetchUserPhotos = async (userId) => {
    const response = await axios.get(`http://localhost:3001/photosOfUser/${userId}`, {withCredentials: true});
    return response.data;
};

export const fetchUserComments = async (userId) => {
  let response = await axios.get(`http://localhost:3001/comments/${userId}`, {withCredentials: true});
  return response.data;
};

export const postUserComment = async ({photoId, comment}) => {
  let response = await axios.post(`http://localhost:3001/commentsOfPhoto/${photoId}`, {comment: comment}, {withCredentials: true});
  return response.data;
};
