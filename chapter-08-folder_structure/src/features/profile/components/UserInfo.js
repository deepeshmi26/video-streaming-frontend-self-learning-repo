import React from "react";

const UserInfo = ({ name, email }) => (
  <div>
    <p>
      <b>Name:</b> {name}
    </p>
    <p>
      <b>Email:</b> {email}
    </p>
  </div>
);

export default UserInfo;
