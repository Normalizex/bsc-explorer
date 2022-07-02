import React from "react";
import { Routes, Route } from 'react-router-dom';

import Home from "./pages/home/Home";
import Address from "./pages/address/Address";
import Tx from "./pages/tx/Tx";
import Block from "./pages/block/Block";
import NotFound from "./404/NotFound";

const Pages = () => {
    return (
        <Routes>
            <Route path="/" element={ <Home />} />
            <Route path="/address/:address" element={ <Address />} />
            <Route path="/tx/:hash" element={ <Tx />} />
            <Route path="/block/:blockNumber" element={ <Block />} />
            <Route path={`/*`} element={ <NotFound message='Something went wrong' /> } />
        </Routes>
    )
};

export default Pages;