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