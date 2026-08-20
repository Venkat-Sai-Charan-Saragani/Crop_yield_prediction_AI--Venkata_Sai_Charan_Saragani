"use client";

import {
  Leaf,
} from "lucide-react";


export default function Navbar() {

  return (

    <header
      className="
        flex
        items-center
        justify-between
        border-b
        border-slate-200
        bg-white/95
        px-4
        py-4
        shadow-sm
        backdrop-blur-xl
        sm:px-6
        lg:px-8
      "
    >

      {/* =================================================
          LEFT
      ================================================= */}

      <div
        className="
          min-w-0
        "
      >

        <h1
          className="
            truncate
            text-lg
            font-bold
            tracking-tight
            text-slate-900
            sm:text-2xl
          "
        >

          Crop_Yield_Prediction-AI Dashboard

        </h1>


        <p
          className="
            mt-1
            hidden
            text-sm
            text-slate-500
            sm:block
          "
        >

          Smart Farming & Crop Yield Prediction

        </p>

      </div>


      {/* =================================================
          RIGHT / USER
      ================================================= */}

      <div
        className="
          ml-4
          flex
          shrink-0
          items-center
          gap-3
        "
      >

        {/* PROFILE ICON */}

        <div
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-gradient-to-br
            from-emerald-500
            to-green-700
            text-white
            shadow-sm
            sm:h-11
            sm:w-11
          "
        >

          <Leaf
            size={19}
          />

        </div>


        {/* USER TEXT */}

        <div
          className="
            hidden
            text-left
            sm:block
          "
        >

          <p
            className="
              whitespace-nowrap
              text-sm
              font-bold
              leading-5
              text-slate-900
            "
          >

            Sai Charan

          </p>


          <p
            className="
              whitespace-nowrap
              text-xs
              font-medium
              leading-5
              text-slate-400
            "
          >

            AI User

          </p>

        </div>

      </div>

    </header>

  );

}