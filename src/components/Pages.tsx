import React from "react";
import { Routes, Route } from 'react-router-dom';

import Home from "./pages/home/Home";
import Address from "./pages/address/Address";
import Tx from "./pages/tx/Tx";
import Block from "./pages/block/Block";


const Pages = () => {
    return (
        <Routes>
            <Route path="/" element={ <Home />} />
            <Route path="/address/:address" element={ <Address />} />
            <Route path="/tx/:hash" element={ <Tx />} />
            <Route path="/block/:blockNumber" element={ <Block />} />
        </Routes>
    )
};

export default Pages;