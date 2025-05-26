import { Modal, Button } from 'flowbite-react';

const HistoryModel = ({
  openDialog,
  handleDialog,
  labels,
  handleAction,
  action,
  cancel,
}) => {
  return (
    <Modal
      show={openDialog}
       onClose={handleDialog}
      popup
      className="backdrop-blur-[2px] bg-black/50 text-white rounded-lg"
    >
      <div className="rounded-lg bg-[#1A1A1A] p-5 text-white shadow-lg">
        <div className="mb-4 text-center overflow-x-auto">
          <table className="w-full text-left border-collapse border">
            <thead>
              <tr className="border">
                <th className="p-2 text-center">Amount (USDT)</th>
                <th className="p-2 text-center">Type</th>
                {/* <th className="p-2 text-center">Status</th> */}
                <th className="p-2 text-center">Address</th>
                <th className="p-2 text-center">Network</th>
                <th className="p-2 text-center">Currency</th>
                <th className="p-2 text-center">Admin</th>
                <th className="p-2 text-center">Date</th>
              </tr>
            </thead>
            <tbody>
              {labels.map((label) => (
                <tr key={label._id} className="hover:bg-gray-700 border-b transition-colors duration-300">
                  <td className="p-2 text-center">{label.amount}</td>
                  <td className="p-2 text-center capitalize">{label.type}</td>
                  {/* <td className="p-2 text-center capitalize">{label.status}</td> */}
                  <td className="p-2 text-center">{label.walletAddress}</td>
                  <td className="p-2 text-center">{label.network}</td>
                  <td className="p-2 text-center">{label.currency}</td>
                  <td className="p-2 text-center">{label.adminNote==="Request rejected by admin"?<span className="text-red-500">Rejected</span>: <span>Aproved</span>}</td>
                  <td className="p-2 text-center">{new Date(label.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end gap-2">
          <Button color="failure" onClick={handleDialog}>
            {cancel}
          </Button>
          <Button color="success" onClick={handleAction}>
            {action}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default HistoryModel;
