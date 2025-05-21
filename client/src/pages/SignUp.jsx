import React, { useEffect, useState } from "react";
import ImgSrc from "../assets/whyChooseUs.png";
import AnimatedHeading from "../components/animation/AnimateHeading";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../store/slices/userSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (user) {
      navigate(-1); // Redirect to the previous page
    }
  }, [user, navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(registerUser({ email, password, firstName, lastName }));
  };
  return (
    <div className="min-h-screen bg-gradient flex flex-col justify-center items-center">
      <AnimatedHeading>
        <h1 className="text-4xl font-bold">SignUp</h1>
      </AnimatedHeading>
      <div className="flex flex-col md:flex-row justify-evenly">
        <div className="hidden md:inline  img w-[40vw] ">
          <img src={ImgSrc} alt="" />
        </div>
        <form onSubmit={handleSubmit} className="px-8 md:w-[40vw] mt-20">
          <input
            type="text"
            placeholder="Enter your First Name..."
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full bg-transparent focus:outline-none rounded-md px-3 py-2 my-3 border-primary"
          />
          <input
            type="text"
            placeholder="Enter Your Last Name..."
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full bg-transparent focus:outline-none rounded-md px-3 py-2 my-3 border-primary"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent focus:outline-none rounded-md px-3 py-2 my-3 border-primary"
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent focus:outline-none rounded-md px-3 py-2 my-3 border-primary"
          />
          <button
            type="submit"
            className="w-full focus:ooutline-none px-2 py-1 bg-secondary rounded-md text-tertiary2 font-medium hover:scale- cursor-pointer text-center"
          >
            Register
          </button>
          <p className="w-full text-center text-gray-500">
            Already Have an account?{" "}
            <a href="" className="text-white">
              LogIn
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
