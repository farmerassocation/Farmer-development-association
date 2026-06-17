import { headers } from "next/headers";
import FarmerIdCard from "@/components/FarmerIdCard";

async function getUser(memberId: string) {
  const headersList = await headers();
  const host = headersList.get("host");

  const protocol = host?.includes("localhost") ? "http" : "https";
  const baseUrl = `${protocol}://${host}`;

  const res = await fetch(`${baseUrl}/api/admin/users/${memberId}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data.user;
}

export default async function IdCardPage({
  params,
}: {
  params: Promise<{ memberId: string }>;
}) {
  const { memberId } = await params; 

  console.log("PAGE memberId:",memberId);

  const user = await getUser(memberId);

  if (!user) {
    return <div className="text-white p-6">User not found ❌</div>;
  }

  return (
    <div className="p-6">
      <FarmerIdCard member={user} />
    </div>
  );
}
