import { ProfileForm } from "@/components/admin/ProfileForm";
import { requireAdmin } from "@/lib/admin";
import styles from "../../admin.module.css";

export const metadata = { title: "Profile" };

export default async function ProfilePage() {
  const { user } = await requireAdmin();

  return <>
    <div className={styles.heading}>
      <div>
        <h1>Profile</h1>
        <p>Update the password for this admin account.</p>
      </div>
    </div>
    <ProfileForm email={user.email ?? ""} />
  </>;
}
