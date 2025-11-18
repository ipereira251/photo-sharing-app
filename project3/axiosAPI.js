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