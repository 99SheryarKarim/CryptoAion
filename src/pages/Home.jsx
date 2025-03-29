
"use client";
  
import { useState } from "react";
import { Link } from "react-router-dom";
import "../pages/Home.css";
// import logo from "../../public/logoooo.png";
import Hero from "../sections/HomeComponents/hero/Hero";

import Discover from "../sections/HomeComponents/Discover/Discover";

import PricingCards from "../sections/HomeComponents/Pricing/Pricing";
import Info from "./../pages/Info/Info";
import JoinUs from "../sections/HomeComponents/JoinUs/JoinUs";
import Footer from "./Footer/Footer";
import Contact from "./ContactUs/Contact";
import WhyChoose from "../sections/HomeComponents/WhyChoose/WhyChoose";
import Services from "../sections/HomeComponents/Services/Services";
// import License from "../sections/HomeComponents/License/License";
// import HeroMain from "../sections/HomeComponents/HeroMain/HeroMain";
import AboutUs from "../sections/HomeComponents/AboutUs/AboutUs";
function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleContactClick = () => {
    setShowContact(true);
  };

  return (
    <main style={{backgroundColor:"#1e2340"}}>
      {/* Header Section */}
   

      {/* Show Contact page only when button is clicked */}
      {showContact ? (
        <Contact />
      ) : (
        <>
          <Hero />
          {/* <Carousel /> */}
        
            <Discover />
   
            <WhyChoose />
            {/* <License /> */}
          {/* <Info /> */}
          <JoinUs />
          <Footer />

   {/* rest */}
{/* <AboutUs />

   <Services /> */}


        </>
      )}
    </main>
  );
}

export default Home;
