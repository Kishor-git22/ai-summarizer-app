import React from 'react'
import { logo } from '../assets'
import {
  PROJECT_NAME,
  PROJECT_GITHUB_LINK,
  HERO_TITLE_LEFT,
  HERO_TITLE_RIGHT,
  HERO_SUBTITLE_LEFT,
  HERO_SUBTITLE_RIGHT
} from '../constants'

// hero
const Hero = () => {
  return (
    <header className="w-full flex flex-col items-center px-6 sm:px-12 lg:px-20 py-6 text-black">
      {/* Navbar */}
      <nav className="flex justify-between items-center w-full max-w-6xl mb-10">
        {/* Brand Logo */}
        <img
          src={logo}
          alt={PROJECT_NAME}
          title={PROJECT_NAME}
          className="w-24 sm:w-28 lg:w-32 object-contain"
          draggable="false"
          loading="lazy"
        />

        {/* GitHub Button */}
        <button
          type="button"
          onClick={() => window.open(PROJECT_GITHUB_LINK, '_blank')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black text-white hover:bg-gray-900 transition-all text-sm sm:text-base"
          title="View Source Code"
        >
          <span className="hidden sm:inline">Github</span>
        </button>
      </nav>

      {/* Title */}
      <div className="text-center max-w-4xl">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900">
          {HERO_TITLE_LEFT} <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
            {HERO_TITLE_RIGHT}
          </span>
        </h1>

        {/* Subtitle */}
        <h2 className="mt-4 text-base sm:text-lg lg:text-xl text-black leading-relaxed">
          {HERO_SUBTITLE_LEFT} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-red-500 font-semibold">
            {PROJECT_NAME}
          </span>
          , {HERO_SUBTITLE_RIGHT}
        </h2>
      </div>
    </header>
  )
}

export default Hero
