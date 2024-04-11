"use server";

import { BASE_URL } from "@/constants";

export async function getWaitResponse(queryData: FormData) {
  const time = queryData.get("time");
  console.log("time", time);

  try {
    const response = await fetch(`${BASE_URL}/api/time`, { method: "POST", body: JSON.stringify({ time }) });
    const data = (await response.json()) as { message: string };
    console.log("data", data);
    return { message: data?.message };
  } catch (e) {
    console.log("ERROR :", e);
    return { message: "ERROR" };
  }
}
