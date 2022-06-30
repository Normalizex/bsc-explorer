import Web3 from "web3";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { searchByPhrase, SearchedToken } from "../../../services/coinbrain";
import { isTransactionHash } from "../../../services/web3";

import emptyToken from '../../../images/empty-token.png';

import './search.scss';

const Search: React.FC = () => {
    const navigate = useNavigate();

    const searchInputRef = useRef<HTMLInputElement>(null);

    const [searchData, setSearchData] = useState<{
        value: string,
        tokens: SearchedToken[]
    }>({
        value: "",
        tokens: []
    })

    const searchTokens = (searchValue: string) => {
        if (!searchValue) return;

        const isBlock = !searchValue.startsWith('0x') && Number(searchValue);
        const isTransaction = isTransactionHash(searchValue);

        if (isBlock || isTransaction) return;

        searchByPhrase(searchValue).then(tokens => {
            setSearchData(prevSearch => {
                return { ...prevSearch, tokens };
            })
        }).catch(_ => {});
    }

    const search = async () => {
        if (!searchInputRef.current?.value) return;

        const searchValue = searchInputRef.current.value;

        const isBlock = (!searchValue.startsWith('0x') && Number(searchValue) && Number(searchValue) > 0);
        const isTransaction = isTransactionHash(searchValue);
        const isAddress = Web3.utils.isAddress(searchValue);

        if (isTransaction){
            navigate(`/tx/${searchValue}`);
        }
        else if (isBlock){
            navigate(`/block/${searchValue}`);
        }
        else if (isAddress){
            navigate(`/address/${searchValue}`);
        }else {
            searchTokens(searchValue);
        }
    };

    useEffect(() => {
        searchTokens(searchData.value);
    }, [searchData.value]);

    useEffect(() => {
        document.addEventListener('keypress', (event) => {
            if (event.key === "Enter" && searchInputRef.current === document.activeElement) search();
        });
        function assertIsNode(e: EventTarget | null): asserts e is Node {
            if (!e || !("nodeType" in e)) {
                throw new Error(`Node expected`);
            }
        } 
        document.addEventListener('mousedown', (e) => {
            assertIsNode(e.target);

            if (!document.querySelector('.header')?.contains(e.target)) {
                setSearchData(prevSearch => {
                    return { ...prevSearch, tokens: [] };
                });
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <div className="header__search">
                <input 
                    type="text"
                    ref={searchInputRef}
                    placeholder='Search by Address/Txn Hash/Block/Token'
                    onChange={(event) => {
                        const { value } = event.target;
                        setSearchData(prevSearch => {
                            return { ...prevSearch, value };
                        });
                    }}
                    value={searchData.value}
                />
                <i 
                    className='bx bx-search'
                    onClick={search}
                />
            </div>
            <div className="header__tokens">
                <div className="header__tokens-container">
                    <div className="row">
                        {searchData.tokens.slice(0, 5).map(token => {
                            return (
                                <div 
                                    key={token.address}
                                    className="col-12"
                                    onClick={() => {
                                        setSearchData({value: "", tokens: []});
                                        navigate(`/address/${token.address}`);
                                    }}
                                >
                                    <div className="card">
                                        <div className="card__body">
                                            <img 
                                                className="header__tokens-img"
                                                src={token.logo || emptyToken}
                                                alt='Token Logo'
                                            />
                                            <span className="header__tokens-symbol">{token.symbol}</span>
                                            <span className="header__tokens-name">| {token.name}</span> 
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    )
};

export default Search;