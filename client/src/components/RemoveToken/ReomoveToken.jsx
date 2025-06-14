import React, { useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
} from "@material-tailwind/react";
import { toast } from "react-toastify";

const RemoveToken = ({ openModal, handleCloseModal, userId }) => {
  const types=["Spot","trading","Perpetual"]
  const [section,setSection]=useState("Spot")
  const handleRemove = () => {
     console.log("Removing userId:", userId);

    toast.success("All userId removed successfully");
    handleCloseModal();
  };
  const handleSection=(t)=>{
    setSection(t)
  }

  return (
    <Dialog open={openModal} handler={handleCloseModal} size="lg">
      <DialogHeader className="text-black">Token Management</DialogHeader>
      <DialogBody className="text-black">
        <div className="h-[280px] scroll-auto">
       <div className="flex gap-4 ">
        {
          types.map((t,i)=>  
             
              <button key={i} onClick={()=>handleSection(t)} 
             className={` cursor-pointer px-3 rounded-full font-semibold ${
    section === t ? "bg-yellow-200 text-black" : "bg-gray-400 text-green-700"
  }`}>{t}</button>
            
          )
        }

       
       </div>
          {
          section==="Spot"?
          <div>
            <span>10USD</span><br />
            <span>20ETH</span><br />
            <span>2BTS</span>
          </div>:
          section==="trading"?
          <div>
            <span>10USD</span>
          </div>
          :<div>
            <span>10USD</span>
          </div>
          }
         
</div>
       
      </DialogBody>
      <DialogFooter>
        <Button
          variant="text"
          color="blue"
          onClick={handleCloseModal}
          className="mr-2"
        >
          Cancel
        </Button>
        <Button
          variant="gradient"
          color="red"
          onClick={handleRemove}
          className="mx-2"
          
        >
          Remove All
        </Button>
         <Button
          variant="gradient"
          color="red"
          onClick={handleRemove}
          
        >
          Update
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default RemoveToken;
