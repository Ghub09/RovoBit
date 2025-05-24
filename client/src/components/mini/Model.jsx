import { Modal, Button } from 'flowbite-react';
import { useTranslation } from 'react-i18next';

const CustomModel = ({
  openDialog,
  handleDialog,
  label,
  handleAction,
  action,
  cancel,
}) => {
  const { t } = useTranslation(); 

  return (
    <Modal
      show={openDialog}
      size="md"
      onClose={handleDialog}
      popup
     className="backdrop-blur-[2px] bg-black/50 text-white rounded-lg "

    >
      <div className="rounded-lg bg-[#1A1A1A] p-5 text-white shadow-lg">
        <div className="mb-4 text-center">
          <p className="text-lg font-medium">{label}</p>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            color="failure"
            onClick={handleDialog}
          >
             { cancel}
          </Button>
          <Button
            color="success"
            onClick={handleAction}
          >
            { action}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CustomModel;
