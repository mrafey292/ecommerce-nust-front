// AboutPage.js
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import './AboutPage.css';
import Header from "@/components/Header";
import Footer from "@/components/Footer";


const teamMembers = [
  {
    name: 'Haleema Imran',
    role: 'Frontend Developer & UI/UX Designer',
    image: '/images/pfp.png',
  },
  {
    name: 'Muhammed Rafey',
    role: 'Backend & Database Architect',
    image: '/images/pfp.png',
  },
  {
    name: 'Hassan Hameed',
    role: 'Full Stack Developer & DevOps',
    image: '/images/pfp.png',
  },
];

const AboutPage = () => {

  return (
    <>
      <Header onCartClick={() => {}} />

      <motion.div
        className="about-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* <a href="./" className="back-button">
        ← 
        </a> */}

        <header className="header-section">
          <h1 className="title">About Our Team</h1>
          <p className="subtitle">
            A second-year BS Computer Science team from NUST, building an eCommerce platform for our Advanced DBMS & Web Technology course.
          </p>
        </header>

        <section className="team-section">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              className="team-card"
              whileHover={{ scale: 1.05 }}
            >
              <img src={member.image} alt={member.name} className="profile-pic" />
              <h3>{member.name}</h3>
              <p>{member.role}</p>
            </motion.div>
          ))}
        </section>

        <section className="location-section">
          <h2><MapPin className="icon" /> Our Location</h2>
          <p>National University of Sciences and Technology (NUST), Islamabad, Pakistan</p>
          <iframe
            title="NUST Map"
            className="map-frame"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3312.4191675951233!2d72.9953734752593!3d33.64253104056019!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38df9568a61c1f79%3A0xe6de3d7c8ebc73c9!2sNational%20University%20of%20Sciences%20and%20Technology%20(NUST)!5e0!3m2!1sen!2s!4v1684083052809!5m2!1sen!2s"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </section>
      </motion.div>
        <Footer />
    </>
  );
};

export default AboutPage;
