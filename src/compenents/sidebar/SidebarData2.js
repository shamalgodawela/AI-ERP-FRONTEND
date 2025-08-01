import React from 'react';
import * as AiIcons from 'react-icons/ai';
import { FaProductHunt } from "react-icons/fa";
import { FaBorderAll } from "react-icons/fa";
import { FaFileInvoice } from "react-icons/fa";
import { BsDatabaseFillGear } from "react-icons/bs";
import { PiOfficeChairFill } from "react-icons/pi";
import { SiHomeassistantcommunitystore } from "react-icons/si";
import { GiMaterialsScience } from "react-icons/gi";
import { TbTruckReturn } from "react-icons/tb";
import { MdOutlineCancelPresentation } from "react-icons/md";
import { FcSalesPerformance } from "react-icons/fc";
import { AiFillProduct } from "react-icons/ai";




const SidebarData2 = [
  <div>

<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous"></link>
  </div>,
  {
    title: 'Manage invoices',
    path: '/all-invoices',
    icon: <FaFileInvoice />,
    cName: 'nav-text'
  },

  {
    title: 'Return Notes belong to new invoice',
    path: '/getallreturn',
    icon: <TbTruckReturn/>,
    cName: 'nav-text'
  },
  {
    title: 'Manage Custormers',
    path: '/getAllCustomer',
    icon: <BsDatabaseFillGear />,
    cName: 'nav-text'
  },

  {
    title: 'Order details',
    path: '/Dorder',
    icon: <GiMaterialsScience />,
    cName: 'nav-text'
  },



];


export default SidebarData2;