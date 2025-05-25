import API from "../../utils/api";

export const deleteUser = async (id) => {
  try {
    const res = await API.delete(`/account/delete/${id}`);
    console.log(res.data)
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Server error" };
  }
};
 
// Toggle user isActive status
export const profitUser = async (userId) => {
  try {
    const response = await API.put(
      `/account/user/${userId}/toggle`);

    console.log("User toggled:", response.data);
    return response.data;
  } catch (error) {
    console.error("Toggle error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Server error" };
  }
};
