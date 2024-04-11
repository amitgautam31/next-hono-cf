"use server";

import { BASE_URL } from "@/constants";

export async function getResponse() {
    try {
      const response = await fetch(`${BASE_URL}/api/hello`);
      const data = await response.json();
      return data;
    } catch (e) {
      console.log("ERROR :", e);
    }
  }
  
