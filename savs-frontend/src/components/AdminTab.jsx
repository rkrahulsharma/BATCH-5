import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminTab = () => {
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const pend = await axios.get("http://localhost:5000/api/superadmin/pending-admins");
    const appr = await axios.get("http://localhost:5000/api/superadmin/approved-admins");
    setPending(pend.data);
    setApproved(appr.data);
  };

  const handleApprove = async (admin) => {
    await axios.post(`http://localhost:5000/api/superadmin/approve-admin/${admin.id}`, {
      email: admin.email,
    });
    fetchData();
  };

  const handleReject = async (admin) => {
    await axios.delete(`http://localhost:5000/api/superadmin/reject-admin/${admin.id}`, {
      data: { email: admin.email },
    });
    fetchData();
  };

  return (
    <div>
      <h4>Pending Admins</h4>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Photo</th><th>Name</th><th>Email</th><th>Dept</th><th>College</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pending.map((a) => (
            <tr key={a.id}>
              <td><img src={`http://localhost:5000/uploads/${a.profile_photo}`} width="50" /></td>
              <td>{a.name}</td>
              <td>{a.email}</td>
              <td>{a.department}</td>
              <td>{a.college}</td>
              <td>
                <button className="btn btn-success btn-sm me-2" onClick={() => handleApprove(a)}>Approve</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleReject(a)}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4>Approved Admins (Total: {approved.length})</h4>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Photo</th><th>Name</th><th>Email</th><th>Dept</th><th>College</th>
          </tr>
        </thead>
        <tbody>
          {approved.map((a) => (
            <tr key={a.id}>
              <td><img src={`http://localhost:5000/uploads/${a.profile_photo}`} width="50" /></td>
              <td>{a.name}</td>
              <td>{a.email}</td>
              <td>{a.department}</td>
              <td>{a.college}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTab;
