import { Card } from "flowbite-react";
import React, { useEffect, useState } from "react";
import API from "../../utils/api";

const Logs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await API.get("/admin/logs");
      setLogs(response.data);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };
  return (
    <div>
      <Card className="p-6 bg-gray-800 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">System Logs</h2>
        <ul className="list-disc pl-5">
          {logs.map((log, index) => (
            <li key={index} className="mb-2">
              {log.message}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default Logs;
