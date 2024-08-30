import React from "react";
import { useSelector } from "react-redux";
import { Button, TextInput } from "flowbite-react";

export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);
  //currentUser里面有rest 要用 currentUser.rest.username
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold">Profile</h1>
      <form className="flex flex-col gap-4">
        <div className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full">
          <img
            src={currentUser.rest.profiePicture}
            alt="user"
            className="rounded-full w-full h-full object-cover border-8 border-[lightgray]"
          ></img>
        </div>
        <TextInput
          type="text "
          id="username"
          placeholder="username"
          defaultValue={currentUser.rest.username}
        ></TextInput>
        <TextInput
          type="email "
          id="email"
          placeholder="email"
          defaultValue={currentUser.rest.email}
        ></TextInput>
        <TextInput
          type="password "
          id="password"
          placeholder="password"
          defaultValue="*********"
        ></TextInput>
        <Button type="submit" gradientDuoTone="purpleToBlue" outline>
          Update
        </Button>
        <div className="text-red-500 flex justify-between mt-5">
          <span className="cursor-pointer">Delete Account</span>
          <span className="cursor-pointer">Sign Out</span>
        </div>
      </form>
    </div>
  );
}
