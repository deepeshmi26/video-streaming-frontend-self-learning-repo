import React from "react";
import UserInfo from "../features/profile/components/UserInfo";

const ProfilePage = () => {
  return (
    <div style={{ padding: 20 }}>
      <h3>Profile</h3>
      <UserInfo name="Deepesh Mitra" email="deepesh@example.com" />
    </div>
  );
};

export default ProfilePage;
