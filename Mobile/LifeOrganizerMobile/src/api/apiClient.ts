import { API_URL } from "@/config/api";
import axios from "axios";

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 5000,
});