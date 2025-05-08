"use client";
import React, { useState, useEffect } from "react";

export default function Users() {
  const [navbarDashboardHeight, setNavbarDashboardHeight] = useState(0);

  useEffect(() => {
    const top = document.querySelector("#navbar-dashboard");

    if (top) setNavbarDashboardHeight(top.clientHeight);

    const handleResize = () => {
      if (top) setNavbarDashboardHeight(top.clientHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [navbarDashboardHeight]);
  return (
    <div
      className="flex flex-col gap-6 justify-center items-start bg-white text-black rounded-4xl w-full p-6"
      style={{ height: `calc(100vh - ${navbarDashboardHeight}px)` }}
    >
      <div className="flex justify-center items-center h-full w-full">
        <h1 className="text-4xl font-bold">Users</h1>
      </div>
    </div>
  );
}
