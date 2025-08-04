import React from 'react';
import './Mdash.css';
import { IoMdArrowRoundBack } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';

const Card = ({ imageClass, title, text, href }) => (
  <li className="cards__item">
    <div className="card">
      <div className={`card__image ${imageClass}`}></div>
      <div className="card__content">
        <div className="card__title">{title}</div>
        <p className="card__text">{text}</p>
        <a href={href} className="btn btn--block card__btn">
          Go inside
        </a>
      </div>
    </div>
  </li>
);

const Mdashboard = () => {
  const cardsData = [
    {
      imageClass: "card__image--fence",
      title: "Inventory Management",
      text: "",
      href: "/dashboard" 
    },
    {
      imageClass: "card__image--DamageInventory",
      title: "Damage Inventory",
      text: "",
      href: "/Damage-Inventory" 
    },{
      imageClass: "card__image--PackingMaterials",
      title: "Packing Materials",
      text: "",
      href: "/Packing-Materials-details" 
    },
    {
      imageClass: "card__image--river",
      title: "Sales performance and collection",
      text: "",
      href: "/sales" 
    },
    {
      imageClass: "card__image--record",
      title: "Annual sales by unit",
      text: "",
      href: "/Season-Product-Quantity" 
    },
    {
      imageClass: "card__image--invoice",
      title: "Invoice and order management",
      text: "",
      href: "/all-invoices" 
    },
    {
      imageClass: "card__image--customer",
      title: "Customer management",
      text: "",
      href: "/getAllCustomer" 
    },
    {
      imageClass: "card__image--record",
      title: "Delaer Wise Product Movement ",
      text: "",
      href: "/Exe-product-wise-sales" 
    },
    {
      imageClass: "card__image--record",
      title: "View Invoices",
      text: "",
      href: "/viewALLinvoice" 
    },
    {
      imageClass: "card__image--Tax",
      title: "All Tax Invoices",
      text: "",
      href: "/viewAll-TaxInvoices" 
    },
   
 
    
  ];

  const navigate=useNavigate();
  const goBack = () => {
    
    navigate(-1);
  };

  return (
    <div className='madashboard-body'>
      <button className='btn-madashboard'><a href='/' className='a-mdashboard'>Logout</a></button>
    {/* <Link to="#" onClick={goBack}><IoMdArrowRoundBack size={23} color='white'/></Link>&nbsp;&nbsp; */}

      <h1 className='madash-h1'>Nihon ERP System</h1>
      <ul className="cards">
        {cardsData.map((card, index) => (
          <Card key={index} imageClass={card.imageClass} title={card.title} text={card.text} href={card.href} />
        ))}
      </ul>
    </div>
  );
};

export default Mdashboard;
