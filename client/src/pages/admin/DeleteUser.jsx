import API from "../../utils/api";

export const deleteUser = async (id) => {
  try {
    const res = await API.delete(`/account/delete/${id}`);
    // console.log(res.data)
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Server error" };
  }
};
 
// Toggle user isActive status
export const profitUser = async (userId) => {
  try {
  if (!userId) {
      throw { message: "User ID is required" };
    }
    const response = await API.put(`http://localhost:5000/api/account/${userId}/toggle`,{
         withCredentials: true
         });
    // console.log("User toggled:", response.data);
    return response.data;
  } catch (error) {
    console.error("Toggle error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Server error" };
  }
};
 
export const userHistory = async (userId) => {
  try {
    if (!userId) {
      throw { message: "User ID is required" };
    }
    const response = await API.get(`/admin/user-history/${userId}`, {
      withCredentials: true
    });
    
    // console.log("User history fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error("Fetch history error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Server error" };
  }
};

export const allSportHistory = async (userId) => {
  try {
     const response = await API.get(`/admin/all-spot/${userId}`, {
      withCredentials: true
    });
    
    console.log("Sport history fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error("Fetch sport history error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Server error" };
  }
}
// allSportHistory()

export const allPerpetualHistory = async (userId) => {
  try {
    const response = await API.get(`/admin/all-perpetual/${userId}`, {
      withCredentials: true
    });

    console.log("Perpetual history fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error("Fetch perpetual history error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Server error" };
  }
}
//  allPerpetualHistory()

export const alltradingHistory = async (userId) => {
  try {
    const response = await API.get(`/admin/all-trades/${userId}`, {
      withCredentials: true
    });
    console.log("Trading history fetched:", response.data);
    return response.data;
  } catch (error) {
    console.error("Fetch trading history error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Server error" };
  }

}
// alltradingHistory()
