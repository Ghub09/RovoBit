import { Modal, Button } from 'flowbite-react';
import { useEffect } from 'react';
import { alltradingHistory } from '../../pages/admin/DeleteUser';

const Historytrading = ({
  openDialog,
  handleDialog,
  handleAction,
  action,
  cancel,
}) => {
  const [trades, setTrades] = useState([]);
 
  useEffect(() => {
    const fetchtradingHistory = async () => {
      try {
            const tradingRes = await alltradingHistory();
            setTrades(tradingRes.data);
      } catch (error) {
        console.error("Error fetching trading history:", error);
      }
    };

    if (openDialog) {
      fetchtradingHistory();
    }
  }, [openDialog, trades]);
 console.log(trades)
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
               
            </thead>
            <tbody>
              
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

export default Historytrading;
