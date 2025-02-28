import React, { useEffect } from 'react';
import { useNavigate } from "react-router-dom"
import './style/LandingStyle.css';

const LandingPage = () => {

  const navigate = useNavigate();

  const navigateRegisterSignIn = () => {  
        navigate("/login")
    }

  const navigateContact = useNavigate();

  const navigateContactUs = () => {  
          navigate("/contact")
  }  


  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        } else {
          entry.target.classList.remove('active');
        }
      });
    });

    revealElements.forEach(element => {
      observer.observe(element);
    });
  }, []);


  return (
    <div className="App">
    <nav className="flex justify-between bg-gray-800 text-white p-2">
      <div className="flex items-center">
        <a href="mailto: karan.kumar@ecerasystem.com" className="flex items-center">
          <img
            src="https://cdn.iconscout.com/icon/free/png-64/email-letter-envelope-message-38065.png"
            alt="G-mail"
            className="h-8 w-8 mx-3 hover:rotate-10 transition-transform duration-300"
          />
          <span className="text-white font-sans">
            karan.kumar@ecerasystem.com
          </span>
        </a>
        <a href="tel: +91 123456789" className="flex items-center">
          <img
            src="https://cdn.iconscout.com/icon/premium/png-64-thumb/telephone-41-117249.png"
            alt=""
            className="h-8 w-8 mx-3 hover:rotate-10 transition-transform duration-300"
          />
          <span className="text-white font-sans">
            +91 123456789
          </span>
        </a>
      </div>
      <div className="flex space-x-4">
        <a href="#">
          <img
            src="https://cdn.iconscout.com/icon/free/png-64/instagram-1868978-1583142.png"
            alt=""
            className="h-8 w-8 hover:scale-110 transition-transform duration-300"
          />
        </a>
        <a href="#">
          <img
            src="https://cdn.iconscout.com/icon/free/png-64/facebook-logo-3771014-3147631.png"
            alt=""
            className="h-8 w-8 hover:scale-110 transition-transform duration-300"
          />
        </a>
        <a href="#">
          <img
            src="https://cdn.iconscout.com/icon/free/png-64/linkedin-162-498418.png"
            alt=""
            className="h-8 w-8 hover:scale-110 transition-transform duration-300"
          />
        </a>
        <a href="#">
          <img
            src="https://cdn.iconscout.com/icon/free/png-64/telegram-2752057-2284874.png"
            alt=""
            className="h-8 w-8 hover:scale-110 transition-transform duration-300"
          />
        </a>
      </div>
    </nav>
    <header className="relative flex justify-between bg-blue-500 w-full p-4">
      <a href="#" className="flex items-center">
        <span>
          <img
            src="/votingLogo.PNG"
            alt="Logo"
            className="h-16 w-16 mx-3 rounded-full border border-white animate-pulse"
          />
        </span>
        <span className="text-white text-4xl font-bold font-serif shadow-lg animate-bounce">
          VOTE ME UP
        </span>
      </a>
      <ul className="flex space-x-4">
        <li>
          <a href="#" className="text-white font-semibold text-lg hover:text-blue-300 transition-colors duration-300">
            Home
          </a>
        </li>
        <li>
        <button
            onClick={navigateRegisterSignIn}
            className="text-white font-semibold text-lg hover:text-blue-300 transition-colors duration-300"
          >
            Register/Sign In
          </button>
        </li>
        <li>
          <a href="#" className="text-white font-semibold text-lg hover:text-blue-300 transition-colors duration-300">
            Services
          </a>
        </li>
        <li>
        <button
            onClick={navigateContactUs}
            className="text-white font-semibold text-lg hover:text-blue-300 transition-colors duration-300"
          >
            Contact Us
          </button>
          {/* <a href="#" className="text-white font-semibold text-lg hover:text-blue-300 transition-colors duration-300">
            Contact Us
          </a> */}
        </li>
      </ul>
    </header>
    <main className="flex flex-col items-center bg-transparent">
      <div className="bg-blue-500 text-white text-center p-8 reveal fade-in">
        <h1 className="text-5xl font-cursive shadow-lg animate-pulse">
          Welcome To Vote Me Up System
        </h1>
        <img
          src="https://cdni.iconscout.com/illustration/premium/thumb/about-us-1805547-1537820.png"
          alt="font"
          className="mt-4 h-48 w-48 mx-auto animate-bounce"
        />
        <p className="mt-4 text-xl font-serif animate-fade-in">
        Our mission is to bring transparency and trust to the voting process through 
        the power of blockchain technology. Our innovative app empowers communities, 
        organizations, and institutions to conduct secure and verifiable elections 
        with ease. Whether you're hosting a small poll or a large-scale election, our 
        platform ensures every vote is counted, every voice is heard, and the entire 
        process remains tamper-proof. We're here to make voting not just a right, but a 
        seamless and trustworthy experience for everyone!
        </p>
      </div>

      <div className="flex justify-between items-center p-8 bg-transparent reveal fade-in">
        <img
          src="https://cdni.iconscout.com/illustration/premium/thumb/growing-business-by-digital-marketing-4217800-3501667.png"
          alt=""
          className="h-48 w-48 animate-pulse"
        />
        <div className="text-left">
          <h1 className="text-3xl font-bold animate-fade-in">
          We Offer Secure and Transparent Voting Solutions
          </h1>
          <p className="mt-4 text-lg animate-fade-in">
          Vote Me Up is a revolutionary voting app leveraging blockchain 
          technology to ensure transparency, security, and fairness in every election. 
          We take a tailored approach to meet the needs of communities, organizations, 
          and institutions, whether for local polls, corporate voting, or large-scale 
          elections. Our platform offers robust features for managing voter registration, 
          conducting secure voting, and delivering verifiable results with ease and integrity.
          </p>
          <h2 className="mt-4 text-2xl animate-fade-in">UI/UX Design (90%)</h2>
          <div className="w-full bg-red-200 h-4 mt-2">
            <div className="h-full bg-red-500 transition-all duration-5s ease-in-out comm1"></div>
          </div>
          <h2 className="mt-4 text-2xl animate-fade-in">APP Development (85%)</h2>
          <div className="w-full bg-red-200 h-4 mt-2">
            <div className="h-full bg-red-500 transition-all duration-5s ease-in-out comm2"></div>
          </div>
          <h2 className="mt-4 text-2xl animate-fade-in">WEB Development (70%)</h2>
          <div className="w-full bg-red-200 h-4 mt-2">
            <div className="h-full bg-red-500 transition-all duration-5s ease-in-out comm3"></div>
          </div>
        </div>
      </div>

      <div className="bg-blue-500 text-white text-center p-8 reveal fade-in">
        <h2 className="text-2xl animate-fade-in">TECHNOLOGY INDEX</h2>
        <h1 className="text-4xl animate-fade-in">
          Real Time Monitoring Your Infrastructure Branded Digital Solutions
        </h1>
        <div className="flex justify-around p-8">
          <div className="text-center animate-fade-in">
            <img
              src="https://cdn.iconscout.com/icon/premium/png-64-thumb/data-analysis-27-681042.png"
              alt=" "
              className="mx-auto h-16 w-16 animate-pulse"
            />
            <p>DATA ANALYTICS</p>
          </div>
          <div className="text-center animate-fade-in">
            <img
              src="https://cdn.iconscout.com/icon/premium/png-64-thumb/ui-ux-designer-2755964-2289563.png"
              alt=" "
              className="mx-auto h-16 w-16 animate-pulse"
            />
            <p>UI/UX DESIGN</p>
          </div>
          <div className="text-center animate-fade-in">
            <img
              src="https://cdn.iconscout.com/icon/premium/png-64-thumb/web-development-3-478143.png"
              alt=" "
              className="mx-auto h-16 w-16 animate-pulse"
            />
            <p>WEB DEVELOPMENT</p>
          </div>
          <div className="text-center animate-fade-in">
            <img
              src="https://cdn.iconscout.com/icon/premium/png-64-thumb/qa-testing-3919162-3246433.png"
              alt=" "
              className="mx-auto h-16 w-16 animate-pulse"
            />
            <p>Q&A TESTING</p>
          </div>
          <div className="text-center animate-fade-in">
            <img
              src="https://cdn.iconscout.com/icon/premium/png-64-thumb/team-135-386667.png"
              alt=" "
              className="mx-auto h-16 w-16 animate-pulse"
            />
            <p>DEDICATED TEAM</p>
          </div>
        </div>
      </div>

      <div className="p-8 bg-transparent reveal fade-in">
        <div className="flex space-x-8 mb-8 animate-fade-in">
          <div className="text-left">
            <h1 className="text-3xl animate-fade-in">WE PROVIDE</h1>
            <h2 className="text-2xl animate-fade-in">Remote Employee</h2>
            <p className="text-lg animate-fade-in">
            A diverse pool of verified voters from every community, 
            ready to participate in your election. Solve your voting 
            challenges by letting us help you engage the most reliable 
            voters or even manage an entire voting system that ensures 
            transparency and fairness. Everything is securely managed 
            by our trusted platform!
            </p>
          </div>
          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/men-and-woman-characters-work-together-on-project-presentation-2706075-2259871.png"
            alt=""
            className="h-48 w-48 animate-pulse"
          />
        </div>
        <div className="flex space-x-8 mb-8 animate-fade-in">
          <div className="text-left">
            <h1 className="text-3xl animate-fade-in">WE HAVE</h1>
            <h2 className="text-2xl animate-fade-in">Global Partnership</h2>
            <p className="text-lg animate-fade-in">
              Our Global partners are spread 12 countries and our client base
              is growing day by day. Many of our clients are repeat customers
              and several have come to us through high recommendation and
              referrals. Our client hail from different domains.
            </p>
          </div>
          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/business-partnership-2975816-2476892.png"
            alt=""
            className="h-48 w-48 mt-12 animate-pulse"
          />
        </div>
        <div className="flex space-x-8 mb-8 animate-fade-in">
          <div className="text-left">
            <h1 className="text-3xl animate-fade-in">OUR GOAL</h1>
            <h2 className="text-2xl animate-fade-in">Same Quality at Low Cost</h2>
            <p className="text-lg animate-fade-in">
            We have a unique and revolutionary approach: "Same security, transparency, 
            and efficiency, but at significantly lower costs."Our goal is to bridge the 
            gap in secure and reliable voting solutions for organizations and governments 
            who, until now, relied mainly on expensive, complex systems. Our platform 
            ensures a seamless and trustworthy voting experience, with professionals and 
            technologies that match the highest standards—combined with the advantage 
            of affordable pricing.
            </p>
          </div>
          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/business-goal-4352585-3618767.png"
            alt=""
            className="h-48 w-48 mt-20 animate-pulse"
          />
        </div>
        <div className="flex space-x-8 mb-8 animate-fade-in">
          <div className="text-left">
            <h1 className="text-3xl animate-fade-in">OUR STRENGTHS</h1>
            <h2 className="text-2xl animate-fade-in">Intelligent Use of Technology and Human Resource</h2>
            <p className="text-lg animate-fade-in">
              We provide every client with a dedicated, full-time work from
              home from their comfortable place. To successfully achieve this
              objective, we relay on management, infrastructure, hardware and
              the latest technology to bridge physical distance and time zone
              differences.We provide experience of making employees to work
              from home for the company as real as they work in the company.
            </p>
          </div>
          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/teamwork-3560853-2989144.png"
            alt=""
            className="h-48 w-48 animate-pulse"
          />
        </div>
      </div>

      <div className="text-center p-8 reveal fade-in">
        <h3 className="text-2xl animate-fade-in">OUR PROCESS</h3>
        <h1 className="text-4xl animate-fade-in">
          Driving Client Results Utilizing New Innovation Points of view
        </h1>
        <div className="flex justify-around p-8">
          <div className="text-center animate-fade-in">
            <h2 className="text-2xl">End to End Solutions and Services Guaranteed</h2>
            <p className="text-lg">
              Fusce nec tellus sed augue semper porta. Mauris massa.
              Vestibulum lacinia arcu eget nulla. per inceptos himenaeos.
            </p>
          </div>
          <div className="text-center animate-fade-in">
            <h2 className="text-2xl">Ahead of The Curve We Future-proof Your IT</h2>
            <p className="text-lg">
              Fusce nec tellus sed augue semper porta. Mauris massa.
              Vestibulum lacinia arcu eget nulla. per inceptos himenaeos.
            </p>
          </div>
          <div className="text-center animate-fade-in">
            <h2 className="text-2xl">Experience Certainty Every Project Executed Successful</h2>
            <p className="text-lg">
              Fusce nec tellus sed augue semper porta. Mauris massa.
              Vestibulum lacinia arcu eget nulla. per inceptos himenaeos.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-blue-500 text-white p-8 reveal fade-in">
        <h1 className="text-4xl text-center animate-fade-in">VOTE ME UP SYSTEM</h1>
        <div className="flex justify-around">
          <a href="#" className="flex items-center text-white animate-fade-in">
            <img
              src="https://cdn.iconscout.com/icon/premium/png-64-thumb/address-blue-circle-location-map-marker-navigation-icon-45868.png"
              alt=" "
              className="h-8 w-8"
            />
            <span>
              <h3>Address</h3>
              <p>4813 Woodland Ave Royal Oak, Michigan - 48073, USA</p>
            </span>
          </a>
          <a href="#" className="flex items-center text-white animate-fade-in">
            <img
              src="https://cdn.iconscout.com/icon/free/png-64/phone-2666572-2212584.png"
              alt=" "
              className="h-8 w-8"
            />
            <span>
              <h3>Phone</h3>
              <p>+1 248 672 1972</p>
            </span>
          </a>
          <a href="#" className="flex items-center text-white animate-fade-in">
            <img
              src="https://cdn.iconscout.com/icon/free/png-64/gmail-2489176-2082900.png"
              alt=" "
              className="h-8 w-8"
            />
            <span>
              <h3>E-mail</h3>
              <p>support@votemeup.com</p>
            </span>
          </a>
        </div>
      </div>
    </main>

    <footer className="flex justify-around bg-blue-500 p-4">
      <ul className="space-y-4">
        <li>
          <a href="#" className="text-white hover:text-blue-300 transition-colors duration-300">
            About Us
          </a>
        </li>
        <li>
          <a href="#" className="text-white hover:text-blue-300 transition-colors duration-300">
            Careers
          </a>
        </li>
        <li>
          <a href="#" className="text-white hover:text-blue-300 transition-colors duration-300">
            Blogs
          </a>
        </li>
      </ul>
      <ul className="space-y-4">
        <li>
          <a href="#" className="text-white hover:text-blue-300 transition-colors duration-300">
            Training
          </a>
        </li>
        <li>
          <a href="#" className="text-white hover:text-blue-300 transition-colors duration-300">
            FAQs
          </a>
        </li>
      </ul>
      <div className="text-center">
        <h2 className="text-white text-2xl mb-4 animate-fade-in">Contact Us</h2>
        <div className="flex space-x-4">
          <a href="#">
            <img
              src="https://cdn.iconscout.com/icon/free/png-64/instagram-188-498425.png"
              alt=" "
              className="h-8 w-8 hover:scale-110 transition-transform duration-300"
            />
          </a>
          <a href="#">
            <img
              src="https://cdn.iconscout.com/icon/free/png-64/facebook-262-721949.png"
              alt=" "
              className="h-8 w-8 hover:scale-110 transition-transform duration-300"
            />
          </a>
          <a href="#">
            <img
              src="https://cdn.iconscout.com/icon/free/png-64/whatsapp-43-189795.png"
              alt=" "
              className="h-8 w-8 hover:scale-110 transition-transform duration-300"
            />
          </a>
        </div>
        <div className="flex space-x-4 mt-4">
          <a href="#">
            <img
              src="https://cdn.iconscout.com/icon/free/png-64/telegram-2752057-2284874.png"
              alt=" "
              className="h-8 w-8 hover:scale-110 transition-transform duration-300"
            />
          </a>
          <a href="#">
            <img
              src="https://cdn.iconscout.com/icon/free/png-64/linkedin-162-498418.png"
              alt=" "
              className="h-8 w-8 hover:scale-110 transition-transform duration-300"
            />
          </a>
        </div>
        <a
          href="tel: +91 232345553"
          className="text-white text-xl font-bold mt-4 block text-center hover:text-blue-300 transition-colors duration-300"
        >
          Telephone No: +91 232345553
        </a>
      </div>
    </footer>
    <p className="text-white text-center bg-gray-800 py-4 animate-fade-in">
      &copy; Copyright <b>votemeupsystem</b>. All Rights Reserved
    </p>
  </div>
  );
};

export default LandingPage;
