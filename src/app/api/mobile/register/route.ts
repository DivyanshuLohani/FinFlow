import { POST as v1POST } from "@/app/api/v1/users/route";
import { NextRequest } from "next/server";
export const POST = async (req: NextRequest) => {
  return v1POST(req);
};
