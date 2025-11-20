import axios from "axios";

export const getUserFromUrl = async (url) => {
    if (url === '/') {
      return "Home";
    }

    const terms = url.split("/");

    if(terms[1]){
      const response = await axios.get(`http://localhost:3001/user/${terms[2]}`);

      if(response.data){
        if(terms[1] === "photos"){
          return `Photos of ${response.data.first_name} ${response.data.last_name}`;
        } else if(terms[1] === "users"){
          return `${response.data.first_name} ${response.data.last_name}`;
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
    let response = await axios.get('http://localhost:3001/user/list');
    let users = response.data;

    console.log("UserList: Response:", users); 
    console.log("UserList: Fetched users.");

    if (!advEnabled) {
        return {users, counts: null};
    }

    const fetchAllCounts = async () => {
        const arr = await Promise.all(users.map(async (user) => {
            const x = await axios.get(`http://localhost:3001/counts/${user._id}`);
            return x.data;
        }));
    
        return arr.flat();
    };
      
    let counts = await fetchAllCounts();
    return {users, counts};
};

export const fetchUserInfo = async (userId) => {
      let response = await axios.get(`http://localhost:3001/user/${userId}`);
      return response.data;
  };

export const fetchUserPhotos = async (userId) => {
    const response = await axios.get(`http://localhost:3001/photosOfUser/${userId}`);
    return response.data;
};

export const fetchUserComments = async (userId) => {
  let resposne = await axios.get(`http://localhost:3001/comments/${userId}`);
  return resposne.data;
  };
