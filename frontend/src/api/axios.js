import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:5016/api",
});